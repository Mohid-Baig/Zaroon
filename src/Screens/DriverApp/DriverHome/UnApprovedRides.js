import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import css from '../../../CssFile/Css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../Component/Loader/Loader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DriverHeader from '../../../Component/CustomHeader/DriverHeader';
import instance from '../../../BaseUrl/BaseUrl';
import DriverLedger from '../../../Component/DriverLedgerCard/DriverLedger';

const UnApprovedRides = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [totals, setTotals] = useState({credit: 0, debit: 0, balance: 0});
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        `/driver/ledgers?agent&from_date=${
          fromDate.toISOString().split('T')[0]
        }&to_date=${toDate.toISOString().split('T')[0]}`,
      );
      const data = response?.data?.driver_ledger;
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
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchLedgerData(startDate, endDate);
  };

  return (
    <View style={css.MainContainer}>
      <DriverHeader title={'Ledger'} />
      <View style={styles.CalendarRow}>
        <TouchableOpacity onPress={showDatePicker} style={styles.StartCalender}>
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
          <Text style={styles.ModalTxt}>{totals.debit}</Text>
        </View>
        <View style={styles.InnerTop}>
          <Text style={styles.TopTxt}>Received Amount</Text>
          <Text style={styles.ModalTxt}>{totals.credit}</Text>
        </View>
        <View style={styles.InnerTop}>
          <Text style={styles.TopTxt}>Total Balance</Text>
          <Text style={styles.ModalTxt}>{totals.balance}</Text>
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
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <DriverLedger item={item} />}
        />
        {/* <View style={{height:15,backgroundColor:'red'}}></View> */}
      </View>

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
    </View>
  );
};

export default UnApprovedRides;

const styles = StyleSheet.create({
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
  CalenderButton: {},
  dateTxt: {
    color: 'gray',
    marginLeft: 5,
    fontSize: 14,
  },
  FlatListContainer: {
    padding: 10,
    marginTop: 0,
    paddingBottom: 230,
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
  ModalTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  TopTxt: {
    color: '#fff',
    fontSize: 13,
  },
  HeaderButtonTxt: {
    color: '#474646',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
