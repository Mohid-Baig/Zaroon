/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, View, Alert, Platform} from 'react-native';
import React, {useState} from 'react';
import {Drawer} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import css from '../../CssFile/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePress = async item => {
    setSelectedItem(item);
    if (item === 'Profile') {
      navigation.navigate('AgentProfile');
    }
    if (item === 'HomeAgent') {
      navigation.navigate('HomeAgent');
    }
    if (item === 'Customers') {
      navigation.navigate('Customer');
    }
    if (item === 'OrderStatus') {
      navigation.navigate('OrderStatus');
    }
    if (item === 'HelpCenter') {
      navigation.navigate('HelpCenter');
    }
    if (item === 'Log out') {
      Alert.alert(
        'Logout',
        'Do you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              await AsyncStorage.removeItem('auth_token');
              navigation.replace('Login');
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.Container}>
      <Drawer.Item
        style={selectedItem === 'Profile' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <Ionicons
            name="person-circle-outline"
            color={css.secondary}
            size={30}
          />
        )}
        label="My Profile"
        onPress={() => handlePress('Profile')}
      />
      <Text style={styles.Txt}>Main Menu</Text>
      <Drawer.Item
        style={selectedItem === 'HomeAgent' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <AntDesign name="home" color={css.secondary} size={size} />
        )}
        label="Home"
        onPress={() => handlePress('HomeAgent')}
      />
      <Drawer.Item
        style={selectedItem === 'Customers' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <Ionicons
            name="people-circle-outline"
            color={css.secondary}
            size={size}
          />
        )}
        label="Customers"
        onPress={() => handlePress('Customers')}
      />
      <Drawer.Item
        style={selectedItem === 'OrderStatus' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <MaterialCommunityIcons
            name="truck-fast-outline"
            color={css.secondary}
            size={size}
          />
        )}
        label="Order Status"
        onPress={() => handlePress('OrderStatus')}
      />
      <Drawer.Item
        style={selectedItem === 'HelpCenter' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <MaterialCommunityIcons
            name="headphones"
            color={css.secondary}
            size={size}
          />
        )}
        label="User Guide"
        onPress={() => handlePress('HelpCenter')}
      />
      <Drawer.Item
        style={selectedItem === 'Log out' ? styles.selectedItem : {}}
        icon={({color, size}) => (
          <AntDesign name="logout" color={'red'} size={size} />
        )}
        label="Log out"
        labelStyle={{color: 'red'}}
        onPress={() => handlePress('Log out')}
      />
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 50 : 20,
  },
  Txt: {
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
});
