import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground, Alert } from 'react-native';
import { RootStackParamList } from '../Transitions/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUpScreen'>;

const logo = require('../assets/logo.png');
const backgroundImages = [
  require('../assets/finance2.png'),
  require('../assets/finance3.jpg'),
  require('../assets/finance4.png'),
];

const SignUpScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundImage, { opacity: fadeAnim }]}>
        <ImageBackground source={backgroundImages[currentImageIndex]} style={styles.backgroundImage} />
      </Animated.View>

      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.welcomeText}>Create an Account</Text>
        <Text style={styles.subText}>Join us today!</Text>

        <View style={[styles.inputContainer, phoneFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="+256 775 582 325"
            keyboardType="phone-pad"
            placeholderTextColor="#888"
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Text style={[styles.icon, styles.iconColored]}>📞</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Text style={[styles.icon, styles.iconColored]}>👁️</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, confirmPasswordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor="#888"
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Text style={[styles.icon, styles.iconColored]}>👁️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>
            Already have an account?{' '}
            <Text style={styles.loginText} onPress={() => navigation.navigate('LoginScreen')}>
              Login
            </Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Have any questions? <Text style={styles.linkText}>Contact us</Text>
        </Text>
      </View>
    </View>
  );
};

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
    marginBottom: 30,
    fontSize: 14,
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 16,
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

export default SignUpScreen;
