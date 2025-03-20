import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../Transitions/navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useIncome } from "../Storage"; // Import context

type BudgetShowNavigationProp = StackNavigationProp<RootStackParamList, "BudgetShow">;

const BudgetSetupScreen = () => {
  const navigation = useNavigation<BudgetShowNavigationProp>();

  const { 
    budgetName, setBudgetName, 
    selectedBudgetPeriod, setSelectedBudgetPeriod, 
    monthlyStartDay, setMonthlyStartDay 
  } = useIncome(); // Access context

  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isStartDayModalVisible, setStartDayModalVisible] = useState(false);

  const budgetOptions = ["Monthly", "Weekly"];
  const monthlyDays = Array.from({ length: 28 }, (_, i) => `${i + 1}th`).concat(["Last day"]);
  const weeklyDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const selectBudgetPeriod = (period: string) => {
    setSelectedBudgetPeriod(period);
    setBudgetModalVisible(false);
  };

  const selectStartDay = (day: string) => {
    setMonthlyStartDay(day);
    setStartDayModalVisible(false);
  };

  const startDayOptions = selectedBudgetPeriod === "Weekly" ? weeklyDays : monthlyDays;

  
  const continueToBudget = () => {
    console.log("BudgetData Stored:", budgetName, selectBudgetPeriod, monthlyStartDay); // Debugging
    navigation.navigate("BudgetShow");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={28} color="black" />
      </TouchableOpacity>

      {/* Icons Row */}
      <View style={styles.iconsRow}>
        <Image source={require("../assets/kids.png")} style={styles.icon} />
      </View>

      <View style={styles.iconsRoww}>
        <Image source={require("../assets/cari.jpg")} style={styles.icon} />
        <Image source={require("../assets/beef.jpg")} style={styles.icon} />
        <Image source={require("../assets/hous.jpg")} style={styles.icon} />
      </View>

      <Text style={styles.title}>Start with the basics</Text>
      <Text style={styles.description}>
        We recommend using the same budget period as your regular income.
      </Text>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>NAME</Text>
        <TextInput
          style={styles.inputText}
          value={budgetName}
          onChangeText={setBudgetName}
          placeholder="Enter budget name"
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>BUDGET PERIOD</Text>
        <TouchableOpacity onPress={() => setBudgetModalVisible(true)}>
          <Text style={styles.inputText}>{selectedBudgetPeriod}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>{selectedBudgetPeriod.toUpperCase()} START DAY</Text>
        <TouchableOpacity onPress={() => setStartDayModalVisible(true)}>
          <Text style={styles.inputText}>{monthlyStartDay}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={continueToBudget} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Modal visible={isBudgetModalVisible} animationType="slide" transparent={true} onRequestClose={() => setBudgetModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>BUDGET PERIOD</Text>
            <FlatList
              data={budgetOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => selectBudgetPeriod(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={isStartDayModalVisible} animationType="slide" transparent={true} onRequestClose={() => setStartDayModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBudgetPeriod.toUpperCase()} START DAY</Text>
            <FlatList
              data={startDayOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => selectStartDay(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    marginTop: 90,
    marginBottom: 10,
  },
  iconsRoww: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 60,
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#888",
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default BudgetSetupScreen;
