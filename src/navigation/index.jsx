import React, {useLayoutEffect, useRef} from 'react';
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
import {useSelector} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

const AppNavigationContainer = () => {
  const user = useSelector(state => state.userAuth.user);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const scheme = useColorScheme();
  useLayoutEffect(() => {
    if (
      auth.currentUser === undefined ||
      auth.currentUser === null ||
      auth.currentUser
    ) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }
  });
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
        // if (previousRouteName !== currentRouteName) {
        //   // Save the current route name for later comparison
        //   routeNameRef.current = currentRouteName;

        //   // Replace the line below to add the tracker from a mobile analytics SDK
        //   console.log(previousRouteName);
        //   console.log(currentRouteName);
        // }
      }}>
      {auth.currentUser !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
