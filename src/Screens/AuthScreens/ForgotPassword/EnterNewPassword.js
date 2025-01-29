import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../../Component/CustomHeader/CustomHeader';
import Loader from '../../../Component/Loader/Loader';
import css from '../../../CssFile/Css';
import instance from '../../../BaseUrl/BaseUrl';
import Toast from 'react-native-simple-toast';

const EnterNewPassword = ({navigation, route}) => {
  const {otp} = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword.length < 8) {
      // Toast.show('Password must be at least 8 characters long', Toast.SHORT);
      Alert.alert(
        'Validation Error',
        'Password must be at least 8 characters long',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      // Toast.show('Passwords do not match', Toast.SHORT);
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    const payload = {
      password: newPassword,
      password_confirmation: confirmPassword,
      otp: otp,
    };

    try {
      setIsLoading(true);
      const response = await instance.post('/password/reset', payload);
      if (response?.data?.message) {
        console.log('sent', response?.data?.message);
        Toast.show('Password updated successfully', Toast.SHORT);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader color={'#000'} title="Reset Password" />

      <View style={styles.container}>
        <Text style={styles.headerText}>Enter New Password</Text>

        <Text style={styles.Txt}>
          Enter new password with a minimum of 8 characters.
        </Text>

        <TextInput
          style={styles.textInput}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="New Password"
          placeholderTextColor={'gray'}
          secureTextEntry
          textContentType="newPassword"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor={'gray'}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

export default EnterNewPassword;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    padding: 20,
    paddingHorizontal: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
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
  Txt: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
  },
});
