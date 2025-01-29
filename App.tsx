import React, {useEffect} from 'react';
import Navigation from './src/Navigation/StackNavigation/Navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import {getFcmToken, registerListenerWithFCM} from './src/utils/fcmHelper';

const App = () => {
  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
