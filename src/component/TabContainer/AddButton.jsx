import React, {useState} from 'react';

import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import COLORS from '../../constants/colors';
import {Actionsheet, Box, Text} from 'native-base';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddButton = ({opened, toggleOpened}) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [isMakeMessangerVisible, setIsMakeMessangerVisible] = useState(false);
  const websiteUrl = 'https://tawk.to/chat/62308fc6a34c2456412b29b5/1fu6r38rm';
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const toggleMakeMessanger = () => {
    setIsMakeMessangerVisible(!isMakeMessangerVisible);
  };

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      friction: 2,
      useNativeDriver: false,
    }).start();
  }, [opened, animation]);

  const opacity = {
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
  };

  const handleMessage = event => {
    const {data} = event.nativeEvent;
    if (data && data.startsWith('PAGE_CONTENT:')) {
      // Extract and save the page content
      const content = data.replace('PAGE_CONTENT:', '');
      setPageContent(content);

      // Notify the parent component to save the content
      onSavePageContent(content);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tawkto Integration */}

      <Actionsheet
        isOpen={isMakeMessangerVisible}
        onClose={toggleMakeMessanger}>
        <Actionsheet.Content>
          <Box
            w="100%"
            h="100%"
            px={4}
            justifyContent="center"
            style={{paddingBottom: 20}}>
            {isLoading && <ActivityIndicator size="large" />}
            <WebView
              source={{uri: websiteUrl}}
              onLoadEnd={() => {
                handleLoadEnd();
              }}
              onMessage={handleMessage}
              injectedJavaScript="window.postMessage('PAGE_CONTENT:' + document.documentElement.outerHTML);"
              style={isLoading ? {display: 'none'} : {flex: 1}}
            />
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      <View style={styles.box}>
        <TouchableWithoutFeedback
          onPress={() => {
            toggleMakeMessanger();
            toggleOpened();
          }}>
          <Animated.View
            style={[
              styles.item,
              opacity,
              {
                backgroundColor: COLORS.lendaBlue,
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
              // style={[
              //   styles.item,
              //   opacity,
              //   {
              //     transform: [
              //       {
              //         translateY: animation.interpolate({
              //           inputRange: [0, 1],
              //           outputRange: [0, -100],
              //         }),
              //       },
              //     ],
              //   },
            ]}>
            <Image
              source={require('../../../assets/images/tawkto.png')}
              resizeMode="contain"
              style={styles.itemIcon}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            toggleOpened();
          }}>
          <Animated.View
            style={[
              styles.item,
              opacity,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -100],
                    }),
                  },
                ],
              },
            ]}>
            <Image
              source={require('../../../assets/images/Transactions.png')}
              resizeMode="contain"
              style={[styles.itemIcon, {tintColor: COLORS.white}]}
            />
          </Animated.View>
        </TouchableWithoutFeedback> */}
        {/* <TouchableWithoutFeedback
          onPress={() => {
            toggleOpened();
          }}>
          <Animated.View
            style={[
              styles.item,
              opacity,
              {
                backgroundColor: COLORS.lendaBlue,
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}>
            <Image
              source={require('../../../assets/images/bell.png')}
              resizeMode="contain"
              style={[styles.itemIcon, {tintColor: COLORS.white}]}
            />
          </Animated.View>
        </TouchableWithoutFeedback> */}
        {/* <View style={styles.center} /> */}
        <View style={styles.center2} />
        <View
          style={
            styles.floatingBtn
            // {
            // alignItems: 'center',
            // justifyContent: 'center',
            // // backgroundColor: COLORS.grey,
            // backgroundColor: '#F4F4F4',
            // left: -3,
            // width: 67,
            // height: 67,
            // borderRadius: 33,
            // zIndex: 90,
            // }
          }>
          <TouchableWithoutFeedback
            onPress={() => {
              toggleOpened();
            }}
            style={styles.addButton}>
            <Animated.View
              style={[
                styles.addButtonInner,
                {
                  transform: [
                    {
                      scale: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.9],
                      }),
                    },
                  ],
                },
              ]}>
              <Icon name="message-text" size={30} color={COLORS.white} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    height: 0,
  },
  box: {
    position: 'relative',
    width: 60,
    height: 60,
    marginTop: -30,
  },
  addButton: {
    shadowColor: COLORS.dark,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  addButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addButtonIcon: {
    width: 40,
    height: 40,
    tintColor: COLORS.white,
  },
  item: {
    position: 'absolute',
    top: 5,
    left: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemIcon: {
    width: 32,
    height: 32,
  },
  // center: {
  //   alignSelf: 'center',
  //   backgroundColor: '#fff',
  //   position: 'absolute',
  //   width: 100,
  //   height: 400,
  //   top: 10,
  //   borderRadius: 40,
  // },
  center2: {
    alignSelf: 'center',
    backgroundColor: '#F4F4F4',
    position: 'absolute',
    width: 80,
    height: 80,
    top: -5,
    borderRadius: 100,
  },
  floatingBtn: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default AddButton;
