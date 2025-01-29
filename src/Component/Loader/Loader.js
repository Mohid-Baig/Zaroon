import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import css from '../../CssFile/Css';

// const {width, height} = Dimensions.get('window');

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={css.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default Loader;
