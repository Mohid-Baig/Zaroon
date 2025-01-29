import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import css from '../../../CssFile/Css';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import instance from '../../../BaseUrl/BaseUrl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../../Component/Loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {draftaddToCart, addToCart} from '../../../redux/action';
import moment from 'moment';
import uuid from 'react-native-uuid';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Toast from 'react-native-simple-toast';

const OrderFilterStatus = ({navigation, route}) => {
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const {status} = route.params;
  const dispatch = useDispatch();

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      // console.log(JSON.stringify(response.data))
      const filteredData = response?.data?.rides.filter(
        item => item?.overall_status === status,
      );
      setStatusData(filteredData.reverse());
      // console.log(filteredData,'uu')
    } catch (error) {
      console.log('OrderFilterStatus Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStatus();
    }, []),
  );

  const getStatusColor = status => {
    switch (status) {
      case 'cancelled':
        return '#DD3C3C';
      case 'completed':
        return '#18BA27';
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
    const orderDetail = order?.order_details;

    if (order) {
      const selectedDate = orderDetail?.date
        ? new Date(`${orderDetail?.date}T${orderDetail?.pickup_time}Z`)
        : new Date();
      // console.log(JSON.stringify(orderDetail[0,1]?.rate_list?.id),'hh')
      const modifiedOrder = {
        ...order,
        ordersDetail: orderDetail.map(detail => ({
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
      // console.log(JSON.stringify(modifiedOrder),'ii')

      switch (order?.overall_status) {
        case 'completed':
        case 'approved':
        case 'pending':
        case 'cancelled':
        case 'unapproved':
          navigation.navigate('OrderDetail', {orderData: order});
          break;
        case 'draft':
          dispatch(draftaddToCart(modifiedOrder));
          // dispatch(addToCart(modifiedOrder?.ordersDetail));
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

  const handleDraftPress = async order => {
    navigation.navigate('CreatedOrder', {order: order});
  };

  const DeleteDraft = async id => {
    Alert.alert(
      'Confirm Remove',
      'Are you sure you want to remove this draft?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await instance.post(
                `/order/updatestatus/${id}`,
                {overall_status: 'cancelled'},
              );
              if (response?.data?.message) {
                await getStatus();
                Toast.show('Draft Removed', Toast.SHORT);
              }
            } catch (error) {
              console.log(error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={css.MainContainer}>
      <SimpleHeader onPress={() => navigation.goBack()} name="Order Status" />
      <View style={{height: '95%'}}>
        <FlatList
          data={statusdata}
          keyExtractor={(item, index) => item?.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleDraftPress(item)}
              style={[
                styles.CardView,
                {
                  borderTopWidth: 3,
                  borderLeftWidth: 3,
                  borderColor: getStatusColor(item?.overall_status),
                },
              ]}>
              <View>
                <View style={styles.Direction}>
                  <View style={styles.CardWidth}>
                    <Text style={styles.topTxt}>Order No</Text>
                    <Text style={styles.BottomTxt}>{item?.order_no}</Text>
                  </View>
                  <View style={styles.CardWidth}>
                    <Text style={styles.topTxt}>Booking Amount</Text>
                    <Text style={styles.BottomTxt}>{item?.booking_amount}</Text>
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
              </View>

              <TouchableOpacity
                onPress={() => DeleteDraft(item?.id)}
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  // name={getStatusIcon(item?.overall_status)}
                  name={'close-box'}
                  size={30}
                  color={'red'}
                  // color={getStatusColor(item?.overall_status)}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <View style={{height: 10}}></View>
      </View>
      {IsLoading && <Loader />}
    </View>
  );
};

export default OrderFilterStatus;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  CardView: {
    backgroundColor: '#fff',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flexDirection: 'row',
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
    fontWeight: 'bold',
    fontSize: 13,
  },
  BottomTxt: {
    color: '#000',
    fontSize: 12,
  },
});
