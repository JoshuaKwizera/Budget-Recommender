import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../../../src/Screens/SplashScreen';
import LoginScreen from '../../../../src/Screens/LoginScreen';
import SignUpScreen from '../../../../src/Screens/SignUpScreen';
import BottomTabsNavigator from '../../../../src/Transitions/navigation/bottomNavigation/BottomTabsNavigator';
import SelectMobileProviderScreen from '../../../Screens/SelectMobileProviderScreen';
import MobileMoneyScreen from '../../../Screens/MobileMoneyScreen';
import HomeScreen from '../../../Screens/HomeScreen';
import BankScreen from '../../../Screens/BankScreen';
import ManualSpendingScreen from '../../../Screens/ManualSpendingScreen';
import SelectBankProviderScreen from '../../../Screens/SelectBankProviderScreen';
import BudgetShows from '../../../Screens/BudgetShows';
import BudgetSetup from '../../../Screens/BudgetSetup';
import BudgetOverview from '../../../Screens/BudgetOverview';
import BudgetShow from '../../../Screens/BudgetShow';
import ExpenseScreen from '../../../Screens/ExpenseScreen';
import FinalSummary from '../../../Screens/FinalSummary';
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BottomTabsNavigator" 
        component={BottomTabsNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="SelectMobileProviderScreen" 
        component={SelectMobileProviderScreen} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name="SelectBankProviderScreen" 
        component={SelectBankProviderScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MobileMoneyScreen" 
        component={MobileMoneyScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BankScreen" 
        component={BankScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ManualSpendingScreen" 
        component={ManualSpendingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
          name="BudgetScreen" 
          component={BudgetSetup} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BudgetShow" 
          component={BudgetShow} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BudgetShows" 
          component={BudgetShows} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ExpenseScreen" 
          component={ExpenseScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BudgetOverview" 
          component={BudgetOverview} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="FinalSummary" 
          component={FinalSummary} 
          options={{ headerShown: false }} 
        />
    </Stack.Navigator>
  );
};

export default StackNavigator;
