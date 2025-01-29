import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import css from '../../../CssFile/Css';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';

const DetailHelp = ({navigation, route}) => {
  const {section, description} = route.params;
  return (
    <View style={css.MainContainer}>
      <SimpleHeader onPress={() => navigation.goBack()} name={'User Guide'} />

      <View>
        <Text style={styles.Header}>{section}</Text>
        <View style={styles.Container}>
          <Text style={styles.descrip}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailHelp;

const styles = StyleSheet.create({
  Txt: {
    color: '#000',
  },
  Header: {
    color: '#000',
    marginTop: 10,
    fontSize: 22,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  Container: {
    padding: 10,
    paddingHorizontal: 20,
  },
  descrip: {
    color: '#242323',
    fontSize: 16,
    fontWeight: '300',
  },
});
