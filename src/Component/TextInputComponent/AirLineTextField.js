/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import css from '../../CssFile/Css';

const AirLineTextField = ({onChangeText, value}) => {
  return (
    <View style={styles.container}>
      <View style={{padding: 10}}>
        <MaterialIcons name="airplanemode-on" color={css.secondary} size={20} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter AirLine Name"
        placeholderTextColor={'#000'}
      />
    </View>
  );
};

export default AirLineTextField;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    marginLeft: -10,
    color: '#000',
  },
});
