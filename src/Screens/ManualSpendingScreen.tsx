import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/BackButton';

interface Item {
  id: string;
  name: string;
  quantity: string;
  amount: string;
  total: string;
}

const ManualSpendingScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [deleteName, setDeleteName] = useState<string>('');
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: '', amount: '', total: '' }]);
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Ensure both values are numbers
          const quantity = Number(updatedItem.quantity) || 0;
          const amount = Number(updatedItem.amount) || 0;

          // Recalculate total
          updatedItem.total = (quantity * amount).toString();

          return updatedItem;
        }
        return item;
      })
    );
  };

  const deleteItem = () => {
    setItems(prevItems => prevItems.filter(item => item.name !== deleteName));
    setDeleteName('');
    setShowDeletePrompt(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>Manual Spending</Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>Quantity</Text>
            <Text style={styles.headerText}>Amount</Text>
            <Text style={styles.headerText}>Total</Text>
          </View>

          {/* Scrollable content */}
          <View style={styles.contentWrapper}>
            <FlatList
              data={items}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.row,
                    index === items.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { textAlign: 'center' }]}
                    value={item.name}
                    onChangeText={text => updateItem(item.id, 'name', text)}
                    placeholder="Enter item"
                  />
                  <TextInput
                    style={[styles.input, { textAlign: 'center' }]}
                    keyboardType="numeric"
                    value={item.quantity}
                    onChangeText={text => updateItem(item.id, 'quantity', text)}
                    placeholder="0"
                  />
                  <TextInput
                    style={[styles.input, { textAlign: 'center' }]}
                    keyboardType="numeric"
                    value={item.amount}
                    onChangeText={text => updateItem(item.id, 'amount', text)}
                    placeholder="0"
                  />
                  <Text style={styles.totalText}>{item.total}</Text>
                </View>
              )}
            />
          </View>

          {/* Bottom Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Delete Button (Left) */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeletePrompt(true)}>
              <Ionicons name="trash-bin" size={20} color="#ff3b30" />
            </TouchableOpacity>

            {/* Add Button (Right) */}
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Ionicons name="add-circle" size={20} color="#075E54" />
            </TouchableOpacity>
          </View>

          {/* Delete Confirmation Prompt */}
          <Modal
            visible={showDeletePrompt}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDeletePrompt(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter item name to delete:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={deleteName}
                  onChangeText={setDeleteName}
                  placeholder="Item name"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={deleteItem}>
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setShowDeletePrompt(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    justifyContent: 'flex-start',
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
  contentWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingBottom: 10,
    borderRadius: 5,
    maxHeight: '100%',
    overflow: 'scroll',
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
  totalText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
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
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Positioning at the bottom
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%', // Full width
    height: '50%', // Cover the bottom half
    justifyContent: 'flex-start', // Adjusted to push inputs and buttons closer to the top
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Centered title
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%', // Ensure input takes full width
    textAlign: 'center', // Centered input text
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Make sure buttons are properly spaced
  },
  modalButton: {
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Ensure equal spacing between buttons
    marginHorizontal: 5, // Add space between buttons
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ManualSpendingScreen;
