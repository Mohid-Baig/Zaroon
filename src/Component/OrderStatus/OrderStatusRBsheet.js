/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderStatusRBsheet = ({selectedStatus, onStatusChange}) => {
  const statuses = [
    'Show All',
    'pending',
    'draft',
    'approved',
    'unapproved',
    'cancelled',
    // 'incomplete', 'completed',
  ];

  return (
    <View style={{padding: 20}}>
      {statuses.map((status, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onStatusChange(status)}
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: selectedStatus === status ? '#f0f0f0' : '#fff',
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 16, color: '#333'}}>{status}</Text>
          {selectedStatus === status && (
            <MaterialCommunityIcons name="check" size={20} color="#333" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OrderStatusRBsheet;
