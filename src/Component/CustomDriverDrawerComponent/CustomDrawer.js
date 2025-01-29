/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CustomDrawer = ({isVisible, onClose, children}) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent'},
      ]}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View
        style={[styles.drawer, {transform: [{translateX: slideAnim}]}]}>
        <View style={styles.drawerContent}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%', // Overlay takes 30% of the screen width on the left
    height: '100%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%', // Drawer takes 70% of the screen width
    height: '100%',
    backgroundColor: 'transparent', // Drawer background is transparent
  },
  drawerContent: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#fff',
  },
});

export default CustomDrawer;
