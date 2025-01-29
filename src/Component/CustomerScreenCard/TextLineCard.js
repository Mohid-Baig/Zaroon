import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const TextLineCard = ({title, name}) => {
  return (
    <View style={styles.TopView}>
      <Text style={styles.LeftTxt}>{title}</Text>
      <Text style={styles.titleTxt}>{name}</Text>
    </View>
  );
};

export default TextLineCard;

const styles = StyleSheet.create({
  TopView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    margin: 3,
  },
  titleTxt: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    width: '55%',
    textAlign: 'right',
  },
  LeftTxt: {
    color: 'gray',
    fontSize: 14,
    width: '45%',
  },
});
