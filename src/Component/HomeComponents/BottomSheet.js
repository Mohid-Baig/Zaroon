/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from '../CreateNewOrderComponent/Button';
import css from '../../CssFile/Css';
import instance from '../../BaseUrl/BaseUrl';
import Loader from '../Loader/Loader';
import TextInputField from '../CreateNewOrderComponent/TextInputField';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const BottomSheet = ({
  selectedItem,
  navigation,
  onRefresh,
  currentInProgressRide,
  closeBottomSheet,
}) => {
  //   const refRBSheet = useRef();
  const [rideDetails, setRideDetails] = useState(selectedItem);
  const [milageModal, setMilageModal] = useState(false);
  const [mileage, setMileage] = useState('');

  const closeModal = () => {
    setMilageModal(false);
  };
  const openModal = () => {
    const rideDate = new Date(rideDetails?.date || rideDetails?.created_at);
    const today = new Date();

    const isToday =
      rideDate.getFullYear() === today.getFullYear() &&
      rideDate.getMonth() === today.getMonth() &&
      rideDate.getDate() === today.getDate();

    if (!isToday) {
      Alert.alert('Alert', 'Only rides scheduled for today can be started.');
      return;
    }
    if (currentInProgressRide) {
      Alert.alert(
        'Ride in Progress',
        'You already have a ride in progress. Complete the current ride before starting a new one.',
        [{text: 'OK'}],
      );
      return;
    }

    setMilageModal(true);
  };

  useEffect(() => {
    setRideDetails(selectedItem);
  }, [selectedItem]);

  // console.log(inProgressData)
  const [linearGradientColors, setLinearGradientColors] = useState([
    '#FFFFFF',
    '#FFFFFF',
  ]);
  const [imageSource, setImageSource] = useState(
    require('../../assets/Homecard/cardrop2.png'),
  );
  const [textColor, setTextColor] = useState(styles.DarkColorStyle1.color);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartButtonClick = async () => {
    setLinearGradientColors(['#00A978', '#5660AB']);
    setImageSource(require('../../assets/Homecard/cardrop3.png'));
    setTextColor('#fff');
    try {
      setIsLoading(true);
      if (mileage !== '') {
        const payload = {
          ride_id: rideDetails.id,
          status: 'in_progress',
          ride_start_mileage: mileage,
        };
        const response = await instance.post(
          '/ride-status-update-driver',
          payload,
        );
        if (response.status === 200) {
          setMilageModal(false);
          closeBottomSheet();
          Toast.show('Ride Start', Toast.SHORT);
          onRefresh();
        }
      } else {
        Alert.alert('Warning!!', 'Please Enter Car Mileage before Starting');
      }
    } catch (error) {
      console.log('Start Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (rideDetails && rideDetails.status === 'in_progress') {
      setLinearGradientColors(['#00A978', '#5660AB']);
      setImageSource(require('../../assets/Homecard/cardrop3.png'));
      setTextColor('#fff');
    } else {
      setLinearGradientColors(['#FFFFFF', '#FFFFFF']);
      setImageSource(require('../../assets/Homecard/cardrop2.png'));
      setTextColor(styles.DarkColorStyle1.color);
    }
  }, [rideDetails]);

  return (
    <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
      <LinearGradient
        colors={linearGradientColors}
        style={styles.FromToStyleView}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <View style={styles.TopDirection}>
          <Text style={[styles.LightColorTxtStyle1, {color: textColor}]}>
            From
          </Text>
          <Text style={[styles.DarkColorStyle1, {color: textColor}]}>
            {rideDetails?.from_loc || rideDetails?.driver_pickup_loc || 'None'}
          </Text>
          {/* <Text style={[styles.DarkColorStyle1, { color: textColor }]}>{rideDetails?.rate_list?.route?.from || rideDetails?.driver_pickup_loc || 'None'}</Text> */}
        </View>

        <View style={styles.ImageIcon}>
          <Image style={{width: 100, height: 15}} source={imageSource} />
        </View>

        <View style={styles.TopDirection}>
          <Text style={[styles.LightColorTxtStyle1, {color: textColor}]}>
            To
          </Text>
          <Text style={[styles.DarkColorStyle1, {color: textColor}]}>
            {rideDetails?.to_loc || rideDetails?.driver_dropoff_loc || 'None'}
          </Text>
          {/* <Text style={[styles.DarkColorStyle1, { color: textColor }]}>{rideDetails?.rate_list?.route?.to || rideDetails?.driver_dropoff_loc || 'None'}</Text> */}
        </View>
      </LinearGradient>

      <View style={{flexDirection: 'row', marginTop: '5%'}}>
        <Text style={styles.RideDetailTxtStyle}>Ride Detail</Text>

        <View style={styles.ViewByWhatsAPPPhoneView}>
          <TouchableOpacity
            onPress={() => {
              const whatsappNo =
                rideDetails?.order?.partner_customer?.whatsapp_no;
              const whatAppPrefix =
                rideDetails?.order?.partner_customer?.prefix_whatsapp;
              const prefix = `${whatAppPrefix}${whatsappNo}`;

              if (prefix) {
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
                    // console.error('An error occurred', error);
                  });
              } else {
                Alert.alert('Error', 'No WhatsApp number found.');
              }
            }}>
            <Fontisto name={'whatsapp'} size={30} color={'#00A978'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const phoneNo = rideDetails?.order?.partner_customer?.phone_no;
              const prefixPhone =
                rideDetails?.order?.partner_customer?.prefix_phone;
              const number = `${prefixPhone}${phoneNo}`;

              if (phoneNo && prefixPhone && number.length > 4) {
                Linking.openURL(`tel:${number}`)
                  .then(supported => {
                    if (!supported) {
                      Alert.alert(
                        'Error',
                        'Phone calling is not supported on your device.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert(
                      'Error',
                      'An error occurred while trying to open the dialer.',
                    );
                  });
              } else {
                Alert.alert('Error', 'No valid phone number found.');
              }
            }}>
            <FontAwesome name={'phone-square'} size={30} color={'#5660AB'} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View style={styles.viewDirection}>
          <Text style={styles.LightColorTxtStyle1}>Name</Text>
          <Text style={styles.DarkColorStyle}>
            {rideDetails?.order?.partner_customer?.name
              ? rideDetails?.order?.partner_customer?.name
              : 'None'}
          </Text>
        </View>
        {/* <View style={styles.viewDirection}>
                    <Text style={styles.LightColorTxtStyle1}>CNIC</Text>
                    <Text style={styles.DarkColorStyle}>{rideDetails?.order?.partner_customer?.cnic}</Text>
                </View>
                <View style={styles.viewDirection}>
                    <Text style={styles.LightColorTxtStyle1}>Passport</Text>
                    <Text style={styles.DarkColorStyle}>{rideDetails?.order?.partner_customer?.passport}</Text>
                </View> */}
        <View style={styles.viewDirection}>
          <Text style={styles.LightColorTxtStyle1}>Pickup Date</Text>
          <Text style={styles.DarkColorStyle}>
            {rideDetails?.date ||
              moment(rideDetails?.created_at).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View style={styles.viewDirection}>
          <Text style={styles.LightColorTxtStyle1}>Pickup Time</Text>
          <Text style={styles.DarkColorStyle}>
            {rideDetails?.pickup_time ||
              moment(rideDetails?.created_at).format('h:mm A')}
          </Text>
        </View>
      </View>
      {rideDetails && rideDetails.status === 'incomplete' && (
        <View style={styles.StartButtonStyle}>
          <Button
            label={'Start'}
            backgroundColor={css.primary}
            color={'#fff'}
            onPress={openModal}
          />
          {/* <Button label={'Start'} backgroundColor={css.primary} color={'#fff'} onPress={handleStartButtonClick} /> */}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={milageModal}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.Title}>
                  <TextInputField
                    nameOfTextInput="Enter Mileage"
                    placeholder="Please Enter car mileage"
                    value={mileage}
                    onChangeText={setMileage}
                    IconLibrary={Ionicons}
                    IconName={'speedometer-outline'}
                    keyboardType={'phone-pad'}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Button
                      label={'Start'}
                      backgroundColor={css.primary}
                      color={'#fff'}
                      onPress={handleStartButtonClick}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  FromToStyleView: {
    width: '85%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '5%',
    borderRadius: 8,
    padding: 5,
    elevation: 3,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  TopDirection: {
    width: '37%',
    margin: 5,
    padding: 5,
  },
  LightColorTxtStyle: {
    fontWeight: '400',
  },
  LightColorTxtStyle1: {
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
    width: '35%',
  },
  DarkColorStyle: {
    color: '#151F30',
    fontSize: 14,
    fontWeight: '500',
  },
  DarkColorStyle1: {
    color: '#151F30',
    fontSize: 14,
    fontWeight: '500',
  },
  RideDetailTxtStyle: {
    paddingLeft: 30,
    fontWeight: '600',
    color: 'black',
    fontSize: 20,
  },
  ViewByWhatsAPPPhoneView: {
    marginLeft: 'auto',
    flexDirection: 'row',
    marginRight: '10%',
    justifyContent: 'space-between',
    width: '18%',
  },
  StartButtonStyle: {
    alignItems: 'center',
    marginTop: '10%',
  },
  ButtonTxtStyle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  TopContainer: {
    flexDirection: 'row',
  },
  LeftTxt: {
    width: '50%',
    paddingLeft: 20,
    padding: 5,
  },
  LightColorStyle: {
    fontWeight: '500',
  },
  viewDirection: {
    flexDirection: 'row',
    paddingLeft: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  ImageIcon: {
    position: 'absolute',
    left: '29%',
    top: '30%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    // shadowColor: '#000',
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 2,
    width: '90%',
  },
  Title: {},
});
