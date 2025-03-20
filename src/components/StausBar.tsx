import React, { useEffect } from 'react';
import { StatusBar, View, Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';

interface StatusBarProps {
  barStyle?: 'light-content' | 'dark-content';
  gradientColors?: string[]; 
  translucent?: boolean;
  hidden?: boolean;
}

const CustomStatusBar: React.FC<StatusBarProps> = ({
  barStyle = 'dark-content',
  gradientColors = ['#6836CC', '#CD4FFF'], 
  translucent = true,
  hidden = false,
}) => {
  useEffect(() => {
    StatusBar.setBarStyle(barStyle);
    StatusBar.setTranslucent(translucent);
    StatusBar.setHidden(hidden);
  }, [barStyle, translucent, hidden]);

  return (
    <>
      {/* Apply gradient background behind the status bar */}
      <View style={styles.statusBarContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}  
          end={{ x: 1, y: 0 }}    
          style={styles.gradientBackground}
        />
      </View>

      {/* Ensure status bar remains visible with a transparent background */}
      <StatusBar barStyle={barStyle} translucent backgroundColor="transparent" />
    </>
  );
};

const styles = StyleSheet.create({
  statusBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: getStatusBarHeight(),
    zIndex: 1, 
  },
  gradientBackground: {
    flex: 1, 
  },
});

export default CustomStatusBar;
