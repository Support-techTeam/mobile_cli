import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setNetwork} from './redux/networkState/network.slice';

const NetworkStatus = () => {
  const dispatch = useDispatch();

  const updateMessage = state => {
    if (state?.isConnected && state?.isInternetReachable) {
      // console.log
    } else if (state?.isConnected && !state?.isInternetReachable) {
      // Toast.show({
      //   type: 'warning',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: 'NETWORK INFORMATION',
      //   text2: `Internet Not Reachable!`,
      //   visibilityTime: 3000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: 'NETWORK INFORMATION',
      //   text2: `No Network connected!`,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    }
  };

  // Use useEffect hook to subscribe and unsubscribe to network state updates
  useEffect(() => {
    // Get the network state once
    NetInfo.fetch().then(state => {
      updateMessage(state);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetwork(state));
      updateMessage(state);
    });

    // Unsubscribe from network state updates
    return () => {
      unsubscribe();
    };
  }, []);
};

export default NetworkStatus;
