/* eslint-disable react-native/no-inline-styles */
import {Text, View} from 'react-native';
import React from 'react';
const ProfileCard = ({headtext, bodytext, icon}) => {
  return (
    <View style={{width: '95%', flexDirection: 'row', alignSelf: 'center'}}>
      <View
        style={{
          height: 70,
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon}
      </View>
      <View style={{width: '80%', justifyContent: 'center'}}>
        <Text style={{fontSize: 16, color: '#000'}}>{headtext}</Text>
        <Text style={{fontSize: 14, color: 'gray'}}>{bodytext}</Text>
      </View>
    </View>
  );
};

export default ProfileCard;
