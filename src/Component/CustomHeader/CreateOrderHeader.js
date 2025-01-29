import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CreateOrderHeader = ({onPress}) => {
  return (
    <View style={styles.Header}>
      <StatusBar backgroundColor={css.headercolor} />
      <TouchableOpacity style={styles.BackButton} onPress={onPress}>
        <AntDesign name="left" color="#fff" size={25} />
      </TouchableOpacity>
      <Text style={styles.HeaderTxt}>Let's Create Your Trip</Text>
    </View>
  );
};

export default CreateOrderHeader;

const styles = StyleSheet.create({
  Header: {
    backgroundColor: css.headercolor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: Platform.OS == 'ios' && 50,
  },
  HeaderTxt: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 40,
  },
  BackButton: {
    paddingLeft: 15,
  },
});
