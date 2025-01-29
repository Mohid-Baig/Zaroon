import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import css from '../../CssFile/Css';

const TextInputField = ({
  nameOfTextInput,
  placeholder,
  IconName,
  IconLibrary = AntDesign,
  keyboardType,
  value,
  onChangeText,
  editable,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{nameOfTextInput}</Text>
      <View style={styles.inputContainer}>
        <IconLibrary
          name={IconName}
          size={20}
          color={css.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default TextInputField;

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
    borderBottomColor: css.primary,
    borderBottomWidth: 3,
    borderRadius: 10,
    borderWidth: 0.2,
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingLeft: 35,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    position: 'absolute',
    left: 5,
  },
});
