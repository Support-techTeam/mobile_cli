// import React from 'react';
import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, PanResponder, Image} from 'react-native';
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Pressable,
  Text,
  Box,
  HStack,
  Badge,
  Spacer,
  Flex,
  Divider,
} from 'native-base';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
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
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
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
            tabBarLabel: ({focused}) => (
              <>
                <Text
                  style={{
                    color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                    fontSize: 12,
                    marginBottom: 5,
                  }}>
                  Home
                </Text>
                <Box w="30%">
                  <Divider
                    thickness="2"
                    _light={{
                      bg: focused ? COLORS.lendaBlue : COLORS.Light,
                    }}
                    _dark={{
                      bg: focused ? COLORS.lendaBlue : COLORS.Light,
                    }}
                  />
                </Box>
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
              tabBarLabel: ({focused}) => (
                <>
                  <Text
                    style={{
                      color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                      fontSize: 12,
                      marginBottom: 5,
                    }}>
                    Loan
                  </Text>
                  <Box w="30%">
                    <Divider
                      thickness="2"
                      _light={{
                        bg: focused ? COLORS.lendaBlue : COLORS.Light,
                      }}
                      _dark={{
                        bg: focused ? COLORS.lendaBlue : COLORS.Light,
                      }}
                    />
                  </Box>
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
        {userProfileData && userProfileData?.profileProgress === null ? null : (
          <Tab.Screen
            name="Invest"
            component={InvestScreen}
            options={{
              tabBarLabel: ({focused}) => (
                <>
                  <Text
                    style={{
                      color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                      fontSize: 12,
                      marginBottom: 5,
                    }}>
                    Invest
                  </Text>
                  <Box w="30%">
                    <Divider
                      thickness="2"
                      _light={{
                        bg: focused ? COLORS.lendaBlue : COLORS.Light,
                      }}
                      _dark={{
                        bg: focused ? COLORS.lendaBlue : COLORS.Light,
                      }}
                    />
                  </Box>
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
          />
        )}

        <Tab.Screen
          name="More"
          component={Morescreens}
          options={{
            tabBarLabel: ({focused}) => (
              <>
                <Text
                  style={{
                    color: focused ? COLORS.lendaBlue : COLORS.Secondary,
                    fontSize: 12,
                    marginBottom: 5,
                  }}>
                  More
                </Text>
                <Box w="30%">
                  <Divider
                    thickness="2"
                    _light={{
                      bg: focused ? COLORS.lendaBlue : COLORS.Light,
                    }}
                    _dark={{
                      bg: focused ? COLORS.lendaBlue : COLORS.Light,
                    }}
                  />
                </Box>
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

// function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text variant="headlineMedium">Home!</Text>
//     </View>
//   );
// }
// function LoanScreen() {
//   return (
//     <View style={styles.container}>
//       <Text variant="headlineMedium">LoanScreen!</Text>
//     </View>
//   );
// }

function InvestScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">InvestScreen!</Text>
    </View>
  );
}

// function SettingsScreen() {
//   const insets = useSafeAreaInsets();
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingHorizontal: 20,
//         backgroundColor: '#fff',
//         paddingTop: insets.top !== 0 ? insets.top : 'auto',
//         paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
//         paddingLeft: insets.left !== 0 ? insets.left : 'auto',
//         paddingRight: insets.right !== 0 ? insets.right : 'auto',
//       }}>
//       <Box alignItems="center">
//         <Pressable maxW="96">
//           {({isHovered, isFocused, isPressed}) => {
//             return (
//               <Box
//                 bg={
//                   isPressed
//                     ? 'coolGray.200'
//                     : isHovered
//                     ? 'coolGray.200'
//                     : 'coolGray.100'
//                 }
//                 style={{
//                   transform: [
//                     {
//                       scale: isPressed ? 0.96 : 1,
//                     },
//                   ],
//                 }}
//                 p="5"
//                 rounded="8"
//                 shadow={3}
//                 borderWidth="1"
//                 borderColor="coolGray.300">
//                 <HStack alignItems="center">
//                   <Badge
//                     colorScheme="darkBlue"
//                     _text={{
//                       color: 'white',
//                     }}
//                     variant="solid"
//                     rounded="4">
//                     Business
//                   </Badge>
//                   <Spacer />
//                   <Text fontSize={10} color="coolGray.800">
//                     1 month ago
//                   </Text>
//                 </HStack>
//                 <Text
//                   color="coolGray.800"
//                   mt="3"
//                   fontWeight="medium"
//                   fontSize="xl">
//                   Marketing License
//                 </Text>
//                 <Text mt="2" fontSize="sm" color="coolGray.700">
//                   Unlock powerfull time-saving tools for creating email delivery
//                   and collecting marketing data
//                 </Text>
//                 <Flex>
//                   {isFocused ? (
//                     <Text
//                       mt="2"
//                       fontSize={12}
//                       fontWeight="medium"
//                       textDecorationLine="underline"
//                       color="darkBlue.600"
//                       alignSelf="flex-start">
//                       Read More
//                     </Text>
//                   ) : (
//                     <Text
//                       mt="2"
//                       fontSize={12}
//                       fontWeight="medium"
//                       color="darkBlue.600">
//                       Read More
//                     </Text>
//                   )}
//                 </Flex>
//               </Box>
//             );
//           }}
//         </Pressable>
//       </Box>
//     </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
