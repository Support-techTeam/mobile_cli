import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import Button from '../component/buttons/Button';
import {userLogOut} from '../stores/AuthStore';
import {useDispatch, useSelector} from 'react-redux';
import {signOutUser} from '../util/redux/userAuth/user.auth.slice';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

//Screens
import Verification from '../screens/Authentications/Verification';
import PersonalDetails from '../screens/ProfileOnboardings/PersonalDetails';
import OnboardingScreen from '../screens/Authentications/OnboardingScreen';
import Splashscreen from './Splashscreen';
//Styles
import {getProfileDetails} from '../stores/ProfileStore';
import {setProfile} from '../util/redux/userProfile/user.profile.slice';
import {auth} from '../util/firebase/firebaseConfig';

const Stack = createNativeStackNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const AppStack = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userAuth.user);
  const isVerified = JSON.parse(userData)?.emailVerified
    ? JSON.parse(userData)?.emailVerified
    : JSON.parse(userData).user?.emailVerified;
  const userProfileData = useSelector(state => state.userProfile.profile);

  useEffect(() => {
    // fetch profile
    if (auth.currentUser !== null) {
      // console.log('Fetching profile');
      const fetchState = async () => {
        try {
          const res = await getProfileDetails();
          if (res?.data !== undefined) {
            if (res.error) {
              // console.error(error);
            } else {
              dispatch(setProfile(res?.data));
            }
          }
        } catch (error) {
          // console.error(error);
        }
      };

      fetchState();
      return () => {
        fetchState();
      };
    }
  }, []);

  // console.log('userProfileData', userProfileData?.email);
  // console.log('profileDetails', profileDetails?.city);
  // console.log('JSON.parse(user)', isVerified);
  // console.log('APPuserProfileData', userProfileData?.profileProgress);
  // console.log('auth.currentUser', auth.currentUser?.emailVerified);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userData && !isVerified && userProfileData?.profileProgress == null && (
        <>
          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{
              title: 'Verification',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetails}
            options={{
              title: 'Personal Details',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
        </>
      )}
      {userData &&
        isVerified &&
        userProfileData &&
        userProfileData?.profileProgress === null && (
          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetails}
            options={{
              title: 'Personal Details',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
        )}
      {userData &&
        isVerified &&
        userProfileData &&
        userProfileData?.profileProgress !== null && (
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{
              title: 'Onboarding',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
        )}
      {userData && !userProfileData && (
        <Stack.Screen
          name="Splashscreen"
          component={Splashscreen}
          options={{
            title: 'Splashscreen',
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />
      )}
    </Stack.Navigator>
    // )
  );
};

export default AppStack;
