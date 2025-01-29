import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../../Screens/AuthScreens/Splash';
import Login from '../../Screens/AuthScreens/Login';
import HomeDriver from '../../Screens/DriverApp/DriverHome/HomeDriver';
import CreateNewOrder from '../../Screens/DriverApp/CreateNewOrder/CreateNewOrder';
import CompletedView from '../../Screens/DriverApp/CompleteRideScreen/CompletedView';
import ExistingCustomer from '../../Screens/DriverApp/CreateNewOrder/ExistingCustomer';
import CreateCustomer from '../../Screens/DriverApp/CreateNewOrder/CreateCustomer';
import {MenuProvider} from 'react-native-popup-menu';
import HomeAgent from '../../Screens/AgentApp/AgentHome/HomeAgent';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import CreateAgentCustomer from '../../Screens/AgentApp/CreateAgentCustomer/CreateAgentCustomer';
import BottomDriver from '../BottomNavigation/BottomDriver';
import DrawerNavigation from '../DrawerNavigation/DrawerNavigation';
import CreateAgentOrder from '../../Screens/AgentApp/CreateAgentOrder/CreateAgentOrder';
import OrderFilterStatus from '../../Screens/AgentApp/OrderFilterStatus/OrderFilterStatus';
import OrderDetail from '../../Screens/AgentApp/OrderDetailScreen/OrderDetail';
import DetailHelp from '../../Screens/AgentApp/HelpCenter/DetailHelp';
import EnterEmail from '../../Screens/AuthScreens/ForgotPassword/EnterEmail';
import EnterOptp from '../../Screens/AuthScreens/ForgotPassword/EnterOptp';
import EnterNewPassword from '../../Screens/AuthScreens/ForgotPassword/EnterNewPassword';
import AgentProfile from '../../Screens/AgentApp/AgentProfile.js/AgentProfile';
import ChangePassword from '../../Screens/AuthScreens/ChangePassword';
import OrderLineFilterStatus from '../../Screens/AgentApp/OrderFilterStatus/OrderLineFilterStatus';
import Notification from '../../Screens/AgentApp/NotificationScreen/Notification';
import CreatedOrder from '../../Screens/AgentApp/CreateAgentOrder/CreatedOrder';
import Ledger from '../../Screens/AgentApp/BottomScreens/LedgerScreen/Ledger';
import AllOrderStatuses from '../../Screens/AgentApp/OrderStatusScreen/AllOrderStatuses';
import DriverNotification from '../../Screens/DriverApp/NotificationsScreen/DriverNotification';
import OrderStatus from '../../Screens/AgentApp/OrderStatusScreen/OrderStatus';
import PdfScreen from '../../Screens/AgentApp/OrderStatusScreen/PdfScreen';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <MenuProvider skipInstanceCheck={true}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
          <Stack.Screen name="HomeDriver" component={HomeDriver} />
          <Stack.Screen name="HomeAgent" component={HomeAgent} />
          <Stack.Screen name="Ledger" component={Ledger} />
          <Stack.Screen name="CompletedView" component={CompletedView} />
          <Stack.Screen name="CreateNewOrder" component={CreateNewOrder} />
          <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
          <Stack.Screen name="ExistingCustomer" component={ExistingCustomer} />
          {/* <Stack.Screen name="BottomNavigation" component={BottomNavigation} /> */}
          <Stack.Screen name="BottomDriver" component={BottomDriver} />
          <Stack.Screen
            name="CreateAgentCustomer"
            component={CreateAgentCustomer}
          />
          <Stack.Screen name="CreateAgentOrder" component={CreateAgentOrder} />
          <Stack.Screen name="CreatedOrder" component={CreatedOrder} />
          <Stack.Screen
            name="OrderFilterStatus"
            component={OrderFilterStatus}
          />
          <Stack.Screen name="AllOrderStatuses" component={AllOrderStatuses} />
          <Stack.Screen name="OrderStatus" component={OrderStatus} />
          <Stack.Screen
            name="OrderLineFilterStatus"
            component={OrderLineFilterStatus}
          />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="DetailHelp" component={DetailHelp} />
          <Stack.Screen name="EnterEmail" component={EnterEmail} />
          <Stack.Screen name="EnterOptp" component={EnterOptp} />
          <Stack.Screen name="EnterNewPassword" component={EnterNewPassword} />
          <Stack.Screen name="AgentProfile" component={AgentProfile} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen
            name="DriverNotification"
            component={DriverNotification}
          />
          <Stack.Screen name="PdfScreen" component={PdfScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default Navigation;
