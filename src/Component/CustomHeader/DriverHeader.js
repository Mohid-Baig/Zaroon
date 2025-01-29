import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';

const DriverHeader = ({title, icon, onPress}) => {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.Txt}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.Icon}>
        {icon}
      </TouchableOpacity>
    </View>
  );
};

export default DriverHeader;

const styles = StyleSheet.create({
  MainContainer: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: css.headercolor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 50 : 30,
  },
  Txt: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '500',
  },
  Icon: {
    position: 'absolute',
    right: 20,
    top: Platform.OS == 'ios' ? 50 : 35,
  },
});
