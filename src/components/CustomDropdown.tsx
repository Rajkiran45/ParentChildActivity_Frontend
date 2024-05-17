/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// components/CustomDropdown.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Dropdown: React.FC<{ options: string[], selectedOption:string, handleSelectedOption:(option:string)=>void, shouldGoDown?:boolean }> = ({ options, selectedOption, handleSelectedOption, shouldGoDown }) => {
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // const handleSelectOption = (option: string) => {
  //   setSelectedOption(option);
  //   setShowOptions(false);
  // };

  return (
    <View style={[styles.container, {
      marginBottom: (showOptions && shouldGoDown) ? options.length * 50 : "auto"
    }]}>
      <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.dropdownButton}>
        <Text style={styles.selectedOptionText}>{selectedOption || 'Select Option'}</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>{ handleSelectedOption(option); setShowOptions(!showOptions)}}
              style={styles.optionButton}
            >
              <Text style={{color:'#333'}}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectedOptionText: {
    color: '#000',
    fontWeight:'400',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 5,
    zIndex: 2,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    color:'#000',
    borderBottomColor: '#ccc',
  },
});

export default Dropdown;
