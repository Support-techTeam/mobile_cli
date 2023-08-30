/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {AppRegistry, Text, View} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderRightColor: 'green',
        borderRightWidth: 2,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        borderRightColor: 'red',
        borderRightWidth: 2,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  info: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'skyblue',
        borderRightColor: 'skyblue',
        borderRightWidth: 2,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  warning: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'orange',
        borderRightColor: 'orange',
        borderRightWidth: 2,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'blue'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

const AppWithToast = () => (
  <>
    <App />
    <Toast config={toastConfig} />
  </>
);
AppRegistry.registerComponent(appName, () => AppWithToast);
