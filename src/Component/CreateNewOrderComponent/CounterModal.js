import React from 'react';
import {Modal, TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const CounterModal = ({
  visible,
  onClose,
  value,
  increaseValue,
  decreaseValue,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={onClose}
        activeOpacity={1}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={decreaseValue}
            style={[styles.modalButton, value === 0 && styles.disabledButton]}
            disabled={value === 0}>
            <Text style={styles.modalButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.modalValue}>{value}</Text>
          <TouchableOpacity onPress={increaseValue} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#3E4A89',
    borderRadius: 5,
    margin: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalValue: {
    fontSize: 24,
    marginVertical: 20,
  },
});

export default CounterModal;
