import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import instance from '../../../BaseUrl/BaseUrl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AgentHeader from '../../../Component/CustomHeader/AgentHeader';
import Loader from '../../../Component/Loader/Loader';
import moment from 'moment';
import css from '../../../CssFile/Css';
import {useDispatch} from 'react-redux';
import {addToCart, draftaddToCart} from '../../../redux/action';
import uuid from 'react-native-uuid';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import OrderStatusRBsheet from '../../../Component/OrderStatus/OrderStatusRBsheet';

const OrderAllStatus = ({navigation}) => {
  const refRBSheet = useRef();
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      const filteredData = response?.data?.rides
        .filter(order => {
          return (
            ['approved', 'unapproved', 'pending', 'draft'].includes(
              order?.overall_status,
            ) ||
            order?.order_details.some(detail =>
              ['completed', 'incompleted', 'cancelled'].includes(
                detail?.status,
              ),
            )
          );
        })
        .reverse();

      const expandedData = filteredData.reduce((acc, order) => {
        const filteredOrderDetails = order.order_details.filter(detail =>
          ['completed', 'incompleted', 'cancelled'].includes(detail.status),
        );

        if (filteredOrderDetails.length > 0) {
          filteredOrderDetails.forEach(detail => {
            acc.push({...order, order_details: [detail], uniqueKey: uuid.v4()});
          });
        } else {
          acc.push({...order, uniqueKey: uuid.v4()});
        }

        return acc;
      }, []);

      setStatusData(expandedData);
      // console.log(JSON.stringify(response.data?.rides.map(order => order?.order_details.map(item => item?.status))), 'pp');
    } catch (error) {
      console.log('OrderAllStatus Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

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
    const orderDetail = order?.order_details[0];

    if (order) {
      const selectedDate = orderDetail?.date
        ? new Date(`${orderDetail?.date}T${orderDetail?.pickup_time}Z`)
        : new Date();
      const modifiedOrder = {
        ...order,
        ordersDetail: order.order_details.map(detail => ({
          id: detail?.rate_list?.id,
          price: detail?.rate,
          route: {
            from: detail?.rate_list?.route?.from,
            to: detail?.rate_list?.route?.to,
          },
          selectedDate: selectedDate.toISOString(),
          lineid: orderDetail?.id + '-' + uuid.v4(),
          lineSource: 'DB',
        })),
      };

      switch (order?.overall_status) {
        case 'approved':
        case 'pending':
        case 'unapproved':
          navigation.navigate('OrderDetail', {orderData: order});
          break;
        case 'draft':
          dispatch(draftaddToCart(modifiedOrder));
          modifiedOrder.ordersDetail.forEach(orderDetail => {
            dispatch(addToCart(orderDetail));
          });
          navigation.navigate('CreateAgentOrder', {mode: 'draft'});
          break;
        default:
          console.log('Unhandled order status: ', order?.overall_status);
      }
    }
  };

  return (
    <View style={css.MainContainer}>
      {/* <AgentHeader onPress={() => navigation.openDrawer()} /> */}
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
      <View style={{paddingBottom: 10}}>
        <FlatList
          data={statusdata}
          keyExtractor={(item, index) => item?.uniqueKey}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              style={[
                styles.CardView,
                {
                  borderTopWidth: 3,
                  borderLeftWidth: 3,
                  borderColor: getStatusColor(
                    item?.order_details[0]?.status || item?.overall_status,
                  ),
                },
              ]}>
              {/* <View style={{ borderBottomWidth: 0.2, borderColor: 'gray', paddingTop: 5, }}>
                                <Text style={{ color: '#7a7a7a', alignSelf: 'flex-end', paddingRight: 10, fontSize: 12, }}>{item?.overall_status}</Text>
                            </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}>
                <View>
                  {['approved', 'unapproved', 'pending', 'draft'].includes(
                    item?.overall_status,
                  ) ? (
                    <>
                      <View
                        style={{
                          borderBottomWidth: 0.2,
                          borderColor: 'gray',
                          paddingTop: 5,
                        }}>
                        <Text
                          style={{
                            color: '#7a7a7a',
                            alignSelf: 'flex-end',
                            fontSize: 12,
                          }}>
                          {item?.overall_status}
                        </Text>
                      </View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Order No</Text>
                          <Text style={styles.BottomTxt}>{item?.order_no}</Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Booking Amount</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.booking_amount}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Created Date</Text>
                          <Text style={styles.BottomTxt}>
                            {moment(item?.created_at).format('MMMM Do YYYY')}
                          </Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Created Time</Text>
                          <Text style={styles.BottomTxt}>
                            {moment(item?.created_at).format(' h:mm a')}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Order No</Text>
                          <Text style={styles.BottomTxt}>{item?.order_no}</Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Customer Name</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.customer_name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Vehicle</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.vehicle}
                          </Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Driver</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.driver}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>From</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.rate_list?.route?.from}
                          </Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>To</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.rate_list?.route?.to}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.Direction}>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Date</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.date}
                          </Text>
                        </View>
                        <View style={styles.CardWidth}>
                          <Text style={styles.topTxt}>Time</Text>
                          <Text style={styles.BottomTxt}>
                            {item?.order_details[0]?.pickup_time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name={getStatusIcon(
                      item?.order_details[0]?.status || item?.overall_status,
                    )}
                    size={30}
                    color={getStatusColor(
                      item?.order_details[0]?.status || item?.overall_status,
                    )}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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
        <OrderStatusRBsheet />
      </RBSheet>
    </View>
  );
};

export default OrderAllStatus;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  CardView: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    elevation: 2,
  },
  Direction: {
    flexDirection: 'row',
  },
  CardWidth: {
    padding: 2,
    width: '42.5%',
  },
  topTxt: {
    color: '#000',
  },
  BottomTxt: {
    color: '#7a7a7a',
  },
});
