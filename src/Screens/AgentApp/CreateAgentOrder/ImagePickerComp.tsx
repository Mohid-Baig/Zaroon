/* eslint-disable react-native/no-inline-styles */
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {launchCamera, MediaType} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import css from '../../../CssFile/Css';

type ImagePickerCompProps = {
  label: string;
  image: string | null;
  setImage: (image: string | null) => void;
};

const ImagePickerComp = ({label, image, setImage}: ImagePickerCompProps) => {
  console.log('image picker comp image', image, 'label', label);

  //request camera permission

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take pictures',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('image picker comp camera permission granted');
      } else {
        console.log('image picker comp camera permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermission();
    }
  }, []);

  const openCamera = () => {
    console.log('open camera fn');
    const options = {
      mediaType: 'photo' as MediaType,
      saveToPhotos: false,
      includeBase64: false,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('user cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets[0]?.uri) {
          setImage(response.assets[0].uri);
        }
      }
    });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={openCamera}>
      <View style={styles.inputContainer}>
        <Ionicons name="camera-outline" size={20} color={'#000'} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {image && (
        <View style={{flexDirection: 'row', columnGap: 8}}>
          <TouchableOpacity
            style={styles.imageFieldRetake}
            onPress={openCamera}>
            <Text style={styles.imageFieldtext}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageFieldView}>
            <Text style={styles.imageFieldtext}>View</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#757575',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 3,
    fontSize: 16,
    color: '#4c4c4c',
  },
  imageFieldRetake: {
    backgroundColor: css.secondary,
    padding: 3,
    borderRadius: 5,
  },
  imageFieldtext: {
    color: '#fff',
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  imageFieldView: {
    backgroundColor: css.primary,
    padding: 3,
    borderRadius: 5,
  },
});
