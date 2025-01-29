import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../Component/CustomHeader/CustomHeader';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import css from '../../../CssFile/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const EnterEmail = ({navigation, route}) => {
  const {mode} = route.params;
  const [enterEmail, setEnterEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      if (mode === 'change') {
        const email = await AsyncStorage.getItem('email');
        if (email) {
          setEnterEmail(email);
        }
      }
    };

    fetchEmail();
  }, [mode]);

  const handlePress = async () => {
    if (!enterEmail) {
      Alert.alert('Input Error', 'Please enter an email address.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await instance.post('/password/email', {
        email: enterEmail,
      });
      if (response?.data?.message) {
        Toast.show('OTP sent to your email', Toast.SHORT);
        navigation.navigate('EnterOptp', {email: enterEmail});
      }
    } catch (error) {
      Alert.alert('Input Error', 'Please enter a valid email address.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        color={'#000'}
        title={mode === 'change' ? 'Change Password' : 'Forgot Password'}
      />

      <View style={styles.Container}>
        <Text style={styles.TextHeader}>
          {mode === 'change' ? 'Change Your Password' : 'Find your account'}
        </Text>
        <Text style={styles.Txt}>
          Enter your email for reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={setEnterEmail}
            value={enterEmail}
            placeholder="Enter your email"
            placeholderTextColor={'gray'}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        <Text style={styles.Txt}>
          You may receive email from us for security and login purpose.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          // onPress={()=>navigation.navigate('EnterNewPassword')}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

export default EnterEmail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: '#000',
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
  Container: {
    padding: 20,
    paddingHorizontal: 30,
  },
  TextHeader: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  Txt: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
  },
});
