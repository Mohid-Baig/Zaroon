import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import css from '../../CssFile/Css';

const CustomPicker = ({selectedValue, onValueChange, items, label}) => {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(label);

  // console.log(items,'item.........')

  useEffect(() => {
    const selectedItem = items?.find(item => item?.id === selectedValue);
    if (selectedItem) {
      setPlaceholder(`You have selected ${selectedItem.name}`);
    }
  }, [selectedValue, items]);

  const handleValueChange = (id, modalid, name) => {
    setPlaceholder(`You have selected ${name}`);
    // onValueChange(value);
    onValueChange({id, modalid});
    setOpen(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleValueChange(item?.id, item?.modalid, item?.name)}>
      <Text style={styles.itemText}>{item?.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(!open)}>
        <Text style={styles.text}>{placeholder}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="white"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => {
              // console.log( item?.id)
              item?.id.toString();
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: css.secondary,
    borderRadius: 10,
    padding: 10,
    width: '95%',
  },
  text: {
    color: '#fff',
    fontSize: 17,
  },
  dropdownContainer: {
    width: '95%',
    backgroundColor: css.secondary,
    borderRadius: 10,
    marginTop: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 17,
    color: '#fff',
  },
});

export default CustomPicker;

// import React, { useState } from 'react';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { StyleSheet, View } from 'react-native';
// import css from '../../CssFile/Css';
// import Ionicons from 'react-native-vector-icons/Ionicons'

// const CustomPicker = ({ selectedValue, onValueChange, items, label }) => {
//     const [open, setOpen] = useState(false);

//     const dropdownItems = items.map(item => ({
//         label: item.name,
//         value: item.id,
//         seats: item.seats,
//         bags: item.bags,
//     }));

//     return (
//         <View style={[styles.dropdownContainer,{height: open === true ? 200 : 'auto'}]}>
//             <DropDownPicker
//                 open={open}
//                 value={selectedValue}
//                 items={dropdownItems}
//                 setOpen={setOpen}
//                 setValue={onValueChange}
//                 placeholder={label}
//                 style={styles.dropdown}
//                 textStyle={styles.text}
//                 dropDownContainerStyle={styles.dropdownContainerStyle}
//                 placeholderStyle={{color:'#fff'}}
//                 ArrowUpIconComponent={({ style }) => (
//                     <Ionicons name="chevron-up" size={20} color="white" />
//                 )}
//                 ArrowDownIconComponent={({ style }) => (
//                     <Ionicons name="chevron-down" size={20} color="white" />
//                 )}
//                 TickIconComponent={({ style }) => (
//                     <Ionicons name="checkmark" size={20} color="white" />
//                 )}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     dropdownContainer: {
//         marginTop: 5,
//         paddingHorizontal:10,
//         // width:'95%',
//         alignSelf:'center',
//     },
//     dropdown: {
//         // backgroundColor: '#6e7adb',
//         backgroundColor: css.secondary,
//         borderRadius: 10,
//         elevation: 1,
//         borderWidth:0,
//     },
//     dropdownContainerStyle: {
//         backgroundColor:  css.secondary,
//         elevation: 1,
//         borderWidth:0,
//     },
//     text:{
//         color:'#fff',
//         fontSize:17,
//     },
// });

// export default CustomPicker;

// import React from 'react';
// import { Picker } from '@react-native-picker/picker';
// import { StyleSheet, View } from 'react-native';

// const CustomPicker = ({ selectedValue, onValueChange, items, label }) => {
//     return (
//         <View style={styles.TextInputContainer}>
//             <Picker
//                 selectedValue={selectedValue}
//                 dropdownIconColor={'gray'}
//                 style={{color:'#000'}}
//                 onValueChange={onValueChange}>
//                 <Picker.Item label={label} value={label} />
//                 {items.map((item, index) => (
//                     <Picker.Item key={index} label={item.name || item.label} value={item.id || item.value} />
//                 ))}
//             </Picker>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     TextInputContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         elevation: 1,
//         marginTop: 5
//     },
// });

// export default CustomPicker;
