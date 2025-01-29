/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import {Picker} from '@react-native-picker/picker';
import PackageCard from '../../../../Component/PackageCard/PackageCard';
import AgentHeader from '../../../../Component/CustomHeader/AgentHeader';
import Button from '../../../../Component/CreateNewOrderComponent/Button';
import instance from '../../../../BaseUrl/BaseUrl';
import Loader from '../../../../Component/Loader/Loader';
import css from '../../../../CssFile/Css';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFilter,
  addToCart,
  removeFromCart,
  removeallcart,
} from '../../../../redux/action';
import uuid from 'react-native-uuid';
import {Searchbar, Switch} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import ModalHeader from '../../../../Component/CustomHeader/ModalHeader';

const Packages = ({navigation, route}) => {
  const refRBSheet = useRef();
  const fromSearchRef = useRef(true);
  const [showPicker, setShowPicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [returnTimes, setReturnTimes] = useState(null);
  const [packages, setPackages] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [vehicleType, setVehicleType] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchToQuery, setSearchToQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.reducer);
  const FilterTypes = useSelector(state => state.FilterReducer);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && fromSearchRef.current) {
      fromSearchRef.current.focus();
    }
    if (isFocused && FilterTypes.length === 0) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
    if (!(searchQuery || searchToQuery)) {
      setPackages('');
    }
  }, [FilterTypes.length, isFocused, searchQuery, searchToQuery]);

  useEffect(() => {
    getPackages();
    getVehicleType();
  }, []);

  const getPackages = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/packages');
      // setPackages(response?.data);
      setSearchFilter(response?.data);
    } catch (error) {
      console.log('Package not found', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleType = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/get-vehicle-type');
      // const data = response.data.vehicle_class;
      const data = response.data.data.map(item => item.vehicle_class);
      const formattedOptions = data.map(item => ({
        id: item.id,
        label: item.name,
        value: item.name,
        bags: item.bags_allow,
        seats: item.seats_allow,
      }));
      setVehicleType(formattedOptions);
    } catch (error) {
      console.log('Vehicle Type Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToOrder = () => {
    const newOrder = {
      ...selectedPackage,
      lineid: selectedPackage.id + '-' + uuid.v4(),
      // selectedDate: selectedDate ? selectedDate.toISOString() : null,
      selectedDate: selectedDates[selectedPackage.id]?.selectedDate
        ? selectedDates[selectedPackage.id].selectedDate.toISOString()
        : null,
      linesource: 'new',
    };
    console.log(newOrder, 'ne');
    dispatch(addToCart(newOrder));

    // If returnTimes is selected, create and dispatch the return order
    if (isSwitchOn === true) {
      const returnOrder = {
        ...newOrder,
        lineid: selectedPackage.id + '-' + uuid.v4(),
        // selectedDate: returnTimes ? returnTimes.toISOString() : null,
        selectedDate: selectedDates[selectedPackage.id]?.returnTimes
          ? selectedDates[selectedPackage.id].returnTimes.toISOString()
          : null,
        route: {
          ...newOrder.route,
          from: newOrder.route.to,
          to: newOrder.route.from,
        },
      };

      dispatch(addToCart(returnOrder));
      console.log(returnOrder, 're');
    }

    refRBSheet.current.close();
    setIsSwitchOn(false);

    if (selectedOption === 'Manual Ride') {
      navigation.navigate('CreateAgentOrder', {mode: 'packages'});
    } else {
      Toast.show('Order Added', Toast.SHORT);
      setSelectedDates(prev => ({
        ...prev,
        [selectedPackage.id]: {selectedDate: null, returnTimes: null},
      }));
    }
  };

  // const handleAddToOrder = () => {
  //   const newOrder = {
  //     ...selectedPackage,
  //     lineid: selectedPackage.id + '-' + uuid.v4(),
  //     selectedDate: selectedDate ? selectedDate.toISOString() : null,
  //     linesource: "new"
  //   };
  //   console.log(newOrder,'ord')
  //   dispatch(addToCart(newOrder));
  //   refRBSheet.current.close();
  //   if (selectedOption === 'Manual Ride') {
  //     navigation.navigate('CreateAgentOrder', { mode: 'packages' });
  //   } else {
  //     Toast.show('Order Added', Toast.SHORT);
  //     setSelectedDate(null);
  //   }
  // };

  const handleDateConfirm = date => {
    setSelectedDates(prev => ({
      ...prev,
      [selectedPackage.id]: {...prev[selectedPackage.id], selectedDate: date},
    }));
    setShowPicker(false);
  };

  const handleReturnTimeConfirm = date => {
    setSelectedDates(prev => ({
      ...prev,
      [selectedPackage.id]: {...prev[selectedPackage.id], returnTimes: date},
    }));
    setShowReturnTimePicker(false);
  };

  const applyFilters = (from, to, vehicle) => {
    const filtered = searchFilter.filter(
      pkg =>
        (!from ||
          pkg?.route?.from.toLowerCase().includes(from.toLowerCase())) &&
        (!to || pkg?.route?.to.toLowerCase().includes(to.toLowerCase())) &&
        pkg?.vehicle_class?.name === FilterTypes[0]?.vehicle?.label,
      // (!vehicle || pkg?.vehicle_class?.name === vehicle)
    );
    setPackages(filtered);
  };

  const handleFromSearch = text => {
    setSearchQuery(text);
    applyFilters(text, searchToQuery, selectedVehicle);
  };

  const handleToSearch = text => {
    setSearchToQuery(text);
    applyFilters(searchQuery, text, selectedVehicle);
  };

  const handleSelectPackageType = () => {
    setSelectedOption('Manual Ride');
    setModalVisible(false);
    setSecondModalVisible(true);
    getVehicleType();
  };

  const handleSelectVehicleType = option => {
    const AddFilterToRedux = {
      type: selectedOption,
      vehicle: option,
    };
    dispatch(addFilter(AddFilterToRedux));
    setSelectedVehicle(option);
    setSecondModalVisible(false);
    // const filtered = searchFilter.filter((pkg) =>
    //   (!searchQuery || pkg?.route?.from.toLowerCase().includes(searchQuery.toLowerCase())) &&
    //   (!searchToQuery || pkg?.route?.to.toLowerCase().includes(searchToQuery.toLowerCase())) &&
    //   (!option || pkg?.vehicle_class?.name === option)
    // );
    // setPackages(filtered);
    navigation.navigate('CreateAgentOrder', {mode: 'packages'});
  };

  // const handleReturnTimePress = () => {
  //   setShowReturnTimePicker(true);
  // };

  // const handleReturnTimeConfirm = (time) => {
  //   setReturnTimes((prevTimes) => ({
  //     ...prevTimes,
  //     [selectedPackage.id]: time.toLocaleTimeString(),
  //   }));
  //   setShowReturnTimePicker(false);
  // };

  // const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={css.MainContainer}>
      <AgentHeader onPress={() => navigation.openDrawer()} />

      <View style={styles.filterBar}>
        <Searchbar
          ref={fromSearchRef}
          style={styles.searchBar}
          placeholder="pick-up location"
          value={searchQuery}
          onChangeText={text => handleFromSearch(text)}
          inputStyle={{marginTop: -8}}
        />
        <Searchbar
          style={[styles.searchBar, {marginTop: 5}]}
          placeholder="drop-off location"
          value={searchToQuery}
          onChangeText={text => handleToSearch(text)}
          inputStyle={{marginTop: -8}}
        />
      </View>
      <ScrollView>
        {packages &&
          packages.map(pkg => {
            const isInCart = cartItems.some(item => item.id === pkg.id);
            return (
              <PackageCard
                key={pkg?.id}
                from={pkg?.route?.from}
                to={pkg?.route?.to}
                price={pkg?.price}
                vehicle={pkg?.vehicle_class?.name}
                marginTop={10}
                onPress={() => {
                  setSelectedPackage(pkg);
                  refRBSheet.current.open();
                }}
                backgroundColor={isInCart ? 'lightgray' : 'white'}
              />
            );
          })}
      </ScrollView>

      {cartItems?.length > 0 && (
        <View style={styles.Buttonorder}>
          <Button
            label={`View Order Detail (${cartItems?.length})`}
            backgroundColor={css.secondary}
            color={'#fff'}
            onPress={() => {
              navigation.navigate('CreateAgentOrder', {mode: 'packages'});
            }}
          />
        </View>
      )}

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
            backgroundColor: '#fff',
            width: 50,
            height: 7,
          },
          container: {
            backgroundColor: '#f0f0f0',
            height: '50%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <View>
          {selectedPackage && (
            <>
              <PackageCard
                from={selectedPackage?.route?.from}
                to={selectedPackage?.route?.to}
                price={selectedPackage?.price}
                vehicle={selectedPackage?.vehicle_class?.name}
                backgroundColor={'#fff'}
                returnBG={isSwitchOn === true ? '#5660AB' : 'gray'}
                Toggle={
                  <Switch
                    value={isSwitchOn}
                    onValueChange={() => setIsSwitchOn(prevState => !prevState)}
                    color="#fff"
                    trackColor={{false: 'gray', true: '#5660AB'}}
                  />
                }
              />

              <View style={styles.BottomContainer}>
                <Text style={styles.Txt}>Add your date and pick-up time</Text>

                <TouchableOpacity
                  style={styles.dateView}
                  onPress={() => setShowPicker(true)}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    color={css.secondary}
                    size={25}
                  />
                  <Text style={styles.dateTxt}>
                    {/* {selectedDate ? selectedDate.toString() : 'Select date and time'} */}
                    {selectedDates[selectedPackage?.id]?.selectedDate
                      ? selectedDates[
                          selectedPackage?.id
                        ].selectedDate.toLocaleString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {isSwitchOn && (
                  <TouchableOpacity
                    style={styles.dateView}
                    onPress={() => setShowReturnTimePicker(true)}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      color={css.secondary}
                      size={25}
                    />
                    <Text style={styles.dateTxt}>
                      {/* {returnTimes[selectedPackage.id]} */}
                      {/* {returnTimes ? returnTimes.toString() : 'Selected return date and time'} */}
                      {selectedDates[selectedPackage?.id]?.returnTimes
                        ? selectedDates[
                            selectedPackage?.id
                          ].returnTimes.toLocaleString()
                        : 'Select Return Time'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.Buttonstyle}>
                <Button
                  label="Add to order"
                  color={'#fff'}
                  backgroundColor={
                    !selectedDates[selectedPackage?.id]?.selectedDate
                      ? css.secondary
                      : 'gray'
                  }
                  onPress={handleAddToOrder}
                  disabled={!selectedDate}
                />
                {/* <Button
                label='Remove from order'
                color={'#fff'}
                backgroundColor={'red'}
                onPress={handleRemoveFromOrder}
              /> */}
              </View>
            </>
          )}
        </View>
        {/* <View style={{ height: 20 }}></View> */}
      </RBSheet>

      <DateTimePickerModal
        isVisible={showPicker}
        mode="datetime"
        minimumDate={new Date()}
        // onConfirm={(date) => {
        //   setSelectedDate(date);
        //   setShowPicker(false);
        // }}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowPicker(false)}
      />

      <DateTimePickerModal
        isVisible={showReturnTimePicker}
        mode="datetime"
        minimumDate={new Date()}
        // onConfirm={(date) => {
        //   setReturnTimes(date);
        //   setShowReturnTimePicker(false);
        // }}
        onConfirm={handleReturnTimeConfirm}
        onCancel={() => setShowPicker(false)}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalHeader />
            <View style={styles.ModalInsideContiner}>
              <Text style={styles.modalTitle}>Select Ride Type</Text>
              <Text style={styles.shortTitle}>
                Choose between the manual or package options. With manual option
                you can select locations from the list. Packages are predefined
                destinations
              </Text>

              <View style={styles.ButtonView}>
                <Button
                  backgroundColor={css.primary}
                  label={'Manual Ride'}
                  color={'#fff'}
                  onPress={handleSelectPackageType}
                />
                <Button
                  backgroundColor={css.primary}
                  label={'Packages'}
                  color={'#fff'}
                  marginTop={10}
                  onPress={() =>
                    Alert.alert('Update', 'Packages are coming soon ')
                  }
                />
              </View>
              {/* <RadioButton.Group
                onValueChange={newValue => setSelectedOption(newValue)}
                value={selectedOption}
              >
                <RadioButton.Item label="Single Ride" value="Single Ride" />
                <RadioButton.Item label="Packages" value="Packages" />
              </RadioButton.Group>
              <Button
                label="OK"
                color={'#000'}
                onPress={handleSelectPackageType}
              /> */}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => setSecondModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ModalHeader />
            <View style={styles.ModalInsideContiner}>
              <Text style={styles.modalTitle}>Select Vehicle Type</Text>
              <Text style={styles.shortTitle}>
                Select the vehicle type of your choice. Our all vehicles are
                comfortable and cozy
              </Text>

              <View style={styles.ButtonView}>
                {vehicleType.map(option => {
                  // console.log(option,'mm')
                  const id = option.id;
                  return (
                    <Button
                      key={id}
                      backgroundColor={css.primary}
                      label={option.value}
                      color={'#fff'}
                      marginTop={10}
                      onPress={() => handleSelectVehicleType(option)}
                    />
                  );
                })}
              </View>
              {/* <RadioButton.Group
                onValueChange={newValue => handleSelectVehicleType(newValue)}
                value={selectedVehicle}
              >
                {vehicleType.map(option => (
                  <RadioButton.Item key={option.id} label={option.label} value={option.value} />
                ))}
              </RadioButton.Group>
              <Button
                title="OK"
                color={'#000'}
                onPress={() => setSecondModalVisible(false)}
              /> */}
            </View>
          </View>
        </View>
      </Modal>

      {IsLoading && <Loader />}
    </View>
  );
};

export default Packages;

const styles = StyleSheet.create({
  BottomContainer: {
    width: '87%',
    alignSelf: 'center',
    marginTop: 15,
  },
  Txt: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dateView: {
    backgroundColor: '#E5F0FF',
    marginTop: 10,
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: css.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTxt: {
    marginLeft: 15,
    color: 'gray',
  },
  Buttonstyle: {
    alignSelf: 'center',
    marginTop: 10,
  },
  Buttonorder: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    width: '85%',
  },
  filterBar: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#d6d6d6',
    // alignSelf: 'center',
    position: 'static',
    borderRadius: 5,
    height: 40,
  },
  filterIcon: {
    alignItems: 'center',
    backgroundColor: '#d6d6d6',
    borderRadius: 5,
    padding: 5,
    height: 40,
  },
  picker: {
    width: 55,
    color: '#000',
    marginTop: -10,
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
    // width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    // alignItems: 'center',
  },
  ModalInsideContiner: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 50,
  },
  shortTitle: {
    fontSize: 14,
    marginTop: 10,
    color: 'gray',
    marginTop: 20,
  },
  ButtonView: {
    marginTop: '20%',
  },
});
