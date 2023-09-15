import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import {resendVerificationEmail, userLogOut} from '../../stores/AuthStore';
import {useDispatch, useSelector} from 'react-redux';
import {signUpUser} from '../../util/redux/userAuth/user.auth.slice';
import {auth} from '../../util/firebase/firebaseConfig';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import COLORS from '../../constants/colors';
import {useRoute} from '@react-navigation/native';
import {resetStore} from '../../util/redux/store';

const Verification = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userAuth.user);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(
    JSON.parse(user)?.user?.emailVerified,
  );
  const [count, setCount] = useState(0);
  const route = useRoute();

  useEffect(() => {
    const interval = setInterval(async () => {
      const userData = auth.currentUser;
      await userData?.reload();
      if (userData && userData.emailVerified) {
        dispatch(signUpUser(JSON.stringify(userData)));
        setIsVerified(userData.emailVerified);
      } else {
        setCount(count + 1);
      }
    }, 5000);

    if (!isVerified) {
      return () => clearInterval(interval);
    }
  }, [isVerified == false && route.name === 'Verification' ? count : '']);

  const handleSignOut = async () => {
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
  };

  const handleResendVerificationEmail = async () => {
    setIsLoading(true);
    const res = await resendVerificationEmail();
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
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 'auto',
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
          <View style={{paddingVertical: 10}}>
            <Text style={styles.verify}>
              Waiting for you to verify your account
            </Text>
          </View>
          <View style={styles.message}>
            <Text style={styles.messageText}>
              Check your inbox or spam, we’ve sent you a verification mail to
              complete your registration.
            </Text>
          </View>
          <View style={styles.demark} />

          <TouchableOpacity
            style={styles.signUp}
            onPress={handleResendVerificationEmail}>
            {false ? (
              <View style={styles.signUpactivity}>
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
          <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
            {false ? (
              <View style={styles.signUpactivity}>
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

const styles = StyleSheet.create({
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
