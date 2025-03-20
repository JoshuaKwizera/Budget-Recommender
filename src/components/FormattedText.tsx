// Importing necessary modules and types from React and React Native.
import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';

// Defining the FormattedTextProps type for specifying the structure and types of props.
type FormattedTextProps = TextProps & {
  isBold?: boolean;
  isUppercase?: boolean;
  truncate?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  style?: TextStyle | TextStyle[];
};

// Defining the FormattedText component with custom styles and dynamic behavior.
const FormattedText: React.FC<FormattedTextProps> = ({ 
  isBold, 
  isUppercase, 
  truncate, 
  align, 
  color, 
  fontSize, 
  lineHeight, 
  letterSpacing, 
  style, 
  children, 
  ...props 
}) => {
  // Creating and filtering the textStyle array to safely merge multiple styles.
  const textStyle: TextStyle[] = (
    Array.isArray(style) ? style : [style]
  ).filter(Boolean) as TextStyle[];

  // Adding bold styling if isBold is true.
  if (isBold) {
    textStyle.push(styles.bold);
  }

  // Adding uppercase transformation if isUppercase is true.
  if (isUppercase) {
    textStyle.push(styles.uppercase);
  }

  // Adding text alignment styling if align is provided.
  if (align) {
    textStyle.push({ textAlign: align });
  }

  // Adding dynamic text color if color is provided.
  if (color) {
    textStyle.push({ color });
  }

  // Adding dynamic font size if fontSize is provided.
  if (fontSize) {
    textStyle.push({ fontSize });
  }

  // Adding dynamic line height if lineHeight is provided.
  if (lineHeight) {
    textStyle.push({ lineHeight });
  }

  // Adding dynamic letter spacing if letterSpacing is provided.
  if (letterSpacing) {
    textStyle.push({ letterSpacing });
  }

  // Rendering the Text component with the dynamically merged styles and props.
  return (
    <Text 
      style={textStyle} 
      numberOfLines={truncate ? 1 : undefined} 
      ellipsizeMode={truncate ? 'tail' : undefined} 
      {...props}
    >
      {children}
    </Text>
  );
};

// Defining reusable styles for bold and uppercase text.
const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});

// Exporting the FormattedText component for use in other parts of the application.
export default FormattedText;
