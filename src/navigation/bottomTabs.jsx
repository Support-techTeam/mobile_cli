// import React from 'react';
import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, PanResponder, Image, Text} from 'react-native';
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {userLogOut} from '../stores/AuthStore';
import {resetStore} from '../util/redux/store';
import {useSelector} from 'react-redux';
import COLORS from '../constants/colors';
// Screens
import {Homescreen} from '../screens/HomeScreens';
import {Morescreens} from '../screens/MoreScreens';
import LoanStack from './LoanStack';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const timerId = useRef(false);
  const [timeForInactivityInSecond] = useState(600);
  const userProfileData = useSelector(state => state.userProfile.profile);
  // const tabBarHeight = useBottomTabBarHeight();
  useEffect(() => {
    resetInactivityTimeout();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    }),
  ).current;

  //Logout if the user is inactive for more than 10 minutes
  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      handleSignOut();
    }, timeForInactivityInSecond * 10000);
  };

  const handleSignOut = async () => {
    const res = await userLogOut();
    if (res?.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res?.title,
        text2: res?.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      await resetStore();
    }
  };

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={() => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.lendaBlue,
          tabBarInactiveTintColor: COLORS.Secondary,
          tabBarActiveBackgroundColor: COLORS.Light,
          tabBarStyle: {
            height: 65,
            marginBottom: 0,
            paddingBottom: 3,
            backgroundColor: COLORS.Light,
          },
          sceneAnimationEnabled: true,
          sceneAnimationType: 'shifting',
          shifting: true,
          compact: true,
        })}>
        <Tab.Screen
          name="Home"
          component={Homescreen}
          options={{
            tabBarLabel: ({focused, position}) => (
              <>
                <Text
                  style={{
                    color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                    fontSize: 12,
                    marginBottom: position === 'beside-icon' ? 0 : 5,
                    marginLeft: position === 'beside-icon' ? 20 : 0,
                    marginTop: position === 'beside-icon' ? 3 : 0,
                  }}>
                  Home
                </Text>
              </>
            ),
            tabBarIcon: ({color, size, focused}) => {
              return <Icon name="home" size={size} color={color} />;
            },
          }}
        />
        {userProfileData && userProfileData?.profileProgress === null ? null : (
          <Tab.Screen
            name="Loan"
            component={LoanStack}
            options={{
              tabBarLabel: ({focused, position}) => (
                <>
                  <Text
                    style={{
                      color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                      fontSize: 12,
                      marginBottom: position === 'beside-icon' ? 0 : 5,
                      marginLeft: position === 'beside-icon' ? 20 : 0,
                      marginTop: position === 'beside-icon' ? 3 : 0,
                    }}>
                    Loan
                  </Text>
                </>
              ),
              tabBarIcon: ({color, size}) => {
                return (
                  <Image
                    style={{
                      width: size,
                      height: size,
                      tintColor: color,
                    }}
                    source={require('../../assets/icons/loan_icon.png')}
                  />
                );
              },
            }}
          />
        )}
        <Tab.Screen
          name="More"
          component={Morescreens}
          options={{
            tabBarLabel: ({focused, position}) => (
              <>
                <Text
                  style={{
                    color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                    fontSize: 12,
                    marginBottom: position === 'beside-icon' ? 0 : 5,
                    marginLeft: position === 'beside-icon' ? 20 : 0,
                    marginTop: position === 'beside-icon' ? 3 : 0,
                  }}>
                  More
                </Text>
              </>
            ),
            tabBarIcon: ({color, size}) => {
              return (
                <Image
                  style={{
                    width: size,
                    height: size,
                    tintColor: color,
                  }}
                  source={require('../../assets/icons/more_icon.png')}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBeneath: {
    fontSize: 10,
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
    marginTop: 3,
  },
});
