import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const FromToButton = ({nameOfTextInput, placeHolder, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.label}>{nameOfTextInput}</Text>
      <View style={styles.inputContainer}>
        <EvilIcons
          name={'location'}
          size={20}
          color={'#00A978'}
          style={styles.icon}
        />
        <View style={styles.TextInput}>
          <Text style={styles.Txt}>{placeHolder}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FromToButton;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',

    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#00A978',
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
  },
  TextInput: {
    height: 50,
    justifyContent: 'center',
  },
  icon: {
    paddingHorizontal: 5,
  },
  Txt: {
    color: 'gray',
  },
});
