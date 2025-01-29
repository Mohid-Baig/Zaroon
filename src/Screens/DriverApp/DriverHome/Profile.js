/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import css from '../../../CssFile/Css';
import DriverHeader from '../../../Component/CustomHeader/DriverHeader';
import ProfileCard from '../../../Component/ProfileCard/ProfileCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const [profileData, setProfileData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
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
            await AsyncStorage.removeItem('Image');
            navigation.replace('Login');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getPrifiledata = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/get-user');
      setProfileData(response?.data?.user?.partner);
    } catch (error) {
      console.log('Profile Api', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPrifiledata();
  }, []);

  return (
    <View style={css.MainContainer}>
      <DriverHeader title={'Profile'} />
      <ScrollView>
        <ProfileCard
          headtext={'Name'}
          bodytext={profileData?.name}
          icon={
            <MaterialIcons
              name="person-outline"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Email'}
          bodytext={profileData?.email}
          icon={
            <MaterialCommunityIcons
              name="email-outline"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Age'}
          bodytext={profileData?.age}
          icon={
            <MaterialCommunityIcons
              name="calendar"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Passport No'}
          bodytext={profileData?.passport}
          icon={
            <MaterialCommunityIcons
              name="passport"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Phone No'}
          bodytext={profileData?.phone_no}
          icon={<MaterialIcons name="phone" color={css.primary} size={25} />}
        />
        <ProfileCard
          headtext={'WhatsApp No'}
          bodytext={profileData?.whatsapp_no}
          icon={
            <MaterialCommunityIcons
              name="whatsapp"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Experience'}
          bodytext={profileData?.experience}
          icon={
            <MaterialCommunityIcons
              name="briefcase-outline"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Company Name'}
          bodytext={profileData?.company_name}
          icon={
            <MaterialCommunityIcons
              name="home-city-outline"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'Address'}
          bodytext={profileData?.address1}
          icon={
            <MaterialCommunityIcons
              name="home-outline"
              color={css.primary}
              size={25}
            />
          }
        />
        <ProfileCard
          headtext={'City'}
          bodytext={profileData?.city}
          icon={
            <MaterialIcons name="location-city" color={css.primary} size={25} />
          }
        />
        <ProfileCard
          headtext={'Country'}
          bodytext={profileData?.country}
          icon={<MaterialIcons name="public" color={css.primary} size={25} />}
        />

        <Text style={styles.Headertxt}>Settings</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EnterEmail', {mode: 'change'})}
          style={styles.changePassword}>
          <View style={styles.Icon}>
            <MaterialIcons name="settings" color={css.primary} size={25} />
          </View>
          <View style={styles.right}>
            <Text style={styles.ChangeTxt}>Change Password</Text>
            <View>
              <MaterialCommunityIcons
                name="chevron-right"
                color={css.primary}
                size={30}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={signOut} style={styles.Logout}>
          <View style={styles.icon}>
            <AntDesign name="logout" color="red" size={25} />
          </View>
          <Text style={styles.Txt}>LogOut</Text>
        </TouchableOpacity>

        <View style={{height: 20}}></View>
      </ScrollView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  Logout: {
    marginTop: 30,
    width: '82%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  Txt: {
    color: 'red',
    fontSize: 18,
  },
  icon: {
    width: '15%',
  },
  Headertxt: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  changePassword: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  Icon: {
    height: 70,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ChangeTxt: {
    color: '#000',
    fontSize: 16,
  },
});
