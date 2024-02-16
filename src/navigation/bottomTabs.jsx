// import React from 'react';
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
  Pressable,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {userLogOut} from '../stores/AuthStore';
import {resetStore} from '../util/redux/store';
import {useSelector} from 'react-redux';
import COLORS from '../constants/colors';
// Screens
import {Homescreen} from '../screens/HomeScreens';
import {Morescreens} from '../screens/MoreScreens';
import LoanStack from './LoanStack';
import {Investscreen} from '../screens/InvestScreens';
import AddButton from '../component/TabContainer/AddButton';
import {useTabMenu} from '../context/TabContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const timerId = useRef(false);
  const [timeForInactivityInSecond] = useState(600);
  const userProfileData = useSelector(state => state.userProfile.profile);
  const {opened, toggleOpened} = useTabMenu();

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

  const disabledIt = ({style, ...props}) => (
    <Pressable
      disabled={
        userProfileData && userProfileData?.profileProgress === null
          ? true
          : false
      }
      style={[
        {
          opacity:
            userProfileData && userProfileData?.profileProgress === null
              ? 0.2
              : 1,
        },
        style,
      ]}
      {...props}
    />
  );

  const handleSignOut = async () => {
  try{
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
  }catch(error){
    // console.log(error);
  }
  };

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: COLORS.lendaBlue,
          tabBarInactiveTintColor: COLORS.Secondary,
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          sceneAnimationEnabled: true,
          sceneAnimationType: 'shifting',
          shifting: true,
          compact: true,
        }}>
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
          listeners={{
            tabPress: e => opened && e.preventDefault(),
          }}
        />
        {/* {userProfileData && userProfileData?.profileProgress === null ? null : ( */}
        <Tab.Screen
          name="Loan"
          component={LoanStack}
          options={{
            tabBarButton: disabledIt,
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
          listeners={{
            tabPress: e => opened && e.preventDefault(),
          }}
        />
        {/* )} */}

        {/* <Tab.Screen
          name="Message"
          component={Homescreen}
          options={{
            tabBarLabel: '',
            tabBarItemStyle: {
              height: 0,
            },
            tabBarButton: () => (
              <AddButton opened={opened} toggleOpened={toggleOpened} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Invest"
          component={Investscreen}
          options={{
            tabBarButton: disabledIt,
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
                  Invest
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
                  source={require('../../assets/icons/invest_icon.png')}
                />
              );
            },
          }}
          listeners={{
            tabPress: e => opened && e.preventDefault(),
          }}
        />
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
              return <Icon name="cog" size={size} color={color} />;
            },
          }}
          listeners={{
            tabPress: e => opened && e.preventDefault(),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabBar: {
    paddingTop: 0,
    marginTop: 0,
    height: 58,
    marginBottom: 1,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabIconContainer: {
    position: 'absolute',
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 32,
    height: 32,
  },
});
