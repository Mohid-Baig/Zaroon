import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const InnerCardFormat = ({title, value}) => {
  return (
    <View style={styles.CardWidth}>
      <Text style={styles.topTxt}>{title}</Text>
      <Text style={styles.BottomTxt}>{value}</Text>
    </View>
  );
};

export default InnerCardFormat;

const styles = StyleSheet.create({
  CardWidth: {
    padding: 2,
    width: '42.5%',
  },
  topTxt: {
    color: '#000',
  },
  BottomTxt: {
    color: '#7a7a7a',
  },
});
