import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import Button from '../component/buttons/Button';
import {userLogOut} from '../stores/AuthStore';
import {useDispatch, useSelector} from 'react-redux';
import {signOutUser} from '../util/redux/userAuth/user.auth.slice';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Screens
import Verification from '../screens/Authentications/Verification';
import PersonalDetails from '../screens/ProfileOnboardings/PersonalDetails';
import OnboardingScreen from '../screens/Authentications/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const user = useSelector(state => state.userAuth.user);
  // console.log(JSON.parse(user).user?.emailVerified);

  // useEffect(() => {
  //     userLogOut();
  //     dispatch(signOutUser(null));
  // }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {JSON.parse(user).user && !JSON.parse(user).user?.emailVerified ? (
        <>
          <Stack.Screen name="Verification" component={Verification} />
        </>
      ) : JSON.parse(user).user &&
        JSON.parse(user).user?.emailVerified &&
        profile ? (
        <>
          {/* <Stack.Screen name="Verification" component={Verification} /> */}
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        </>
      ) : (
        <>
          {/* <Stack.Screen name="Verification" component={Verification} /> */}
          <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
