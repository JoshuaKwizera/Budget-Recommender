import { Animated } from 'react-native';

// Background images
export const backgroundImages = [
  require('../assets/finance2.png'),
  require('../assets/finance3.jpg'),
  require('../assets/finance4.png'),
];

// Create a fade animation value
export const createFadeAnimation = (duration: number) => {
  const fadeAnim = new Animated.Value(1);
  return {
    fadeAnim,
    fadeAnimation: (callback: () => void) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => {
        callback();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }).start();
      });
    },
  };
};
