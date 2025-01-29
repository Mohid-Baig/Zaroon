/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
// import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Searchbar} from 'react-native-paper';
import css from '../../CssFile/Css';

const FilterRBSheet = ({
  onApplyFilter,
  filterValue,
  partnerName,
  customerName,
  selectedDate,
  dateRange,
  onClose,
}) => {
  const [showStatus, setShowStatus] = useState(false);
  const [showDateFilters, setShowDateFilters] = useState(true);
  const [showNameFilters, setShowNameFilters] = useState(false);
  const [showPtnrNameFilters, setShowPtnrNameFilters] = useState(false);
  const [tempPartnerName, setTempPartnerName] = useState(partnerName);
  const [tempCustomerName, setTempCustomerName] = useState(customerName);
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showTick, setShowTick] = useState(false);

  const handleDateConfirm = date => {
    setTempSelectedDate(date);
    setTempDateRange({startDate: null, endDate: null});
    setDatePickerVisibility(false);
    onApplyFilter(
      filterValue,
      tempPartnerName,
      tempCustomerName,
      date,
      {startDate: null, endDate: null},
      selectedStatus,
    );
  };

  const handleRangeConfirm = range => {
    setTempDateRange(range);
    setTempSelectedDate(null);
    onApplyFilter(
      filterValue,
      tempPartnerName,
      tempCustomerName,
      null,
      range,
      selectedStatus,
    );
  };

  const handlePartnerNameChange = name => {
    setTempPartnerName(name);
    onApplyFilter(
      filterValue,
      name,
      tempCustomerName,
      tempSelectedDate,
      tempDateRange,
    );
  };

  const handleCustomerNameChange = name => {
    setTempCustomerName(name);
    onApplyFilter(
      filterValue,
      tempPartnerName,
      name,
      tempSelectedDate,
      tempDateRange,
    );
  };

  const clearFilter = () => {
    setTempPartnerName('');
    setTempCustomerName('');
    setTempSelectedDate(null);
    setTempDateRange({startDate: null, endDate: null});
    onApplyFilter('', '', '', null, {startDate: null, endDate: null});
    setShowDateFilters(false);
  };

  const removeStatus = () => {
    setSelectedStatus('');
    setShowTick(false);
    onApplyFilter(
      filterValue,
      tempPartnerName,
      tempCustomerName,
      tempSelectedDate,
      tempDateRange,
      '',
    );
    setShowStatus(false);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.TitleHeader}>
        <Text style={styles.Title}>Apply Filteration</Text>
        <TouchableOpacity onPress={onClose} style={styles.DrawerClose}>
          <AntDesign name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => setShowStatus(prevState => !prevState)}
          style={[styles.BtnContainer, {marginTop: 0}]}>
          <Text style={styles.txt}>Status</Text>
          {/* {selectedStatus && (
          <TouchableOpacity onPress={removeStatus}>
            <AntDesign name="close" size={18} color="#000" />
          </TouchableOpacity>
        )} */}
        </TouchableOpacity>

        {/* {showStatus && ( */}
        <View>
          <View style={styles.Statuses}>
            <TouchableOpacity
              style={styles.StatusButtons}
              onPress={removeStatus}>
              <Text style={styles.Innertxt}>Show All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StatusButtons}
              onPress={() => {
                setSelectedStatus('pending');
                setShowTick(true);
                onApplyFilter(
                  filterValue,
                  tempPartnerName,
                  tempCustomerName,
                  tempSelectedDate,
                  tempDateRange,
                  'pending',
                );
              }}>
              <Text style={styles.Innertxt}>
                Un Approved{' '}
                {selectedStatus === 'pending' && (
                  <AntDesign name="check" size={18} color="green" />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.Statuses}>
            <TouchableOpacity
              style={styles.StatusButtons}
              onPress={() => {
                setSelectedStatus('completed');
                setShowTick(true);
                onApplyFilter(
                  filterValue,
                  tempPartnerName,
                  tempCustomerName,
                  tempSelectedDate,
                  tempDateRange,
                  'completed',
                );
              }}>
              <Text style={styles.Innertxt}>
                Completed{' '}
                {selectedStatus === 'completed' && (
                  <AntDesign name="check" size={18} color="green" />
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StatusButtons}
              onPress={() => {
                setSelectedStatus('cancelled');
                setShowTick(true);
                onApplyFilter(
                  filterValue,
                  tempPartnerName,
                  tempCustomerName,
                  tempSelectedDate,
                  tempDateRange,
                  'cancelled',
                );
              }}>
              <Text style={styles.Innertxt}>
                Cancelled{' '}
                {selectedStatus === 'cancelled' && (
                  <AntDesign name="check" size={18} color="green" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* )} */}

        <TouchableOpacity
          onPress={() => setShowNameFilters(prevState => !prevState)}
          style={styles.BtnContainer}>
          <Text style={styles.txt}>Creater Name</Text>
        </TouchableOpacity>
        {/* {showNameFilters && ( */}
        <View>
          <Searchbar
            value={tempPartnerName}
            onChangeText={handlePartnerNameChange}
            placeholder="Search Ride Creater Name"
            style={styles.searchBar}
            inputStyle={{marginTop: -8, fontSize: 14}}
          />
        </View>
        {/* )} */}

        <TouchableOpacity
          onPress={() => setShowPtnrNameFilters(prevState => !prevState)}
          style={styles.BtnContainer}>
          <Text style={styles.txt}>Customer Name</Text>
        </TouchableOpacity>
        {/* {showPtnrNameFilters && ( */}
        <View>
          <Searchbar
            value={tempCustomerName}
            onChangeText={handleCustomerNameChange}
            placeholder="Search Customer Name"
            style={styles.searchBar}
            inputStyle={{marginTop: -8, fontSize: 14}}
          />
        </View>
        {/* )} */}

        <TouchableOpacity
          onPress={() => setShowDateFilters(prevState => !prevState)}
          style={styles.BtnContainer}>
          <Text style={styles.txt}>Date</Text>
          {(tempSelectedDate ||
            (tempDateRange.startDate && tempDateRange.endDate)) && (
            <TouchableOpacity onPress={clearFilter}>
              <AntDesign name="close" size={18} color="#000" />
            </TouchableOpacity>
          )}
          {!(
            tempSelectedDate ||
            (tempDateRange.startDate && tempDateRange.endDate)
          ) &&
            showDateFilters && (
              <TouchableOpacity onPress={clearFilter}>
                <Entypo name="chevron-small-up" size={18} color="gray" />
              </TouchableOpacity>
            )}
          {!(
            tempSelectedDate ||
            (tempDateRange.startDate && tempDateRange.endDate)
          ) &&
            !showDateFilters && (
              <TouchableOpacity onPress={clearFilter}>
                <Entypo name="chevron-small-down" size={18} color="gray" />
              </TouchableOpacity>
            )}
        </TouchableOpacity>

        {showDateFilters && (
          <View style={styles.InnerContainer}>
            <CalendarPicker
              onDateChange={handleDateConfirm}
              onRangeChange={handleRangeConfirm}
              previousTitleStyle={{color: 'gray', marginLeft: 10}}
              nextTitleStyle={{color: 'gray', marginRight: 10}}
              allowRangeSelection={true}
              width={280}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FilterRBSheet;

const styles = StyleSheet.create({
  Container: {
    // padding: 15,
    flex: 1,
  },
  TitleHeader: {
    backgroundColor: css.secondary,
    paddingVertical: 23,
    paddingTop: Platform.OS == 'ios' && 50,
  },
  Title: {
    alignSelf: 'center',
    // marginTop: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    // marginBottom: 10,
  },
  DrawerClose: {
    position: 'absolute',
    left: 10,
    top: Platform.OS == 'ios' ? 50 : 25,
  },
  BtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    // paddingVertical: 10,
  },
  InnerContainer: {
    // paddingLeft: 20,
  },
  txt: {
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    marginVertical: 5,
    height: 40,
    backgroundColor: '#eeeeee',
    // marginVertical: 10,
    borderRadius: 5,
  },
  Innertxt: {
    color: '#000',
    fontSize: 14,
    paddingHorizontal: 6,
    // paddingBottom: 15,
    // fontWeight: '600',
  },
  Statuses: {
    // paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  StatusButtons: {
    backgroundColor: '#eeeeee',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
