import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const OrderCard = ({title, image, onPress, count, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.Container}>
      <View style={style}>
        <Text style={styles.counter}>{count}</Text>
      </View>
      <Image style={styles.Img} source={image} />
      <Text style={styles.Txt}>{title}</Text>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    margin: 5,
    width: 78,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 3,
    position: 'relative',
    marginTop: 20,
  },
  Txt: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 20,
  },
  Img: {
    height: 50,
    width: 50,
    position: 'absolute',
    top: -12,
  },
  Count: {
    backgroundColor: '#DD3C3C',
    position: 'absolute',
    right: -8,
    top: -8,
    padding: 2,
    minHeight: 18,
    minWidth: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    color: '#fff',
    fontSize: 10,
  },
});
