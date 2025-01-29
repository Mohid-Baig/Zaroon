import {StyleSheet, Text, View, RefreshControl, FlatList} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import css from '../../../CssFile/Css';
import Loader from '../../../Component/Loader/Loader';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../../Component/HomeComponents/BottomSheet';
import instance from '../../../BaseUrl/BaseUrl';
import HomeCard from '../../../Component/HomeComponents/HomeCard';
import DriverHeader from '../../../Component/CustomHeader/DriverHeader';
import Feather from 'react-native-vector-icons/Feather';
import FilterRBSheet from '../../../Component/HomeComponents/FilterRBSheet';
import moment from 'moment';
import CustomDrawer from '../../../Component/CustomDriverDrawerComponent/CustomDrawer';

const CompletedRides = ({navigation}) => {
  const refRBSheet = useRef();
  const filterRbSheet = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [completedData, setCompletedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [refreshing2, setRefreshing2] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({startDate: null, endDate: null});
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const onRefresh2 = useCallback(() => {
    setRefreshing2(true);
    getCompletedApi();
    setTimeout(() => {
      setRefreshing2(false);
    }, 0);
  }, []);

  const openRBSheet = item => {
    setSelectedItem(item);
    refRBSheet.current.open();
  };

  // const getCompletedApi = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await instance.get('/ride-assign-driver-complete');
  //     const complete = response?.data?.completed_rides;
  //     const reversedata = complete.reverse();
  //     setCompletedData(reversedata);
  //     setOriginalData(reversedata); // Store the original data
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const getCompletedApi = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/getallrides/assigntodriver');
      const complete = response?.data?.rides;
      // console.log(JSON.stringify(complete),'complete')
      const filteredData = complete.filter(
        item =>
          item.status !== 'incomplete' &&
          item.status !== 'in_progress' &&
          item.status !== 'paid' &&
          item.status !== 'draft',
      );
      const reversedata = filteredData.reverse();
      setCompletedData(reversedata);
      setOriginalData(reversedata);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = (
    filterValue,
    partnerName,
    customerName,
    selectedDate,
    dateRange,
    selectedStatus,
  ) => {
    setFilterValue(filterValue);
    setPartnerName(partnerName);
    setCustomerName(customerName);
    setSelectedDate(selectedDate);
    setDateRange(dateRange);

    const dataToFilter = [...originalData];

    let filteredData = dataToFilter;

    if (selectedStatus) {
      filteredData = filteredData.filter(
        item => item.status === selectedStatus,
      );
    }

    // Filter by Single Date
    if (selectedDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = moment(item.date).format('YYYY-MM-DD');
        return itemDate === moment(selectedDate).format('YYYY-MM-DD');
      });
    }

    // Filter by Date Range
    if (dateRange.startDate && dateRange.endDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = moment(item.date);
        return itemDate.isBetween(
          dateRange.startDate,
          dateRange.endDate,
          'days',
          '[]',
        );
      });
    }

    if (partnerName) {
      filteredData = filteredData.filter(item =>
        item.order.business_partner.name
          .toLowerCase()
          .includes(partnerName.toLowerCase()),
      );
    }

    if (customerName) {
      filteredData = filteredData.filter(item =>
        item.order.partner_customer.name
          .toLowerCase()
          .includes(customerName.toLowerCase()),
      );
    }

    setCompletedData(filteredData);
  };

  useFocusEffect(
    useCallback(() => {
      getCompletedApi();
    }, []),
  );

  const getStatusColor = status => {
    switch (status) {
      case 'cancelled':
        return '#DD3C3C';
      case 'completed':
        return '#00A978';
      case 'pending':
        return 'pink';
      default:
        return '#fff';
    }
  };

  return (
    <View style={css.MainContainer}>
      <DriverHeader
        title={'My Rides'}
        onPress={() => setIsDrawerVisible(true)}
        // onPress={() => filterRbSheet.current.open()}
        icon={<Feather name="filter" color="#fff" size={22} />}
      />
      <View style={{paddingBottom: 80}}>
        <FlatList
          data={completedData}
          refreshControl={
            <RefreshControl refreshing={refreshing2} onRefresh={onRefresh2} />
          }
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item}) => (
            <View>
              <HomeCard
                item={item}
                openRBSheet={() => openRBSheet(item)}
                borderLeftColorProps={getStatusColor(item.status)}
              />
            </View>
          )}
        />
      </View>

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
            backgroundColor: '#eeeeee',
            width: 50,
            height: 7,
          },
          container: {
            backgroundColor: '#fff',
            height: '55%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <BottomSheet
          selectedItem={selectedItem}
          navigation={navigation}
          onRefresh={onRefresh2}
        />
      </RBSheet>

      {/* <RBSheet
        ref={filterRbSheet}
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
            backgroundColor: '#eeeeee',
            width: 50,
            height: 7,
          },
          container: {
            backgroundColor: '#fff',
            height: '45%',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <FilterRBSheet
          onApplyFilter={applyFilter}
          filterValue={filterValue}
          partnerName={partnerName}
          customerName={customerName}
          selectedDate={selectedDate}
          dateRange={dateRange}
        />
      </RBSheet> */}

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)} // Close drawer
      >
        <FilterRBSheet
          onClose={() => setIsDrawerVisible(false)}
          onApplyFilter={applyFilter}
          filterValue={filterValue}
          partnerName={partnerName}
          customerName={customerName}
          selectedDate={selectedDate}
          dateRange={dateRange}
        />
      </CustomDrawer>

      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default CompletedRides;

const styles = StyleSheet.create({});
