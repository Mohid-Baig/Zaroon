import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import CustomHeader from '../../../Component/CustomHeader/CustomHeader';
import css from '../../../CssFile/Css';
import instance from '../../../BaseUrl/BaseUrl';

const ExistingCustomer = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [existing, setExisting] = useState([]);

  const getExistingdata = async () => {
    try {
      const response = await instance.get('/search-walkin');
      setExisting(response?.data?.walkin_customers);
    } catch (error) {
      console.log('Existing data', error);
    }
  };

  useEffect(() => {
    getExistingdata();
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.length >= 3) {
      const textData = text.toUpperCase();
      const newData = existing.filter(item => {
        return (
          (item.name && item.name.toUpperCase().includes(textData)) ||
          (item.phone_no && item.phone_no.toUpperCase().includes(textData)) ||
          (item.whatsapp_no &&
            item.whatsapp_no.toUpperCase().includes(textData)) ||
          (item.passport && item.passport.toUpperCase().includes(textData)) ||
          (item.cnic && item.cnic.toUpperCase().includes(textData)) ||
          item.id.toString().includes(textData)
        );
      });
      setFilteredData(newData);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <View style={styles.MainContainer}>
      <CustomHeader color={'#fff'} />
      <View style={styles.Container}>
        <Searchbar
          style={styles.searchBar}
          placeholder="Search Existing Customer"
          value={searchQuery}
          onChangeText={text => handleSearch(text)}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CreateCustomer')}>
          <Text style={styles.Txt}>Create New Customer</Text>
        </TouchableOpacity>
        {searchQuery.length >= 3 && (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <ScrollView horizontal={true}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CreateNewOrder', {customer: item})
                  }
                  style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.name} </Text>
                  <Text style={styles.itemText}> {item.phone_no} </Text>
                  <Text style={styles.itemText}> {item.whatsapp_no} </Text>
                  <Text style={styles.itemText}> {item.passport} </Text>
                  <Text style={styles.itemText}> {item.cnic} </Text>
                  {/* <Text style={styles.itemText}> {item.id} </Text> */}
                </TouchableOpacity>
              </ScrollView>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ExistingCustomer;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#151F30',
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    // padding:10
    // alignItems: 'center',
  },
  searchBar: {
    width: '85%',
    backgroundColor: '#eeeeee',
    margin: 20,
    alignSelf: 'center',
    position: 'static',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    marginLeft: 10,
  },
  itemText: {
    fontSize: 14,
    color: 'gray',
    // marginLeft:10
  },
  Txt: {
    alignSelf: 'center',
    color: '#0072EE',
    fontSize: 16,
    marginBottom: '5%',
  },
});
