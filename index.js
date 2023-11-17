/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {AppRegistry, Text, View} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {NativeBaseProvider, extendTheme} from 'native-base';
import networkService from './src/util/NetworkService';

// Initialize network service
// const network = new networkService();
const newColorTheme = {
  brand: {
    900: '#5B8DF6',
    800: '#ffffff',
    700: '#cccccc',
  },
};

const themeNative = extendTheme({
  colors: newColorTheme,
});

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        flex: 1,
        borderLeftColor: '#28a745',
        borderRightColor: '#28a745',
        borderRightWidth: 2,
        backgroundColor: '#28a745',
        flexWrap: 'wrap',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: '#28a745',
        flexWrap: 'wrap',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 14,
        color: 'white',
        flexWrap: 'wrap',
      }}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={{
        flexWrap: 'wrap',
        flex: 1,
        borderLeftColor: '#dc3545',
        borderRightColor: '#dc3545',
        borderRightWidth: 2,
        backgroundColor: '#dc3545',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: '#dc3545',
        flexWrap: 'wrap',
        flex: 1,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 14,
        color: 'white',
        flexWrap: 'wrap',
      }}
    />
  ),

  info: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#17a2b8',
        borderRightColor: '#17a2b8',
        borderRightWidth: 2,
        backgroundColor: '#17a2b8',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: '#17a2b8',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 14,
        color: 'white',
      }}
    />
  ),

  warning: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ffc107',
        borderRightColor: '#ffc107',
        borderRightWidth: 2,
        backgroundColor: '#ffc107',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: '#ffc107',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
      }}
      text2Style={{
        fontSize: 14,
        color: 'white',
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
  <NativeBaseProvider theme={themeNative}>
    <App />
    <Toast config={toastConfig} />
  </NativeBaseProvider>
);
AppRegistry.registerComponent(appName, () => AppWithToast);
