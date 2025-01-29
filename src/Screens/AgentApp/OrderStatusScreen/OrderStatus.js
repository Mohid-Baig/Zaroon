import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import css from '../../../CssFile/Css';
import Loader from '../../../Component/Loader/Loader';
import instance from '../../../BaseUrl/BaseUrl';
import InnerCardFormat from '../../../Component/OrderStatus/InnerCardFormat';
import moment from 'moment';
import OrderStatusRBsheet from '../../../Component/OrderStatus/OrderStatusRBsheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const OrderStatus = ({navigation}) => {
  const refRBSheet = useRef();
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Show All');
  const [filteredData, setFilteredData] = useState([]);

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      const rides = response?.data?.rides;
      const reverseRides = rides.reverse();
      setStatusData(reverseRides);
      setFilteredData(reverseRides);
    } catch (error) {
      console.log('OrderStatus Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStatus();
    }, []),
  );
  const filterStatusData = status => {
    if (status === 'Show All') {
      setFilteredData(statusdata);
    } else {
      const filtered = statusdata.filter(
        item => item.overall_status === status,
      );
      setFilteredData(filtered);
    }
  };

  const handleStatusChange = status => {
    setSelectedStatus(status);
    filterStatusData(status);
    refRBSheet.current.close(); // Close the bottom sheet after selection
  };

  const getStatusColor = status => {
    switch (status) {
      case 'cancelled':
        return '#DD3C3C';
      case 'completed':
        return '#18BA27';
      case 'incomplete':
        return 'purple';
      case 'pending':
        return '#F1A114';
      case 'approved':
        return '#5660AB';
      case 'unapproved':
        return '#1E2D45';
      case 'draft':
        return '#F58659';
      default:
        return '#fff';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkbox-marked-circle';
      case 'pending':
        return 'clock-outline';
      case 'approved':
        return 'check-circle-outline';
      case 'unapproved':
        return 'alert-circle-outline';
      case 'draft':
        return 'circle-edit-outline';
      default:
        return 'information-outline';
    }
  };

  const handlePress = async order => {
    if (order) {
      switch (order?.overall_status) {
        case 'approved':
        case 'pending':
        case 'unapproved':
        case 'cancelled':
          navigation.navigate('OrderDetail', {orderData: order});
          break;
        case 'draft':
          navigation.navigate('CreatedOrder', {order: order});
        default:
          console.log('Unhandled order status: ', order?.overall_status);
      }
    }
  };

  return (
    <View style={css.MainContainer}>
      <SimpleHeader
        onCalenderPress={() => refRBSheet.current.open()}
        name="Order Status"
        onPress={() => navigation.navigate('HomeAgent')}
        // onPress={() => navigation.goBack()}
        Icon={
          <MaterialCommunityIcons
            name="filter-outline"
            color={'#fff'}
            size={25}
          />
        }
      />

      <View style={{paddingBottom: 60}}>
        <ScrollView>
          {filteredData &&
            filteredData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  key={index}
                  style={[
                    styles.CardView,
                    {
                      borderTopWidth: 3,
                      borderLeftWidth: 3,
                      borderColor: getStatusColor(item?.overall_status),
                    },
                  ]}>
                  <View style={styles.TitleView}>
                    <Text style={styles.statusTxt}>{item?.overall_status}</Text>
                  </View>
                  <View style={styles.Direction}>
                    <InnerCardFormat
                      title={'Order No'}
                      value={item?.order_no || 'N/A'}
                    />
                    <InnerCardFormat
                      title={'Booking Amount'}
                      value={item?.booking_amount || 'N/A'}
                    />
                  </View>
                  <View style={styles.Direction}>
                    <InnerCardFormat
                      title={'Customer Name'}
                      value={item?.partner_customer?.name || 'N/A'}
                    />
                    <View style={styles.CardWidth}>
                      <Text style={styles.topTxt}>WhatsApp no#</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const whatsappNo =
                            item?.partner_customer?.whatsapp_no;
                          const whatAppPrefix =
                            item?.partner_customer?.prefix_whatsapp;
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
                                  Linking.openURL(
                                    `whatsapp://send?phone=${prefix}`,
                                  );
                                }
                              })
                              .catch(err => {
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
                        <Text style={styles.BottomTxt}>{`${
                          item?.partner_customer?.prefix_whatsapp || ''
                        } ${
                          item?.partner_customer?.whatsapp_no || 'N/A'
                        }`}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* <InnerCardFormat title={'WhatsApp no#'} value={`${item?.partner_customer?.prefix_whatsapp || ''} ${item?.partner_customer?.whatsapp_no || 'N/A'}`} /> */}
                  </View>
                  <View style={styles.Direction}>
                    <InnerCardFormat
                      title={'Created Date'}
                      value={
                        item?.created_at
                          ? moment(item.created_at).format('MMMM Do YYYY')
                          : 'N/A'
                      }
                    />
                    <InnerCardFormat
                      title={'Created Time'}
                      value={
                        item?.created_at
                          ? moment(item.created_at).format('h:mm a')
                          : 'N/A'
                      }
                    />
                  </View>

                  <View style={styles.IconView}>
                    <MaterialCommunityIcons
                      name={getStatusIcon(item?.overall_status)}
                      size={30}
                      color={getStatusColor(item?.overall_status)}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
      {IsLoading && <Loader />}

      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        closeOnDragDown={true}
        closeOnPressMask={true}
        draggable={true}
        openDuration={100}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          draggableIcon: {
            backgroundColor: '#eeeeee',
            width: 50,
            height: 7,
          },
          container: {
            backgroundColor: '#fff',
            height: '42%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <OrderStatusRBsheet
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />
      </RBSheet>
    </View>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  CardView: {
    backgroundColor: '#fff',
    width: '94%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  statusTxt: {
    color: '#7a7a7a',
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  TitleView: {
    borderBottomWidth: 0.2,
    borderColor: 'gray',
    paddingTop: 5,
  },
  Direction: {
    flexDirection: 'row',
  },
  IconView: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '85%',
  },
  WhatsAppline: {
    backgroundColor: 'red',
  },
  CardWidth: {
    padding: 2,
    width: '42.5%',
  },
  topTxt: {
    color: '#000',
  },
  BottomTxt: {
    color: '#3483bf',
  },
});
