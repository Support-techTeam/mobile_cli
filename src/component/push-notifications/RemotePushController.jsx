import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const RemotePushController = () => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('Platform ==>', Platform.OS);
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('Platform ==>', Platform.OS);
        console.log('REMOTE NOTIFICATION ==>', notification);
        // required on iOS only
        notification.finish(PushNotificationIOS.FetchResult.NoData);

        // process the notification here
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Android only: GCM or FCM Sender ID
      senderID: '24130547176',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return null;
};

export default RemotePushController;
