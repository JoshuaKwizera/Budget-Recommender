import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import FileUpload from '../components/FileUpload';
import BackButton from '../components/BackButton';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { useMutation } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const BankScreen: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<DocumentPickerResponse | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null); // State for selected bank
  const [password, setPassword] = useState<string>(''); // State for Eco Bank password
  const [isPasswordModalVisible, setPasswordModalVisible] = useState<boolean>(false); // Modal visibility state

  // Fetch selected bank from AsyncStorage when component mounts
  useEffect(() => {
    const fetchSelectedBank = async () => {
      try {
        const bank = await AsyncStorage.getItem('selectedBankProvider');
        if (bank) {
          setSelectedBank(bank);
        }
      } catch (error) {
        console.error('Error retrieving selected bank:', error);
      }
    };
    fetchSelectedBank();
  }, []);

  const handleFileRemove = () => {
    setUploadedFile(null);
  };

  const estimateTokenCount = (content: string): number => {
    return Math.floor(content.length / 4);
  };

  const mutation = useMutation(
    async (file: DocumentPickerResponse) => {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      // Determine the URL and password based on the selected bank
      const url =
        selectedBank === 'Eco Bank'
          ? 'https://investorsol4.pythonanywhere.com/eco_bank'
          : 'https://investorsol4.pythonanywhere.com/stanbic_bank';

      const data: any = {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      };

      if (selectedBank === 'Eco Bank' && password) {
        data.body = new FormData();
        data.body.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
        data.body.append('password', password); // Append password for Eco Bank
      }

      const response = await fetch(url, data);

      const textResponse = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        responseData = { success: false, message: textResponse };
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Network response was not ok');
      }

      return responseData;
    },
    {
      onSuccess: async (data) => {
        let processedData;
        if (selectedBank === 'Eco Bank' && data.tables) {
          // Process Eco Bank data
          const table = data.tables[1]; // Get the main transaction table
          processedData = table.slice(1).map((row: any[]) => ({
            transactionDate: row[0],
            description: row[1],
            valueDate: row[3],
            debit: row[4],
            credit: row[5],
            balance: row[6],
          }));
        } else {
          // Process Stanbic Bank (assuming CSV data is returned)
          processedData = data.data;
        }

        // Handle token counting and CSV file generation
        let csv = Papa.unparse(processedData);

        const tokenCount = estimateTokenCount(csv);
        const targetTokenCount = 32768;
        const emptyRowsCount = Math.max(0, Math.floor((targetTokenCount - tokenCount) / 3));

        for (let i = 0; i < emptyRowsCount; i++) {
          const emptyRow = { date: '', balance: '', credit: '', debit: '', description: '' };
          processedData.push(emptyRow);
        }

        const updatedCsv = Papa.unparse(processedData);
        const filePath = `${RNFS.DocumentDirectoryPath}/${selectedBank}_Statement.csv`;
        await RNFS.writeFile(filePath, updatedCsv, 'utf8');

        // Read the file content and encode it to base64
        const csvBase64 = await RNFS.readFile(filePath, 'base64');

        // ✅ Step 1: REMOVE existing cache before calling Gemini API
        const cacheKey = `${selectedBank}_cache`; // Use dynamic cache name based on selectedBank
        await AsyncStorage.removeItem(cacheKey);

        // ✅ Step 2: Send CSV to Gemini API with structured description
        const geminiApiKey = 'AIzaSyCqJ_JAum_uosYDYLU6yYWl0ygjg5neDho';
        const cacheResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/cachedContents?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'models/gemini-1.5-flash-001',
              contents: [
                {
                  parts: [
                    {
                      inline_data: {
                        mime_type: 'text/csv',
                        data: csvBase64,
                      },
                    },
                  ],
                  role: 'user',
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: `You are an expert at analyzing financial statements. The provided CSV file represents a bank account statement with the following structure:

                              1. **Balance (Column A)** – The account balance after the transaction.
                              2. **Credit (Column B)** – Money deposited into the account.
                              3. **Date (Column C)** – The date of the transaction (MM/DD/YYYY).
                              4. **Debit (Column D)** – Money withdrawn from the account.
                              5. **Description (Column E)** – A brief description of the transaction.

                              - A positive value in the Credit column means an incoming transaction.
                              - A positive value in the Debit column means an outgoing transaction.
                              - The Balance column reflects the account's total after the transaction.
                              - The Description column provides additional details such as transfer types, fees, or reference numbers.

                              Analyze this data to identify spending patterns, detect anomalies, and extract meaningful insights.`,
                  },
                ],
              },
              ttl: '172800s',
            }),
          }
        );

        const cacheText = await cacheResponse.text();
        let cacheData;
        try {
          cacheData = JSON.parse(cacheText);
        } catch (error) {
          throw new Error('Invalid JSON response from Gemini');
        }

        if (!cacheResponse.ok) {
          throw new Error(cacheData.message || 'Failed to cache CSV in Gemini.');
        }

        // ✅ Step 3: Store the new cache name in AsyncStorage
        const cacheName = cacheData.name;
        await AsyncStorage.setItem(cacheKey, cacheName); // Store using dynamic cache key

        // ✅ Step 4: Allow user to share CSV file
        const options = {
          title: 'Share CSV',
          url: `file://${filePath}`,
          type: 'text/csv',
        };
        await Share.open(options);
      },
      onError: (error) => {
        console.error('Mutation error:', error);
        Alert.alert('Error', 'An error occurred while processing the file.');
      },
    }
  );

  const uploadFile = () => {
    if (uploadedFile) {
      if (selectedBank === 'Eco Bank' && !password) {
        setPasswordModalVisible(true); // Show the password modal if Eco Bank is selected
      } else {
        mutation.mutate(uploadedFile);
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (password) {
      setPasswordModalVisible(false);
  
      if (uploadedFile) {
        // Proceed with mutation after password is provided
        mutation.mutate(uploadedFile);
      } else {
        Alert.alert('Error', 'Please upload a file.');
      }
    } else {
      Alert.alert('Error', 'Please enter the password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Bank Account Statement</Text>
      </View>

      <Text style={styles.instructions}>
        Please upload your <Text style={styles.selectedProviderText}>{selectedBank}</Text> statement. Only PDF files are allowed.
      </Text>

      <FileUpload
        title="Attach Document"
        onFileSelected={(file: DocumentPickerResponse) => setUploadedFile(file)}
        supportedFormats="PDF"
        onFileRemoved={handleFileRemove}
      />

      <TouchableOpacity
        style={[
          styles.button,
          !uploadedFile && styles.buttonDisabled,
          uploadedFile && { backgroundColor: '#075E54' },
        ]}
        disabled={!uploadedFile}
        onPress={uploadFile}
      >
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      {/* Password Input Modal for Eco Bank */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Eco Bank Password</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54',
    textAlign: 'center',
    flex: 1,
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#4931BA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedProviderText: {
    fontSize: 16,
    color: '#075E54',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  passwordInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#075E54',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default BankScreen;
