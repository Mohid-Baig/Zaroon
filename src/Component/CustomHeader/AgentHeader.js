/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import css from '../../CssFile/Css';
import {SafeAreaView} from 'react-native-safe-area-context';

const AgentHeader = ({onPress, onNotification, notification}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.Left}>
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="menu" size={25} color="#fff" />
        </TouchableOpacity>
        <View>
          {notification && notification?.unread_count > 0 && (
            <TouchableOpacity onPress={onNotification} style={styles.bellDot}>
              <Octicons name="dot-fill" size={12} color="red" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onNotification} style={styles.bell}>
            <Octicons name="bell" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginRight: -30, marginTop: -20}}>
        <Image
          style={styles.img}
          source={require('../../assets/AgentHome/headerImg3.png')}
        />
      </View>
    </View>
  );
};

export default AgentHeader;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: css.primary,
    padding: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  Left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    // backgroundColor:'red'
  },
  bell: {
    paddingLeft: 15,
  },
  img: {
    height: 50,
    width: 150,
  },
  bellDot: {
    position: 'absolute',
    top: -5,
    right: 0,
    zIndex: 2,
  },
});
