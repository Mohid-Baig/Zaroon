/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const CompletedView = ({navigation}) => {
  return (
    <View style={styles.MainContainer}>
      <Image
        style={{marginBottom: 30}}
        source={require('../../../assets/HomeImages/Group.png')}
      />

      <Text style={styles.TopTxt}>Your Order has been successfully</Text>
      <Text style={styles.TopTxt}>completed</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.TxtContainer}>
        <Text style={styles.Txt}>Back to Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompletedView;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#151F30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TopTxt: {
    color: 'white',
    fontSize: 15,
  },
  TxtContainer: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#1f302b',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  Txt: {
    color: '#00A978',
    fontSize: 16,
  },
});
