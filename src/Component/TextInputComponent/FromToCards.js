import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const FromToCards = ({Txt, onPress, icon}) => {
  console.log('form to cards', Txt);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon}
      <Text style={styles.Txt}>{Txt}</Text>
    </TouchableOpacity>
  );
};

export default FromToCards;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Txt: {
    color: '#000',
    paddingLeft: 5,
  },
});
