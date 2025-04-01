import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIncome } from '../Storage';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import { AxiosError } from 'axios';
import Voice from '@react-native-voice/voice'; // Added for voice recognition

interface Item {
  id: string;
  name: string;
  total: string;
}

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const ManualSpendingScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalTranslateY] = useState(new Animated.Value(screenHeight));
  const [isRecording, setIsRecording] = useState(false); // Added for voice recording state
  const [activeField, setActiveField] = useState<{ id: string; field: keyof Item } | null>(null); // Added for active field tracking
  const { uName } = useIncome();
  const navigation = useNavigation();

  // Voice recognition setup
  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0 && activeField) {
        updateItem(activeField.id, activeField.field, event.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [activeField]);

  const addItem = () => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      if (!lastItem.name.trim() || !lastItem.total.trim()) {
        Alert.alert('Incomplete Item', 'Please enter both Name and Total before adding a new item.');
        return;
      }
    }
    setItems([...items, { id: Date.now().toString(), name: '', total: '' }]);
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const confirmDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteItem(itemId) },
      ]
    );
  };

  const deleteItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Voice recognition functions
  const startListening = async () => {
    try {
      if (!activeField) {
        Alert.alert('No Active Field', 'Please tap on a field before using voice input.');
        return;
      }
      setIsRecording(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice Recognition Error:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
    } catch (error) {
      console.error('Stop Voice Recognition Error:', error);
    }
  };

  const handleCameraLaunch = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
          showModal();
        }
      }
    });
  };

  const showModal = () => {
    Animated.timing(modalTranslateY, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalTranslateY, {
      toValue: screenHeight,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSendToGemini = async () => {
    if (imageUri) {
      try {
        const imageBase64 = await encodeImageToBase64(imageUri);
  
        const payload = {
          contents: [{
            parts: [
              {
                text: "Please process this image and return the item name and total amount in the following format: {'itemName': '<item name>', 'totalAmount': '<amount>'}. ."
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          }],
        };
  
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAHFnB9sKNqQGFKD2jX6btmFzPbuXsMC7Y',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Gemini API Response:', response.data);
  
        const responseData = response.data;
  
        if (responseData.candidates && responseData.candidates.length > 0) {
          const candidateContent = responseData.candidates[0].content;
          console.log('Candidate Content:', candidateContent);
  
          const contentText = candidateContent?.parts[0]?.text || '';
          const jsonData = extractDataFromText(contentText);
  
          if (jsonData) {
            const { itemName, totalAmount } = jsonData;
            if (itemName && totalAmount) {
              addItemFromReceipt(itemName, totalAmount);
              hideModal();
            } else {
              Alert.alert('Error', 'Failed to extract item details from the receipt.');
            }
          } else {
            const errorMessage = responseData?.candidates[0]?.content?.parts[0]?.text || 'Failed to process the receipt. Please try again.';
            Alert.alert('Error', ` ${errorMessage}`);
          }
        } else {
          console.error('No candidates found in Gemini response');
          Alert.alert('Error', 'Failed to process the receipt. Please try again.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const geminiErrorMessage = error.response?.data?.error?.message || 'Something went wrong. Please try again later.';
          console.error('Error sending image to Gemini:', geminiErrorMessage);
          Alert.alert('Error', `Gemini Error: ${geminiErrorMessage}`);
        } else {
          console.error('Unexpected Error:', error);
          Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
      }
    }
  };
  
  const extractDataFromText = (text: string) => {
    try {
      const regex = /{'itemName':\s*'(.?)',\s'totalAmount':\s*'(.*?)'}/;
      const match = text.match(regex);
      if (match) {
        return { itemName: match[1], totalAmount: match[2] };
      }
    } catch (error) {
      console.error('Error parsing the content text:', error);
    }
    return null;
  };
  
  const encodeImageToBase64 = (uri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fs = require('react-native-fs');
      fs.readFile(uri, 'base64')
        .then((base64String: string) => resolve(base64String))
        .catch((error: Error) => reject(error));
    });
  };

  const addItemFromReceipt = (itemName: string, totalAmount: string) => {
    setItems([...items, { id: Date.now().toString(), name: itemName, total: totalAmount }]);
  };

  const API_URL = 'http://investorsol4.pythonanywhere.com/entry';

  const sendEntries = async () => {
    if (!items || items.length === 0) {
      Alert.alert('No data', 'There are no entries to send.');
      return;
    }
    console.log(items);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uName,  // Include uName in the request body
          entries: items,
        }),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Entries sent successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() } // Navigate back on success
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to send entries.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Error', 'Network error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={sendEntries}>
              <View style={styles.backButtonContainer}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Manual Spending</Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>Total Amount</Text>
          </View>

          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
            {items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.row,
                  index === items.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <TouchableOpacity 
                  onPress={() => setActiveField({ id: item.id, field: 'name' })}
                  style={styles.micIcon}
                >
                  <Ionicons name="wallet-outline" size={20} color="#075E54" />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  value={item.name}
                  onFocus={() => setActiveField({ id: item.id, field: 'name' })}
                  onChangeText={text => updateItem(item.id, 'name', text)}
                  placeholder="Enter item name"
                />
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  value={item.total}
                  onFocus={() => setActiveField({ id: item.id, field: 'total' })}
                  onChangeText={text => updateItem(item.id, 'total', text)}
                  placeholder="0"
                />
                <TouchableOpacity
                  onPress={() => confirmDeleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-bin" size={18} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.micButton} 
              onPress={isRecording ? stopListening : startListening}
            >
              <Ionicons 
                name={isRecording ? "mic-off" : "mic"} 
                size={30} 
                color={isRecording ? "#ff3b30" : "#075E54"} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraButton} onPress={handleCameraLaunch}>
              <Ionicons name="camera" size={30} color="#075E54" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Ionicons name="add-circle" size={30} color="#075E54" />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: modalTranslateY }],
              },
            ]}
          >
            {imageUri && (
              <View style={styles.modalContent}>
                <Image source={{ uri: imageUri }} style={styles.modalImage} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={hideModal} style={[styles.closeButton, { backgroundColor: '#ff3b30' }]}>
                    <Ionicons name="close" size={30} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleSendToGemini} style={[styles.sendButton, { backgroundColor: '#075E54' }]}>
                    <Ionicons name="send" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
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
    marginRight: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#075E54',
    borderRadius: 6,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 80,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 38,
    paddingHorizontal: 6,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  backButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    padding: 10,
    marginRight: 10, // Added to separate from camera button
  },
  cameraButton: {
    padding: 10,
    marginRight: 10, // Added to separate from add button
  },
  addButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  deleteButton: {
    padding: 10,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#ff3b30',
  },
  sendButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#075E54',
  },
  micIcon: {
    padding: 5,
  },
});

export default ManualSpendingScreen;