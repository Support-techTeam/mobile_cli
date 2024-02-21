import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import {resendOTP, userLogOut, verifyOTP} from '../../stores/AuthStore';
import {useDispatch, useSelector} from 'react-redux';
import {signUpUser} from '../../util/redux/userAuth/user.auth.slice';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import COLORS from '../../constants/colors';
import {useRoute} from '@react-navigation/native';
import {resetStore} from '../../util/redux/store';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from '../../../styles';

const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 6;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 150,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 200 : 150,
    }),
  ]).start();
};

const Verification = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userAuth.user);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  let isVerified = auth().currentUser?.emailVerified;
  const [count, setCount] = useState(0);
  const route = useRoute();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);

    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell_otp, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerificationData();
    }
  }, [value]);

  const handleSignOut = async () => {
    try {
      const res = await userLogOut();
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
        await resetStore();
      }
    } catch (err) {}
  };

  const handleResendVerificationEmail = async () => {
    setIsLoading(true);
    const userData = auth().currentUser;
    await userData?.reload();
    const payLoad = {
      email: userData?.email,
      firstName: userData?.displayName?.split(' ')[0],
      phoneNumber: userData?.phoneNumber || '+2340000000000',
      uuid: userData?.uid,
    };

    try {
      const res = await resendOTP(payLoad);
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
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleVerificationData = async () => {
    setIsSending(true);
    const uid = auth()?.currentUser?.uid;
    verifyOTP(value, uid)
      .then(async res => {
        if (res?.error) {
          Toast.show({
            type: 'error',
            position: 'top',
            topOffset: 50,
            text1: 'OTP Verification',
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
            text1: 'OTP Verification',
            text2: res?.message,
            visibilityTime: 3000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
        }

        setIsSending(false);
        await auth().currentUser?.reload();
        const user = auth().currentUser;
        dispatch(signUpUser(JSON.stringify(user)));
        isVerified = user?.emailVerified;
      })
      .catch(e => {
        setIsSending(false);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Resending Verification Email...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
          animation="slide"
        />
      )}

      {isSending && (
        <Spinner
          textContent={'Verification User...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
          animation="slide"
        />
      )}
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center'}}>
          <View style={{marginTop: 40, alignItems: 'center'}}>
            <Image
              source={require('../../../assets/images/HeadLogo.png')}
              style={{width: 83, height: 32}}
            />
          </View>
          <View style={{marginTop: 40}}>
            <Image source={require('../../../assets/images/veriEnv.png')} />
          </View>
        </View>
        <View style={styles.pinView}>
          <View style={[{paddingVertical: 10}]}>
            <Text style={styles.title_otp}>OTP Verification</Text>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
          </View>
          <View style={internalStyles.message}>
            <Text style={internalStyles.messageText}>
              Please enter the verification code{'\n'}
              we send to your email address oe phone number
            </Text>
          </View>
          <View style={internalStyles.demark} />

          <TouchableOpacity
            style={internalStyles.signUp}
            onPress={handleResendVerificationEmail}>
            {false ? (
              <View style={internalStyles.signUpactivity}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <Text
                style={{
                  fontWeight: '500',
                  color: '#fff',
                }}>
                Resend verification code
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={internalStyles.signOut}
            onPress={handleSignOut}>
            {false ? (
              <View style={internalStyles.signUpactivity}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <Text
                style={{
                  fontWeight: '500',
                  color: COLORS.white,
                }}>
                SignOut
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verification;

const internalStyles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: statusBarHeight,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  pinView: {
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: '#D9DBE9',
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    marginTop: 30,
  },
  verify: {
    color: '#14142B',

    fontSize: 28,
    lineHeight: 42,
    fontWeight: '400',
    paddingHorizontal: 2.5,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  message: {
    // paddingHorizontal: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#595959',
    marginBottom: 10,
    textAlign: 'center',
  },
  demark: {
    width: '97%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    width: '100%',

    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
  },
  otpBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#054B99',
  },
  otpText: {
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  signUp: {
    marginTop: 10,
    backgroundColor: COLORS.lendaBlue,
    width: '95%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOut: {
    marginTop: 10,
    backgroundColor: COLORS.red,
    width: '95%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  resendModal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  resendText: {
    color: '#054B99',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
  },
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    // borderWidth:.5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',

    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  checkedText2: {
    color: '#ED2E7E',

    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    textAlign: 'center',
    fontWeight: '600',
  },
  //
  extraView: {
    alignItems: 'center',
    marginTop: 30,
  },
  extra: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontWeight: '500',
  },
  continue: {
    marginVertical: 30,
    backgroundColor: '#054B99',
    width: '50%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
