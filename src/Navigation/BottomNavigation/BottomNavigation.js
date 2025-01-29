/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Packages from '../../Screens/AgentApp/BottomScreens/PackagesScreen/Packages';
import Ledger from '../../Screens/AgentApp/BottomScreens/LedgerScreen/Ledger';
import Entypo from 'react-native-vector-icons/Entypo';
import css from '../../CssFile/Css';
import HomeAgent from '../../Screens/AgentApp/AgentHome/HomeAgent';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: css.primary,
        tabBarStyle: {
          paddingBottom: 10,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeAgent}
        options={{
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Packages"
        component={Packages}
        options={{
          tabBarIcon: ({color, size}) => (
            <Entypo name="box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ledger"
        component={Ledger}
        options={{
          tabBarIcon: ({color, size}) => (
            <Entypo name="book" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
