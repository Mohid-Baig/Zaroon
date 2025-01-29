import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {EventType} from '@notifee/react-native';

// Request and check notification permissions for iOS and Android
/* export const checkApplicationNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    // For iOS, request permission via Firebase SDK
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS notification permission granted');
    } else {
      console.log('iOS notification permission denied');
    }
  }

  if (Platform.OS === 'android') {
    // For Android 13 and above, request the POST_NOTIFICATIONS permission
    const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
    const result = await request(permission);

    console.log('POST_NOTIFICATIONS permission status:', result);
    if (result !== 'granted') {
      console.log('Notification permission not granted');
      return false; // Permission denied
    }

    // For older Android versions (below Android 13), you do not need to request notification permission separately
    if (Platform.Version < 33) {
      console.log(
        'Android version below 13, no need to request POST_NOTIFICATIONS permission',
      );
      return true; // Automatically allowed in older versions
    }
  }

  return true; // Default permission granted if no issues
}; */
export const checkApplicationNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    // iOS permission request using Firebase SDK
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS notification permission granted');
    } else {
      console.log('iOS notification permission denied');
    }
    return enabled;
  }

  if (Platform.OS === 'android') {
    // Android 13 and above requires POST_NOTIFICATIONS permission
    if (Platform.Version >= 33) {
      try {
        // Request permission using PermissionsAndroid for Android 13 and above
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('POST_NOTIFICATIONS permission status:', result);

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission not granted');
          return false; // Permission denied
        } else {
          console.log('Notification permission granted');
          return true; // Permission granted
        }
      } catch (error) {
        console.error('Permission request failed:', error);
        return false; // If permission request fails, return false
      }
    } else {
      // For Android versions below 13, permission handling is different
      console.log(
        'Android version below 13, no need to request POST_NOTIFICATIONS permission',
      );
      return true; // Automatically granted in older versions
    }
  }

  return true; // Default permission granted if no issues
};

// Get the FCM token after permissions are granted
export const getFcmToken = async () => {
  let token = null;

  // Check and request notification permissions
  const hasPermission = await checkApplicationNotificationPermission();
  if (!hasPermission) {
    console.log('Permission not granted');
    return token; // Return null or handle error as needed
  }

  // Register device for remote notifications (ensure device is registered)
  await registerAppWithFCM();

  try {
    // Get the FCM token from Firebase
    token = await messaging().getToken();
    console.log('FCM Token:', token);

    // Store the token in AsyncStorage (optional)
    await AsyncStorage.setItem('fcm_token', token);
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }

  return token;
};

// Register device for remote messaging (required before getting token)
export async function registerAppWithFCM() {
  console.log('Checking device registration for remote messages...');

  // Ensure device is registered for remote messages
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      console.log('Device registered for remote messages.');
    } catch (error) {
      console.log('Error registering device for remote messages:', error);
    }
  }
}

// Unregister device for remote messaging (optional)
export async function unRegisterAppWithFCM() {
  console.log('Checking device registration for remote messages...');

  // Ensure device is unregistered for remote messages
  if (messaging().isDeviceRegisteredForRemoteMessages) {
    try {
      await messaging().unregisterDeviceForRemoteMessages();
      console.log('Device unregistered for remote messages.');
    } catch (error) {
      console.log('Error unregistering device for remote messages:', error);
    }
  }
}

// Register listeners for foreground, background, and quit state notifications
export function registerListenerWithFCM() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('onMessage Received:', JSON.stringify(remoteMessage));

    if (
      remoteMessage?.notification?.title &&
      remoteMessage?.notification?.body
    ) {
      onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage?.data,
      );
    }
  });

  // Handle foreground events for notifications (when app is in the foreground)
  notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        break;
    }
  });

  // Handle notification opened from background or quit state
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log(
      'onNotificationOpenedApp Received',
      JSON.stringify(remoteMessage),
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  return unsubscribe;
}

// Function to display notifications in the foreground
async function onDisplayNotification(title, body, data) {
  console.log('onDisplayNotification:', JSON.stringify(data));

  // Request permission to display notifications (iOS)
  await notifee.requestPermission();

  // Create a notification channel for Android
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display notification
  await notifee.displayNotification({
    title: title,
    body: body,
    data: data,
    ios: {
      sound: 'default', // Or specify a custom sound file name (without extension)
    },
    android: {
      channelId,
      sound: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
}
