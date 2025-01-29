/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ButtonPrise from '../ButtonPrize/ButtonPrise';

const CardsView = ({item, onPress, onCardPress}) => {
  return (
    <TouchableOpacity onPress={onCardPress} style={styles.Container}>
      <View style={styles.CrossBtn}>
        {/* <TouchableOpacity onPress={onPress} style={{paddingRight:10}}>
                    <AntDesign name='edit' color={css.secondary} size={20} />
                </TouchableOpacity> */}
        <TouchableOpacity onPress={onPress}>
          <AntDesign name="close" color="#000" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.TopContainer}>
        <View style={styles.InsideView}>
          <View style={styles.circle}>
            <Text style={styles.toptxt}>From</Text>
          </View>
          <Text style={styles.BottomTxt}>{item?.from}</Text>
        </View>

        <View style={styles.InsideView}>
          <View style={styles.circle}>
            <Text style={styles.toptxt}>To</Text>
          </View>
          <Text style={styles.BottomTxt}>{item?.to}</Text>
        </View>
      </View>

      <View style={[styles.TopContainer, {paddingTop: 10}]}>
        <View style={styles.InsideView}>
          <View style={styles.circle}>
            <Text style={styles.toptxt}>Price</Text>
          </View>
          <Text style={styles.BottomTxt}>{item?.price}</Text>
        </View>

        <View style={styles.InsideView}>
          <View style={styles.circle}>
            <Text style={styles.toptxt}>Date & Time</Text>
          </View>
          <Text style={styles.BottomTxt}>{item?.dateTime}</Text>
        </View>
      </View>

      {item?.flightNo && (
        <View style={[styles.TopContainer, {paddingTop: 10}]}>
          <View style={styles.InsideView}>
            <View style={styles.circle}>
              <Text style={styles.toptxt}>Flight No</Text>
            </View>
            <Text style={styles.BottomTxt}>{item?.flightNo}</Text>
          </View>

          <View style={styles.InsideView}>
            <View style={styles.circle}>
              <Text style={styles.toptxt}>AirLine Name</Text>
            </View>
            <Text style={styles.BottomTxt}>{item?.airLine}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CardsView;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 7,
    width: '95%',
    alignSelf: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  TopContainer: {
    flexDirection: 'row',
  },
  InsideView: {
    // paddingLeft: 20,
    width: '50%',
  },
  toptxt: {
    color: '#7A7A7A',
    fontSize: 13,
  },
  BottomTxt: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 13,
    marginTop: 3,
  },
  round: {
    height: 12,
    backgroundColor: css.secondary,
    width: 12,
    borderRadius: 10,
    marginRight: 10,
    position: 'absolute',
    left: -22,
  },
  line: {
    height: 45,
    width: 3,
    backgroundColor: css.secondary,
    position: 'absolute',
    left: 12,
    top: 20,
  },
  circle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  CrossBtn: {
    position: 'absolute',
    right: 10,
    top: 3,
    flexDirection: 'row',
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 7,
  },
});
