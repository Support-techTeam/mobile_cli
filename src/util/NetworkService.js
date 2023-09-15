import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setNetwork} from './redux/networkState/network.slice';

const colors = {
  connected: '#4CAF50',
  internetReachable: '#FFEB3B',
  disconnected: '#F44336',
};

const NetworkStatus = () => {
  // Define state variables for network state and color
  const [networkState, setNetworkState] = useState(null);
  const [color, setColor] = useState(colors.disconnected);
  const dispatch = useDispatch();

  // Define a function to update the color based on network state
  const updateMessage = state => {
    if (state.isConnected && state.isInternetReachable) {
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: 'NETWORK INFORMATION',
        text2: `Network Connected!`,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else if (state.isConnected && !state.isInternetReachable) {
      Toast.show({
        type: 'warning',
        position: 'top',
        topOffset: 50,
        text1: 'NETWORK INFORMATION',
        text2: `Internet Not Reachable!`,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: 'NETWORK INFORMATION',
        text2: `No Network connected!`,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    }
  };

  // Use useEffect hook to subscribe and unsubscribe to network state updates
  useEffect(() => {
    // Get the network state once
    NetInfo.fetch().then(state => {
      setNetworkState(state);
      updateMessage(state);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetwork(state));
      setNetworkState(state);
      updateMessage(state);
    });

    // Unsubscribe from network state updates
    return () => {
      unsubscribe();
    };
  }, []);
};

export default NetworkStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  indicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
