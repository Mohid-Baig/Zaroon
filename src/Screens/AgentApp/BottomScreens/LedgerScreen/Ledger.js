import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import css from '../../../../CssFile/Css';
// import AgentHeader from '../../../../Component/CustomHeader/AgentHeader';
import instance from '../../../../BaseUrl/BaseUrl';
import Loader from '../../../../Component/Loader/Loader';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleHeader from '../../../../Component/CustomHeader/SimpleHeader';
import LedgerCard from '../../../../Component/LedgerCardComponent/LedgerCard';

const Ledger = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({credit: 0, debit: 0, balance: 0});

  useEffect(() => {
    fetchLedgerData(startDate, endDate);
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmStartDate = date => {
    setStartDate(date);
    setEndDate(null);
    hideDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = date => {
    setEndDate(date);
    hideEndDatePicker();
    if (startDate) {
      // setModalVisible(false);
      fetchLedgerData(startDate, date);
    }
  };

  const fetchLedgerData = async (fromDate, toDate) => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/ledgers?agent&from_date=${
          fromDate.toISOString().split('T')[0]
        }&to_date=${toDate.toISOString().split('T')[0]}`,
      );
      const data = response?.data?.ledgerentries;
      setLedgerData(data);
      // console.log(data)

      const result = data.reduce(
        (acc, obj) => {
          acc.credit += obj.credit;
          acc.debit += obj.debit;
          acc.balance += obj.balance;
          return acc;
        },
        {credit: 0, debit: 0, balance: 0},
      );

      setTotals(result);
    } catch (error) {
      console.error('Error fetching ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={css.MainContainer}>
      {/* <AgentHeader onPress={() => navigation.openDrawer()} /> */}
      <SimpleHeader
        name="Ledger"
        onPress={() => navigation.goBack()}
        // Icon={<FontAwesome name='calendar' color={'#fff'} size={25} />}
        // onCalenderPress={() => setModalVisible(true)}
      />

      <>
        <View style={styles.CalendarRow}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.StartCalender}>
            <View style={styles.CalenderButton}>
              <AntDesign name="calendar" color={css.secondary} size={22} />
            </View>
            <Text style={styles.dateTxt}>
              {startDate ? startDate.toDateString() : 'Select Start Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showEndDatePicker}
            style={styles.StartCalender}>
            <View style={styles.CalenderButton}>
              <AntDesign name="calendar" color={css.secondary} size={22} />
            </View>
            <Text style={styles.dateTxt}>
              {endDate ? endDate.toDateString() : 'Select End Date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.TopContainer}>
          <View style={styles.InnerTop}>
            <Text style={styles.TopTxt}>Trip Amount</Text>
            <Text style={styles.ModalTxt}>{totals?.debit}</Text>
          </View>
          <View style={styles.InnerTop}>
            <Text style={styles.TopTxt}>Received Amount</Text>
            <Text style={styles.ModalTxt}>{totals?.credit}</Text>
          </View>
          <View style={styles.InnerTop}>
            <Text style={styles.TopTxt}>Total Balance</Text>
            <Text style={styles.ModalTxt}>{totals?.balance}</Text>
          </View>
        </View>

        <View style={styles.FlatListContainer}>
          <View style={styles.TitleContainer}>
            <View style={styles.DescriptionBox}>
              <Text style={styles.HeaderButtonTxt}>Description</Text>
            </View>
            <View style={styles.AmountBox}>
              <Text style={styles.HeaderButtonTxt}>Amount</Text>
            </View>
          </View>
          <FlatList
            data={ledgerData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <LedgerCard item={item} />}
          />
          {/* <View style={{height:15,backgroundColor:'red'}}></View> */}
        </View>
      </>

      {loading && <Loader />}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={startDate || new Date()}
        onConfirm={handleConfirmStartDate}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        date={endDate || new Date()}
        onConfirm={handleConfirmEndDate}
        onCancel={hideEndDatePicker}
      />

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => startDate && endDate && setModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}>
            <Image
              style={styles.LedgerImage}
              source={require('../../../../assets/AgentHome/ledger.png')}
            />
            <Text style={styles.modalTitle}>View Ledger</Text>
            <Text style={styles.ModalTxt}>
              Select Date Range to see your full Ledger !
            </Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.dateButton}>
                <Text style={styles.ModalTxt}>
                  {startDate ? startDate.toDateString() : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showEndDatePicker}
                style={styles.dateButton}>
                <Text style={styles.ModalTxt}>
                  {endDate ? endDate.toDateString() : 'Select End Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Ledger;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    marginTop: 10,
  },
  ModalTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  TopTxt: {
    color: '#fff',
    fontSize: 13,
  },
  LedgerImage: {
    height: 60,
    width: 60,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    marginTop: 20,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
  },
  CalendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  StartCalender: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '49%',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    elevation: 1,
  },
  CalenderButton: {
    // backgroundColor:'red',
    // padding:5,
  },
  dateTxt: {
    color: 'gray',
    marginLeft: 5,
    fontSize: 14,
  },
  TopContainer: {
    backgroundColor: css.secondary,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  InnerTop: {
    alignItems: 'center',
  },
  FlatListContainer: {
    padding: 10,
    marginTop: 0,
    paddingBottom: 210,
    // height:'78%',
  },
  TitleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ccd0ed',
    borderRadius: 5,
    paddingVertical: 5,
  },
  DescriptionBox: {
    width: '70%',
    alignItems: 'center',
  },
  AmountBox: {
    width: '30%',
    alignItems: 'center',
  },
  HeaderButtonTxt: {
    color: '#474646',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
