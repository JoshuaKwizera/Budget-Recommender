import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/Screens/SplashScreen';
import LoginScreen from './src/Screens/LoginScreen'; 
import { EmailProvider } from './src/utilityFunctions/EmailContext';
import SignUpScreen from './src/Screens/SignUpScreen';
import BottomTabsNavigator from './src/Transitions/navigation/BottomNavigation/BottomTabsNavigator';

const Stack = createStackNavigator();

const App = () => {
  return (
    <EmailProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
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
       
      </Stack.Navigator>
    </NavigationContainer>
    </EmailProvider>
  );
};

export default App;
