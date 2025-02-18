import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground } from 'react-native';
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Define the type for navigation prop specific to LoginScreen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

// Import static assets
const logo = require('../assets/logo.png');
const backgroundImages = [
  require('../assets/finance2.png'),
  require('../assets/finance3.jpg'),
  require('../assets/finance4.png'),
];

// LoginScreen component definition
const LoginScreen = () => {
  // State hooks for managing focus and input values
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  // Refs for animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const typingAnim = useRef(new Animated.Value(0)).current; 

  // Navigation hook
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Full text to display in the footer with typing effect
  const fullText = "Fast, Reliable & Affordable?";

  // Effect for cycling background images with fade animation
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

  // Effect for typing animation of the footer text
  useEffect(() => {
    const typingInterval = 100; 
    let index = 0;

    const typingTimer = setInterval(() => {
      setTypedText((prev) => fullText.slice(0, index + 1));
      index += 1;
      if (index >= fullText.length) {
        clearInterval(typingTimer);
      }
    }, typingInterval);

    return () => clearInterval(typingTimer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated background image with fading effect */}
      <Animated.View style={[styles.backgroundImage, { opacity: fadeAnim }]}>
        <ImageBackground source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} />
      </Animated.View>

      <View style={styles.content}>
        {/* Logo image */}
        <Image source={logo} style={styles.logo} />
        
        {/* Welcome text */}
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subText}>to F.W.H</Text>

        {/* Phone number input with focus styles */}
        <View style={[styles.inputContainer, phoneFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="+256 775 582 325"
            keyboardType="phone-pad"
            placeholderTextColor="#888"
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Text style={[styles.icon, styles.iconColored]}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Password input with focus styles */}
        <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Text style={[styles.icon, styles.iconColored]}>👁️</Text>
          </TouchableOpacity>
        </View>

        {/* Login button with navigation */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('BottomTabsNavigator', { screen: 'Home' })}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>


        {/* Link to reset password */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>I forgot my password</Text>
        </TouchableOpacity>

        {/* Sign up button with navigation */}
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText} onPress={() => navigation.navigate('SignUpScreen')}>Sign Up</Text>
        </TouchableOpacity>

        {/* Footer text with typing effect */}
        <Text style={styles.footerText}>
          {typedText} <Text style={styles.linkText}>here you are</Text>
        </Text>
      </View>
    </View>
  );
};

// Styles for the LoginScreen component
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
  subText: {
    fontSize: 20,
    color: '#075E54',
    marginBottom: 30,
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
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
  },
  iconColored: {
    color: '#075E54',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  linkText: {
    color: '#075E54',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
