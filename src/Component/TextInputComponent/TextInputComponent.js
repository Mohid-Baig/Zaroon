import {StyleSheet, View, TextInput} from 'react-native';
import React from 'react';

const TextInputComponent = ({value, onChangeText, placeholder}) => {
  return (
    <View style={styles.Container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#000'}
      />
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  Container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#d7d7d7',
    width: '25%',
    backgroundColor: '#fff',
  },
});
