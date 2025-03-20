import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Dropdown from '../components/DropDown'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/BackButton';
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the type for navigation prop specific to LoginScreen
type BankProviderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectBankProviderScreen'>;

const BANK_PROVIDERS = [
  { label: 'Stanbic Bank', value: 'Stanbic Bank' },
  { label: 'Eco Bank', value: 'Eco Bank' },
];

const SelectBankProviderScreen: React.FC = () => {
  const navigation = useNavigation<BankProviderScreenNavigationProp>();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBankSelect = (value: string) => {
    setSelectedBank(value);
    setErrors((prev) => ({ ...prev, bankProvider: '' }));
  };

  const handleSubmit = async () => {
    if (!selectedBank) {
      setErrors((prev) => ({
        ...prev,
        bankProvider: 'Please select a bank provider.',
      }));
      return;
    }

    try {
      // Store the selected bank provider in AsyncStorage
      await AsyncStorage.setItem('selectedBankProvider', selectedBank);
      // Navigate to the next screen
      navigation.navigate('BankScreen');
    } catch (error) {
      console.error('Error storing bank provider:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Bank Provider</Text>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>Please select your preferred bank from the list below:</Text>
      </View>

      <Dropdown
        options={BANK_PROVIDERS}
        selectedValue={selectedBank}
        onSelect={handleBankSelect}
        placeholder="Select a bank"
        dropdownPosition={{ top: 240, left: 20, right: 20 }} 
        prefix={<Ionicons name="home-outline" size={18} color="#333" />} 
        error={errors?.bankProvider} 
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54',
    textAlign: 'center',
    flex: 1,
  },
  subtitleContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectBankProviderScreen;
