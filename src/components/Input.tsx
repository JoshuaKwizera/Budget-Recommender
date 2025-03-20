import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/* Extend InputProps to include multiline and numberOfLines */
interface InputProps {
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  error?: string | null;
  size?: 'small' | 'medium' | 'large';
  value?: string;
  maxLength?: number;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  style?: object;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'url';
  passwordStrength?: 'weak' | 'moderate' | 'very strong';
  multiline?: boolean;
  numberOfLines?: number;
}

/* Creating the Input component with customizable props and dynamic behavior */
const Input: React.FC<InputProps> = ({
  placeholder,
  prefix,
  suffix,
  disabled = false,
  error,
  size = 'medium',
  value,
  maxLength,
  onChangeText,
  onBlur,
  onFocus,
  secureTextEntry,
  style,
  keyboardType = 'default',
  passwordStrength,
  multiline = false,
  numberOfLines = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Create a reference for the TextInput
  const inputRef = useRef<TextInput>(null);

  const shouldFloatPlaceholder = isFocused || value !== '';

  const sizeStyles = {
    small: { fontSize: 14, paddingVertical: 8, height: 40 },
    medium: { fontSize: 14, paddingVertical: 10, height: 47 },
    large: { fontSize: 18, paddingVertical: 12, height: 60 },
  };

  const inputStyles = [
    styles.input,
    sizeStyles[size],
    disabled && styles.disabled,
    isFocused && styles.focused,
    error && styles.errorBorder,
    style,
  ];

  const floatingPlaceholderStyle = {
    top: size === 'small' ? 2 : size === 'medium' ? 4 : 5,
    fontSize: size === 'large' ? 12 : 10,
    color: '#bbb',
  };

  let loaderColor = '#bbb';
  let loaderFillWidth = hasStartedTyping ? 0 : 0;

  if (passwordStrength === 'weak') {
    loaderColor = 'red';
    loaderFillWidth = hasStartedTyping ? 25 : 0;
  } else if (passwordStrength === 'moderate') {
    loaderColor = 'orange';
    loaderFillWidth = hasStartedTyping ? 50 : 0;
  } else if (passwordStrength === 'very strong') {
    loaderColor = 'green';
    loaderFillWidth = hasStartedTyping ? 100 : 0;
  }

  return (
    <View style={styles.container}>
      {/* Wrap everything in TouchableOpacity to make the whole area clickable */}
      <TouchableOpacity
        style={styles.inputWrapper}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()} 
      >
        {prefix && <View style={styles.prefix}>{prefix}</View>}

        <Text
          style={[
            styles.placeholder,
            shouldFloatPlaceholder ? floatingPlaceholderStyle : styles.placeholderDefault,
            prefix ? { left: 40 } : undefined,
          ]}
        >
          {placeholder}
        </Text>

        <TextInput
          ref={inputRef} 
          style={[
            inputStyles,
            prefix ? { paddingLeft: 40 } : null,
            suffix || secureTextEntry ? { paddingRight: 40 } : null,
          ]}
          value={value}
          editable={!disabled}
          onChangeText={(text) => {
            setHasStartedTyping(text.length > 0);
            onChangeText && onChangeText(text);
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
          onFocus={() => {
            setIsFocused(true);
            onFocus && onFocus();
          }}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize="none"
          placeholderTextColor="transparent"
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />

        {secureTextEntry && passwordStrength && (
          <View style={styles.loader}>
            <View
              style={[
                styles.loaderFill,
                { backgroundColor: loaderColor, width: `${loaderFillWidth}%` },
              ]}
            />
          </View>
        )}

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.suffix}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        )}

        {suffix && !secureTextEntry && <View style={styles.suffix}>{suffix}</View>}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

/* Defining styles for the Input component and its elements */
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
  disabled: {
    backgroundColor: '#ffff',
    color: '#000',
  },
  focused: {
    borderColor: '#4931BA',
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: 'red',
  },
  prefix: {
    position: 'absolute',
    top: '50%',
    left: 10,
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  suffix: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    right: 40,
    width: '15%',
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 2.5,
    transform: [{ translateY: -2.5 }],
  },
  loaderFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    color: '#bbb',
    zIndex: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  placeholderDefault: {
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
