import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, FlatList, TextInput, Modal, Alert, } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIncome } from "../Storage";

// Define the type for navigation prop specific to LoginScreen
type BudgetPreviewNavigationProp = StackNavigationProp<RootStackParamList, 'BudgetOverview'>;

export default function BudgetScreen() {
  const { incomeSources, setIncomeSources, expense, setExpense, totalExpense, setTotalExpense, uName, totalIncome, setTotalIncome, amountLeft, setAmountLeft } = useIncome(); 
  const navigation = useNavigation<BudgetPreviewNavigationProp>();
  const [activeTab, setActiveTab] = useState("PLAN");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expenseEditingIndex, setExpenseEditingIndex] = useState<number | null>(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [editedExpense, setEditedExpense] = useState("");

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // Expense Modal
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const data = {
    data: [2], // 100% used (2 out of 2)
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();


  const handleConfirmEdit =  (index: number) => {
    const updatedSources = [...incomeSources];
    updatedSources[index].amount = editedAmount;
    setIncomeSources(updatedSources);
    setEditingIndex(null);
  };

  const handleConfirmEditExpense = (index: number) => {
    const updatedExpenses = [...expense];
    updatedExpenses[index].amount = editedExpense;
    setExpense(updatedExpenses);
    setExpenseEditingIndex(null);
  };

  // Function to handle adding a new income category
  const handleAddIncomeCategory = async () => {
    if (newCategory.trim() !== "" && newAmount.trim() !== "") {
      const incomeAmount = parseFloat(newAmount); // Ensure it's a number
  
      if (isNaN(incomeAmount)) {
        Alert.alert("Error", "Please enter a valid income amount.");
        return;
      }
  
      const newIncome = { name: newCategory, amount: String(incomeAmount) };
  
      // Update total income first
      const updatedTotalIncome = totalIncome + incomeAmount;
  
      // Compute new amount left correctly
      const updatedAmountLeft = updatedTotalIncome - totalExpense;
  
      setTotalIncome(updatedTotalIncome);
      setAmountLeft(updatedAmountLeft);
  
      console.log("Updated Total Income:", updatedTotalIncome);
      console.log("New Amount Left:", updatedAmountLeft);
  
      try {
        const requestData = { uName, newIncome: [newIncome] };
  
        const response = await fetch("http://investorsol4.pythonanywhere.com/newincome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          setIncomeSources([...incomeSources, newIncome]);
          Alert.alert("Success", "Income source added successfully!");
  
          setNewCategory("");
          setNewAmount("");
          setModalVisible(false);
        } else {
          Alert.alert("Error", responseData.message || "Failed to add income source.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
        console.error("Error adding income source:", error);
      }
    } else {
      Alert.alert("Warning", "Please fill in both fields before adding.");
    }
  };
  
  
  const handleAddExpenseCategory = async () => {
    if (newExpense.trim() !== "" && newExpenseAmount.trim() !== "") {
      const expenseAmount = parseFloat(newExpenseAmount);
  
      if (isNaN(expenseAmount)) {
        Alert.alert("Error", "Please enter a valid expense amount.");
        return;
      }
  
      const newExpenseCat = { name: newExpense, amount: String(expenseAmount) };
  
      // Update total expense first
      const updatedTotalExpense = totalExpense + expenseAmount;
  
      // Compute new amount left correctly
      const updatedAmountLeft = totalIncome - updatedTotalExpense;
  
      setTotalExpense(updatedTotalExpense);
      setAmountLeft(updatedAmountLeft);
  
      console.log("Updated Total Expense:", updatedTotalExpense);
      console.log("New Amount Left:", updatedAmountLeft);
  
      try {
        const requestData = { uName, newExpenseCat: [newExpenseCat] };
  
        const response = await fetch("http://investorsol4.pythonanywhere.com/newexpense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          setExpense([...expense, newExpenseCat]);
          Alert.alert("Success", "Expense added successfully!");
  
          setNewExpense("");
          setNewExpenseAmount("");
          setExpenseModalVisible(false);
        } else {
          Alert.alert("Error", responseData.message || "Failed to add expense.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
        console.error("Error adding expense:", error);
      }
    } else {
      Alert.alert("Warning", "Please fill in both fields before adding.");
    }
  };
  
  

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      {/* Header & Tabs Section */}
      <View style={{ backgroundColor: "#075E54", padding: 20, paddingBottom: 30, paddingTop: StatusBar.currentHeight }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>Budget: My Household</Text>
          <MaterialIcons name="edit" size={24} color="white" />
        </View>
                {/* Tabs */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15 }}>
          {["PLAN", "RECOMMENDED", "INSIGHTS"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 15,
                  backgroundColor: activeTab === tab ? "rgba(255, 255, 255, 0.2)" : "transparent",
                }}
              >
                <Text style={{ color: activeTab === tab ? "white" : "#DDD", fontWeight: "bold" }}>
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    

      {/* Main Content Section */}
      <View style={{ backgroundColor: "#F6F1E9", flex: 1, padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20 }}>
                {/* Date Selection */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, backgroundColor: "white", borderRadius: 40, height: 60, paddingHorizontal: 15 }}>
          <TouchableOpacity>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{`${currentMonth} ${currentYear}`}</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Total Expenses Card */}
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <ProgressChart
            data={data}
            width={100}
            height={100}
            strokeWidth={10}
            radius={32}
            chartConfig={{
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
            hideLegend={true}
          />
          <View style={{  marginTop: -68, marginLeft: 100 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#000", marginBottom: -50 }}>Total Planned Expenses</Text>
            
                </View>
          
                <View style={{  marginTop: 20, marginLeft: 100 }}>
          
                <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000"}}>USh {totalExpense}</Text>
                </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <View style={{ width: 10, height: 10, backgroundColor: "#00C49F", borderRadius: 5, marginRight: 10 }} />
            <Text>Amount Left {amountLeft} USh</Text>
          </View>
        </View>

        {/* Income Section */}
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Income</Text>
          <FlatList
            data={incomeSources}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="wallet-outline" size={24} color="green" style={{ marginRight: 10 }} />
                  <Text>{item.name}</Text>
                </View>
                {editingIndex === index ? (
                  <TextInput
                    style={{ borderBottomWidth: 1, width: 80, textAlign: "right" }}
                    value={editedAmount}
                    onChangeText={setEditedAmount}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={{ fontWeight: "bold" }}>USh {item.amount}</Text>
                )}
                {editingIndex === index ? (
                  <TouchableOpacity onPress={() => handleConfirmEdit(index)}>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => { setEditingIndex(index); setEditedAmount(item.amount.toString()); }}>
                    <Ionicons name="create-outline" size={24} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Ionicons name="add-circle-outline" size={24} color="gray" style={{ marginRight: 10 }} />
            <Text style={{ color: "gray" }}>Add category</Text>
          </TouchableOpacity>
        </View>

         {/* Modal for Adding Income */}
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                width: "85%",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Income Category</Text>

              {/* Category Input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
                placeholder="Category Name"
                value={newCategory}
                onChangeText={setNewCategory}
              />

              {/* Amount Input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
                placeholder="Amount (USh)"
                value={newAmount}
                keyboardType="numeric"
                onChangeText={setNewAmount}
              />

              {/* Buttons */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF4C4C",
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    marginRight: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#075E54",
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    alignItems: "center",
                  }}
                  onPress={handleAddIncomeCategory}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Expense Section */}
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Expenses</Text>
          <FlatList
            data={expense}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="cart-outline" size={24} color="green" style={{ marginRight: 10 }} />
                  <Text>{item.name}</Text>
                </View>
                {expenseEditingIndex === index ? (
                  <TextInput
                    style={{ borderBottomWidth: 1, width: 80, textAlign: "right" }}
                    value={editedExpense}
                    onChangeText={setEditedExpense}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={{ fontWeight: "bold" }}>USh {item.amount}</Text>
                )}
                {expenseEditingIndex === index ? (
                  <TouchableOpacity onPress={() => handleConfirmEditExpense(index)}>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => { setExpenseEditingIndex(index); setEditedExpense(item.amount.toString()); }}>
                    <Ionicons name="create-outline" size={24} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setExpenseModalVisible(true)} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Ionicons name="add-circle-outline" size={24} color="gray" style={{ marginRight: 10 }} />
            <Text style={{ color: "gray" }}>Add Expense</Text>
          </TouchableOpacity>
        </View>

         {/* Modal for Adding Expense */}
        <Modal transparent={true} visible={expenseModalVisible} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                width: "85%",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Expense Category</Text>

              {/* Category Input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
                placeholder="Expense Name"
                value={newExpense}
                onChangeText={setNewExpense}
              />

              {/* Amount Input */}
              <TextInput
                style={{
                  borderWidth: 1,
                  width: "100%",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
                placeholder="Amount (USh)"
                value={newExpenseAmount}
                keyboardType="numeric"
                onChangeText={setNewExpenseAmount}
              />

              {/* Buttons */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF4C4C",
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    marginRight: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setExpenseModalVisible(false)}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#075E54",
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    alignItems: "center",
                  }}
                  onPress={handleAddExpenseCategory}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
