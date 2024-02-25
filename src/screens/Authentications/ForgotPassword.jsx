import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Input from '../../component/inputField/input.component';
import Button from '../../component/buttons/Button';
import {forgotPassword} from '../../stores/AuthStore';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AuthHeader} from '../../component/header/AuthHeader';

const WINDOW_HIGHT = Dimensions.get('window').height;

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  const [userDetails, setUserDetails] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      const res = await forgotPassword(userDetails.email);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
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
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const validate = async () => {
    let isValid = true;
    if (!userDetails.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!userDetails.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }
    if (isValid) {
      handleForgotPassword();
    }
  };

  const handleOnchange = (text, input) => {
    setUserDetails(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../assets/forgotPass.png')}
          resizeMode="stretch"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{paddingHorizontal: 16}}>
            {isLoading && (
              <Spinner
                textContent={'Loading...'}
                textStyle={{color: 'white'}}
                visible={true}
                overlayColor="rgba(78, 75, 102, 0.7)"
              />
            )}
            <View
              style={{
                flex: 1,
                marginBottom: 40,
                flexDirection: 'column',
              }}>
              <View>
                <AuthHeader
                  routeAction={() => navigation.goBack()}
                  heading={'Forgotten Password?'}
                  intro={
                    'Please enter your email address to recieve a password reset link'
                  }
                  disabled={true}
                  renderImage={
                    Image.resolveAssetSource(
                      require('../../../assets/images/locked.png'),
                    ).uri
                  }
                />
              </View>
              <View
                style={{
                  height: hp('60%'),
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    paddingTop: 25,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    opacity: 0.86,
                    borderColor: '#D9DBE9',
                    borderWidth: 2,
                  }}>
                  <Input
                    onChangeText={text => handleOnchange(text, 'email')}
                    onFocus={() => handleError(null, 'email')}
                    iconName="email-outline"
                    label="Email"
                    placeholder="Enter your email address"
                    error={errors.email}
                    autoCorrect={false}
                    autoCapitalize="none"
                    isNeeded={true}
                  />
                  <Button
                    title="Submit"
                    onPress={validate}
                    disabled={!userDetails.email}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {},
  demark: {
    width: wp('100%'),
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginBottom: 10,
  },
  signupView: {
    alignItems: 'center',
    width: wp('80%'),
  },
  signupText: {
    fontWeight: '700',
    fontSize: hp('4%'),
    // fontSize: 30,
    fontFamily: 'serif',
    paddingTop: 16,
    lineHeight: 48,
    color: '#14142B',
  },
  extraText: {
    textAlign: 'center',
    fontFamily: 'serif',
    marginLeft: 10,
    fontSize: hp('2%'),
    // fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    paddingHorizontal: 15,
  },

  signUp: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  image: {
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
  },
});
