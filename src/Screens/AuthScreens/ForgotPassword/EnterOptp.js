/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import OTPTextView from 'react-native-otp-textinput';
import CustomHeader from '../../../Component/CustomHeader/CustomHeader';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import css from '../../../CssFile/Css';
import Toast from 'react-native-simple-toast';

const EnterOptp = ({navigation, route}) => {
  const {email} = route.params;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      const response = await instance.post('/password/email', {email: email});
      if (response?.data?.message) {
        console.log('Response:', response.data);
        Toast.show('Resend OTP', Toast.SHORT);
        setTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await instance.post('/otp/verify', {otp: otp});
      console.log(response?.data?.message);
      if (response?.data?.message) {
        Toast.show('Varified OTP', Toast.SHORT);
        navigation.navigate('EnterNewPassword', {otp: otp});
      }
    } catch (error) {
      Toast.show('Invalid or expired OTP', Toast.SHORT);
      console.log('Entered OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader color={'#000'} title="Email Verification" />

      <View style={styles.Containers}>
        <Text style={styles.headerText}>Get Your Code</Text>
        <Text style={styles.Txt}>
          Please enter the 6-digit code that was sent to your email address.
        </Text>

        <OTPTextView
          containerStyle={styles.otpContainer}
          textInputStyle={styles.otpInput}
          handleTextChange={setOtp}
          inputCount={6}
          keyboardType="numeric"
        />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.Txt}>If you don't receive the code.</Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.headerText, {fontSize: 16}]}> Resend?</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.Txt}>({timer}s) </Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

export default EnterOptp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  otpContainer: {
    marginBottom: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    width: 40,
    height: 60,
  },
  button: {
    backgroundColor: css.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  Containers: {
    marginTop: 20,
    marginHorizontal: 35,
  },
  Txt: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
  },
});
