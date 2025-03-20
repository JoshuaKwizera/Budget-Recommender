import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BackButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <View style={styles.backButtonContainer}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;
