import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Modal, Keyboard, Alert,
} from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useIncome } from "../Storage";

const ExpenseScreen = () => {
  const navigation = useNavigation();
  const { totalIncome, expense, setExpense, totalExpense, setTotalExpense, uName, setAmountLeft, amountLeft } = useIncome(); // Access global income state
  const [modalVisible, setModalVisible] = useState(false); 
  const [editingIndex, setEditingIndex] = useState(null);  
  const [customCategory, setCustomCategory] = useState("");  
  const [showCustomInput, setShowCustomInput] = useState(false);  
  const [remainingIncome, setRemainingIncome] = useState(totalIncome);

  const incomeCategories = [
    "Rent", "Internet", "Food", "Clothes", "Gas", 
    "Savings", "Miscellaneous", "Other"
  ];
  

  useEffect(() => {
    const totalExpenses = expense.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setTotalExpense(totalExpenses);
    setRemainingIncome(totalIncome - totalExpenses);
    setAmountLeft(totalIncome - totalExpenses);
    console.log(amountLeft);
  }, [expense, totalIncome]);

  // Handle selection from modal
  const addIncomeCategory = (category) => {
    if (category === "Other") {
      setShowCustomInput(true); // Show input field for custom category
    } else {
      setExpense([...expense, { name: category, amount: "" }]);
      setModalVisible(false);
      setEditingIndex(expense.length); 
    }
  };

  // Confirm custom category and add it to the list
  const confirmCustomCategory = () => {
    if (customCategory.trim() !== "") {
      setExpense([...expense, { name: customCategory, amount: "" }]);
      setShowCustomInput(false);
      setCustomCategory("");
      setModalVisible(false);
      setEditingIndex(expense.length); 
    }
  };

  // Handle amount change
  const updateIncomeAmount = (text, index) => {
    let updatedSources = [...expense];
    updatedSources[index].amount = text;
    setExpense(updatedSources);
  };

  // Confirm amount entry
  const confirmAmount = (index) => {
    setEditingIndex(null); 
    Keyboard.dismiss();
  };

  const totalExpenses = expense.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

 const continueToBudget = async () => {
     if (!Array.isArray(expense) || expense.length === 0) {
       Alert.alert("Error", "Please add at least one expense source before proceeding.");
       return;
     }
   
     if (!uName) {
       Alert.alert("Error", "User name is missing. Please log in again.");
       return;
     }
   
     try {
       console.log("Sending data to server:", { uName, expense });
     
       const response = await fetch("http://investorsol4.pythonanywhere.com/expense", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ uName, expense }),
       });
     
       const text = await response.text(); // Read response as text first
       console.log("Raw server response:", text);
     
       try {
         const data = JSON.parse(text); // Parse JSON
         console.log("Parsed server response:", data);
     
         if (response.ok) {
           Alert.alert("Success", "Expense data saved successfully!");
           navigation.navigate("FinalSummary");
         } else {
           Alert.alert("Error", data.message || "Failed to save data. Please try again.");
         }
       } catch (jsonError) {
         console.error("JSON Parse error:", jsonError);
         Alert.alert("Error", "Invalid server response. Please check the backend.");
       }
     } catch (error) {
       console.error("Network error:", error);
       Alert.alert("Error", "Network error. Please check your connection and try again.");
     }
   };
  return (
    <View style={styles.container}>
      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={() => navigation.goBack()} 
        style={styles.backButton} 
      />

      {/* Display Total Expenses */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalAmount}>USh {remainingIncome} left of income</Text>
      </View>

      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.description}>
        These expenses should be fairly regular from period to period
      </Text>

      <FlatList
        data={expense}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.incomeItem}>
            <Text style={styles.incomeText}>{item.name}</Text>
            {editingIndex === index ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  autoFocus={true}
                  value={item.amount}
                  onChangeText={(text) => updateIncomeAmount(text, index)}
                />
                <IconButton 
                  icon="check-circle" 
                  size={24} 
                  color="green" 
                  onPress={() => confirmAmount(index)}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingIndex(index)}>
                <Text style={styles.amountText}>
                  {item.amount ? `USh ${item.amount}` : "USh 0"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.addIncomeButton} 
        onPress={() => setModalVisible(true)}
      >
        <IconButton icon="plus-circle-outline" size={24} color="black" />
        <Text style={styles.addIncomeText}>Add another expense</Text>
      </TouchableOpacity>

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

      {/* Full-Screen Modal for Category Selection */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <IconButton 
            icon="close" 
            size={24} 
            onPress={() => setModalVisible(false)} 
            style={styles.closeButton} 
          />
          
          <Text style={styles.modalTitle}>Select Expense Category</Text>

          {!showCustomInput ? (
            <FlatList 
              data={incomeCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryItem} 
                  onPress={() => addIncomeCategory(item)}
                >
                  <Text style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.customCategoryContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter category name"
                value={customCategory}
                onChangeText={setCustomCategory}
                autoFocus
              />
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={confirmCustomCategory}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  backButton: { position: "absolute", top: 20, left: 10 },
  totalContainer: { marginTop: 10, padding: 15, borderBottomWidth: 1, borderBottomStartRadius: 50, borderBottomEndRadius: 50, borderBottomColor: "#000", flexDirection: "row", justifyContent: "center" },
  totalText: { fontSize: 18, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 30, marginBottom: 5},
  description: { textAlign: "center", fontSize: 14, color: "gray", marginBottom: 25 },
  incomeItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderRadius: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
  incomeText: { fontSize: 16, fontWeight: "bold" },
  amountText: { fontSize: 16, color: "#888" },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: { borderBottomWidth: 1, fontSize: 16, paddingHorizontal: 5, minWidth: 80 },
  addIncomeButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addIncomeText: { fontSize: 16, color: "black" },
  skipMessageBox: { backgroundColor: "#f1f1f1", padding: 15, borderRadius: 10, marginTop: 20 },
  skipMessageText: { textAlign: "center", color: "gray" },
  button: { backgroundColor: "#075E54", paddingVertical: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  closeButton: { position: "absolute", top: 20, right: 10 },
  modalTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  categoryItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  categoryText: { fontSize: 18 },
  customCategoryContainer: { padding: 20 },
  customInput: { borderBottomWidth: 1, fontSize: 16, padding: 10 },
  confirmButton: { backgroundColor: "#075E54", padding: 10, marginTop: 10, borderRadius: 5, alignItems: "center" },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "bold" }
});


export default ExpenseScreen;
