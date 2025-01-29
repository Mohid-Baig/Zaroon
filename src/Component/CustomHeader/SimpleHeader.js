import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import css from '../../CssFile/Css';

const SimpleHeader = ({onPress, name, onCalenderPress, Icon}) => {
  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={onPress} style={styles.icon}>
        <AntDesign name="left" color="#fff" size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>{name}</Text>

      <TouchableOpacity onPress={onCalenderPress} style={styles.calenderIcon}>
        {Icon}
      </TouchableOpacity>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // marginTop: 10,
    justifyContent: 'center',
    backgroundColor: css.primary,
    paddingVertical: 15,
    paddingTop: Platform.OS == 'ios' && 50,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: Platform.OS == 'ios' && 50,
  },
  calenderIcon: {
    position: 'absolute',
    right: 25,
    top: Platform.OS == 'ios' && 50,
  },
});
