import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import instance from '../../../BaseUrl/BaseUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import css from '../../../CssFile/Css';
import moment from 'moment';
import Loader from '../../../Component/Loader/Loader';
import Octicons from 'react-native-vector-icons/Octicons';

const Notification = ({navigation}) => {
  const [notificatios, setNotificatios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getNotification = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/get/notifications');
      const notifiy = response?.data?.notifications;
      const reverseNotify = notifiy.reverse();
      setNotificatios(reverseNotify);
      await MarkAllread();
    } catch (error) {
      console.log('Notification', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MarkAllread = async () => {
    try {
      const response = await instance.post('/notification/all-read');
    } catch (error) {
      console.log('mark all read', error);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <View>
      <SimpleHeader name="Notification" onPress={() => navigation.goBack()} />

      <ScrollView style={{marginTop: 3, height: '92%', paddingBottom: 10}}>
        {notificatios.map(item => {
          return (
            <View
              style={[
                styles.CardView,
                {backgroundColor: item?.is_read === 0 ? '#e6e6e6' : '#fff'},
              ]}
              key={item.id}>
              <View style={styles.Icon}>
                <Ionicons
                  name="person-circle-outline"
                  size={25}
                  color={css.secondary}
                />
              </View>

              {/* <View style={styles.bellDot}>
                <Octicons name='dot-fill' size={12} color='red' />
              </View> */}

              <View style={styles.TextContainer}>
                <Text style={styles.Txt}>
                  {item?.receiver ? item?.receiver?.name : 'None'}
                </Text>
                <Text style={styles.Txt}>{item?.detail}</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateTxt}>
                    {moment(item.created_at).format('DD-MM-YY hh:mm a')}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {isLoading && <Loader />}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  CardView: {
    // backgroundColor: '#fff',
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    padding: 7,
    borderRadius: 5,
    flexDirection: 'row',
  },
  TextContainer: {
    width: '90%',
  },
  Txt: {
    color: '#000',
  },
  dateTxt: {
    fontSize: 12,
    textAlign: 'right',
    color: 'gray',
  },
  Icon: {
    width: '10%',
  },
  // bellDot: {
  //   position: 'absolute',
  //   right: 10,
  //   top: 10
  // },
});
