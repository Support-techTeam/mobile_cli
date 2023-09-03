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
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen';
import Splashscreen from './Splashscreen';
import {UserProvider} from '../context/userContext';

const AppNavigationContainer = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const scheme = useColorScheme();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
      // console.log('user', JSON.stringify(user));
      setUser(user);
      setIsLoading(false);
    });

    return subscriber;
  }, []);
  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute();
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute();
        console.log(currentRouteName);
      }}>
      {!user && isLoading ? (
        <Splashscreen text="Checking Authentication..." />
      ) : user ? (
        // <UserProvider>
        <AppStack />
      ) : (
        // </UserProvider>
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
