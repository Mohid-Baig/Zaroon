import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import css from '../../CssFile/Css';

const TravellerCounter = ({
  addAdult,
  subAdult,
  adultCount,
  addChild,
  subChild,
  childCount,
  addLuggage,
  subLuggage,
  luggageCount,
}) => {
  const size = 24;
  return (
    <View style={styles.Container}>
      <View style={styles.InnerContainer}>
        <TouchableOpacity onPress={addAdult}>
          <AntDesign name="plussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
        <Text style={styles.txt}>{adultCount} Adults</Text>
        <TouchableOpacity onPress={subAdult}>
          <AntDesign name="minussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.InnerContainer}>
        <TouchableOpacity onPress={addChild}>
          <AntDesign name="plussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
        <Text style={styles.txt}>{childCount} Childs</Text>
        <TouchableOpacity onPress={subChild}>
          <AntDesign name="minussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.InnerContainer}>
        <TouchableOpacity onPress={addLuggage}>
          <AntDesign name="plussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
        <Text style={styles.txt}>{luggageCount} Bags</Text>
        <TouchableOpacity onPress={subLuggage}>
          <AntDesign name="minussquare" size={size} color={css.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TravellerCounter;

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  InnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    color: '#000',
    paddingHorizontal: 3,
  },
});
