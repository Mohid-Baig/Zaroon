import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import css from '../../../CssFile/Css';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import instance from '../../../BaseUrl/BaseUrl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../../Component/Loader/Loader';
import moment from 'moment';

const OrderLineFilterStatus = ({navigation, route}) => {
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const {status} = route.params;

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      const filteredData = response?.data?.rides.filter(item =>
        item?.order_details.some(detail => detail?.status === status),
      );
      setStatusData(filteredData.reverse());
    } catch (error) {
      console.log('OrderFilterStatus Api', error);
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
      case 'incomplete':
        return 'clock-outline';
      default:
        return 'information-outline';
    }
  };

  const handlePress = async orderDetail => {
    navigation.navigate('OrderDetail', {orderDetail});
  };

  return (
    <View style={css.MainContainer}>
      <SimpleHeader onPress={() => navigation.goBack()} name="Order Status" />
      <View style={{height: '92%'}}>
        <FlatList
          data={statusdata}
          keyExtractor={(item, index) => item?.id.toString()}
          renderItem={({item}) => {
            return item.order_details
              .filter(detail => detail.status === status)
              .map((detail, index) => (
                <View
                  key={index}
                  // onPress={() => handlePress(detail)}
                  style={[
                    styles.CardView,
                    {
                      borderTopWidth: 3,
                      borderLeftWidth: 3,
                      borderColor: getStatusColor(detail.status),
                    },
                  ]}>
                  <View>
                    <View style={styles.Direction}>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Order No</Text>
                        <Text style={styles.BottomTxt}>{item?.order_no}</Text>
                      </View>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Customer Name</Text>
                        <Text style={styles.BottomTxt}>
                          {item?.customer_partner_id}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.Direction}>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Vehicle</Text>
                        <Text style={styles.BottomTxt}>
                          {detail?.vehicle_id}
                        </Text>
                      </View>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Driver</Text>
                        <Text style={styles.BottomTxt}>
                          {detail?.driver_id}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.Direction}>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>From</Text>
                        <Text style={styles.BottomTxt}>
                          {detail?.rate_list?.route?.from}
                        </Text>
                      </View>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>To</Text>
                        <Text style={styles.BottomTxt}>
                          {detail?.rate_list?.route?.to}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.Direction}>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Date</Text>
                        <Text style={styles.BottomTxt}>{detail?.date}</Text>
                      </View>
                      <View style={styles.CardWidth}>
                        <Text style={styles.topTxt}>Time</Text>
                        <Text style={styles.BottomTxt}>
                          {detail?.pickup_time}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '15%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={getStatusIcon(detail.status)}
                      size={30}
                      color={getStatusColor(detail.status)}
                    />
                  </View>
                </View>
              ));
          }}
        />
        <View style={{height: 10}}></View>
      </View>
      {IsLoading && <Loader />}
    </View>
  );
};

export default OrderLineFilterStatus;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  CardView: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
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
