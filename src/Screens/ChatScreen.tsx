import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY = 'AIzaSyCqJ_JAum_uosYDYLU6yYWl0ygjg5neDho';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCache, setSelectedCache] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const banks = ['Eco Bank', 'Stanbic Bank', 'Centenary Bank'];
  const mobileMoney = ['MTN Mobile Money', 'Airtel Money'];

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    if (!selectedCache) {
      Alert.alert('Select Data Source', 'Please select a bank or mobile money before sending a query.');
      return;
    }

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const cachedContent = await AsyncStorage.getItem(`${selectedCache}_cache`);
      if (!cachedContent) {
        Alert.alert('No Cached Content', 'No cached content found. Please upload a document first.');
        setLoading(false);
        return;
      }
      const instruction = `You must strictly follow this format when analyzing the bank statement CSV. Do not deviate from the given structure. However, your response should use natural language to clearly communicate insights.
      
      The provided CSV file represents a bank account statement with the following structure:

      1. **Balance (Column A)** – The account balance after the transaction.
      2. **Credit (Column B)** – Money deposited into the account.
      3. **Date (Column C)** – The date of the transaction (DD/MM/YYYY).
      4. **Debit (Column D)** – Money withdrawn from the account.
      5. **Description (Column E)** – A brief description of the transaction.

      ### **Important Rules (Strictly Follow):**  

      - Every row follows this structure without exception.
      - Transactions **after** the given date are debits (outgoing transactions).
      - Transactions **before** the given date are credits (incoming transactions).
      - The Balance column shows the updated total after the transaction.
      - The Description column contains details such as transfer types, fees, or reference numbers.
      - **Your response must maintain this format while providing clear, structured explanations.**
      - **All amounts must be in UGX** (Ugandan Shillings). Ensure the currency is always stated.
      - first transaction is at the exterme bottom and doesnt matter whether its this year or not 
      ### **How to Respond:**

      - **Do not simply extract content; explain it in real words.**
      - **Maintain clarity and readability** while ensuring the analysis respects the structure.
      - Example: Instead of just listing numbers, summarize findings like:  
        - "On 12/03/2024, a deposit of $500 was credited, bringing the balance to $3,200. The description indicates a salary deposit."
        
      Now, answer the following query while maintaining the required structure:`;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: instruction }, { text: input }], role: 'user' }],
          cachedContent,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Gemini API Response:', response.data);

      const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
      setMessages((prevMessages) => [...prevMessages, { text: botReply.trim(), sender: 'bot' }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages((prevMessages) => [...prevMessages, { text: 'Error getting response.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        const parts = content.split(/\*\*(.*?)\*\*/g);
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.botMessageText}>
              {parts.map((part, i) =>
                i % 2 === 1 ? <Text key={i} style={{ fontWeight: 'bold' }}>{part}</Text> : part
              )}
            </Text>
          </View>
        );
      }
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <Text key={index} style={styles.botMessageText}>
          {parts.map((part, i) =>
            i % 2 === 1 ? <Text key={i} style={{ fontWeight: 'bold' }}>{part}</Text> : part
          )}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        {selectedCache && <Text style={styles.selectedCache}>{selectedCache}</Text>}
      </View>

      {/* Cache Selection Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Data Source</Text>

            <Text style={styles.sectionTitle}>Bank Statements</Text>
            {banks.map((bank) => (
              <TouchableOpacity key={bank} onPress={() => { setSelectedCache(bank); setShowModal(false); }} style={styles.option}>
                <Text style={styles.optionText}>{bank}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Mobile Money</Text>
            {mobileMoney.map((mm) => (
              <TouchableOpacity key={mm} onPress={() => { setSelectedCache(mm); setShowModal(false); }} style={styles.option}>
                <Text style={styles.optionText}>{mm}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            {item.sender === 'user' ? (
              <Text style={styles.userMessageText}>{item.text}</Text>
            ) : (
              renderFormattedText(item.text)
            )}
          </View>
        )}
      />

      {/* Input Field with Plus Icon */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.plusButton}>
          <Ionicons name="add-circle" size={30} color="#075E54" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !input.trim()}
          style={styles.sendButton}
        >
          <Ionicons name="send" size={24} color={input.trim() ? '#075E54' : '#aaa'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  message: { padding: 10, borderRadius: 8, marginBottom: 5, maxWidth: '80%', marginTop: 10 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#075E54' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#eeeeee' },
  userMessageText: { color: '#fff', fontSize: 16 },
  botMessageText: { color: '#555555', fontSize: 16 },

  // Header styling
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginHorizontal: 2, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  selectedCache: { fontSize: 16, color: '#075E54', fontStyle: 'italic' },

  // Modal Styling
  modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '100%', height: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  option: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  optionText: { fontSize: 16 },

  // Input Field
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ddd', marginBottom: 20 },
  input: { flex: 1, paddingVertical: 10, fontSize: 16 },
  sendButton: { padding: 8, marginLeft: 5 },

  // Plus Icon Button
  plusButton: { padding: 5 },

  // Bullet point styling
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bulletText: {
    fontSize: 18,
    marginRight: 5,
  },
});

export default ChatScreen;
