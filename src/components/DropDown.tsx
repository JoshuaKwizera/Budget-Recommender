import React, { useState, useMemo, useRef } from 'react';
import { 
  StyleSheet, FlatList, Pressable, Text, View, Modal, LayoutChangeEvent 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DropdownProps {
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  dropdownPosition?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  prefix?: string | React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  dropdownPosition = {},
  prefix,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const inputWrapperRef = useRef<View>(null);

  const handleToggleDropdown = () => {
    if (!disabled) setIsDropdownOpen(prev => !prev);
  };

  const handleItemSelect = (value: string) => {
    onSelect(value);
    setIsDropdownOpen(false);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setInputLayout({ x, y, width, height });
  };

  const memoizedOptions = useMemo(() => options, [options]);

  const selectedLabel = selectedValue
    ? memoizedOptions.find(opt => opt.value === selectedValue)?.label
    : placeholder;

  return (
    <View style={[styles.container, error && styles.errorContainer]}>
      <View style={styles.inputWrapper} ref={inputWrapperRef} onLayout={handleLayout}>
        {label && (
          <Text style={[styles.placeholder, isDropdownOpen || selectedValue ? styles.placeholderFloat : styles.placeholderDefault]}>
            {label}
          </Text>
        )}
        <Pressable
          style={[styles.dropdown, isDropdownOpen && styles.focused, error && styles.errorBorder, disabled && styles.disabled]}
          onPress={handleToggleDropdown}
        >
          <View style={styles.prefixContainer}>
            {prefix && typeof prefix === 'string' ? <Text style={styles.prefixText}>{prefix}</Text> : null}
            {prefix && React.isValidElement(prefix) ? prefix : null}
          </View>
          <Text style={[styles.dropdownText, selectedValue && styles.dropdownTextSelected]}>
            {selectedLabel}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#333" style={isDropdownOpen && styles.iconRotated} />
        </Pressable>

        {isDropdownOpen && (
          <Modal 
            transparent
            animationType="fade"
            visible={isDropdownOpen}
            onRequestClose={() => setIsDropdownOpen(false)}
          >
            <Pressable style={styles.modalOverlay} onPress={() => setIsDropdownOpen(false)} />
            <View 
              style={[
                styles.dropdownOptions, 
                { top: inputLayout.y + inputLayout.height, left: inputLayout.x, right: inputLayout.x + inputLayout.width, ...dropdownPosition }
              ]}
            >
              <FlatList
                data={memoizedOptions}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.option,
                      item.value === selectedValue && styles.optionSelected,
                      pressed && styles.optionPressed
                    ]}
                    onPress={() => handleItemSelect(item.value)}
                  >
                    <Text style={[styles.optionText, item.value === selectedValue && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </Modal>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputWrapper: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',  
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  focused: {
    borderColor: '#075E54',
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: 'red',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#bbb',  
    flex: 1,  
    paddingLeft: 10, 
  },
  dropdownTextSelected: {
    color: '#000', 
  },
  placeholder: {
    position: 'absolute',
    color: '#bbb',
    zIndex: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  placeholderFloat: {
    top: 2,
    fontSize: 12,
  },
  placeholderDefault: {
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 16,
  },
  dropdownOptions: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    zIndex: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  optionPressed: {
    backgroundColor: '#e6e6e6',
  },
  optionSelected: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#075E54',
  },
  errorContainer: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Dropdown;
