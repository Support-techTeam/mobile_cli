import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {auth} from '../util/firebase/firebaseConfig';
import SplashScreen from 'react-native-splash-screen';
import Splashscreen from './Splashscreen';
import NetworkScreen from './NetworkError';
import {useSelector} from 'react-redux';
// import {networkState} from '../util/redux/networkState/network.slice';
import {TabContextProvider} from '../context/TabContext';

const AppNavigationContainer = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const scheme = useColorScheme();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const networkState = useSelector(state => state.networkState.network);

  useLayoutEffect(() => {
    if (
      auth.currentUser === undefined ||
      auth.currentUser === null ||
      auth.currentUser
    ) {
      SplashScreen.hide();
    }
  }, []);

  useLayoutEffect(() => {
    const subscriber = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return subscriber;
  }, []);
  return (
    <TabContextProvider>
      <NavigationContainer
        theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute();
        }}>
        {isLoading ? (
          <Splashscreen text="Checking Authentication..." />
        ) : user ? (
          networkState &&
          networkState?.isConnected &&
          networkState?.isInternetReachable ? (
            <AppStack />
          ) : (
            <NetworkScreen />
          )
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </TabContextProvider>
  );
};

export default AppNavigationContainer;
