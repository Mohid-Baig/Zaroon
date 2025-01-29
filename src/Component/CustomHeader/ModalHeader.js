/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import css from '../../CssFile/Css';

const ModalHeader = ({}) => {
  return (
    <View style={styles.Container}>
      <View style={{marginRight: 10}}>
        <Image
          style={styles.img}
          source={require('../../assets/AgentHome/headerImg2.png')}
        />
      </View>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: css.primary,
    padding: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  img: {
    height: 30,
    width: 120,
  },
});
