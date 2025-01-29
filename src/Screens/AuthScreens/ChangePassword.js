/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import css from '../../CssFile/Css';
import Loader from '../../Component/Loader/Loader';
import instance from '../../BaseUrl/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const ChangePassword = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    const payload = {
      old_password: oldPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    };
    try {
      setIsLoading(true);
      const response = await instance.post('/change-password', payload);
      if (response?.data?.message) {
        Toast.show('Password Changed Succcessfully', Toast.SHORT);
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('auth_token');
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Change Password Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <Text style={styles.headerText}>Change Password</Text>

        <Text style={styles.Txt}>
          Enter new password with a minimum of 8 characters.
        </Text>
        <Text style={styles.Txt}>
          New password must be different from old password
        </Text>

        <View style={[styles.inputContainer, {marginTop: 20}]}>
          <TextInput
            style={styles.textInput}
            value={oldPassword}
            placeholder="Enter old password"
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            onChangeText={setOldPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newPassword}
            placeholder="Enter new password"
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={confirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  Txt: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    color: 'gray',
  },
  button: {
    backgroundColor: css.primary,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
