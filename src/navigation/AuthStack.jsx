import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Authentications/OnboardingScreen';
import Login from '../screens/Authentications/Login';
import SignUp from '../screens/Authentications/SignUp';
import ForgotPassword from '../screens/Authentications/ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const config = {
  animation: 'slide',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const AuthStack = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  useEffect(() => {
    async function checkOnboardingState() {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        if (value !== null) {
          setOnboardingCompleted(JSON.parse(value));
        } else {
          await AsyncStorage.setItem(
            'onboardingCompleted',
            JSON.stringify(false),
          );
          setOnboardingCompleted(false);
        }
      } catch (error) {
        setOnboardingCompleted(false);
      }
    }
    checkOnboardingState();
  }, []);

  return (
    onboardingCompleted != null && (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!onboardingCompleted ? (
          <>
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
            />
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
    )
  );
};

export default AuthStack;
