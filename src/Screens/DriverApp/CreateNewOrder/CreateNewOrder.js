import {StyleSheet, Text, View, ScrollView} from 'react-native';
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

const CreateNewOrder = ({navigation, route}) => {
  const {customer} = route.params || {};

  const [fullName, setFullName] = useState(customer?.name || '');
  const [cnic, setCnic] = useState(customer?.cnic || '');
  const [phoneNo, setPhoneNo] = useState(customer?.phone_no || '');
  const [whatsappNo, setWhatsappNo] = useState(customer?.whatsapp_no || '');
  const [passportNo, setPassportNo] = useState(customer?.passport || '');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [froms, setFroms] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const [fromto, setfromto] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const createOrder = async () => {
    const payload = {
      customer_partner_id: customer?.id,
      rate_list_id: selectedValue,
      driver_pickup_loc: fromLocation,
      driver_dropoff_loc: toLocation,
      driver_rate: price,
    };
    try {
      setIsLoading(true);
      const response = await instance.post('/new-ride-request', payload);
      if (response?.data?.message) {
        Toast.show('Successfully created', Toast.SHORT);
        navigation.navigate('BottomDriver');
      }
    } catch (error) {
      console.log('create order Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFroms = async () => {
    try {
      const response = await instance.get('/routes/from');
      // console.log(response.data)
      setFroms(response.data);
    } catch (error) {
      console.log('Froms', error);
    }
  };
  const getTo = async () => {
    try {
      const response = await instance.get(`/routes/to?from=${s}`);
      console.log(response.data);
      setFroms(response.data);
    } catch (error) {
      console.log('Froms', error);
    }
  };

  useEffect(() => {
    getFroms();
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

  // const getFromTo = async () => {
  //     const response = await instance.get('/packages')
  //     setfromto(response.data);
  // }

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

  return (
    <View style={styles.MainContainer}>
      <CustomHeader title={'Create New Order'} color={css.headercolor} />

      <ScrollView>
        <TextInputField
          nameOfTextInput="Full name"
          placeholder="Enter Customer name"
          value={fullName}
          onChangeText={setFullName}
          IconName={'user'}
          IconLibrary={AntDesign}
        />
        <TextInputField
          nameOfTextInput="Cnic"
          placeholder="Enter Customer Cnic"
          keyboardType="number-pad"
          value={cnic}
          onChangeText={setCnic}
          IconLibrary={AntDesign}
          IconName={'idcard'}
        />
        <TextInputField
          nameOfTextInput="Phone no#"
          placeholder="Enter Customer Phone no"
          keyboardType="phone-pad"
          value={phoneNo}
          onChangeText={setPhoneNo}
          IconLibrary={MaterialCommunityIcons}
          IconName={'phone-in-talk-outline'}
        />
        <TextInputField
          nameOfTextInput="Whatsapp no#"
          placeholder="Enter Customer Whatsapp no"
          keyboardType="phone-pad"
          value={whatsappNo}
          onChangeText={setWhatsappNo}
          IconLibrary={FontAwesome}
          IconName={'whatsapp'}
        />
        <TextInputField
          nameOfTextInput="Passport no#"
          placeholder="Enter Customer Passport no"
          value={passportNo}
          onChangeText={setPassportNo}
          IconLibrary={MaterialCommunityIcons}
          IconName={'passport'}
        />
        {/* <View style={{ paddingLeft: 20 }}>
                    <Text style={styles.label}>Route</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                    <View style={[{}, styles.picker]}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            // itemStyle={styles.pickerItem}
                            style={{ height: 40,color:'#000' }}
                            dropdownIconColor={'#000'}
                        >
                            <Picker.Item label="Select Route" value={null} color="gray" />
                            {fromto.map((location) => (
                                <Picker.Item label={location.name} value={location.id} key={location.id} />
                            ))}
                        </Picker>

                    </View>
                </View> */}

        {/* <TextInputField
                    nameOfTextInput="From"
                    placeholder="Enter Customer pick-up"
                    value={fromLocation}
                    onChangeText={setFromLocation}
                    IconLibrary={EvilIcons}
                    IconName={'location'}
                    editable={selectedValue == null}
                /> */}
        <TextInputField
          nameOfTextInput="From"
          placeholder="Enter Customer pick-up"
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
          onChangeText={setToLocation}
          IconLibrary={EvilIcons}
          IconName={'location'}
          editable={selectedValue == null}
        />
        <TextInputField
          nameOfTextInput="Price"
          placeholder="Enter Price"
          value={price}
          onChangeText={setPrice}
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
            onPress={createOrder}
          />
        </View>
        <View style={{height: 100}}></View>
      </ScrollView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default CreateNewOrder;

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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  picker: {
    width: '90%',
    color: '#000',
    borderBottomColor: '#00A978',
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
    padding: 10,
  },
  pickerItem: {
    height: 50,
    color: '#000',
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
});
