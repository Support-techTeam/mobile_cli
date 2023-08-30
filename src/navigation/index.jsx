import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../util/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLogOut} from '../stores/AuthStore';
import {signOutUser} from '../util/redux/userAuth/user.auth.slice';
import {useDispatch, useSelector} from 'react-redux';

const AppNavigationContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userAuth.user);
  // console.log(user?.user?.emailVerified);
  //monitor auth state change events
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      await AsyncStorage.clear();
      if (user) {
        //prevent onBoarding screen from coming up
        await AsyncStorage.setItem('hasUser', 'true');
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(async () => {
  //   await AsyncStorage.clear();
  // }, []);

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
