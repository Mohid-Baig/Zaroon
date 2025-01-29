/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ButtonPrise from '../ButtonPrize/ButtonPrise';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import css from '../../CssFile/Css';

const PackageCard = ({
  onPress,
  from,
  to,
  vehicle,
  price,
  backgroundColor,
  returnBG,
  Toggle,
  marginTop,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.Container, {backgroundColor, marginTop}]}>
      <View style={styles.TopHeader}>
        {/* <Text style={styles.TitleTxt}>New Travel Package</Text> */}
        <View style={[styles.returnBtn, {backgroundColor: returnBG}]}>
          {Toggle}
        </View>
      </View>
      <View style={styles.line}></View>
      <View>
        <View style={styles.InsideView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.round}></View>
            <Text style={styles.toptxt}>From</Text>
          </View>
          <Text style={styles.BottomTxt}>{from}</Text>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            width: '86%',
            alignSelf: 'center',
            padding: 2,
          }}></View>

        <View style={[styles.InsideView, {marginTop: 3}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.round, {backgroundColor: css.primary}]}></View>
            <Text style={styles.toptxt}>To</Text>
          </View>
          <Text style={styles.BottomTxt}>{to}</Text>
        </View>
      </View>

      <View style={styles.Buttons}>
        <ButtonPrise
          Txt={'Price'}
          price={price}
          icon={
            <Image
              style={{height: 18, width: 18}}
              source={require('../../assets/Homecard/cash.png')}
            />
          }
        />
        <ButtonPrise
          Txt={'Vehicle'}
          price={vehicle}
          icon={
            <MaterialCommunityIcons
              name="car"
              color={css.secondary}
              size={18}
            />
          }
        />
      </View>
    </TouchableOpacity>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  Container: {
    // backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 2,
    padding: 10,
  },
  TopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleTxt: {
    fontWeight: 'bold',
    color: '#7A7A7A',
    alignSelf: 'center',
    fontSize: 16,
  },
  returnBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    // backgroundColor: css.secondary,
    // padding:3,
    // paddingHorizontal:10,
    borderRadius: 30,
  },
  InsideView: {
    paddingLeft: 20,
    paddingTop: 0,
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
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '87%',
    alignSelf: 'center',
    marginTop: 7,
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
});
