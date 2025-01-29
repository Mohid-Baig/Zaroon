/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const Button = ({
  label,
  onPress,
  backgroundColor,
  borderColor,
  borderWidth,
  color,
  disabled,
  marginTop,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#cccccc' : backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          marginTop: marginTop,
        },
      ]}
      onPress={!disabled ? onPress : null}
      disabled={disabled}>
      <Text style={[styles.buttonText, {color: disabled ? '#888888' : color}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 7,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
  },
});
