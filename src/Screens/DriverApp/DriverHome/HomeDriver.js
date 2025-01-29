import React, {useRef, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import HomeCard from '../../../Component/HomeComponents/HomeCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../../Component/HomeComponents/BottomSheet';
import instance, {BASEURL} from '../../../BaseUrl/BaseUrl';
import css from '../../../CssFile/Css';
// import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import Loader from '../../../Component/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInputField from '../../../Component/CreateNewOrderComponent/TextInputField';
import Button from '../../../Component/CreateNewOrderComponent/Button';
import moment from 'moment';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';

const HomeScreen = ({navigation}) => {
  const refRBSheet = useRef();
  const menuRef = useRef(null);
  const [pendingData, setPendingData] = useState([]);
  const [inProgressData, setInPrgressData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [currentInProgressRide, setCurrentInProgressRide] = useState(null);
  const [milageModal, setMilageModal] = useState(false);
  const [mileage, setMileage] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [swipedItem, setSwipedItem] = useState(null); // New state to track swiped item
  const [notificationCount, setNotificationCount] = useState({});

  const getProfileImage = async () => {
    try {
      setIsLoading(true);
      const image = await AsyncStorage.getItem('Image');
      if (image) {
        const ImageURL = `${BASEURL}/storage/${image}`;
        setProfileImage(ImageURL);
      }
    } catch (error) {
      console.error('Failed to fetch profile image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setMilageModal(false);
  };

  handleNotificationUnreed = async () => {
    try {
      const response = await instance.get('/notification/count');
      setNotificationCount(response.data);
    } catch (error) {
      console.log('Unreed Notification Home', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [pending, inProgress] = await Promise.all([
        getPendingApi(),
        getInProgress(),
      ]);
      setCombinedData([...inProgress, ...pending]);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const openRBSheet = item => {
    setSelectedItem(item);
    refRBSheet.current.open();
  };
  const closeBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.close();
    }
  };
  const handleRightIconPress = () => {
    setShouldShowMenu(true);
  };

  const getPendingApi = async () => {
    try {
      const response = await instance.get('/ride-assign-driver-pending');
      const pending = response?.data?.pending_rides.reverse();
      // console.log(pending, 'pend');
      setPendingData(pending);
      checkForCancellation(pending);
      return pending;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleCancelStatus = async rideId => {
    const payload = {
      ride_id: rideId,
      status: 'cancelled',
    };
    try {
      const response = await instance.post(
        '/ride-status-update-driver',
        payload,
      );
      console.log(`Ride with ID ${rideId} cancelled successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  const checkForCancellation = rides => {
    rides.forEach(ride => {
      const {date, pickup_time, id} = ride;
      const rideDateTime = moment(
        `${date} ${pickup_time}`,
        'YYYY-MM-DD HH:mm:ss',
      );
      const currentTime = moment();

      // Check if the current time is more than 24 hours after the ride date and time
      if (currentTime.isAfter(rideDateTime.add(24, 'hours'))) {
        handleCancelStatus(id); // Pass the ride ID to cancel the ride
      }
    });
  };

  const getInProgress = async () => {
    try {
      const response = await instance.get('/ride-assign-driver-inprogress');
      const inProgress = response?.data?.inprogress_rides;
      setInPrgressData(inProgress);

      if (inProgress.length > 0) {
        setCurrentInProgressRide(inProgress[0]);
      } else {
        setCurrentInProgressRide(null);
      }

      return inProgress;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const [pending, inProgress] = await Promise.all([
          getPendingApi(),
          getInProgress(),
        ]);
        setCombinedData([...inProgress, ...pending]);
      };

      fetchData();
      getProfileImage();
      handleNotificationUnreed();
    }, []),
  );

  const handleSwipeComplete = async () => {
    if (!swipedItem) return;

    try {
      setIsLoading(true);
      if (mileage !== '') {
        const payload = {
          ride_id: swipedItem.id,
          status: 'completed',
          ride_end_mileage: mileage,
        };
        const response = await instance.post(
          '/ride-status-update-driver',
          payload,
        );
        if (response.status === 200) {
          closeModal();
          navigation.navigate('CompletedView');
          getPendingApi();
        }
      } else {
        Alert.alert('Warning!!', 'Please Enter Car Mileage before Ending');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const leftSwipe = item => {
    return (
      <View style={styles.slideContainer}>
        <Text style={styles.slidetxt}>Completed</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />

      <Image
        style={styles.BackGroundImageStyle}
        source={require('../../../assets/HomeImages/HomeBack.jpg')}
      />

      <View style={styles.Profile}>
        {profileImage ? (
          <Image
            source={{uri: profileImage}}
            style={styles.profileImageStyle}
          />
        ) : (
          <Ionicons name="person-sharp" color="gray" size={30} />
        )}
      </View>

      <View style={styles.TopLeftContainer}>
        <TouchableOpacity onPress={onRefresh}>
          <Feather name="refresh-cw" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('DriverNotification')}>
          <Octicons name="bell" size={20} color="#fff" />
        </TouchableOpacity>

        {notificationCount && notificationCount?.unread_count > 0 && (
          <TouchableOpacity style={styles.bellDot}>
            <Octicons name="dot-fill" size={12} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.buttonPlusStyle}
        onPress={() => navigation.navigate('CreateCustomer')}>
        <Fontisto name="plus-a" size={18} color={'#FFFFFF'} />
        <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 5}}>
          Book a ride
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 3,
          paddingBottom: 10,
          borderTopRightRadius: 40,
          marginTop: -20,
        }}>
        <View style={styles.Title}>
          <Text style={styles.TitleTxt}>Pending Rides</Text>
        </View>
        <FlatList
          data={combinedData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item}) =>
            item.status === 'in_progress' ? (
              <Swipeable
                renderLeftActions={() => leftSwipe(item)}
                onSwipeableOpen={() => {
                  setSwipedItem(item);
                  setMilageModal(true);
                }} // Open modal on swipe
              >
                <HomeCard
                  item={item}
                  openRBSheet={() => openRBSheet(item)}
                  borderLeftColorProps={'orange'}
                />
              </Swipeable>
            ) : (
              <HomeCard
                item={item}
                openRBSheet={() => openRBSheet(item)}
                borderLeftColorProps={'orange'}
              />
            )
          }
        />
      </View>

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
            height: '50%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <BottomSheet
          selectedItem={selectedItem}
          navigation={navigation}
          onRefresh={onRefresh}
          closeBottomSheet={closeBottomSheet}
          currentInProgressRide={currentInProgressRide}
        />
      </RBSheet>

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
                      label={'End'}
                      backgroundColor={css.primary}
                      color={'#fff'}
                      onPress={handleSwipeComplete} // Call handleSwipeComplete on button press
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

export default HomeScreen;

const styles = StyleSheet.create({
  MainTxtStyle: {
    marginTop: '10%',
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
  },
  buttonPlusStyle: {
    backgroundColor: css.primary,
    flexDirection: 'row',
    padding: 10,
    position: 'absolute',
    borderRadius: 30,
    right: 20,
    top: 100,
  },
  TxtButtonViewStyle: {
    flexDirection: 'row',
    width: '100%',
    height: '200',
    alignItems: 'flex-end',
    position: 'absolute',
    marginTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'red',
  },
  BackGroundImageStyle: {
    height: '30%',
    width: '100%',
  },
  Profile: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 70,
    height: 70,
    // borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageStyle: {
    height: 70,
    width: 70,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#029ff2',
  },
  TopLeftContainer: {
    position: 'absolute',
    right: 25,
    top: 50,
    flexDirection: 'row',
    width: 50,
    justifyContent: 'space-between',
  },
  bellDot: {
    position: 'absolute',
    right: 0,
    top: -5,
    zIndex: 2,
  },
  slideContainer: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    width: 100,
    marginTop: 10,
  },
  slidetxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  Title: {
    width: '90%',
    alignSelf: 'center',
  },
  TitleTxt: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    // paddingHorizontal: 7,
    marginBottom: 5,
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
});
