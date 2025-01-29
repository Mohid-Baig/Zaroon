import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

const CustomHeader = ({
  title,
  rightIcon,
  onPress,
  backgroundColor,
  color,
  textstyle,
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.Main, {backgroundColor}]}>
      <View style={styles.Header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.ImageContainer}>
          <Entypo name="chevron-left" color={color} size={30} />
        </TouchableOpacity>
        <View style={styles.TxtView}>
          <Text style={[styles.Txt, {color}, textstyle]}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.ImageContainer}>
          <MaterialCommunityIcons name={rightIcon} color="#fff" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  ImageContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  Main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    width: '100%',
  },
  TxtView: {
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Txt: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
