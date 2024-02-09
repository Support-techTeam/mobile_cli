import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {appFlyerIos, appFlyerAndroid} from '../../../app.json';
import appsFlyer from 'react-native-appsflyer';

const appsFlyerOption = {
  devKey: Platform.select({ios: appFlyerIos, android: appFlyerAndroid}),
  isDebug: false,
  appId: Platform.select({ios: 'id6447363171', android: ''}),
  onInstallConversionDataListener: true, //Optional
  onDeepLinkListener: true, //Optional
  timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
};

const InitializeSDKHandler = props => {
  useEffect(() => {
    //  AppFlyer initialization

    appsFlyer.initSdk(
      appsFlyerOption,
      result => {
        // console.log(result);
      },
      error => {
        // console.error(error);
      },
    );
  }, []);

  return null;
};

export default InitializeSDKHandler;
