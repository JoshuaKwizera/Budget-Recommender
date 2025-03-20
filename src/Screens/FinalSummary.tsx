import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { IconButton } from "react-native-paper";
import { Svg, Circle } from "react-native-svg";
import { useNavigation} from "@react-navigation/native";
import { useIncome } from "../Storage";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";


const BudgetSetupScreen = () => {

  const { totalIncome, expense, totalExpense, setHasBudget } = useIncome(); // Get context values

  const navigation = useNavigation();

  const continueToBudget = () => {
    setHasBudget(true);
    navigation.navigate('BottomTabsNavigator', { screen: 'Budget' });
  };

  return (
    <View style={styles.container}>

      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={() => navigation.goBack()} 
        style={styles.backButton} 
      />


      <Text style={styles.title}>You're all set up! 🎉</Text>
      <Text style={styles.subtitle}>
        Great job! Remember, you can edit everything you've just entered and add new categories later on.
      </Text>

      <View style={styles.circleContainer}>
        <Svg width={100} height={100} viewBox="0 0 101 100">
          <Circle
            cx="60"
            cy="60"
            r="35"
            stroke="#FFA500"
            strokeWidth="12"
            fill="none"
            strokeDasharray="251"
            strokeDashoffset={251 - 251 * 1}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.textContainer}>
      <Text style={styles.totalText}>Total Planned Expenses</Text>
  
      </View>

      <View style={styles.totalTextContainer}>

      <Text style={styles.totalExpenses}>USh {totalExpense}</Text>
      </View>

      <View style={styles.rows}>
        <View style={[styles.colorDots, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.incomeName}>Income  .......................</Text>
          <Text style={styles.amountTexts}>USh {totalIncome}</Text>
      </View>

      <FlatList
        data={expense}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.colorDot, { backgroundColor: "#FF9800" }]} />
            <Text style={styles.categoryText}>{item.name}    ............................    </Text>
            <Text style={styles.amountText}>USh {item.amount}</Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={continueToBudget} style={styles.button}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  backButton: { position: "absolute", top: 20, left: 10 },
  totalText: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: -50 },
  title: { fontSize: 28, fontWeight: "900", marginTop: 35 },
  subtitle: { fontSize: 16.5, textAlign: "center", color: "#666", marginBottom: 20 },
  circleContainer: {  marginTop: 18, marginLeft: -190 },
  textContainer: {  marginTop: -65, marginLeft: 80 },
  totalTextContainer: {  marginTop: 20, marginLeft: 80 },
  totalExpenses: { fontSize: 25, fontWeight: "bold", color: "#000"},
  row: {  width: "100%", paddingVertical: 1, marginTop: 7, marginStart: 10 },
  colorDot: { width: 12, height: 12, borderRadius: 4, marginRight: 300, marginTop: 27 },
  categoryText: { flex: 1, fontSize: 16.8, marginStart: 30, marginTop: -17 },
  amountText: { fontSize: 16, fontWeight: "bold", marginTop: -18, marginLeft: 250, color: "black" },
  button: { backgroundColor: "#075E54", paddingVertical: 17, width: "100%", alignItems: "center", borderRadius: 30, marginBottom: 20 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  colorDots: { width: 12, height: 12, borderRadius: 4, marginRight: 300, marginTop: 30 },
  incomeName: { fontSize: 19, fontWeight: "bold", marginTop: -18, marginLeft: 30, color: "black" },
  amountTexts: { fontSize: 16, fontWeight: "bold", marginTop: -17, marginLeft: 250, color: "black" },
  rows: {  width: "100%", paddingVertical: 2, marginTop: 17, marginStart: 28 },
});

export default BudgetSetupScreen;
