import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Buttons from '../../component/buttons/Buttons';
import Spinner from 'react-native-loading-spinner-overlay';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const LockPin = () => {
  const navigation = useNavigation();
  const [visibility, setVisibility] = useState(false);
  const insets = useSafeAreaInsets();
  const lockup = () => {
    // walletStore.Lock();
  };

  useEffect(() => {
    const unsub = async () => {};

    unsub();
    // rnBiometrics.isSensorAvailable().then(resultObject => {
    //   const {available, biometryType} = resultObject;

    //   if (available && biometryType === BiometryTypes.TouchID) {
    //     console.log('TouchID is supported');
    //   } else if (available && biometryType === BiometryTypes.FaceID) {
    //     console.log('FaceID is supported');
    //   } else if (available && biometryType === BiometryTypes.Biometrics) {
    //     console.log('Biometrics is supported');
    //   } else {
    //     console.log('Biometrics not supported');
    //   }
    // });
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <Spinner
        visible={false}
        textContent={'Locking Pin...'}
        textStyle={{color: 'white'}}
        overlayColor="rgba(16, 17, 17, 0.7)"
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>LOCK PIN</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>

      <View style={styles.demark} />
      <Text style={styles.text}>
        Your account will be locked to future transactions and if you wish to
        re-active your pin contact tradelenda support mail,
        <Text style={{color: '#054B99'}}> info@tradelenda.com </Text>
      </Text>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Buttons label={'Lock Pin'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LockPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    // marginTop: 34,
    // backgroundColor:'blue'
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
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
  demark: {
    width: '97%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginVertical: 10,
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
    backgroundColor: '#054B99',
    width: 90,
    opacity: 0.5,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  text: {
    marginVertical: 20,
    fontSize: 16,
  },
  modal: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    backgroundColor: 'blue',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  signOutView: {
    alignItems: 'center',
    marginVertical: 60,
  },
  signOutText: {
    color: '#054B99',
    fontFamily: 'serif',
    fontSize: 16,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  signUpactivity: {
    backgroundColor: '#054B99',
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});
