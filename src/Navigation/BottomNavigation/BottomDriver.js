/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../Screens/DriverApp/DriverHome/HomeDriver';
import css from '../../CssFile/Css';
import Profile from '../../Screens/DriverApp/DriverHome/Profile';
import CompletedRides from '../../Screens/DriverApp/DriverHome/CompletedRides';
import UnApprovedRides from '../../Screens/DriverApp/DriverHome/UnApprovedRides';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const BottomDriver = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: css.primary,
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          paddingBottom: 10,
          height: 60,
          backgroundColor: css.headercolor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Rides"
        component={CompletedRides}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="check-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ledger"
        component={UnApprovedRides}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="progress-clock"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomDriver;
