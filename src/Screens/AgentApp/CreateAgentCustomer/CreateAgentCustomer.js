import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import css from '../../../CssFile/Css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextInputField from '../../../Component/CreateNewOrderComponent/TextInputField';
import Button from '../../../Component/CreateNewOrderComponent/Button';
import instance from '../../../BaseUrl/BaseUrl';
import {Picker} from '@react-native-picker/picker';
import Loader from '../../../Component/Loader/Loader';
import Toast from 'react-native-simple-toast';

const CreateAgentCustomer = ({navigation, route}) => {
  const {mode, customer} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [cnic, setCnic] = useState('');
  const [whatsAppNo, setWhatsAppNo] = useState('');
  const [passport, setPassport] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (mode === 'update' && customer) {
      setFullName(customer.name);
      setEmail(customer.email);
      setPhoneNo(customer.phone_no);
      setCnic(customer.cnic);
      setWhatsAppNo(customer.whatsapp_no);
      setPassport(customer.passport);
      setAddress(customer.address1);
      setCity(customer.city);
      setCountry(customer.country);
    }
  }, [mode, customer]);

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

  useEffect(() => {
    getCountryApi();
  }, []);

  const validateFields = () => {
    if (!fullName) {
      Alert.alert('Validation Error', 'Please enter customer Name.');
      return false;
    }
    if (!email) {
      Alert.alert('Validation Error', 'Please enter customer email');
      return false;
    }
    if (!phoneNo) {
      Alert.alert('Validation Error', 'Please enter customer phone no');
      return false;
    }
    if (!cnic) {
      Alert.alert('Validation Error', 'Please enter customer cnic');
      return false;
    }
    if (!whatsAppNo) {
      Alert.alert('Validation Error', 'Please enter customer whatsapp no');
      return false;
    }
    if (!passport) {
      Alert.alert('Validation Error', 'Please enter customer passport no');
      return false;
    }
    if (!address) {
      Alert.alert('Validation Error', 'Please enter customer address');
      return false;
    }
    if (!country) {
      Alert.alert('Validation Error', 'Please enter customer country');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please enter customer city');
      return false;
    }
    return true;
  };

  const createCustomer = async () => {
    if (!validateFields()) {
      return;
    }

    const payload = {
      name: fullName,
      email: email,
      phone_no: phoneNo,
      whatsapp_no: whatsAppNo,
      cnic: cnic,
      address1: address,
      country: country,
      city: city,
      passport: passport,
    };

    try {
      setIsLoading(true);
      const response = await instance.post('/create-customer', payload);
      if (response?.data?.message) {
        Toast.show('Successfully Created', Toast.SHORT);
        navigation.navigate('Customer');
      }
    } catch (error) {
      console.log('Create Agent Customer', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async () => {
    if (!validateFields()) {
      return;
    }
    const payload = {
      name: fullName,
      email: email,
      phone_no: phoneNo,
      whatsapp_no: whatsAppNo,
      cnic: cnic,
      address1: address,
      country: country,
      city: city,
      passport: passport,
    };
    console.log(payload, 'payload');
    try {
      setIsLoading(true);
      console.log(customer.id, 'd');
      const response = await instance.post(
        `/update-customer/${customer.id}`,
        payload,
      );
      if (response?.data?.message) {
        Toast.show('Successfully Updated', Toast.SHORT);
        navigation.navigate('Customer');
      }
    } catch (error) {
      console.log('Update Agent Customer', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = selectedCountry => {
    setCountry(selectedCountry);
    getCityApi(selectedCountry);
  };

  return (
    <View style={css.MainContainer}>
      <StatusBar backgroundColor={css.headercolor} />
      <View style={styles.Header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.HeaderTxt}>
          {mode === 'create' ? 'Create Customer' : 'Update Customer'}
        </Text>
        <Text style={styles.txtheader}>
          {mode === 'create'
            ? 'Organizing your customers helps you create quicker quotes and keep track of them easier.'
            : 'Organizing your customers helps you update quicker quotes and keep track of them easier.'}
        </Text>
      </View>

      <View>
        <ScrollView>
          <TextInputField
            nameOfTextInput="Full Name"
            placeholder={'Enter Your Name'}
            value={fullName}
            onChangeText={setFullName}
            IconName={'user'}
            IconLibrary={AntDesign}
          />
          <TextInputField
            nameOfTextInput="Email"
            placeholder={'Enter Your Email'}
            value={email}
            onChangeText={setEmail}
            IconName={'envelope-o'}
            IconLibrary={FontAwesome}
          />
          <TextInputField
            nameOfTextInput="Phone-No"
            placeholder={'Enter Your Phone-No'}
            value={phoneNo}
            onChangeText={setPhoneNo}
            IconName={'phone'}
            IconLibrary={Feather}
            keyboardType="numeric"
          />
          <TextInputField
            nameOfTextInput="Cnic"
            placeholder={'Enter Your Cnic'}
            value={cnic}
            onChangeText={setCnic}
            IconName={'idcard'}
            IconLibrary={AntDesign}
            keyboardType="numeric"
          />
          <TextInputField
            nameOfTextInput="Whatsapp-No"
            placeholder={'Enter Your WhatsApp No'}
            value={whatsAppNo}
            onChangeText={setWhatsAppNo}
            IconName={'briefcase-outline'}
            IconLibrary={Ionicons}
            keyboardType="numeric"
          />
          <TextInputField
            nameOfTextInput="Passport No"
            placeholder={'Enter Your Passport No'}
            value={passport}
            onChangeText={setPassport}
            IconName={'passport'}
            IconLibrary={FontAwesome5}
          />
          <TextInputField
            nameOfTextInput="Address"
            placeholder={'Enter Your Address'}
            value={address}
            onChangeText={setAddress}
            IconName={'home'}
            IconLibrary={AntDesign}
          />
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={itemValue => handleCountryChange(itemValue)}
              style={styles.picker}
              dropdownIconColor={'#000'}>
              <Picker.Item label="Select Country" value={null} color="gray" />
              {countries.map((country, index) => (
                <Picker.Item key={index} label={country} value={country} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>City</Text>
          <View style={styles.pickerContainer}>
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
          </View>

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
            {mode === 'create' ? (
              <Button
                label="Create"
                backgroundColor={css.secondary}
                color="white"
                onPress={createCustomer}
              />
            ) : (
              <Button
                label="Update"
                backgroundColor={css.secondary}
                color="white"
                onPress={updateCustomer}
              />
            )}
          </View>
          <View style={{height: 200}}></View>
        </ScrollView>
      </View>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default CreateAgentCustomer;

const styles = StyleSheet.create({
  Header: {
    backgroundColor: css.headercolor,
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
  },
  HeaderTxt: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  txtheader: {
    color: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 20,
  },
  pickerContainer: {
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 0.2,
    borderBottomColor: '#00A978',
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
    width: '90%',
    alignSelf: 'center',
  },
  picker: {
    color: 'black',
  },
});
