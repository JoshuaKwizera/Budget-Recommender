import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Transitions/navigation/types';
import { useIncome } from "../Storage"; // Import context


// Define navigation type
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const logo = require('../assets/logo.png');
const backgroundImages = [
  require('../assets/finance2.png'),
  require('../assets/finance3.jpg'),
  require('../assets/finance4.png'),
];

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const {uName, setUName, setHasBudget, setIncomeSources, setExpense, setTotalExpense, setTotalIncome, setAmountLeft} = useIncome();
  const [password, setPassword] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleTextChange = (text) => {
    setUsername(text);
    setUName(text);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    try {
      const response = await fetch('http://investorsol4.pythonanywhere.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Login successful!');
        setUName(username);
        // Extract token and budget data from the response
        const { token, income = [], expenses = [] } = data;
            if (income.length > 0 && expenses.length > 0) {
          // Ensure amounts are parsed as floats
          const parsedIncome = income.map(item => ({
            category: item.category,
            amount: parseFloat(item.amount) || 0,
          }));
  
          const parsedExpenses = expenses.map(item => ({
            category: item.category,
            amount: parseFloat(item.amount) || 0,
          }));
          console.log(income);
          setIncomeSources(income);
          setExpense(expenses);
  
          // Calculate totals
          const totalIncome = parsedIncome.reduce((sum, item) => sum + item.amount, 0);
          const totalExpense = parsedExpenses.reduce((sum, item) => sum + item.amount, 0);
          const amountRemaining = totalIncome - totalExpense;
          setAmountLeft(amountRemaining);
  
          setTotalIncome(totalIncome);
          setTotalExpense(totalExpense);
  
          // Set hasBudget to true
          setHasBudget(true);
        }
  
        // Navigate to home screen
        navigation.navigate('BottomTabsNavigator', { screen: 'Home' });
      } else {
        Alert.alert('Error', data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundImage, { opacity: fadeAnim }]}>
        <ImageBackground source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} />
      </Animated.View>

      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome!</Text>

        {/* Username Input */}
        <View style={[styles.inputContainer, phoneFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            onChangeText={handleTextChange}
            value={username}
          />
        </View>

        {/* Password Input */}
        <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>I forgot my password</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    zIndex: -1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  inputContainerFocused: {
    borderColor: '#075E54',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#075E54',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderColor: '#075E54',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#075E54',
    fontSize: 16,
  },
});

export default LoginScreen;
