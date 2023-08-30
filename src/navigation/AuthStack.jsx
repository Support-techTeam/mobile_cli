import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Authentications/OnboardingScreen';
import Login from '../screens/Authentications/Login';
import SignUp from '../screens/Authentications/SignUp';
import ForgotPassword from '../screens/Authentications/ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  const [hasUser, setHasUser] = useState(null);
  const getUSerStorage = async () => {
    try {
      const hasUserr = await AsyncStorage.getItem('hasUser');
      if (hasUserr !== null) {
        setHasUser(hasUserr);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUSerStorage();
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!hasUser ? (
        <>
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
