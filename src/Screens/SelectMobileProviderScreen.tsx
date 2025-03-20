import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type MobileProviderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectMobileProviderScreen'>;

const PROVIDERS = [
  { id: 'airtel', name: 'Airtel Mobile Money', logo: require('../assets/airtel.png'), color: '#D91A2A' },
  { id: 'mtn', name: 'MTN Mobile Money', logo: require('../assets/mtn.png'), color: '#FFCC00' },
];

const SelectMobileProviderScreen: React.FC = () => {
  const navigation = useNavigation<MobileProviderScreenNavigationProp>();

  const storeProvider = async (providerName: string) => {
    try {
      await AsyncStorage.setItem('selectedMobileProvider', providerName); 
      navigation.navigate('MobileMoneyScreen'); // Navigate after storing
    } catch (error) {
      console.error('Error storing provider:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Mobile Money</Text>
      </View>

      <Text style={styles.subtitle}>Select a mobile money provider</Text>

      {PROVIDERS.map((provider) => (
        <TouchableOpacity 
          key={provider.id} 
          style={styles.card} 
          onPress={() => storeProvider(provider.name)}
        >
          <Image source={provider.logo} style={styles.logo} />
          <Text style={styles.providerText}>{provider.name}</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20, },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#075E54', textAlign: 'center', flex: 1 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 12 },
  providerText: { fontSize: 16, fontWeight: 'bold', flex: 1 },
});

export default SelectMobileProviderScreen;
