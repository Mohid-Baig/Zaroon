import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import instance from '../../../BaseUrl/BaseUrl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../../Component/Loader/Loader';
import moment from 'moment';
import css from '../../../CssFile/Css';
import uuid from 'react-native-uuid';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import OrderStatusRBsheet from '../../../Component/OrderStatus/OrderStatusRBsheet';
import InnerCardFormat from '../../../Component/OrderStatus/InnerCardFormat';

const AllOrderStatuses = ({navigation}) => {
  const refRBSheet = useRef();
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [uperCard, setUpperCard] = useState([]);
  const [bottomCard, setBottomCard] = useState([]);

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      const rides = response?.data?.rides;

      setStatusData(rides);

      const UpperCard = rides.filter(item =>
        ['approved', 'unapproved', 'pending', 'draft'].includes(
          item?.overall_status,
        ),
      );
      const BottomsCard = rides
        .map(item =>
          item?.order_details.filter(detail =>
            ['completed', 'incomplete', 'cancelled'].includes(detail?.status),
          ),
        )
        .filter(filteredDetails => filteredDetails.length > 0);

      setUpperCard(UpperCard);
      setBottomCard(BottomsCard);
    } catch (error) {
      console.log('OrderAllStatus Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  const filterData = status => {
    setSelectedStatus(status);
    if (status === 'Show All') {
      setUpperCard(
        statusdata.filter(item =>
          ['approved', 'unapproved', 'pending', 'draft'].includes(
            item?.overall_status,
          ),
        ),
      );
      setBottomCard(
        statusdata
          .map(item =>
            item?.order_details.filter(detail =>
              ['completed', 'incomplete', 'cancelled'].includes(detail?.status),
            ),
          )
          .filter(filteredDetails => filteredDetails.length > 0),
      );
    } else if (
      ['approved', 'unapproved', 'pending', 'draft'].includes(status)
    ) {
      const filteredUpperCard = statusdata.filter(
        item => item?.overall_status === status,
      );

      setUpperCard(filteredUpperCard);
      setBottomCard([]);
    } else if (['completed', 'incomplete', 'cancelled'].includes(status)) {
      const filteredBottomCard = statusdata
        .map(item =>
          item?.order_details.filter(detail => detail?.status === status),
        )
        .filter(filteredItem => filteredItem.length > 0);

      setUpperCard([]);
      setBottomCard(filteredBottomCard);
    } else {
      setUpperCard([]);
      setBottomCard([]);
    }
    refRBSheet.current.close();
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
        onPress={() => navigation.goBack()}
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
          {uperCard &&
            uperCard.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={[
                    styles.CardView,
                    {
                      borderTopWidth: 3,
                      borderLeftWidth: 3,
                      borderColor: getStatusColor(item?.overall_status),
                    },
                  ]}
                  key={index}>
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

          {bottomCard &&
            bottomCard.map((orderDetails, index) => (
              <View key={index}>
                {Array.isArray(orderDetails) &&
                  orderDetails?.map((detail, idx) => (
                    <View
                      style={[
                        styles.CardView,
                        {
                          borderTopWidth: 3,
                          borderLeftWidth: 3,
                          borderColor: getStatusColor(detail?.status),
                        },
                      ]}
                      key={idx}>
                      <View style={styles.TitleView}>
                        <Text style={styles.statusTxt}>{detail?.status}</Text>
                      </View>
                      <View style={styles.Direction}>
                        <InnerCardFormat
                          title={'Order No'}
                          value={detail?.order?.order_no || 'None'}
                        />
                        <InnerCardFormat
                          title={'Customer Name'}
                          value={
                            detail?.order?.partner_customer?.name || 'None'
                          }
                        />
                      </View>

                      <View style={styles.Direction}>
                        <InnerCardFormat
                          title={'Vehicle'}
                          value={detail?.vehicle?.model || 'None'}
                        />
                        <InnerCardFormat
                          title={'Driver'}
                          value={detail?.driver?.name || 'None'}
                        />
                      </View>

                      <View style={styles.Direction}>
                        <InnerCardFormat
                          title={'From'}
                          value={detail?.from_loc || 'None'}
                        />
                        <InnerCardFormat
                          title={'To'}
                          value={detail?.to_loc || 'None'}
                        />
                      </View>

                      <View style={styles.Direction}>
                        <InnerCardFormat
                          title={'Date'}
                          value={detail?.date || 'None'}
                        />
                        <InnerCardFormat
                          title={'Time'}
                          value={detail?.pickup_time || 'None'}
                        />
                      </View>

                      <View style={styles.IconView}>
                        <MaterialCommunityIcons
                          name={getStatusIcon(detail?.status)}
                          size={30}
                          color={getStatusColor(detail?.status)}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            ))}
        </ScrollView>

        <View style={{height: 10}}></View>
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
            height: '55%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <OrderStatusRBsheet
          selectedStatus={selectedStatus}
          onStatusChange={filterData}
        />
      </RBSheet>
    </View>
  );
};

export default AllOrderStatuses;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  Direction: {
    flexDirection: 'row',
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
  IconView: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '85%',
  },
});
