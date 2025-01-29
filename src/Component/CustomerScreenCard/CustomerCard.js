/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import css from '../../CssFile/Css';
import TextLineCard from './TextLineCard';

const CustomerCard = ({customer, onPress}) => {
  return (
    <View style={styles.MainContainer}>
      <View style={styles.TopView}>
        <Text style={[styles.titleTxt, {fontSize: 15}]}>
          Customer No {customer.id}
        </Text>
        <Ionicons name="people-outline" color={css.primary} size={23} />
      </View>
      <View style={{paddingHorizontal: 12}}>
        <TextLineCard title={'Full Name'} name={customer.name} />
        <TextLineCard title={'Phone No'} name={customer.phone_no} />
        <TextLineCard title={'Email'} name={customer.email} />
        <TextLineCard title={'Business'} name={customer.business_partner_id} />
      </View>
      <TouchableOpacity style={styles.Button} onPress={onPress}>
        <Text style={[styles.LeftTxt, {color: '#fff'}]}>View more</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerCard;

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  Button: {
    backgroundColor: css.primary,
    padding: 5,
    alignSelf: 'flex-end',
    margin: 5,
    borderRadius: 5,
  },
  TopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontWeight: 'bold',
    color: '#1d1d1d',
    fontSize: 15,
  },
  LeftTxt: {
    color: '#fff',
    fontSize: 12,
  },
});
