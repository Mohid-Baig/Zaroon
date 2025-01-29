import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AgentHeader from '../../../Component/CustomHeader/AgentHeader';
import CustomerCard from '../../../Component/CustomerScreenCard/CustomerCard';
import css from '../../../CssFile/Css';
import TextLineCard from '../../../Component/CustomerScreenCard/TextLineCard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import {useFocusEffect} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';

const Customer = ({navigation}) => {
  const [detailModal, setDetailModal] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [filterData, setFiltereddata] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const closeModal = () => {
    setDetailModal(false);
  };

  const getCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/fetch-customers');
      setCustomerData(response?.data?.partners);
      setFiltereddata(response?.data?.partners);
    } catch (error) {
      console.log('Customer Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getCustomer();
    }, []),
  );

  const openDetailModal = customer => {
    setSelectedCustomer(customer);
    setDetailModal(true);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.length >= 2) {
      const filtered = customerData.filter(customer => {
        const customerName = customer.name ? customer.name.toLowerCase() : ''; // Check if name exists
        const customerId = customer.id ? customer.id.toString() : ''; // Check if id exists

        return (
          customerName.includes(text.toLowerCase()) || customerId.includes(text)
        );
      });
      setCustomerData(filtered);
    } else {
      setCustomerData(filterData);
    }
  };

  return (
    <View style={css.MainContainer}>
      <AgentHeader onPress={() => navigation.openDrawer()} />
      <View>
        <Searchbar
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => handleSearch(text)}
          inputStyle={{marginTop: -8}}
        />
      </View>

      <ScrollView>
        {customerData && customerData.length > 0 ? (
          customerData.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onPress={() => openDetailModal(customer)}
            />
          ))
        ) : (
          <Text style={[styles.TitleTxt, {alignSelf: 'center', marginTop: 50}]}>
            No customers found
          </Text>
        )}
      </ScrollView>
      {/* <TouchableOpacity
                onPress={() => navigation.navigate('CreateAgentCustomer', { mode: 'create' })}
                style={styles.CreateButton}>
                <AntDesign name='pluscircle' color={css.primary} size={50} />
            </TouchableOpacity> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModal}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.Title}>
                  <Text style={styles.TitleTxt}>Customer Detail</Text>
                  {/* <TouchableOpacity
                                        onPress={() => { setDetailModal(false); navigation.navigate('CreateAgentCustomer', { mode: 'update', customer: selectedCustomer }) }}
                                        style={{ position: 'absolute', right: 5 }}>
                                        <AntDesign name='edit' color={css.primary} size={25} />
                                    </TouchableOpacity> */}
                </View>
                <View style={styles.ModelInside}>
                  {selectedCustomer && (
                    <>
                      <TextLineCard
                        title={'Full Name'}
                        name={selectedCustomer?.name}
                      />
                      <TextLineCard
                        title={'Phone No'}
                        name={selectedCustomer?.phone_no}
                      />
                      <TextLineCard
                        title={'Email'}
                        name={selectedCustomer?.email}
                      />
                      <TextLineCard
                        title={'Business'}
                        name={selectedCustomer?.business_partner_id}
                      />
                      <TextLineCard
                        title={'Passport'}
                        name={selectedCustomer?.passport}
                      />
                      <TextLineCard
                        title={'Cnic'}
                        name={selectedCustomer?.cnic}
                      />
                      <TextLineCard
                        title={'WhatsApp No'}
                        name={selectedCustomer?.whatsapp_no}
                      />
                      <TextLineCard
                        title={'City'}
                        name={selectedCustomer?.city}
                      />
                      <TextLineCard
                        title={'Country'}
                        name={selectedCustomer?.country}
                      />
                      <TextLineCard
                        title={'Address'}
                        name={selectedCustomer?.address1}
                      />
                    </>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {IsLoading ? <Loader /> : null}
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  Title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleTxt: {
    color: css.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ModelInside: {
    padding: 10,
  },
  CreateButton: {
    position: 'absolute',
    right: 25,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#d6d6d6',
    marginTop: 10,
    alignSelf: 'center',
    position: 'static',
    borderRadius: 5,
    height: 40,
  },
});
