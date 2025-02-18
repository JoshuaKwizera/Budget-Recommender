import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Transitions/navigation/types';


type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;
const logo = require('../assets/logo.png');

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const fadeAnim = new Animated.Value(0); // Initial opacity value

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Duration for the fade-in effect
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace('LoginScreen'); // Navigate to the login screen after 3 seconds
      }, 1000); // Wait 1 second after the animation ends
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image source={logo} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
