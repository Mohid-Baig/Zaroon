/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AgentHeader from '../../../Component/CustomHeader/AgentHeader';
import css from '../../../CssFile/Css';
import Fontisto from 'react-native-vector-icons/Fontisto';
import OrderCard from '../../../Component/AgentHomeComponents/OrderCard';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  removeHeaderState,
  removeallcart,
  draftremoveallcart,
  removeFilter,
} from '../../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAgent = ({navigation}) => {
  const [statusdata, setStatusData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState({});
  const dispatch = useDispatch();

  const checkSavedData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const email = await AsyncStorage.getItem('email');

      console.log('auth_token:', token); // This logs the saved token
      console.log('email:', email); // This logs the saved email

      // Optionally, check if the token exists to decide if the user is logged in
      if (token) {
        console.log('User is logged in');
      } else {
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    }
  };
  useEffect(() => {
    checkSavedData(); // This will log the values saved in AsyncStorage
  }, []);
  const getStatus = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/partners_orders');
      setStatusData(response?.data?.rides);
    } catch (error) {
      console.log('OrderFilterStatus Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLatesPendings = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/latest-Pending-Orders');
      // setLatestPending(response?.data?.data);
    } catch (error) {
      console.log('latest pending Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCountByStatus = status => {
    return statusdata.filter(order => order?.overall_status === status).length;
  };

  useFocusEffect(
    React.useCallback(() => {
      getStatus();
      getLatesPendings();
      dispatch(removeFilter());
      handleNotificationUnreed();
    }, []),
  );

  const draftNavigation = () => {
    navigation.navigate('OrderFilterStatus', {status: 'draft'});
    dispatch(removeallcart());
    dispatch(removeHeaderState());
    dispatch(draftremoveallcart());
  };

  const handleNotificationUnreed = async () => {
    try {
      const response = await instance.get('/notification/count');
      setNotificationCount(response.data);
    } catch (error) {
      console.log('Unreed Notification Home', error);
    }
  };

  return (
    <View style={styles.MainContainer}>
      <StatusBar backgroundColor={css.primary} barStyle={'light-content'} />
      <AgentHeader
        notification={notificationCount}
        onNotification={() => navigation.navigate('Notification')}
        onPress={() => navigation.openDrawer()}
      />
      <ScrollView>
        <View style={[styles.TopCards, {marginTop: 10}]}>
          <Text style={styles.Boldtxt}>Zaroon Exclusive Offers</Text>
          <ScrollView
            horizontal={true}
            style={{marginTop: 5}}
            showsHorizontalScrollIndicator={false}>
            <Image
              style={styles.Images}
              source={require('../../../assets/AgentHome/card1.png')}
            />
            <Image
              style={styles.Images}
              source={require('../../../assets/AgentHome/card2.png')}
            />
          </ScrollView>
        </View>

        <View style={styles.TopCards}>
          <Text style={styles.Boldtxt}>Book a Order</Text>
          <View style={styles.BookRide}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatedOrder')}
              style={styles.BookButton}>
              <Text
                style={[styles.TxtRide, {fontWeight: 'bold', paddingRight: 5}]}>
                Book a ride
              </Text>
              <Fontisto name="arrow-right-l" color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.TopCards}>
          <Text style={styles.Boldtxt}>Order Status</Text>
          <View>
            <View style={styles.cardsDirection}>
              <OrderCard
                style={styles.Count}
                count={getCountByStatus('draft')}
                onPress={draftNavigation}
                image={require('../../../assets/AgentHome/draft.png')}
                title={'Draft'}
              />
              <OrderCard
                onPress={() => navigation.navigate('OrderStatus')}
                image={require('../../../assets/AgentHome/completed.png')}
                title={'Status'}
              />
              <OrderCard
                onPress={() => navigation.navigate('Ledger')}
                title={'Ledger'}
                image={require('../../../assets/AgentHome/approved.png')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {IsLoading && <Loader />}
    </View>
  );
};

export default HomeAgent;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  TopCards: {
    padding: 10,
  },
  Boldtxt: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
  },
  BookRide: {
    backgroundColor: css.secondary,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    paddingVertical: 50,
  },
  TxtRide: {
    color: '#fff',
    fontSize: 14,
  },
  BookButton: {
    padding: 8,
    marginVertical: 10,
    backgroundColor: css.primary,
    paddingHorizontal: 30,
    borderRadius: 5,
    flexDirection: 'row',
    width: 150,
    alignSelf: 'center',
  },
  cardsDirection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  Images: {
    margin: 4,
    height: 170,
    width: 290,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  Count: {
    backgroundColor: '#DD3C3C',
    position: 'absolute',
    right: -8,
    top: -8,
    padding: 2,
    minHeight: 18,
    minWidth: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
