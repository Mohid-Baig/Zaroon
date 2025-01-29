/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import Customer from '../../Screens/AgentApp/CustomerScreen/Customer';
import HelpCenter from '../../Screens/AgentApp/HelpCenter/HelpCenter';
import HomeAgent from '../../Screens/AgentApp/AgentHome/HomeAgent';
import OrderStatus from '../../Screens/AgentApp/OrderStatusScreen/OrderStatus';
import BottomNavigation from '../BottomNavigation/BottomNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, drawerStyle: {width: '60%'}}}
      initialRouteName="HomeAgent"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="BottomNavigation" component={BottomNavigation} />
      <Drawer.Screen name="HomeAgent" component={HomeAgent} />
      <Drawer.Screen name="Customer" component={Customer} />
      <Drawer.Screen name="OrderStatus" component={OrderStatus} />
      <Drawer.Screen name="HelpCenter" component={HelpCenter} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
