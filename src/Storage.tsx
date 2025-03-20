import React, { createContext, useState, useContext } from "react";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomeSources, setIncomeSources] = useState([]); // Store income sources
  const [expense, setExpense] = useState([]); //keep trck of expenses
  const [totalIncome, setTotalIncome] = useState(0); // Store total income
  const [amountLeft, setAmountLeft] = useState(0); // Store total income
  const [totalExpense, setTotalExpense] = useState(0); //store total expense
  const [budgetName, setBudgetName] = useState("My Household"); // for storing the budget name
  const [uName, setUName] = useState(""); // for storing the name
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState("Monthly"); //for storing budget period
  const [monthlyStartDay, setMonthlyStartDay] = useState("First day of the month");
  const [hasBudget, setHasBudget] = useState(false); // Track if budget setup is complete

  return (
    <IncomeContext.Provider value={{ incomeSources, setIncomeSources, totalIncome, setTotalIncome, expense, setExpense, totalExpense, setTotalExpense, budgetName, setBudgetName, selectedBudgetPeriod, selectedBudgetPeriod, monthlyStartDay, setMonthlyStartDay, hasBudget, setHasBudget, uName, setUName, amountLeft, setAmountLeft }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => useContext(IncomeContext);
