import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const RemotePushController = () => {
  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    // console.log('DEVICE TOKEN', fcmToken);
  };
  const notificationsConfigureAndroid = () => {
    try {
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'your_channel_id',
            channelName: 'My channel',
            channelDescription: 'Notifications channel',
            playSound: false,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`createChannel returned '${created}'`),
        );
        PushNotification.getChannels(function (channel_ids) {
          console.log(channel_ids);
        });
        messaging().onMessage(async (remoteMessage) => {
          PushNotification.localNotification({
            message: remoteMessage.notification.body,
            title: remoteMessage.notification.title,
            bigPictureUrl: remoteMessage.notification.android.imageUrl,
            smallIcon: remoteMessage.notification.android.imageUrl,
            channelId: 'fcm_fallback_notification_channel',
            vibrate: true,
          });
        });
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const notificationsConfigureForiOS = async () => {
    messaging().onMessage(message => {
      console.log('REMOTE NOTIFICATION ==>', message);
      PushNotificationIOS.presentLocalNotification({
        alertTitle: message.notification?.title,
        alertBody: message.notification?.body,
      });
    });
  };
  useEffect(() => {
    getToken();
    notificationsConfigureAndroid();
    notificationsConfigureForiOS();
  }, []);

  return null;
};

export default RemotePushController;
