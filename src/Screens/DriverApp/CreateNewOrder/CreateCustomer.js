import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextInputField from '../../../Component/CreateNewOrderComponent/TextInputField';
import Button from '../../../Component/CreateNewOrderComponent/Button';
import css from '../../../CssFile/Css';
import CustomHeader from '../../../Component/CustomHeader/CustomHeader';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';

const CreateCustomer = ({navigation, route}) => {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [price, setPrice] = useState('');
  const [rateListId, setRateListId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fromto, setfromto] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [froms, setFroms] = useState([]);
  const [to, setTo] = useState([]);
  const [vehicleId, setVehicleId] = useState([]);

  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+92');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState('');

  const [countryCodesPhone, setCountryCodesPhone] = useState([]);
  const [selectedCodePhone, setSelectedCodePhone] = useState('+92');
  const [modalVisiblePhone, setModalVisiblePhone] = useState(false);
  const [countryCodeSearchPhone, setCountryCodeSearchPhone] = useState('');

  useEffect(() => {
    if (partnerId) {
      createOrder();
    }
  }, [partnerId]);

  const postApiCall = async () => {
    const payload = {
      name: fullName,
      actor_id: '8',
      // 'cnic': cnic,
      phone_no: phoneNo,
      whatsapp_no: whatsappNo,
      prefix_whatsapp: selectedCode.replace('+', ''),
      prefix_phone: selectedCodePhone.replace('+', ''),
      // 'passport': passportNo,
    };
    // console.log(payload, 'oooo')
    try {
      setIsLoading(true);
      const response = await instance.post('/driver-create-customer', payload);
      if (response?.data?.data?.id) {
        setPartnerId(response.data.data.id);
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

  const createOrder = async () => {
    if (!partnerId) return;

    const payload = {
      customer_partner_id: partnerId,
      rate_list_id: rateListId,
      driver_pickup_loc: fromLocation,
      driver_dropoff_loc: toLocation,
      driver_rate: price,
    };
    // console.log(payload, 'pay')
    try {
      setIsLoading(true);
      const response = await instance.post('/new-ride-request', payload);
      if (response?.data?.message) {
        Toast.show('Successfully created', Toast.LONG);
        navigation.navigate('BottomDriver');
      }
    } catch (error) {
      console.log('Order creation ', error);

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

  // const getFromTo = async () => {
  //     const response = await instance.get('/packages')
  //     setfromto(response.data);
  // }
  // useEffect(() => {
  //     getFromTo();

  // }, [])
  // useEffect(() => {
  //     if (selectedValue !== null) {
  //         const selectedRoute = fromto.find(route => route.id === selectedValue);
  //         if (selectedRoute) {
  //             setFromLocation(selectedRoute.route.from);
  //             setToLocation(selectedRoute.route.to);
  //             setPrice(selectedRoute.price)
  //         }
  //     } else {
  //         setFromLocation("");
  //         setToLocation("");
  //         setPrice("");

  //     }
  // }, [selectedValue]);

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
      item.nicename.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      item.phonecode.toString().includes(countryCodeSearch),
  );
  const filteredCountryCodesPhone = countryCodesPhone.filter(
    item =>
      item.nicename
        .toLowerCase()
        .includes(countryCodeSearchPhone.toLowerCase()) ||
      item.phonecode.toString().includes(countryCodeSearchPhone),
  );

  const getFroms = async () => {
    try {
      const response = await instance.get('/routes/from');
      setFroms(response.data);
    } catch (error) {
      console.log('Froms', error);
    }
  };

  const getTo = async too => {
    try {
      const response = await instance.get(`/routes/to?from=${too}`);
      setTo(response.data);
    } catch (error) {
      console.log('Froms', error);
    }
  };

  const getVehicleId = async () => {
    try {
      const response = await instance.get('/fetch/vehicle_class_id');
      setVehicleId(response?.data?.vehicle_class_ids[0]);
    } catch (error) {
      console.log('vehicle Id', error);
    }
  };

  const getPrise = async toLocation => {
    try {
      const response = await instance.get(
        `/routes/rates?from=${fromLocation}&to=${toLocation}&vehicle_class_id=${vehicleId}`,
      );
      setPrice(response?.data[0]?.price);
      setRateListId(response?.data[0]?.id);
    } catch (error) {
      console.log('Tos', error);
    }
  };

  useEffect(() => {
    getFroms();
    getVehicleId();
    getCountryPrefix();
  }, []);

  const handleInputChange = text => {
    setFromLocation(text);
    if (text) {
      const filteredSuggestions = froms.filter(item =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleToChange = text => {
    setToLocation(text);
    if (text) {
      const filteredSuggestions = to.filter(item =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setToSuggestions(filteredSuggestions);
    } else {
      setToSuggestions([]);
    }
  };

  const renderSuggestions = () => {
    if (suggestions.length > 0) {
      return (
        <View style={styles.suggestionsContainer}>
          <ScrollView>
            {suggestions.map((item, index) => (
              <Text
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setFromLocation(item);
                  setSuggestions([]);
                  getTo(item);
                }}>
                {item}
              </Text>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  const renderToSuggestions = () => {
    if (toSuggestions.length > 0) {
      return (
        <View style={styles.suggestionsContainer}>
          <ScrollView>
            {toSuggestions.map((item, index) => (
              <Text
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setToLocation(item);
                  setToSuggestions([]);
                  getPrise(item);
                }}>
                {item}
              </Text>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.MainContainer}>
      <CustomHeader
        title={'Create New Customer / Order'}
        color={css.headercolor}
        textstyle={{fontSize: 17}}
      />

      <ScrollView>
        <TextInputField
          nameOfTextInput="Full name"
          placeholder="Enter Customer name"
          value={fullName}
          onChangeText={setFullName}
          IconName={'user'}
          IconLibrary={AntDesign}
        />

        <Text style={styles.label}>phone no#</Text>
        <View style={styles.WhatsAppContainer}>
          <TouchableOpacity
            style={styles.PrefixView}
            onPress={() => setModalVisiblePhone(true)}>
            <Text style={styles.selectedCodeText}>{selectedCodePhone}</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter Customer Phone No'}
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={phoneNo}
              onChangeText={setPhoneNo}
            />
          </View>
        </View>

        <Text style={styles.label}>Whatsapp no#</Text>
        <View style={styles.WhatsAppContainer}>
          <TouchableOpacity
            style={styles.PrefixView}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.selectedCodeText}>{selectedCode}</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter Customer WhatsApp No'}
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={whatsappNo}
              onChangeText={setWhatsappNo}
            />
          </View>
        </View>

        {/* <TextInputField
                    nameOfTextInput="Phone no#"
                    placeholder="Enter Customer Phone no"
                    keyboardType="phone-pad"
                    value={phoneNo}
                    onChangeText={setPhoneNo}
                    IconLibrary={MaterialCommunityIcons}
                    IconName={'phone-in-talk-outline'}
                /> */}
        {/* <TextInputField
                    nameOfTextInput="Whatsapp no#"
                    placeholder="Enter Customer Whatsapp no"
                    keyboardType="phone-pad"
                    value={whatsappNo}
                    onChangeText={setWhatsappNo}
                    IconLibrary={FontAwesome}
                    IconName={'whatsapp'}
                /> */}

        <TextInputField
          nameOfTextInput="From"
          placeholder="Enter Customer Pick-up"
          value={fromLocation}
          onChangeText={handleInputChange}
          IconLibrary={EvilIcons}
          IconName={'location'}
          editable={selectedValue == null}
        />
        {renderSuggestions()}
        <TextInputField
          nameOfTextInput="To"
          placeholder="Enter Customer drop-off"
          value={toLocation}
          onChangeText={handleToChange}
          IconLibrary={EvilIcons}
          IconName={'location'}
          editable={selectedValue == null}
        />
        {renderToSuggestions()}
        <TextInputField
          nameOfTextInput="Price"
          placeholder="Enter Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="phone-pad"
          IconLibrary={FontAwesome}
          IconName={'dollar'}
          editable={selectedValue == null}
        />
        <View style={styles.buttonRow}>
          <Button
            label="Cancel"
            color="black"
            borderColor={css.secondary}
            borderWidth={1}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Button
            label="Create"
            backgroundColor={css.primary}
            color="white"
            onPress={postApiCall}
          />
        </View>
        <View style={{height: 100}}></View>
      </ScrollView>
      {isLoading ? <Loader /> : null}

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
                  keyExtractor={item => item.id.toString()}
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
                  keyExtractor={item => item.id.toString()}
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

export default CreateCustomer;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  backButton: {
    marginRight: '20%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 20,
  },
  // picker: {
  //     width: '90%',
  //     color: '#000',
  //     borderBottomColor: '#00A978',
  //     borderBottomWidth: 3,
  //     borderRadius: 10,
  //     borderWidth: 0.2,
  //     padding: 10,
  // },
  // pickerItem: {
  //     height: 50,
  //     color: '#000',
  // },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  suggestionsContainer: {
    width: '90%',
    alignSelf: 'center',
    maxHeight: 200,
    backgroundColor: '#eeeeee',
  },
  suggestionItem: {
    paddingVertical: 7,
    paddingLeft: 20,
    color: '#000',
  },
  textInput: {
    height: 50,
    // paddingLeft: 35,
    fontSize: 16,
    color: '#000',
    fontSize: 14,
    width: '100%',
    padding: 5,
    color: 'gray',
  },
  inputContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: css.primary,
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
    width: '78%',
  },
  WhatsAppContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  PrefixView: {
    borderBottomColor: css.primary,
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
    width: '20%',
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCodeText: {
    fontSize: 16,
    color: 'gray',
  },
  // textInput: {
  //     height: 50,
  //     paddingLeft: 10,
  // },
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
  CountryTxt: {
    color: '#000',
    textAlign: 'left',
    width: '100%',
  },
});
