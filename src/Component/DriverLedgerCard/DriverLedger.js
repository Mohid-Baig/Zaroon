import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import css from '../../CssFile/Css';

const DriverLedger = ({item}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.LeftView}>
        <View style={styles.InnerCont}>
          <Ionicons
            name="calendar-number-outline"
            color={css.secondary}
            size={20}
          />
          <Text style={styles.LeftTxt}>{item?.tr_date}</Text>
        </View>
        <View style={styles.InnerCont}>
          <MaterialIcons
            name="person-outline"
            color={css.secondary}
            size={20}
          />
          <Text style={styles.LeftTxt}>{item?.customer}</Text>
        </View>
        <View style={styles.InnerCont}>
          <MaterialIcons name="details" color={css.secondary} size={20} />
          <Text style={styles.LeftTxt}>{item?.tr_no}</Text>
        </View>
      </View>
      <View style={styles.RightView}>
        <Text style={styles.RightTxt}>{item?.debit - item.credit}</Text>
      </View>
    </View>
  );
};

export default DriverLedger;

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    borderColor: '#000',
    borderRadius: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 1,
  },
  LeftView: {
    width: '70%',
    borderColor: '#000',
  },
  RightView: {
    width: '30%',
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  LeftTxt: {
    color: '#000',
    paddingLeft: 5,
  },
  InnerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  RightTxt: {
    color: '#000',
    fontSize: 16,
  },
});
