/* eslint-disable no-undef */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
import OTPInput from 'react-native-otp-withpaste';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {getAllPin, validatePin} from '../../stores/SecurityStore';
import Loader from '../../component/loader/loader';

const {height, width} = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const EnterPin = ({toggleVisibility}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pinDetails, setPinDetails] = useState({
    currentPin: '',
  });
  const [hasPin, setHasPin] = useState(false);
  const insets = useSafeAreaInsets();
  const {getItem, setItem} = useAsyncStorage('@lockState');

  useEffect(() => {
    checkIfPinIsSet();
  }, []);

  const checkIfPinIsSet = async () => {
    try {
      const res = await getAllPin();
      if (res?.data?.length > 0) {
        setHasPin(true);
      } else if (res?.data == null) {
        toggleVisibility();
        setHasPin(false);
      } else {
        toggleVisibility();
        setHasPin(false);
      }
    } catch (e) {}
  };

  const handleValidatePin = async () => {
    try {
      if (pinDetails.currentPin !== '') {
        setIsLoading(true);
        const res = await validatePin(pinDetails.currentPin.toString());
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
          Toast.show({
            type: 'success',
            position: 'top',
            topOffset: 50,
            text1: res?.title,
            text2: res?.message,
            visibilityTime: 3000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
          toggleVisibility();
        }

        setIsLoading(false);
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Check Pin',
          text2: 'Pin can not be empty!',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <Loader visible={isLoading} loadingText={'Please wait...'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={[styles.TextHead, {alignItems: 'center'}]}>
              UNLOCK SCREEN
            </Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ImageBackground
        source={require('../../../assets/signup.png')}
        resizeMode="stretch"
        style={styles.image}>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}>
          <View
            style={{
              paddingTop: 25,
              backgroundColor: '#FFFFFF',
              borderRadius: 15,
              paddingHorizontal: 15,
              paddingVertical: 15,
              opacity: 0.72,
              borderColor: '#D9DBE9',
              borderWidth: 2,
              height: height * 0.9,
            }}>
            <View style={{marginTop: 30, height: height * 0.4}}>
              <OTPInput
                title="PIN CODE"
                type="outline"
                numberOfInputs={4}
                onChange={code => {
                  setPinDetails({...pinDetails, currentPin: code});
                }}
                onFilledCode={true}
                secureTextEntry={true}
                onPasted={pinDetails.currentPin}
              />
            </View>
            <TouchableOpacity
              style={{marginTop: 0}}
              onPress={handleValidatePin}>
              <Buttons label={'Unlock'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EnterPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  image: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
  },
  pinText: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#14142B',

    textAlign: 'left',
  },
  pinStyle: {
    borderWidth: 0.5,
    borderColor: COLORS.lendaBlue,
    marginLeft: 15,
    marginRight: 15,
    height: 50,
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  desc: {
    color: '#4E4B66',

    fontWeight: '500',
    fontSize: 14,
  },
  amount: {
    fontFamily: 'serif',
    fontSize: 16,
  },
  blur: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  avoidingView: {
    borderRadius: 10,
    height: 150,
    marginTop: 50,
    width: width - 30,
  },
  containerCodePin: {
    borderRadius: 10,
  },
});
