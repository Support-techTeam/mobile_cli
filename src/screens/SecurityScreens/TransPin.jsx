import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import Buttons from '../../component/buttons/Buttons';

const TransPin = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({f: '', s: '', t: '', fo: ''});
  const disableit = !otp.f || !otp.s || !otp.t || !otp.fo;

  const [pinString, setPinString] = useState('');

  useEffect(() => {
    setPinString(`${otp.f + otp.s + otp.t + otp.fo}`);
  }, [otp]);

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
            <Text style={styles.TextHead}>TRANSACTION PIN</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#14142B', fontSize: 16}}>
            Enter your transaction pin
          </Text>
        </View>
        <View style={styles.pinView}>
          <View style={styles.otpContainer}>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={firstInput}
                onChangeText={text => {
                  setOtp({...otp, f: text});
                  text && secondInput.current.focus();
                }}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={secondInput}
                onChangeText={text => {
                  setOtp({...otp, s: text});
                  text
                    ? thirdInput.current.focus()
                    : firstInput.current.focus();
                }}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={thirdInput}
                onChangeText={text => {
                  setOtp({...otp, t: text});
                  text
                    ? fourthInput.current.focus()
                    : secondInput.current.focus();
                }}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={fourthInput}
                onChangeText={text => {
                  setOtp({...otp, fo: text});
                  !text && thirdInput.current.focus();
                }}
                secureTextEntry={true}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{marginTop: 40}}
          disabled={disableit}
          onPress={() => {
            navigation.navigate('PinCon', {pinString: pinString});
          }}>
          <Buttons label={'Proceed'} disabled={disableit} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
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
    height: 40,
    width: 40,
  },
  signUp: {
    marginTop: 10,
    backgroundColor: '#054B99',
    width: '95%',
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
});
