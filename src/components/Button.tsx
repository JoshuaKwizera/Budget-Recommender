import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/**
 * Button component that supports different styles, icons, loading states, and an optional gradient background.
 */
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<any>;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[]; 
};

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'contained',
  disabled = false,
  loading = false,
  icon: IconComponent,
  style,
  textStyle,
  gradientColors, 
}) => {
  /**
   * Determine if the button is disabled based on the `disabled` prop or if it's in a loading state.
   */
  const isDisabled = disabled || loading;

  /**
   * Render gradient only if gradientColors are provided and the variant is 'contained'.
   */
  const renderGradientBackground = () => {
    if (variant === 'contained' && gradientColors) {
      return (
        <LinearGradient
          colors={gradientColors} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
          style={styles.gradient} 
        />
      );
    }
    return null;
  };

  /**
   * Determine button styles: fall back to solid background color if no gradient is provided.
   */
  const buttonStyles = [
    styles.base,
    variant === 'contained' && !gradientColors && styles.contained, 
    variant === 'outlined' && styles.outlined,
    variant === 'text' && styles.text,
    isDisabled && styles.disabled,
    style,
  ];

  /**
   * Set text styles based on the `variant` and if the button is disabled.
   * Additional text styles from the `textStyle` prop are also included.
   */
  const textStyles = [
    styles.textBase,
    variant === 'contained' && styles.textContained,
    variant === 'outlined' && styles.textOutlined,
    variant === 'text' && styles.textText,
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {renderGradientBackground()}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'contained' ? '#fff' : '#6200ee'}
        />
      ) : (
        <>
          {IconComponent && <IconComponent style={{ marginRight: 8 }} />}
          <Text style={textStyles}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

/**
 * Define the styles for the Button component.
 * Styles change based on the variant (contained, outlined, or text) and disabled state.
 */
const styles = StyleSheet.create({
  base: {
    height: 48, 
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden', 
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  contained: {
    backgroundColor: '#4931BA', 
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#4931BA',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#e0e0e0',
  },
  textBase: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContained: {
    color: '#fff',
  },
  textOutlined: {
    color: '#6200ee',
  },
  textText: {
    color: '#6200ee',
  },
  textDisabled: {
    color: '#9e9e9e',
  },
});

export default Button;
