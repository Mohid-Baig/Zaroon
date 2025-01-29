/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const HomeCard = ({openRBSheet, IconName, borderLeftColorProps, item}) => {
  const isItemInProgress = item?.status === 'in_progress';
  const pickupDateTime =
    item?.date && item?.pickup_time
      ? `${moment(item.date).format('YYYY-MM-DD')} ${moment(
          item.pickup_time,
          'HH:mm:ss',
        ).format('h:mm A')}`
      : moment(item?.created_at).format('YYYY-MM-DD h:mm A');

  return (
    <View
      style={[
        styles.MainViewStyle,
        {borderLeftColor: borderLeftColorProps},
        isItemInProgress && {backgroundColor: '#ccd0ed'},
      ]}>
      <TouchableOpacity onPress={openRBSheet}>
        {/* {isItemInProgress &&
          <View style={{ alignSelf: 'center' }}>
            <Image source={require('../../assets/Homecard/car.png')} />
          </View>
        } */}

        {item?.status === 'completed' && (
          <View style={{position: 'absolute', right: 0}}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={20}
              color={'#00A978'}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        )}
        {item?.status === 'cancelled' && (
          <View style={{position: 'absolute', right: 0}}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={'red'}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        )}
        {item?.status === 'pending' && (
          <View style={{position: 'absolute', right: 0}}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={'pink'}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        )}

        <View style={styles.TextContainer}>
          <View style={styles.TopContainer}>
            <View style={[styles.LeftTxt, {width: '75%'}]}>
              <Text style={styles.LightColorStyle}>Creater Name</Text>
              <Text style={styles.DarkColorStyle}>
                {item?.order?.business_partner?.name
                  ? item?.order?.business_partner?.name
                  : 'None'}
              </Text>
            </View>
            {(item?.status === 'incomplete' ||
              item?.status === 'in_progress') && (
              <View
                style={[
                  styles.LeftTxt,
                  {
                    width: '25%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    const whatsappNo =
                      item?.order?.partner_customer?.whatsapp_no;
                    const whatAppPrefix =
                      item?.order?.partner_customer?.prefix_whatsapp;
                    const prefix = `${whatAppPrefix}${whatsappNo}`;

                    if (whatAppPrefix && whatsappNo) {
                      Linking.openURL(`whatsapp://send?phone=${prefix}`)
                        .then(supported => {
                          if (!supported) {
                            Alert.alert(
                              'Error',
                              'WhatsApp is not installed on your device.',
                            );
                          } else {
                            Linking.openURL(`whatsapp://send?phone=${prefix}`);
                          }
                        })
                        .catch(error => {
                          Alert.alert(
                            'Error',
                            'An error occurred while trying to open WhatsApp.',
                          );
                          // console.error('An error occurred', err);
                        });
                    } else {
                      Alert.alert('Error', 'No WhatsApp number found.');
                    }
                  }}>
                  <Fontisto name={'whatsapp'} size={30} color={'#00A978'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const phoneNo = item?.order?.partner_customer?.phone_no;
                    const prefixPhone =
                      item?.order?.partner_customer?.prefix_phone;
                    const number = `${prefixPhone}${phoneNo}`;
                    console.log(number, 'number');
                    if (prefixPhone && phoneNo) {
                      Linking.openURL(`tel:${number}`)
                        .then(supported => {
                          if (!supported) {
                            Alert.alert(
                              'Error',
                              'Phone calling is not supported on your device.',
                            );
                          } else {
                            Linking.openURL(`tel:${number}`);
                          }
                        })
                        .catch(error => {
                          Alert.alert(
                            'Error',
                            'An error occurred while trying to open.',
                          );
                          // console.error('An error occurred', err);
                        });
                    } else {
                      Alert.alert('Error', 'No phone number found.');
                    }
                  }}>
                  <FontAwesome
                    name={'phone-square'}
                    size={30}
                    color={'#5660AB'}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.TextContainer}>
          <View style={styles.TopContainer}>
            <View style={styles.LeftTxt}>
              <Text style={styles.LightColorStyle}>Customer Name</Text>
              <Text style={styles.DarkColorStyle}>
                {item?.order?.partner_customer?.name
                  ? item?.order?.partner_customer?.name
                  : 'None'}
              </Text>
            </View>
            <View style={styles.LeftTxt}>
              <Text style={styles.LightColorStyle}>Pickup Date/Time</Text>
              <Text style={styles.DarkColorStyle}>{pickupDateTime}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.TextContainer, {paddingTop: 0}]}>
          <View style={styles.TopContainer}>
            <View style={styles.LeftTxt}>
              <Text style={styles.LightColorStyle}>Pickup</Text>
              <Text style={styles.DarkColorStyle}>
                {item?.from_loc || item?.driver_pickup_loc || 'None'}
              </Text>
              {/* <Text style={styles.DarkColorStyle}>{item?.rate_list?.route?.from || item?.driver_pickup_loc || 'None'}</Text> */}
            </View>
            <View style={styles.LeftTxt}>
              <Text style={styles.LightColorStyle}>Drop of</Text>
              <Text style={styles.DarkColorStyle}>
                {item?.to_loc || item?.driver_dropoff_loc || 'None'}
              </Text>
              {/* <Text style={styles.DarkColorStyle}>{item?.rate_list?.route?.to || item?.driver_dropoff_loc || 'None'}</Text> */}
            </View>
          </View>
        </View>
        {isItemInProgress && (
          <View style={styles.SwipeView}>
            <Text style={{color: 'gray', fontSize: 12}}>
              Swipe left to complete
            </Text>
            <AntDesign name="doubleright" color="gray" size={14} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  MainViewStyle: {
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    borderLeftWidth: 6,
    position: 'relative',
    backgroundColor: '#ffffff',
    marginTop: 10,
    padding: 10,
    elevation: 4,
  },
  TextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  LeftTxt: {
    width: '50%',
    paddingLeft: 10,
    paddingVertical: 2,
  },
  RideTxtStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '85%',
    alignSelf: 'center',
    marginTop: '3%',
    color: '#151F30',
    paddingLeft: '8%',
  },
  LightColorStyle: {
    fontWeight: '500',
    color: 'gray',
    fontSize: 12,
  },
  DarkColorStyle: {
    fontWeight: '600',
    color: '#151F30',
    fontSize: 13,
  },
  SwipeView: {
    marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
