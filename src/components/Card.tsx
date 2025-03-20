// Importing necessary modules and types from React and React Native.
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

// Defining the CardProps interface to specify the types and structure of props.
interface CardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  elevation?: number;
  borderColor?: string;
  borderWidth?: number;
  position?: 'absolute' | 'relative' | 'static'; 
  top?: number; 
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  zIndex?: number; 
}

// Defining the Card component with customizable styles and rendering logic.
const Card: React.FC<CardProps> = ({
  children,
  style,
  backgroundColor = '#ffffff',
  borderRadius = 32,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  shadowColor = '#000',
  shadowOpacity = 0.1,
  shadowRadius = 4,
  shadowOffset = { width: 0, height: 2 },
  elevation = 5,
  borderColor = 'transparent',
  borderWidth = 0,
  position = 'relative',
  top,
  alignSelf,
  zIndex = 1,
}) => {
  // Combining styles based on props to create a dynamic card style.
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    borderTopLeftRadius: borderTopLeftRadius ?? borderRadius,
    borderTopRightRadius: borderTopRightRadius ?? borderRadius,
    borderBottomLeftRadius: borderBottomLeftRadius ?? borderRadius,
    borderBottomRightRadius: borderBottomRightRadius ?? borderRadius,
    shadowColor,
    shadowOpacity,
    shadowRadius,
    shadowOffset,
    elevation,
    borderColor,
    borderWidth,
    position,
    top,
    alignSelf,
    zIndex,
  };

  // Rendering the card container with children and combined styles.
  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
};

// Creating default styles for the card component.
const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

// Exporting the Card component for use in other parts of the application.
export default Card;
