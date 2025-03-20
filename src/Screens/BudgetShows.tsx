import React from "react";
import { View, TouchableOpacity, Text, FlatList, StyleSheet } from "react-native";
import { useIncome } from "../Storage"; // Import context
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const BudgetShows = () => {
  const navigation = useNavigation();
  const { incomeSources, setTotalIncome} = useIncome(); // Get context values

  // Convert amounts to numbers and sum them up
  const totalIncome = incomeSources.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const continueToBudget = () => {
    setTotalIncome(totalIncome); // Store total income in context
    console.log("Total Income Stored:", totalIncome); // Debugging
    navigation.navigate("ExpenseScreen");
  };

  return (
    <View style={styles.container}>
      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={() => navigation.goBack()} 
        style={styles.backButton} 
      />
      <Text style={styles.title}>Income Summary</Text>
      <FlatList
        data={incomeSources}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.incomeItem}>
            <Text style={styles.incomeText}>{item.name}</Text>
            <Text style={styles.amountText}>{item.amount ? `USh ${item.amount}` : "0 USh"}</Text>
          </View>
        )}
      />
      {/* Display Total Income */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Income:</Text>
        <Text style={styles.totalAmount}>USh {totalIncome.toFixed(2)}</Text>
      </View>

      <View style={styles.skipMessageBox}>
        <Text style={styles.skipMessageText}>
            If you want to budget using only expenses, then go ahead and skip this step.
        </Text>
      </View>
    
      <TouchableOpacity 
        onPress={continueToBudget}
        style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: { position: "absolute", top: 20, left: 10 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 38 },
  incomeItem: { flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  incomeText: { fontSize: 16, fontWeight: "bold" },
  amountText: { fontSize: 16, color: "#888" },
  totalContainer: { marginTop: 20, padding: 15, borderTopWidth: 1, borderTopColor: "#000", flexDirection: "row", justifyContent: "space-between" },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "#333" },
  skipMessageBox: { backgroundColor: "#f1f1f1", padding: 15, borderRadius: 10, marginTop: 20 },
  skipMessageText: { textAlign: "center", color: "gray" },
  button: { backgroundColor: "#075E54", paddingVertical: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default BudgetShows;
