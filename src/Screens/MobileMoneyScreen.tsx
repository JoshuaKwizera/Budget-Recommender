import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import FileUpload from '../components/FileUpload';
import BackButton from '../components/BackButton';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { useMutation } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const MobileMoneyScreen: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<DocumentPickerResponse | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Retrieve selected provider from AsyncStorage on component mount
  useEffect(() => {
    const fetchSelectedProvider = async () => {
      try {
        const provider = await AsyncStorage.getItem('selectedMobileProvider');
        if (provider) {
          setSelectedProvider(provider);
        }
      } catch (error) {
        console.error('Error retrieving provider:', error);
      }
    };
    fetchSelectedProvider();
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

      const response = await fetch('http://investorsol4.pythonanywhere.com/mobile_money', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

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
        if (data.transactions) {
          let csv = Papa.unparse(data.transactions);

          const tokenCount = estimateTokenCount(csv);
          const targetTokenCount = 32768;
          const emptyRowsCount = Math.max(0, Math.floor((targetTokenCount - tokenCount) / 2500));

          for (let i = 0; i < emptyRowsCount; i++) {
            const emptyRow = { 
              date: '', transaction: '', details: '', transaction_id: '', 
              from: '', to: '', amount: '', fees: '', taxes: '', balance: '' 
            };
            data.transactions.push(emptyRow);
          }

          const updatedCsv = Papa.unparse(data.transactions);
          const filePath = `${RNFS.DocumentDirectoryPath}/mobileMoneyStatement.csv`;
          await RNFS.writeFile(filePath, updatedCsv, 'utf8');

          const csvBase64 = await RNFS.readFile(filePath, 'base64');

          // ✅ Step 1: Remove existing cache before calling Gemini API
          const cacheKey = `${selectedProvider}_cache`; // Use the dynamic cache key based on selectedProvider
          await AsyncStorage.removeItem(cacheKey);

          const geminiApiKey = 'AIzaSyCqJ_JAum_uosYDYLU6yYWl0ygjg5neDho'; // Replace with your actual API key
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
                      text: `You are an expert at analyzing mobile money statements. The provided CSV file represents mobile transactions with the following structure:

                              1. **Date** – Transaction date.
                              2. **Transaction** – Type of transaction.
                              3. **Details** – Transaction details.
                              4. **Transaction ID** – Unique identifier for the transaction.
                              5. **From** – Sender.
                              6. **To** – Recipient.
                              7. **Amount** – Transaction amount.
                              8. **Fees** – Transaction fees.
                              9. **Taxes** – Any applied taxes.
                              10. **Balance** – Account balance after the transaction.
  
                              Analyze this data to identify spending patterns, detect anomalies, and extract meaningful insights.`,
                    },
                  ],
                },
                ttl: '172800s',
              }),
            }
          );

          const cacheText = await cacheResponse.text();
          // Log the raw response text
          console.log("Gemini API Response Text:", cacheText);
          let cacheData;
          try {
            cacheData = JSON.parse(cacheText);
          } catch (error) {
            throw new Error('Invalid JSON response from Gemini');
          }

          if (!cacheResponse.ok) {
            throw new Error(cacheData.message || 'Failed to cache CSV in Gemini.');
          }

          // ✅ Step 2: Store the new cache name in AsyncStorage
          const cacheName = cacheData.name;
          await AsyncStorage.setItem(cacheKey, cacheName); // Store using the dynamic cache key

          // ✅ Step 3: Allow user to share CSV file
          const options = {
            title: 'Share CSV',
            url: `file://${filePath}`,
            type: 'text/csv',
          };
          await Share.open(options);
        } else {
          Alert.alert('Error', 'Failed to extract data from the file.');
        }
      },
      onError: (error) => {
        console.error('Mutation error:', error);
        Alert.alert('Error', 'An error occurred while processing the file.');
      },
    }
  );

  const uploadFile = () => {
    if (uploadedFile) {
      mutation.mutate(uploadedFile);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Mobile Money Statement</Text>
      </View>

      <Text style={styles.instructions}>
        Please upload your <Text style={styles.selectedProviderText}>{selectedProvider}</Text> statement. Only PDF files are allowed.
      </Text>

      <FileUpload
        title="Attach Document"
        onFileSelected={(file: DocumentPickerResponse) => setUploadedFile(file)}
        supportedFormats="PDF"
        onFileRemoved={handleFileRemove}
      />

      <TouchableOpacity
        style={[styles.button, !uploadedFile && styles.buttonDisabled, uploadedFile && { backgroundColor: '#075E54' }]}
        disabled={!uploadedFile}
        onPress={uploadFile}
      >
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
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
  selectedProviderText: {
    fontSize: 16,
    color: '#075E54',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
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
});

export default MobileMoneyScreen;
