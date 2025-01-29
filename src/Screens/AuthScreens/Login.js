/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import instance from '../../BaseUrl/BaseUrl';
import Loader from '../../Component/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import css from '../../CssFile/Css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Please Enter your password'),
});

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const animationTxtTextinput = useRef(new Animated.Value(0)).current;
  const animationButton = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationTxtTextinput, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [animationTxtTextinput]);

  useEffect(() => {
    Animated.timing(animationButton, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [animationButton]);

  const postApiCall = async values => {
    // const firebase_token = await AsyncStorage.getItem('fcm_token');
    setIsLoading(true);

    const payload = {
      email: values.email,
      password: values.password,
      firebase_token: '123456789',
    };
    try {
      const response = await instance.post('/login', payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response?.data?.token) {
        await AsyncStorage.setItem('auth_token', response?.data?.token);
        await AsyncStorage.setItem('Image', response?.data?.user?.image);
        await AsyncStorage.setItem('email', values.email);
        await AsyncStorage.setItem('password', values.password);

        const token = await AsyncStorage.getItem('auth_token');
        const email = await AsyncStorage.getItem('email');

        console.log('Stored auth_token:', token); // Log the saved token
        console.log('Stored email:', email); // Log the saved email

        const flagId = response?.data?.user?.flag;
        if (flagId === 1) {
          navigation.navigate('ChangePassword');
        } else {
          const actorId = response?.data?.user?.actor_id;
          if (actorId === 5) {
            navigation.replace('BottomDriver');
          } else if (actorId === 4) {
            navigation.replace('DrawerNavigation');
          } else {
            Alert.alert('Login Failed', 'Invalid email or password');
          }
        }

        // const actorId = response?.data?.user?.actor_id;
        // if (actorId === 5) {
        //   navigation.replace('BottomDriver');
        // } else if (actorId === 4) {
        //   navigation.replace('DrawerNavigation');
        // } else {
        //   Alert.alert('Login Failed', 'Invalid email or password');
        // }
      }
    } catch (error) {
      console.log('Login Api', error);
      Alert.alert(
        'Login Error',
        'An error occurred during login. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.MainContainer}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleTxt}>Welcome to</Text>
        <Text style={styles.titleTxt}>Zaroon Transport company</Text>
      </View>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={values => postApiCall(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Animated.View
              style={[
                styles.AnimatedView,
                {
                  transform: [
                    {
                      translateY: animationTxtTextinput.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-150, 3], // Animation range values
                      }),
                    },
                  ],
                },
              ]}>
              <View style={{alignSelf: 'flex-start', paddingLeft: 20}}>
                <Text style={styles.Txt}>Enter your account to continue</Text>
              </View>
              <View style={styles.Container}>
                <Text style={styles.TopTxt}>Email address</Text>
                <View style={styles.TextInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={values.email}
                    placeholder="Enter Email..."
                    placeholderTextColor={'gray'}
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <Text style={[styles.TopTxt, {marginTop: 20}]}>Password</Text>
                <View
                  style={[
                    styles.TextInputContainer,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <TextInput
                    style={[styles.textInput, {width: '90%'}]}
                    value={values.password}
                    placeholder="Enter Password..."
                    placeholderTextColor={'gray'}
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showHideButton}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
            </Animated.View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EnterEmail', {mode: 'forgot'})
              }>
              <Text style={styles.forgot}>Forgot password ?</Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.AnimatedView1,
                {
                  transform: [
                    {
                      translateY: animationButton.interpolate({
                        inputRange: [0, 1],
                        outputRange: [150, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{color: '#fff', fontSize: 18}}>Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </Formik>

      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    marginTop: '25%',
    paddingLeft: 20,
    width: '87%',
  },
  titleTxt: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#000',
  },
  TextInputContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    color: 'gray',
  },
  TopTxt: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  Txt: {
    color: 'gray',
    fontSize: 16,
  },
  button: {
    width: '70%',
    backgroundColor: css.primary,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '30%',
  },
  Container: {
    marginTop: '20%',
    width: '87%',
    alignSelf: 'center',
  },
  forgot: {
    color: css.secondary,
    textAlign: 'right',
    paddingRight: 30,
    paddingTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 15,
  },
  AnimatedView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AnimatedView1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
