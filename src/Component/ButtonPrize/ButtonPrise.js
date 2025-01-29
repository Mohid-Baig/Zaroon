/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ButtonPrise = ({icon, Txt, price}) => {
  return (
    <View style={styles.Container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {icon}
        <Text style={styles.txt}>{Txt}</Text>
      </View>
      <Text style={styles.Bottomtxt}>{price}</Text>
    </View>
  );
};

export default ButtonPrise;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#ededed',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    // width:'30%'
  },
  txt: {
    color: '#000',
    fontSize: 12,
    paddingLeft: 3,
  },
  Bottomtxt: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
    fontSize: 12,
    paddingHorizontal: 7,
  },
});
