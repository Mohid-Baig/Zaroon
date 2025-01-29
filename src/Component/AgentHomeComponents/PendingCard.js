/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import css from '../../CssFile/Css';

const PendingCard = ({from, to, date}) => {
  return (
    <View style={styles.orderItem}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.CalenderView}>
          <View style={{backgroundColor: '#fff', padding: 5, borderRadius: 30}}>
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              color="#000"
              size={25}
            />
          </View>
          <View>
            <Text style={{color: '#fff', marginLeft: 5, fontSize: 12}}>
              Date/Time
            </Text>
            <Text style={{color: '#fff', marginLeft: 5, fontSize: 12}}>
              {date}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.fromToContainer}>
        <View style={styles.fromTo}>
          <Text style={styles.FromToTxt}>From:</Text>
          <Text style={styles.FromToBold}>{from}</Text>
        </View>

        <Image
          style={styles.Imagecar}
          source={require('../../assets/Homecard/cardrop2.png')}
        />
        <View style={styles.fromTo}>
          <Text style={styles.FromToTxt}>To:</Text>
          <Text style={styles.FromToBold}>{to}</Text>
        </View>
      </View>
    </View>
  );
};

export default PendingCard;

const styles = StyleSheet.create({
  orderItem: {
    width: 330,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: css.secondary,
    backgroundColor: '#fff',
  },
  CalenderView: {
    backgroundColor: '#253755',
    padding: 5,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  fromToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fromTo: {
    width: '35%',
  },
  FromToTxt: {
    color: 'gray',
  },
  FromToBold: {
    color: 'black',
    fontWeight: 'bold',
  },
  Imagecar: {
    position: 'absolute',
    left: 50,
  },
});
