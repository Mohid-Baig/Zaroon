import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';

const AddTripButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.Container} onPress={onPress}>
      <Text style={styles.Txt}>Add To Trip</Text>
    </TouchableOpacity>
  );
};

export default AddTripButton;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: css.primary,
    borderRadius: 16,
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt: {
    color: '#fff',
    fontSize: 15,
  },
});
