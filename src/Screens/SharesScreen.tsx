import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure it's installed

const BudgetSetupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={28} color="black" />
      </TouchableOpacity>

      {/* Icons Row */}
      <View style={styles.iconsRow}>
        <Image source={require("../assets/pig.jpg")} style={styles.icon} />
        <Image source={require("../assets/pig.jpg")} style={styles.iconInactive} />

      </View>

      <View style={styles.iconsRoww}>
        <Image source={require("../assets/pig.jpg")} style={styles.icon} />
        <Image source={require("../assets/pig.jpg")} style={styles.icon} />
        <Image source={require("../assets/pig.jpg")} style={styles.icon} />
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>Start with the basics</Text>
      <Text style={styles.description}>
        We recommend using the same budget period as your regular income.
      </Text>

      {/* Input Sections */}
      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>NAME</Text>
        <Text style={styles.inputText}>My Household</Text>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>BUDGET PERIOD</Text>
        <Text style={styles.inputText}>Monthly budget</Text>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>MONTHLY START DAY</Text>
        <Text style={styles.inputText}>First day of the month</Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 95,
    marginBottom: 10,
  },
  iconsRoww: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 20,
  },
  icon: {
    width: 55,
    height: 50,
    marginHorizontal: 5,
  },
  iconInactive: {
    width: 55,
    height: 50,
    marginHorizontal: 5,
    opacity: 0.3, // Dimmed inactive icon
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 15,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  inputText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#075E54",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BudgetSetupScreen;
