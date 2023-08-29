import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useContext } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
// import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../config/mobX stores/RootStore';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../../RootNavigation';
import { auth } from '../../config/firebase/firebase';

const statusBarHeight = getStatusBarHeight();

const Verification = observer(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { authStore } = useContext(StoreContext);
  const { emailsuccess, loading } = authStore;

  const handleResendVerificationEmail = async () => {
    await authStore.ResendVerificationMail();
  };

  const checkVerificationStatus = async () => {
    await authStore.checkVerificationStatus();
    authStore.setEmailSuccess;
  };

  useEffect(() => {
    if (emailsuccess === 'Successful') {
      if (auth.currentUser.emailVerified) {
        authStore.getProfileDetails();
      }
    }
  }, [navigation, emailsuccess]);

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
      }}
    >
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Image source={require('../../../assets/images/HeadLogo.png')} />
          </View>
          <View style={{ marginTop: 40 }}>
            <Image source={require('../../../assets/images/veriEnv.png')} />
          </View>
        </View>
        <View style={styles.pinView}>
          <View style={{ paddingVertical: 10 }}>
            <Text style={styles.verify}>Verify Your Account</Text>
          </View>
          <View style={styles.message}>
            <Text style={styles.messageText}>
              Check your inbox or spam, we’ve sent you a verification mail to complete your
              registration.
            </Text>
          </View>
          <View style={styles.demark} />

          <TouchableOpacity style={styles.signUp} onPress={checkVerificationStatus}>
            {loading ? (
              <View style={styles.signUpactivity}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <Text
                style={{
                  fontWeight: '500',
                  color: '#fff',
                  fontFamily: 'Montserat',
                }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resendView} onPress={handleResendVerificationEmail}>
          <Text style={styles.resendText}>Resend verification code</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
});

export default Verification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight,
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
    fontFamily: 'Montserat',
    fontSize: 28,
    lineHeight: 42,
    fontWeight: '400',
    paddingHorizontal: 2.5,
  },
  message: {
    // paddingHorizontal: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  messageText: {
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  signUp: {
    marginTop: 10,
    backgroundColor: '#054B99',
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
    fontFamily: 'Montserat',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',
    fontFamily: 'Montserat',
    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  checkedText2: {
    color: '#ED2E7E',
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
