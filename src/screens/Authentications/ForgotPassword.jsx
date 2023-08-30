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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  const [userDetails, setUserDetails] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    const res = await forgotPassword(userDetails.email);
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    }
    setIsLoading(false);
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
        // paddingHorizontal: 20,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      <ImageBackground
        source={require('../../../assets/forgotPass.png')}
        resizeMode="stretch"
        style={styles.image}>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: 20}}>
          {isLoading && (
            <Spinner
              textContent={'Loading...'}
              textStyle={{color: 'white'}}
              visible={true}
              overlayColor="rgba(16, 17, 17, 0.7)"
            />
          )}
          <KeyboardAvoidingWrapper>
            <View style={{marginBottom: 40}}>
              <View style={{alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/images/HeadLogo.png')}
                  />
                </View>
              </View>
              <View style={styles.signupView}>
                <Image source={require('../../../assets/images/locked.png')} />
                <Text style={styles.signupText}>Forgotten Password?</Text>
                <View>
                  <Text style={[styles.extraText, {marginBottom: 40}]}>
                    Please enter your email address to recieve a password reset
                    link
                  </Text>
                </View>
              </View>
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
          </KeyboardAvoidingWrapper>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// export default ForgotPassword;
export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingHorizontal: 20,
    // backgroundColor: '#f4f4f4',
  },
  demark: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    // marginTop: 16,
    marginBottom: 10,
  },
  signupView: {
    marginTop: 30,
    // backgroundColor:'red',
    alignItems: 'center',
  },
  signupText: {
    fontWeight: '700',
    fontSize: 32,
    // letterSpacing: 3.5,
    fontFamily: 'Montserat',
    paddingTop: 16,
    lineHeight: 48,
    color: '#14142B',
    // marginLeft:-2.5
  },
  extraText: {
    textAlign: 'center',
    fontFamily: 'Montserat',
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    paddingHorizontal: 15,
  },

  signUp: {
    // backgroundColor: '#054B99',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  image: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
  },
});
