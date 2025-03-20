import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Define the type for navigation prop specific to LoginScreen
type BudgetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BudgetScreen'>;

const ProfileScreen = () => {
  const navigation = useNavigation<BudgetScreenNavigationProp>();
  return (
    <View style={styles.container}>
      {/* Piggy Bank Image */}
      <Image source={require("../assets/pig.jpg")} style={styles.pigImage} />

      {/* Title */}
      <Text style={styles.title}>
        Setup your first budget <Text style={styles.emoji}>💰</Text>
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        We'll guide you through the steps of setting up your personalised
        household budget.
      </Text>

      {/* Buttons */}
      <TouchableOpacity 
       onPress={() => navigation.navigate('BudgetScreen')}
      style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonSecondaryText}>Skip setup</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Light grey background
    paddingHorizontal: 20,
  },
  pigImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  emoji: {
    fontSize: 22,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#075E54",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    paddingVertical: 10,
  },
  buttonSecondaryText: {
    color: "#666",
    fontSize: 16,
  },
});

export default ProfileScreen;
