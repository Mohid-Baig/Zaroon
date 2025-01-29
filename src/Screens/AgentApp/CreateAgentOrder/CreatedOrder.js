/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import css from '../../../CssFile/Css';
import CreateOrderHeader from '../../../Component/CustomHeader/CreateOrderHeader';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import CustomPicker from '../../../Component/TextInputComponent/CustomPicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Button from '../../../Component/CreateNewOrderComponent/Button';
import AddTripButton from '../../../Component/TextInputComponent/AddTripButton';
import CardsView from '../../../Component/TextInputComponent/CardsView';
import TravelLabel from '../../../Component/TextInputComponent/TravelLabel';
import FromToCards from '../../../Component/TextInputComponent/FromToCards';
import CustomModal from '../../../Component/ModalComponent/CustomModal';
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment';
import FlightTextField from '../../../Component/TextInputComponent/FlightTextField';
import {Picker} from '@react-native-picker/picker';
import AirLineTextField from '../../../Component/TextInputComponent/AirLineTextField';
import TextInputField from '../../../Component/CreateNewOrderComponent/TextInputField';
import TextInputComponent from '../../../Component/TextInputComponent/TextInputComponent';
import Toast from 'react-native-simple-toast';
import ImagePickerComp from './ImagePickerComp';

const CreatedOrder = ({navigation, route}) => {
  const {order} = route?.params || {};
  const multiSelectRef = useRef(null);

  const [draftOrder, setDraftOrder] = useState(order);
  const [vehicleType, setVehicleType] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [seats, setSeats] = useState('');
  const [bags, setBags] = useState('');
  const [tripList, setTripList] = useState([]);
  const [showTripFields, setShowTripFields] = useState(false);
  const [otherFields, setOtherFields] = useState(false);
  const [from, setFrom] = useState([]);
  const [to, setTo] = useState([]);
  const [flightNo, setFlightNo] = useState('');
  const [airLinename, setAirLineName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);
  const [price, setPrice] = useState('');
  const [fromSearch, setFromSearch] = useState([]);
  const [toSearch, setToSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [CustomerName, setCustomerName] = useState('');
  const [whatsAppNo, setWhatsAppNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [showAddTrip, setShowAddTrip] = useState(false);

  const [fromModal, setFromModal] = useState(false);
  const [toModal, setToModal] = useState(false);
  const [isFlight, setIsFlight] = useState(false);

  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+92');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState('');

  const [countryCodesPhone, setCountryCodesPhone] = useState([]);
  const [selectedCodePhone, setSelectedCodePhone] = useState('+92');
  const [modalVisiblePhone, setModalVisiblePhone] = useState(false);
  const [countryCodeSearchPhone, setCountryCodeSearchPhone] = useState('');

  const [selectedTripIndex, setSelectedTripIndex] = useState(null);

  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [luggageCount, setLuggageCount] = useState(0);

  const [adultField, setAddultField] = useState('');
  const [childField, setChildField] = useState('');
  const [luggageField, setLuggageField] = useState('');

  //umarshakoor code for adding image picker or capure through camera first getting permssion for camera and gallery and creating state for them and adding them in payload also when they captured in their respective field i want show little preview with in form field may be when they click they can zoom and option to select from gallery
  const [cnicImage, setCnicImage] = useState(null);
  const [passportImage, setPassportImage] = useState(null);
  const [ticketImage, setTicketImage] = useState(null);
  console.log('create order screen cnic image picker', cnicImage);
  //-----------------------------------------

  useEffect(() => {
    if (draftOrder) {
      console.log(JSON.stringify(draftOrder), 'dras');
      const tripData = draftOrder?.order_details?.map(item => {
        return {
          // from: item?.rate_list?.route?.from || '',
          // to: item?.rate_list?.route?.to || '',
          from: item?.from_loc || '',
          to: item?.to_loc || '',
          price: item?.rate_list?.price || '',
          flightNo: item?.flight_num || '',
          airLine: item?.airline_name || '',
          dateTime: `${item?.date} ${item?.pickup_time}` || '',
          rateListId: item?.rate_list.id || '',
        };
      });
      // console.log(draftOrder?.vehicle_class_id,  draftOrder?.vehicle_model_id,'idss')
      setSelectedVehicle({
        id: draftOrder?.vehicle_class_id,
        modalid: draftOrder?.vehicle_model_id,
      });
      setCustomerName(draftOrder?.partner_customer?.name);
      setWhatsAppNo(draftOrder?.partner_customer?.whatsapp_no);
      setSelectedCode(draftOrder?.partner_customer?.prefix_whatsapp);
      setSelectedCodePhone(draftOrder?.partner_customer?.prefix_phone);
      setPhoneNo(draftOrder?.partner_customer?.phone_no);
      setPassportNo(draftOrder?.partner_customer?.passport);
      setCnic(draftOrder?.partner_customer?.cnic);
      setEmail(draftOrder?.partner_customer?.email);
      setAddress(draftOrder?.partner_customer?.address1);
      setCountry(draftOrder?.partner_customer?.country);
      setCity(draftOrder?.partner_customer?.city);
      setTripList(tripData);
      setAddultField(draftOrder?.overall_adult);
      setChildField(draftOrder?.overall_child);
      setLuggageField(draftOrder?.overall_bags);
    }
    // console.log(JSON.stringify(draftOrder),'draf')
  }, [draftOrder]);

  useEffect(() => {
    getVehicleType();
    getFroms();
    getCountryApi();
    getCountryPrefix();
  }, []);

  const getCountryPrefix = async () => {
    try {
      const response = await instance.get('/fetch/phonecode');
      setCountryCodes(response?.data?.phonecode);
      setCountryCodesPhone(response?.data?.phonecode);
    } catch (error) {
      console.log('Country Prefix', error);
    }
  };
  const filteredCountryCodes = countryCodes.filter(
    item =>
      item?.nicename.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      item?.phonecode.toString().includes(countryCodeSearch),
  );
  const filteredCountryCodesPhone = countryCodesPhone?.filter(
    item =>
      item?.nicename
        .toLowerCase()
        .includes(countryCodeSearchPhone.toLowerCase()) ||
      item?.phonecode.toString().includes(countryCodeSearchPhone),
  );

  const getVehicleType = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/get-vehicle-type');
      // console.log(JSON.stringify(response.data.data),'aaa')
      // const data = response?.data?.data;
      const data = response?.data?.data?.map(item => ({
        name: item?.model?.name,
        id: item?.vehicle_class?.id,
        modalid: item?.model?.id,
        seats: item?.vehicle_class?.seats_allow,
        bags: item?.vehicle_class?.bags_allow,
      }));
      setVehicleType(data);
    } catch (error) {
      console.log('Vehicle Type Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFroms = async () => {
    try {
      const response = await instance.get('/routes/from');
      const formattedData = response.data.map(item => ({
        id: item,
        name: item,
      }));
      console.log('create order', formattedData);
      setFromSearch(formattedData);
    } catch (error) {
      console.log('Froms', error);
    }
  };

  const getTo = async fromLocation => {
    try {
      const response = await instance.get(`/routes/to?from=${fromLocation}`);
      const formattedTo = response.data.map(item => ({
        id: item,
        name: item,
      }));
      setToSearch(formattedTo);
    } catch (error) {
      console.log('Tos', error);
    }
  };

  const getPrise = async toLocation => {
    const vehicleId = selectedVehicle?.id;
    try {
      const response = await instance.get(
        `/routes/rates?from=${from}&to=${toLocation}&vehicle_class_id=${vehicleId}`,
      );
      // console.log(response?.data,'sss ... ')
      setPrice(response?.data[0]);
      const isFlight = response?.data[0]?.route?.is_flight === 1;
      setIsFlight(isFlight);
    } catch (error) {
      console.log('Tos', error);
    }
  };

  const onSelectedItemsChange = selectedItems => {
    setFrom(Array.isArray(selectedItems) ? selectedItems : []);
    getTo(selectedItems);
    setFromModal(false);
  };

  const onSelectedToChange = selectedItems => {
    setTo(Array.isArray(selectedItems) ? selectedItems : []);
    getPrise(selectedItems);
    setToModal(false);
  };

  const getCountryApi = async () => {
    try {
      const response = await instance.get('/fetch-country');
      setCountries(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getCityApi = async selectedCountry => {
    try {
      const response = await instance.get(`/fetch-city/${selectedCountry}`);
      setCities(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const handleCountryChange = selectedCountry => {
    setCountry(selectedCountry);
    getCityApi(selectedCountry);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const handleConfirm = date => {
    const Dateee = moment(date).format('YYYY-MM-DD HH:mm:ss');
    setDateTime(Dateee);
    hideDateTimePicker();
  };

  const handleAddTrip = async () => {
    try {
      const newTrip = {
        from,
        to,
        dateTime,
        price: price?.price,
        rateListId: price?.id,
        flightNo: isFlight ? flightNo : '',
        airLine: isFlight ? airLinename : '',
      };

      if (selectedTripIndex !== null) {
        const updatedTripList = [...tripList];
        updatedTripList[selectedTripIndex] = newTrip;
        setTripList(updatedTripList);
        setSelectedTripIndex(null);
      } else {
        setTripList([...tripList, newTrip]);
      }

      setShowTripFields(false);
      setFrom('');
      setTo('');
      setFlightNo('');
      setAirLineName('');
      setDateTime('');
      setIsFlight(false);
    } catch (error) {
      console.log('Price', error);
    }
  };

  const handleEditTrip = async index => {
    const trip = tripList[index];
    if (trip.flightNo) {
      setIsFlight(true);
    } else {
      setIsFlight(false);
    }
    setFrom(trip.from);
    setTo(trip.to);
    setFlightNo(trip.flightNo);
    setAirLineName(trip.airLine);
    setDateTime(trip.dateTime);
    setShowTripFields(true);
    await handleRemoveTrip(index);
  };

  const handleRemoveTrip = index => {
    const updatedTripList = [...tripList];
    updatedTripList.splice(index, 1);
    setTripList(updatedTripList);
  };

  const calculateTotalPrice = () => {
    return tripList
      .reduce((total, trip) => total + parseFloat(trip.price || 0), 0)
      .toFixed(2);
  };

  useEffect(() => {
    // console.log(selectedVehicle,'vehiccccccc')
    if (selectedVehicle) {
      setVehicleOpen(true);
    }
    if (CustomerName && whatsAppNo) {
      setShowAddTrip(true);
    }
  }, [selectedVehicle, CustomerName, whatsAppNo, tripList]);

  useEffect(() => {
    if (fromModal || (toModal && multiSelectRef.current)) {
      multiSelectRef.current._toggleSelector();
    }
  }, [fromModal, toModal]);

  useEffect(() => {
    if (selectedVehicle) {
      const selected = vehicleType?.find(
        vehicle => vehicle?.id === parseInt(selectedVehicle?.id),
      );
      // console.log(selected,'selected')
      if (selected) {
        setSeats(selected?.seats);
        setBags(selected?.bags);
      }
    }
  }, [selectedVehicle, vehicleType]);

  const handleDraftCreated = async status => {
    if (status === 'pending') {
      if (
        !CustomerName ||
        !whatsAppNo ||
        !selectedVehicle ||
        tripList.lengt > 0
      ) {
        Alert.alert(
          'Validation failed',
          'Please ensure all required fields are filled.',
        );
        return;
      }
    }
    const rateListIds = tripList.map(trip => trip.rateListId);
    const priceList = tripList.map(trip => trip.price);
    const flightNum = tripList.map(trip => trip.flightNo);
    const airLineName = tripList.map(trip => trip.airLine);
    const DateTime = tripList.map(trip => trip.dateTime);
    const dates = DateTime.map(dateTime =>
      moment(dateTime).format('YYYY-MM-DD'),
    );
    const times = DateTime.map(dateTime => moment(dateTime).format('HH:mm:ss'));
    const repeatedIsAC = Array(tripList.length).fill(1);
    const maxSeats = Array(tripList.length).fill(adultField);
    const maxChilds = Array(tripList.length).fill(childField);
    const maxBags = Array(tripList.length).fill(luggageField);

    const formData = new FormData();
    formData.append('name', CustomerName);
    console.log('create order form data', formData);

    const payload = {
      name: CustomerName,
      prefix_whatsapp: selectedCode.replace('+', ''),
      prefix_phone: selectedCodePhone.replace('+', ''),
      whatsapp_no: whatsAppNo,
      phone_no: phoneNo,
      passport: passportNo,
      cnic: cnic,
      email: email,
      address1: address,
      country: country,
      city: city,
      overall_adult: adultField,
      overall_child: childField,
      overall_bags: luggageField,
      trip_type: 'Single trip',
      rate_list_id: rateListIds,
      flight_num: flightNum,
      airline_name: airLineName,
      rate: priceList,
      vehicle_class_id: selectedVehicle?.id,
      vehicle_model_id: selectedVehicle?.modalid,
      overall_status: status,
      adult: maxSeats,
      child: maxChilds,
      bags: maxBags,
      booking_amount: calculateTotalPrice(),
      final_amount: calculateTotalPrice(),
      date: dates,
      pickup_time: times,
      is_ac: repeatedIsAC,
    };
    console.log(payload, 'pay');
    try {
      setIsLoading(true);
      const response = await instance.post('/create-order', payload);
      if (response?.data?.message) {
        Toast.show('Successfully created', Toast.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Order creation failed', error);

      let errorMessage =
        'Something went wrong while creating your order. Please try again later.';

      if (error.response && error.response.status === 400) {
        errorMessage =
          'It seems there was an issue with the information provided. Please check your details and try again.';
      } else if (error.response && error.response.status === 500) {
        errorMessage =
          "We're currently experiencing issues on our end. Please try again later.";
      } else if (error.message === 'Network Error') {
        errorMessage =
          'It seems you are offline. Please check your internet connection and try again.';
      }

      Alert.alert('Order Creation Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftUpdated = async status => {
    const rateListIds = tripList.map(trip => trip.rateListId);
    const priceList = tripList.map(trip => trip.price);
    const flightNum = tripList.map(trip => trip.flightNo);
    const airLineName = tripList.map(trip => trip.airLine);
    const repeatedIsAC = Array(tripList.length).fill(1);
    const maxSeats = Array(tripList.length).fill(adultField);
    const maxBags = Array(tripList.length).fill(luggageField);
    const maxChilds = Array(tripList.length).fill(childField);
    const DateTime = tripList.map(trip => trip.dateTime);
    const dates = DateTime.map(dateTime =>
      moment(dateTime).format('YYYY-MM-DD'),
    );
    const times = DateTime.map(dateTime => moment(dateTime).format('HH:mm:ss'));
    const orderid = draftOrder?.id;
    const orderNo = draftOrder?.order_no;
    const partnerId = draftOrder?.customer_partner_id;
    console.log(orderid);
    const payload = {
      order_no: orderNo,
      name: CustomerName,
      prefix_whatsapp: selectedCode.replace('+', ''),
      prefix_phone: selectedCodePhone.replace('+', ''),
      whatsapp_no: whatsAppNo,
      phone_no: phoneNo,
      passport: passportNo,
      cnic: cnic,
      email: email,
      address1: address,
      country: country,
      city: city,
      overall_adult: adultField,
      overall_child: childField,
      overall_bags: luggageField,
      trip_type: 'Single trip',
      rate_list_id: rateListIds,
      flight_num: flightNum,
      airline_name: airLineName,
      rate: priceList,
      vehicle_class_id: selectedVehicle?.id,
      vehicle_model_id: selectedVehicle?.modalid,
      overall_status: status,
      adult: maxSeats,
      child: maxChilds,
      bags: maxBags,
      booking_amount: calculateTotalPrice(),
      final_amount: calculateTotalPrice(),
      date: dates,
      pickup_time: times,
      is_ac: repeatedIsAC,
      customer_partner_id: partnerId,
    };
    console.log(payload, 'oo');
    try {
      setIsLoading(true);
      const response = await instance.post(`/update-order/${orderid}`, payload);
      if (response?.data?.message) {
        Toast.show('Successfully Updated', Toast.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Order creation failed', error);

      let errorMessage =
        'Something went wrong while creating your order. Please try again later.';

      if (error.response && error.response.status === 400) {
        errorMessage =
          'It seems there was an issue with the information provided. Please check your details and try again.';
      } else if (error.response && error.response.status === 500) {
        errorMessage =
          "We're currently experiencing issues on our end. Please try again later.";
      } else if (error.message === 'Network Error') {
        errorMessage =
          'It seems you are offline. Please check your internet connection and try again.';
      }

      Alert.alert('Order Creation Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const GoBackNavigation = () => {
    if (selectedVehicle) {
      Alert.alert('Unsaved Changes', 'Save as Draft', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'No',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: 'Yes, Go Back',
          onPress: () => {
            if (draftOrder) {
              console.log('draft');
              handleDraftUpdated('draft');
            } else {
              console.log('create');
              handleDraftCreated('draft');
            }

            navigation.goBack();
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        GoBackNavigation();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [selectedVehicle]);

  const addAdult = () => setAdultCount(adultCount + 1);
  const subAdult = () => {
    if (adultCount > 0) setAdultCount(adultCount - 1);
  };

  const addChild = () => setChildCount(childCount + 1);
  const subChild = () => {
    if (childCount > 0) setChildCount(childCount - 1);
  };

  const addLuggage = () => setLuggageCount(luggageCount + 1);
  const subLuggage = () => {
    if (luggageCount > 0) setLuggageCount(luggageCount - 1);
  };
  const scrollViewRef = useRef(null);
  return (
    <View style={styles.MainContainer}>
      <CreateOrderHeader onPress={GoBackNavigation} />

      <ScrollView
        style={[tripList?.length > 0 && {marginBottom: 100}, {padding: 5}]}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: true});
          }
        }}>
        <CustomPicker
          selectedValue={selectedVehicle}
          onValueChange={setSelectedVehicle}
          label="Select Vehicle Type"
          items={vehicleType}
        />
        {vehicleOpen && (
          <View>
            <Text style={styles.TopHeaderTxt}>Maximum Limit</Text>
            <TravelLabel seats={seats} Bags={bags} />

            <View
              style={{
                flexDirection: 'row',
                width: '95%',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
                height: 40,
              }}>
              <TextInput
                mode="outlined"
                style={{backgroundColor: '#fff', width: '30%', height: 40}}
                outlineStyle={{borderRadius: 10}}
                activeOutlineColor={css.secondary}
                label="Luggages"
                value={luggageField}
                onChangeText={setLuggageField}
                inputMode="numeric"
              />
              <TextInput
                mode="outlined"
                style={{backgroundColor: '#fff', width: '30%', height: 40}}
                outlineStyle={{borderRadius: 10}}
                activeOutlineColor={css.secondary}
                label="Childs"
                value={childField}
                onChangeText={setChildField}
                inputMode="numeric"
              />
              <TextInput
                mode="outlined"
                style={{backgroundColor: '#fff', width: '30%', height: 40}}
                outlineStyle={{borderRadius: 10}}
                activeOutlineColor={css.secondary}
                label="Adults"
                value={adultField}
                onChangeText={setAddultField}
                inputMode="numeric"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.TopHeaderTxt}>Customer Details</Text>
              <TouchableOpacity
                style={styles.AddTripBtn}
                onPress={() => setOtherFields(prevState => !prevState)}>
                <AntDesign name="plus" color={'#fff'} size={18} />
                <Text style={{color: '#fff', paddingLeft: 2}}>Add More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.TextFieldsView}>
              <TextInput
                style={{backgroundColor: '#fff'}}
                label="Enter Customer Name"
                mode="outlined"
                outlineStyle={{borderRadius: 10}}
                activeOutlineColor={css.secondary}
                value={CustomerName}
                onChangeText={CustomerName => setCustomerName(CustomerName)}
              />

              <View style={styles.WhatsAppContainer}>
                <TouchableOpacity
                  style={styles.PrefixView}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.selectedCodeText}>{selectedCode}</Text>
                </TouchableOpacity>
                <View style={styles.whatsAppInner}>
                  <TextInput
                    style={{backgroundColor: '#fff'}}
                    label="Enter WhatsApp No#"
                    mode="outlined"
                    outlineStyle={{borderRadius: 10}}
                    activeOutlineColor={css.secondary}
                    value={whatsAppNo}
                    onChangeText={whatsAppNo => setWhatsAppNo(whatsAppNo)}
                    inputMode="numeric"
                  />
                </View>
              </View>
              {otherFields && (
                <View>
                  <Text style={styles.ExtraFields}>Optional*</Text>

                  <View style={styles.WhatsAppContainer}>
                    <TouchableOpacity
                      style={styles.PrefixView}
                      onPress={() => setModalVisiblePhone(true)}>
                      <Text style={styles.selectedCodeText}>
                        {selectedCodePhone}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.whatsAppInner}>
                      <TextInput
                        style={{backgroundColor: '#fff'}}
                        label="Enter Phone No#"
                        mode="outlined"
                        outlineStyle={{borderRadius: 10}}
                        activeOutlineColor={css.secondary}
                        value={phoneNo}
                        onChangeText={phoneNo => setPhoneNo(phoneNo)}
                        inputMode="numeric"
                      />
                    </View>
                  </View>

                  <TextInput
                    style={{backgroundColor: '#fff'}}
                    label="Enter Passport No#"
                    mode="outlined"
                    outlineStyle={{borderRadius: 10}}
                    activeOutlineColor={css.secondary}
                    value={passportNo}
                    onChangeText={passportNo => setPassportNo(passportNo)}
                  />
                  <View>
                    <ImagePickerComp
                      label="Passport Image"
                      image={passportImage}
                      setImage={setPassportImage}
                    />
                  </View>
                  <TextInput
                    style={{backgroundColor: '#fff'}}
                    label="Enter Cnic No#"
                    mode="outlined"
                    outlineStyle={{borderRadius: 10}}
                    activeOutlineColor={css.secondary}
                    value={cnic}
                    onChangeText={cnic => setCnic(cnic)}
                    inputMode="numeric"
                  />
                  <View>
                    <ImagePickerComp
                      label="CNIC Image"
                      image={cnicImage}
                      setImage={setCnicImage}
                    />
                  </View>
                  <TextInput
                    style={{backgroundColor: '#fff'}}
                    label="Enter Email"
                    mode="outlined"
                    outlineStyle={{borderRadius: 10}}
                    activeOutlineColor={css.secondary}
                    value={email}
                    onChangeText={email => setEmail(email)}
                  />
                  <TextInput
                    style={{backgroundColor: '#fff'}}
                    label="Enter Address"
                    mode="outlined"
                    outlineStyle={{borderRadius: 10}}
                    activeOutlineColor={css.secondary}
                    value={address}
                    onChangeText={address => setAddress(address)}
                  />

                  <TouchableOpacity style={styles.CountryView}>
                    <Picker
                      selectedValue={country}
                      onValueChange={itemValue =>
                        handleCountryChange(itemValue)
                      }
                      style={styles.picker}
                      dropdownIconColor={'gray'}>
                      <Picker.Item
                        label="Select Country"
                        value={null}
                        color="gray"
                      />
                      {countries.map((country, index) => (
                        <Picker.Item
                          key={index}
                          label={country}
                          value={country}
                        />
                      ))}
                    </Picker>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.CountryView}>
                    <Picker
                      selectedValue={city}
                      onValueChange={itemValue => setCity(itemValue)}
                      style={styles.picker}
                      dropdownIconColor={'gray'}
                      enabled={!!country}>
                      <Picker.Item
                        label={city ? city : 'Select City after Country'}
                        value={null}
                        color="gray"
                      />
                      {cities.map((city, index) => (
                        <Picker.Item key={index} label={city} value={city} />
                      ))}
                    </Picker>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {showAddTrip && (
              <View>
                <TouchableOpacity
                  style={styles.AddTripBtn}
                  onPress={() => setShowTripFields(prevState => !prevState)}>
                  <AntDesign name="plus" color={'#fff'} size={18} />
                  <Text style={{color: '#fff', paddingLeft: 2}}>Add Trip</Text>
                </TouchableOpacity>
                <View style={styles.RouteView}>
                  {showTripFields && (
                    <View style={styles.InputFields}>
                      <FromToCards
                        Txt={from.length > 0 ? from[0] : 'Search From'}
                        icon={
                          <Ionicons
                            name="location-outline"
                            color={css.secondary}
                            size={20}
                          />
                        }
                        onPress={() => setFromModal(true)}
                      />
                      <FromToCards
                        Txt={to.length > 0 ? to[0] : 'Search From'}
                        icon={
                          <Ionicons
                            name="location-outline"
                            color={css.secondary}
                            size={20}
                          />
                        }
                        onPress={() => setToModal(true)}
                      />
                      {isFlight && (
                        <>
                          <FlightTextField
                            value={flightNo}
                            onChangeText={setFlightNo}
                          />
                          <ImagePickerComp
                            label="Ticket Image"
                            image={ticketImage}
                            setImage={setTicketImage}
                          />
                          <AirLineTextField
                            value={airLinename}
                            onChangeText={setAirLineName}
                          />
                        </>
                      )}
                      <FromToCards
                        Txt={dateTime ? dateTime : 'Search date'}
                        icon={
                          <Ionicons
                            name="calendar-outline"
                            color={css.secondary}
                            size={20}
                          />
                        }
                        onPress={showDateTimePicker}
                      />
                      {from && to && dateTime && (
                        <AddTripButton onPress={handleAddTrip} />
                      )}
                    </View>
                  )}
                </View>

                <View style={{paddingVertical: 10}}>
                  {tripList.map((item, index) => (
                    <CardsView
                      key={index.toString()}
                      item={item}
                      onPress={() => handleRemoveTrip(index)}
                      onCardPress={() => handleEditTrip(index)}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {tripList && tripList?.length > 0 && (
        <View style={styles.ButtonContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <Text style={[styles.TotalTxt, {color: 'gray', fontSize: 14}]}>
              Total Price:
            </Text>
            <Text
              style={[styles.TotalTxt, {fontWeight: 'bold', paddingLeft: -6}]}>
              {calculateTotalPrice()}
            </Text>
          </View>
          {draftOrder ? (
            <View style={styles.BtnView}>
              <Button
                onPress={() => handleDraftUpdated('draft')}
                label="Save as draft"
                color={'#000'}
                borderWidth={1}
                borderColor={'gray'}
              />
              <Button
                onPress={() => handleDraftUpdated('pending')}
                label="Checkout"
                color={'#fff'}
                backgroundColor={css.secondary}
              />
            </View>
          ) : (
            <View style={styles.BtnView}>
              <Button
                onPress={() => handleDraftCreated('draft')}
                label="Save as draft"
                color={'#000'}
                borderWidth={1}
                borderColor={'gray'}
              />
              <Button
                onPress={() => handleDraftCreated('pending')}
                label="Checkout"
                color={'#fff'}
                backgroundColor={css.secondary}
              />
            </View>
          )}
        </View>
      )}

      {isLoading && <Loader />}

      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        minimumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDateTimePicker}
      />

      <CustomModal
        isVisible={fromModal}
        onClose={() => setFromModal(false)}
        children={
          <View style={{}}>
            <MultiSelect
              ref={multiSelectRef}
              hideTags
              items={fromSearch}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedItemsChange}
              single={true}
              selectedItems={from}
              selectText="Pick Items"
              searchInputPlaceholderText="Search From"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              hideSubmitButton
              hideDropdown={false}
              itemFontSize={16}
              styleRowList={{
                marginTop: 10,
                backgroundColor: '#eeeeee',
                paddingVertical: 5,
                borderRadius: 3,
              }}
            />
          </View>
        }
      />

      <CustomModal
        isVisible={toModal}
        onClose={() => setToModal(false)}
        children={
          <View style={{}}>
            <MultiSelect
              ref={multiSelectRef}
              hideTags
              items={toSearch}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedToChange}
              single={true}
              selectedItems={from}
              selectText="Pick Items"
              searchInputPlaceholderText="Search From"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              hideSubmitButton
              hideDropdown={true}
              itemFontSize={16}
              styleRowList={{
                marginTop: 10,
                backgroundColor: '#eeeeee',
                paddingVertical: 5,
                borderRadius: 3,
              }}
            />
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.CenterView}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by code or name"
                  placeholderTextColor={'gray'}
                  value={countryCodeSearch}
                  onChangeText={setCountryCodeSearch}
                />
                <FlatList
                  data={filteredCountryCodes}
                  keyExtractor={(item, index) =>
                    item?.id?.toString() || index.toString()
                  }
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedCode(`+${item.phonecode}`);
                        setModalVisible(false);
                      }}>
                      <Text
                        style={
                          styles.CountryTxt
                        }>{`+${item.phonecode} (${item.nicename})`}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisiblePhone}
        onRequestClose={() => setModalVisiblePhone(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisiblePhone(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.CenterView}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by code or name"
                  placeholderTextColor={'gray'}
                  value={countryCodeSearchPhone}
                  onChangeText={setCountryCodeSearchPhone}
                />
                <FlatList
                  data={filteredCountryCodesPhone}
                  keyExtractor={(item, index) =>
                    item?.id?.toString() || index.toString()
                  }
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedCodePhone(`+${item.phonecode}`);
                        setModalVisiblePhone(false);
                      }}>
                      <Text
                        style={
                          styles.CountryTxt
                        }>{`+${item.phonecode} (${item.nicename})`}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CreatedOrder;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TextInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
    marginTop: 5,
  },
  RouteView: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  TopHeaderTxt: {
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  TextFieldsView: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  AddTripBtn: {
    backgroundColor: css.primary,
    alignSelf: 'flex-end',
    padding: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 10,
  },
  InputFields: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  TextInput: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  suggestionsContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#eeeeee',
  },
  suggestionItem: {
    paddingVertical: 7,
    paddingLeft: 20,
    color: '#000',
    fontSize: 16,
  },
  ButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 1,
    height: 100,
    justifyContent: 'center',
  },
  itemText: {
    backgroundColor: 'red',
    paddingVertical: 20,
  },
  TotalTxt: {
    color: css.secondary,
    padding: 5,
    fontSize: 16,
  },
  BtnView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 5,
  },
  ExtraFields: {
    marginTop: 5,
    alignSelf: 'flex-end',
    color: 'red',
  },
  CountryView: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  picker: {
    color: '#000',
  },
  WhatsAppContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  whatsAppInner: {
    width: '78%',
  },
  PrefixView: {
    width: '20%',
    height: 50,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    padding: 5,
  },
  selectedCodeText: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalItem: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  CenterView: {
    height: '95%',
    width: '70%',
  },
  CountryTxt: {
    color: '#000',
    textAlign: 'left',
  },
  searchInput: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: 'gray',
  },
});
