/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Image,
  TextInput,
  Alert,
  BackHandler,
  Modal,
  Touchable,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import instance from '../../../BaseUrl/BaseUrl';
import BottomSheet from '@gorhom/bottom-sheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Button from '../../../Component/CreateNewOrderComponent/Button';
import css from '../../../CssFile/Css';
import Loader from '../../../Component/Loader/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeFromCart,
  removeallcart,
  draftremoveallcart,
  addHeaderState,
  removeHeaderState,
} from '../../../redux/action';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

const CreateAgentOrder = ({navigation, route}) => {
  const {mode} = route.params;

  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [bussinessPartner, setBussinessPartner] = useState('');
  const [IsLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [luggage, setLuggage] = useState('');
  const [child, setChild] = useState('');
  const [adult, setAdult] = useState('');
  const [mainDraft, setMainDraft] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCounter, setCurrentCounter] = useState(null);
  const DraftcartItems = useSelector(state => state.mainDraftReducer);
  const cartItems = useSelector(state => state.reducer);
  const headerState = useSelector(state => state.headerReducer);
  const FilterTypes = useSelector(state => state.FilterReducer);

  useEffect(() => {
    setMainDraft(DraftcartItems);
    setOrderList(cartItems);
    // console.log(JSON.stringify(cartItems),'ssss')
  }, [DraftcartItems, mainDraft, cartItems, orderList]);

  useEffect(() => {
    if (headerState.length > 0) {
      setSelectedCustomer(headerState[0]?.selectedCustomer);
      setAdult(headerState[0]?.adult);
      setLuggage(headerState[0]?.luggage);
      setChild(headerState[0]?.child);
    } else {
      setSelectedCustomer(DraftcartItems[0]?.customer_partner_id);
      setAdult(DraftcartItems[0]?.overall_adult);
      setLuggage(DraftcartItems[0]?.overall_bags);
      setChild(DraftcartItems[0]?.overall_child);
    }
  }, [DraftcartItems, headerState]);

  const removeOrder = id => {
    dispatch(removeFromCart(id));
  };

  const AddMorePackage = async () => {
    const payload = {
      luggage,
      child,
      adult,
      selectedCustomer,
    };
    dispatch(addHeaderState(payload));
    navigation.navigate('Packages');
  };

  const getCustomerPicker = async () => {
    try {
      const response = await instance.get('/fetch-customers');
      const customersData = response?.data?.partners;
      setCustomers(customersData);
      setItems(
        customersData.map(customer => ({
          label: customer.name,
          value: customer.id,
        })),
      );
    } catch (error) {
      console.log('Customer Picker');
    }
  };

  const getPartnerName = async () => {
    try {
      const response = await instance.get('/get-user');
      setBussinessPartner(response?.data?.user?.name);
    } catch (error) {
      console.log('Partner Name', error);
    }
  };

  useEffect(() => {
    getCustomerPicker();
    getPartnerName();
  }, []);

  const validateFields = () => {
    if (!luggage) {
      Alert.alert('Validation Error', 'Please enter the number of luggages.');
      return false;
    }
    if (!selectedCustomer) {
      Alert.alert('Validation Error', 'Please select a customer.');
      return false;
    }
    if (!child) {
      Alert.alert('Validation Error', 'Please enter the number of children.');
      return false;
    }
    if (!adult) {
      Alert.alert('Validation Error', 'Please enter the number of adults.');
      return false;
    }
    if (orderList.length === 0) {
      Alert.alert('Validation Error', 'Please select your package');
      return false;
    }
    return true;
  };

  const CreateOrder = async () => {
    if (!validateFields()) {
      return;
    }
    const dates = orderList.map(
      order => new Date(order?.selectedDate).toISOString().split('T')[0],
    );
    const times = orderList.map(
      order => new Date(order?.selectedDate).toTimeString().split(' ')[0],
    );
    const rateListIds = orderList.map(order => order?.id);
    const rateListPrice = orderList.map(order => order?.price);

    const repeatedAdults = Array(orderList.length).fill(adult);
    const repeatedChildren = Array(orderList.length).fill(child);
    const repeatedBags = Array(orderList.length).fill(luggage);
    const repeatedIsAC = Array(orderList.length).fill(1);

    const payload = {
      customer_partner_id: selectedCustomer,
      overall_adult: adult,
      overall_child: child,
      overall_bags: luggage,
      overall_status: 'pending',
      booking_amount: totalPrice,
      final_amount: totalPrice,
      rate_list_id: rateListIds,
      rate: rateListPrice,
      adult: repeatedAdults,
      child: repeatedChildren,
      bags: repeatedBags,
      date: dates,
      pickup_time: times,
      is_ac: repeatedIsAC,
    };
    try {
      setIsLoading(true);
      const response = await instance.post('/create-order', payload);
      if (response?.data?.message) {
        Toast.show('Successfully created', Toast.SHORT);
        dispatch(removeallcart());
        dispatch(draftremoveallcart());
        dispatch(removeHeaderState());
        navigation.goBack();
      }
    } catch (error) {
      console.log('Create Order', error);
    } finally {
      setIsLoading(false);
    }
  };

  const OrderDraft = async () => {
    if (!validateFields()) {
      return;
    }

    const dates = orderList.map(
      order => new Date(order?.selectedDate).toISOString().split('T')[0],
    );
    const times = orderList.map(
      order => new Date(order?.selectedDate).toTimeString().split(' ')[0],
    );
    const rateListIds = orderList.map(order => order?.id);
    const rateListPrice = orderList.map(order => order?.price);

    const repeatedAdults = Array(orderList.length).fill(adult);
    const repeatedChildren = Array(orderList.length).fill(child);
    const repeatedBags = Array(orderList.length).fill(luggage);
    const repeatedIsAC = Array(orderList.length).fill(1);

    const payload = {
      customer_partner_id: selectedCustomer,
      overall_adult: adult,
      overall_child: child,
      overall_bags: luggage,
      overall_status: 'draft',
      booking_amount: totalPrice,
      final_amount: totalPrice,
      rate_list_id: rateListIds,
      rate: rateListPrice,
      adult: repeatedAdults,
      child: repeatedChildren,
      bags: repeatedBags,
      date: dates,
      pickup_time: times,
      is_ac: repeatedIsAC,
    };
    // console.log(payload, 'pay')
    try {
      setIsLoading(true);
      const response = await instance.post('/create-order', payload);
      if (response?.data?.message) {
        Toast.show('Save as Draft', Toast.SHORT);
        dispatch(removeallcart());
        dispatch(draftremoveallcart());
        dispatch(removeHeaderState());
        navigation.goBack();
      }
    } catch (error) {
      console.log('Create Order', error);
    } finally {
      setIsLoading(false);
    }
  };

  const DraftedOrderDraft = async () => {
    if (!validateFields()) {
      return;
    }
    const repeatedAdults = Array(orderList.length).fill(adult);
    const repeatedChildren = Array(orderList.length).fill(child);
    const repeatedBags = Array(orderList.length).fill(luggage);
    const repeatedIsAC = Array(orderList.length).fill(1);

    const dates = orderList.map(
      order => new Date(order?.selectedDate).toISOString().split('T')[0],
    );
    const times = orderList.map(
      order => new Date(order?.selectedDate).toTimeString().split(' ')[0],
    );
    const rateListIds = orderList.map(order => order?.id);
    const rateListPrice = orderList.map(order => order?.price);

    const payload = {
      order_no: mainDraft[0]?.order_no,
      business_partner_id: mainDraft[0]?.business_partner_id,
      customer_partner_id: selectedCustomer,
      overall_adult: adult,
      overall_child: child,
      overall_bags: luggage,
      booking_amount: totalPrice,
      final_amount: totalPrice,
      overall_status: 'draft',
      adult: repeatedAdults,
      bags: repeatedBags,
      child: repeatedChildren,
      date: dates,
      pickup_time: times,
      rate: rateListPrice,
      rate_list_id: rateListIds,
      is_ac: repeatedIsAC,
    };
    try {
      setIsLoading(true);
      const response = await instance.post(
        `/update-order/${mainDraft[0]?.id}`,
        payload,
      );
      console.log(response?.data, 'dr');
      if (response?.data?.message) {
        Toast.show('Draft Updated', Toast.SHORT);
        dispatch(removeallcart());
        dispatch(draftremoveallcart());
        dispatch(removeHeaderState());
        navigation.goBack();
      }
    } catch (error) {
      console.log('Drafted again draft', error);
    } finally {
      setIsLoading(false);
    }
  };

  const DraftedCreateOrder = async () => {
    if (!validateFields()) {
      return;
    }

    const repeatedAdults = Array(orderList.length).fill(adult);
    const repeatedChildren = Array(orderList.length).fill(child);
    const repeatedBags = Array(orderList.length).fill(luggage);
    const repeatedIsAC = Array(orderList.length).fill(1);

    const dates = orderList.map(
      order => new Date(order?.selectedDate).toISOString().split('T')[0],
    );
    const times = orderList.map(
      order => new Date(order?.selectedDate).toTimeString().split(' ')[0],
    );
    const rateListIds = orderList.map(order => order?.id);
    const rateListPrice = orderList.map(order => order?.price);

    const payload = {
      order_no: mainDraft[0]?.order_no,
      business_partner_id: mainDraft[0]?.business_partner_id,
      customer_partner_id: selectedCustomer,
      overall_adult: adult,
      overall_child: child,
      overall_bags: luggage,
      booking_amount: totalPrice,
      final_amount: totalPrice,
      overall_status: 'pending',
      adult: repeatedAdults,
      bags: repeatedBags,
      child: repeatedChildren,
      date: dates,
      pickup_time: times,
      rate: rateListPrice,
      rate_list_id: rateListIds,
      is_ac: repeatedIsAC,
    };
    try {
      setIsLoading(true);
      const response = await instance.post(
        `/update-order/${mainDraft[0]?.id}`,
        payload,
      );
      console.log(response?.data, 'dr');
      if (response?.data?.message) {
        Toast.show('Successfully created', Toast.SHORT);
        dispatch(removeallcart());
        dispatch(draftremoveallcart());
        dispatch(removeHeaderState());
        navigation.goBack();
      }
    } catch (error) {
      console.log('Updated Draft', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Bottom sheet setup
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['63%'], []);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return orderList
      .reduce((sum, order) => sum + parseFloat(order.price), 0)
      .toFixed(2);
  }, [orderList]);

  const GoBackNavigation = () => {
    Alert.alert(
      'Unsaved Changes',
      'You have unsaved changes. If you go back now, all the data you have entered will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Go Back',
          onPress: () => {
            navigation.goBack();
            dispatch(removeallcart());
            dispatch(removeHeaderState());
            dispatch(draftremoveallcart());
          },
        },
      ],
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        GoBackNavigation();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleCounterPress = counterType => {
    setCurrentCounter(counterType);
  };

  useEffect(() => {
    if (currentCounter) {
      setModalVisible(true);
    }
  }, [currentCounter]);

  const increaseValue = () => {
    if (currentCounter === 'luggage') {
      setLuggage(prev => (parseInt(prev) || 0) + 1);
    } else if (currentCounter === 'child') {
      setChild(prev => (parseInt(prev) || 0) + 1);
    } else if (currentCounter === 'adult') {
      setAdult(prev => (parseInt(prev) || 0) + 1);
    }
  };

  const decreaseValue = () => {
    if (currentCounter === 'luggage') {
      setLuggage(prev => Math.max((parseInt(prev) || 0) - 1, 0));
    } else if (currentCounter === 'child') {
      setChild(prev => Math.max((parseInt(prev) || 0) - 1, 0));
    } else if (currentCounter === 'adult') {
      setAdult(prev => Math.max((parseInt(prev) || 0) - 1, 0));
    }
  };

  useEffect(() => {
    if (!modalVisible) {
      setCurrentCounter(null);
    }
  }, [luggage, child, adult, modalVisible]);

  return (
    <View style={css.MainContainer}>
      <StatusBar backgroundColor={css.headercolor} />

      <View style={styles.Header}>
        <TouchableOpacity
          style={{
            paddingLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
          }}
          onPress={GoBackNavigation}>
          <AntDesign name="left" color="#fff" size={25} />
          <Text style={styles.HeaderTxt}>Let's Create Your Trip</Text>
        </TouchableOpacity>

        {FilterTypes && (
          <View style={styles.labelsContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.label}>Vehicle :</Text>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>
                {' '}
                {FilterTypes[0]?.vehicle?.label}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.label}>Max Seats : </Text>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>
                {' '}
                {FilterTypes[0]?.vehicle?.seats}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.label}>Max Bags : </Text>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>
                {' '}
                {FilterTypes[0]?.vehicle?.bags}
              </Text>
            </View>
          </View>
        )}

        {/* <View style={styles.TopContainer}>
          <View style={styles.mainView}>
            <View style={styles.TopView}>
              <View style={styles.IconView}>
                <Entypo name='text-document' color={css.primary} size={17} />
              </View>
              <Text style={styles.TopTxt}>Order No</Text>
            </View>
            <View style={[styles.NestedView, { width: 110 }]}>
              <Text style={[styles.nestedTxt, { width: 100, textAlign: 'center' }]}>{mainDraft[0]?.order_no || 'None'}</Text>
            </View>
          </View>

          <View style={styles.mainView}>
            <View style={styles.TopView}>
              <View style={styles.IconView}>
                <Ionicons name='people-outline' color={css.primary} size={17} />
              </View>
              <Text style={styles.TopTxt}>Business Partner</Text>
            </View>
            <View style={[styles.NestedView, { width: 220 }]}>
              <Text style={[styles.nestedTxt, { width: 210, textAlign: 'center' }]}>{bussinessPartner}</Text>
            </View>
          </View>
        </View> */}
      </View>

      {/* <View style={[styles.TopContainer, { marginTop: -10 }]}>

        <View style={[styles.mainView, { marginTop: 10 }]}>
          <View style={styles.TopView}>
            <View style={styles.IconView}>
              <MaterialIcons name='luggage' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Luggage</Text>
          </View>
          <View style={[styles.TextInput, { elevation: 3, width: 110 }]}>
            <TextInput
              style={styles.input}
              placeholder='Luggages count'
              placeholderTextColor={'gray'}
              value={luggage}
              onChangeText={setLuggage}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.TopView}>
            <View style={styles.IconView}>
              <Ionicons name='person-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Customer</Text>
          </View>
          <View style={styles.pickerContainer}>
            <DropDownPicker
              open={open}
              value={selectedCustomer}
              items={items}
              setOpen={setOpen}
              setValue={setSelectedCustomer}
              setItems={setItems}
              placeholder="Select a customer"
              style={styles.picker}
              containerStyle={{}}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>
        </View>
      </View> */}

      {/* <View style={[styles.TopContainer, { marginTop: 0 }]}>
        <View style={styles.mainView}>
          <View style={styles.TopView}>
            <View style={styles.IconView}>
              <MaterialCommunityIcons name='baby-face-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Child</Text>
          </View>
          <View style={[styles.TextInput, { elevation: 3, width: 110 }]}>
            <TextInput
              style={styles.input}
              placeholder="Child's with you"
              placeholderTextColor={'gray'}
              value={child}
              onChangeText={setChild}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.TopView}>
            <View style={styles.IconView}>
              <Ionicons name='people-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Adult</Text>
          </View>
          <View style={[styles.TextInput, { elevation: 3, width: 220 }]}>
            <TextInput
              style={styles.input}
              placeholder="Total Adults"
              placeholderTextColor={'gray'}
              value={adult}
              onChangeText={setAdult}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View> */}

      <View style={[styles.TopContainer, {}]}>
        <View style={[styles.mainView, {marginTop: 10}]}>
          {/* <View style={styles.TopView}>
            <View style={styles.IconView}>
              <MaterialIcons name='luggage' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Luggage</Text>
          </View> */}
          <TouchableOpacity
            style={[styles.TextInput, {width: 130}]}
            onPress={() => handleCounterPress('luggage')}>
            <MaterialIcons name="luggage" color={css.primary} size={20} />
            <Text style={styles.input}>{luggage ? luggage : 'Luggages'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.mainView, {marginTop: 10}]}>
          {/* <View style={styles.TopView}>
            <View style={styles.IconView}>
              <Ionicons name='person-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Customer</Text>
          </View> */}
          <View style={styles.pickerContainer}>
            <Ionicons name="person-outline" color={css.primary} size={17} />
            <Picker
              selectedValue={selectedCustomer}
              style={styles.picker}
              dropdownIconColor={'gray'}
              onValueChange={itemValue => setSelectedCustomer(itemValue)}>
              <Picker.Item label="Customer" value="Customer" />
              {items.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={[styles.TopContainer]}>
        <View style={styles.mainView}>
          {/* <View style={styles.TopView}>
            <View style={styles.IconView}>
              <MaterialCommunityIcons name='baby-face-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Child</Text>
          </View> */}
          <TouchableOpacity
            style={[styles.TextInput, {width: 130}]}
            onPress={() => handleCounterPress('child')}>
            <MaterialCommunityIcons
              name="baby-face-outline"
              color={css.primary}
              size={20}
            />
            <Text style={styles.input}>{child ? child : 'Childs'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainView}>
          {/* <View style={styles.TopView}>
            <View style={styles.IconView}>
              <Ionicons name='people-outline' color={css.primary} size={17} />
            </View>
            <Text style={styles.BottomTxt}>Adult</Text>
          </View> */}
          <TouchableOpacity
            style={[styles.TextInput, {width: 220}]}
            onPress={() => handleCounterPress('adult')}>
            <Ionicons name="people-outline" color={css.primary} size={20} />
            <Text style={styles.input}>{adult ? adult : 'Adults'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide">
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={decreaseValue}
              style={[
                styles.modalButton,
                currentCounter && styles.modalButtonEnabled,
              ]}
              disabled={!currentCounter}>
              {/* <Text style={styles.modalButtonText}>-</Text> */}
              <AntDesign name="minuscircleo" color={css.primary} size={30} />
            </TouchableOpacity>
            <Text style={styles.modalValue}>
              {currentCounter === 'luggage'
                ? luggage || 0
                : currentCounter === 'child'
                ? child || 0
                : adult || 0}
              {/* {currentCounter === 'luggage' ? luggage : currentCounter === 'child' ? child : adult} */}
            </Text>
            <TouchableOpacity
              onPress={increaseValue}
              style={styles.modalButton}>
              {/* <Text style={styles.modalButtonText}>+</Text> */}
              <AntDesign name="pluscircleo" color={css.primary} size={30} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}>
        <View style={styles.HeaderSheet}>
          <Text style={[styles.nestedTxt, {fontSize: 20}]}>Bookings</Text>
          <TouchableOpacity
            style={{
              backgroundColor: css.secondary,
              padding: 5,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
            onPress={AddMorePackage}>
            <Text style={{color: '#fff'}}>Add Ride</Text>
            {/* <AntDesign name='pluscircle' color={css.secondary} size={35} /> */}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Packages')}
          style={styles.searchButton}>
          <Ionicons name="search-outline" color="#000" size={18} />
          <Text style={{color: '#000', marginLeft: 10}}>Pick-Up location</Text>
        </TouchableOpacity>

        <View style={{height: '63%'}}>
          <BottomSheetFlatList
            data={orderList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({item, index}) => (
              <View style={styles.orderItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.CalenderView}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        padding: 5,
                        borderRadius: 30,
                      }}>
                      <MaterialCommunityIcons
                        name="calendar-clock-outline"
                        color="#000"
                        size={25}
                      />
                    </View>
                    <View>
                      <Text
                        style={{color: '#fff', marginLeft: 5, fontSize: 12}}>
                        Date/Time
                      </Text>
                      <Text
                        style={{color: '#fff', marginLeft: 5, fontSize: 12}}>
                        {moment(item?.selectedDate).format(
                          'MMMM Do YYYY, h:mm a',
                        )}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      // removeOrder(`${item.lineid}-${index}`)
                      removeOrder(item?.lineid);
                      // console.log(item, 'vvv')
                    }}>
                    <AntDesign name="close" color={'#000'} size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.fromToContainer}>
                  <View style={styles.fromTo}>
                    <Text style={styles.FromToTxt}>From:</Text>
                    <Text style={styles.FromToBold}>{item?.route?.from}</Text>
                  </View>

                  <Image
                    style={styles.Imagecar}
                    source={require('../../../assets/Homecard/cardrop2.png')}
                  />
                  <View style={styles.fromTo}>
                    <Text style={styles.FromToTxt}>To:</Text>
                    <Text style={styles.FromToBold}>{item?.route?.to}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.ButtonContainer}>
          <Text
            style={{
              color: 'gray',
              padding: 5,
              fontSize: 16,
              paddingHorizontal: 10,
            }}>
            Total Price : {totalPrice}
          </Text>

          {mainDraft && Object.keys(mainDraft).length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingBottom: 5,
              }}>
              <Button
                label="Save as draft"
                color={'#000'}
                onPress={DraftedOrderDraft}
                borderWidth={1}
                borderColor={'gray'}
              />
              <Button
                label="Checkout"
                color={'#fff'}
                onPress={DraftedCreateOrder}
                backgroundColor={css.secondary}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingBottom: 5,
              }}>
              <Button
                label="Save as draft"
                color={'#000'}
                onPress={OrderDraft}
                borderWidth={1}
                borderColor={'gray'}
              />
              <Button
                label="Checkout"
                color={'#fff'}
                onPress={CreateOrder}
                backgroundColor={css.secondary}
              />
            </View>
          )}
        </View>
      </BottomSheet>

      {IsLoading && <Loader />}
    </View>
  );
};

export default CreateAgentOrder;

const styles = StyleSheet.create({
  Header: {
    backgroundColor: css.headercolor,
  },
  labelsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: css.primary,
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  label: {
    color: '#fff',
    paddingVertical: 10,
    // marginHorizontal: 10,
  },
  HeaderTxt: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    // paddingBottom: 20,
    paddingLeft: 40,
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  BottomContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    paddingLeft: '8%',
  },
  TopView: {
    flexDirection: 'row',
    padding: 3,
    alignItems: 'center',
  },
  IconView: {
    backgroundColor: '#1f302b',
    padding: 5,
    borderRadius: 30,
    marginRight: 5,
  },
  TopTxt: {
    color: '#fff',
  },
  NestedView: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  nestedTxt: {
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  mainView: {
    padding: 5,
  },
  BottomTxt: {
    color: '#000',
  },
  HeaderSheet: {
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ButtonContainer: {
    // bottom: 0,
    // position: 'absolute',
    // width: '100%',
    // alignSelf: 'center',
    elevation: 1,
    padding: 5,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: '#ededed',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  orderItem: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: css.secondary,
  },
  CalenderView: {
    backgroundColor: '#253755',
    padding: 5,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  fromToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fromTo: {
    width: '35%',
  },
  FromToTxt: {
    color: 'gray',
  },
  FromToBold: {
    color: 'black',
    fontWeight: 'bold',
  },
  Imagecar: {
    position: 'absolute',
    left: 50,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    height: 43,
    width: 220,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  picker: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 0,
    color: '#000',
    width: 190,
  },
  TextInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  input: {
    color: '#000',
    paddingLeft: 5,
    paddingVertical: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  modalButton: {
    // padding: 10,
    // backgroundColor: '#3E4A89',
    // borderRadius: 30,
    // margin: 10,
  },
  modalButtonEnabled: {
    // backgroundColor: '#3E4A89',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalValue: {
    fontSize: 24,
    marginVertical: 20,
    color: '#000',
  },
});
