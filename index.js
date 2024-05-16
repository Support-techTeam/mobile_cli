/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {AppRegistry, Text, View} from 'react-native';
import App from './App';
import {name as appName, firebase_config} from './app.json';
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
        shadowOffset: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        flexWrap: 'wrap',
        height: '100%',
        minHeight: 70,
        padding: 5,
      }}
      contentContainerStyle={{
        padding: 5,
        backgroundColor: 'white',
        flexWrap: 'wrap',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
      }}
      text2NumberOfLines={10}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={{
        flex: 1,
        borderLeftColor: '#dc3545',
        borderRightColor: '#dc3545',
        shadowOffset: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        flexWrap: 'wrap',
        height: '100%',
        minHeight: 70,
        padding: 5,
      }}
      contentContainerStyle={{
        padding: 5,
        backgroundColor: 'white',
        flexWrap: 'wrap',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
      }}
      text2NumberOfLines={10}
    />
  ),

  info: props => (
    <BaseToast
      {...props}
      style={{
        flex: 1,
        borderLeftColor: '#17a2b8',
        borderRightColor: '#17a2b8',
        shadowOffset: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        flexWrap: 'wrap',
        height: '100%',
        minHeight: 70,
        padding: 5,
      }}
      contentContainerStyle={{
        padding: 5,
        backgroundColor: 'white',
        flexWrap: 'wrap',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
      }}
      text2NumberOfLines={10}
    />
  ),

  warning: props => (
    <ErrorToast
      {...props}
      style={{
        flex: 1,
        borderLeftColor: '#ffc107',
        borderRightColor: '#ffc107',
        shadowOffset: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        flexWrap: 'wrap',
        height: '100%',
        minHeight: 70,
        padding: 5,
      }}
      contentContainerStyle={{
        padding: 5,
        backgroundColor: 'white',
        flexWrap: 'wrap',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
      }}
      text2NumberOfLines={10}
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
