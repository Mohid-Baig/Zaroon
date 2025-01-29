/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TravelLabel = ({seats, Bags}) => {
  let color = css.secondary;
  let size = 20;

  return (
    <View style={styles.labelsContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MaterialCommunityIcons name="snowflake" size={size} color={color} />
        <Text style={styles.label}> AC</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <Text style={styles.label}>Max Seats : </Text> */}
        <MaterialIcons name="person" size={size} color={color} />
        <Text style={styles.label}> Upto </Text>
        <Text style={[styles.label, {fontWeight: 'bold'}]}> {seats}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <Text style={styles.label}>Max Bags : </Text> */}
        <MaterialCommunityIcons name="bag-suitcase" size={size} color={color} />
        <Text style={styles.label}> Upto </Text>
        <Text style={[styles.label, {fontWeight: 'bold'}]}> {Bags}</Text>
      </View>
    </View>
  );
};

export default TravelLabel;

const styles = StyleSheet.create({
  labelsContainer: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-evenly',
    marginTop: 5,
    borderRadius: 3,
  },
  label: {
    color: css.secondary,
    paddingVertical: 5,
    // marginHorizontal: 10,
  },
});
