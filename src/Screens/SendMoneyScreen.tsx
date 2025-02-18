import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SendScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Light grey background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark grey text
  },
});

export default SendScreen;
