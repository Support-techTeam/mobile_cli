import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  purchaseAirtime,
  purchaseDataPlan,
  purchaseElectricity,
  renewSubscription,
  updateSubscription,
} from '../../stores/BillStore';

const BillPin = ({route}) => {
  const {airtimeDetails, acctNumber, selectedPackageData} = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
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

  const details = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: pinString,
    // transactionPin: `${otp.f + otp.s + otp.t + otp.fo}`,
  };
  const dataDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: pinString,
    DataCode: airtimeDetails.package,
  };

  const powerDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: pinString,
    meterNumber: airtimeDetails.meter,
  };
  const cableDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: pinString,
    variationCode: airtimeDetails.variationCode,
    cardNumber: airtimeDetails.cardNumber,
  };

  const createPayment = async () => {
    if (airtimeDetails.service === 'airtime purchase') {
      setIsLoading(true);
      const res = await purchaseAirtime(details);
      if (res?.error || res?.data?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.message ? res?.data?.message : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('StatusFailed');
        }, 1000);
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
        setTimeout(() => {
          navigation.navigate('StatusSuc');
        }, 1000);
      }
      setIsLoading(false);
    }

    if (airtimeDetails.service === 'data purchase') {
      setIsLoading(true);
      const res = await purchaseDataPlan(dataDetails);
      if (res?.error || res?.data?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.message ? res?.data?.message : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('StatusFailed');
        }, 1000);
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
        setTimeout(() => {
          navigation.navigate('StatusSuc');
        }, 1000);
      }
      setIsLoading(false);
    }

    if (airtimeDetails.service === 'electricity purchase') {
      setIsLoading(true);
      const res = await purchaseElectricity(powerDetails);
      if (res?.error || res?.data?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.message ? res?.data?.message : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('StatusFailed');
        }, 1000);
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
        setTimeout(() => {
          navigation.navigate('StatusSuc');
        }, 1000);
      }
      setIsLoading(false);
    }

    if (airtimeDetails.service === 'cable_tv purchase') {
      setIsLoading(true);
      let res;
      if (airtimeDetails.status == 'update') {
        res = await updateSubscription(cableDetails);
      } else {
        res = await renewSubscription(cableDetails);
      }
      if (res?.error || res?.data?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.message ? res?.data?.message : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('StatusFailed');
        }, 1000);
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
        setTimeout(() => {
          navigation.navigate('StatusSuc');
        }, 1000);
      }
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
      {isLoading && (
        <Spinner
          textContent={'Processing...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
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
            <Text style={styles.TextHead}>Enter PIN</Text>
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
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: 15,
        }}>
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
          onPress={createPayment}>
          <Buttons label={'Submit'} disabled={disableit} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillPin;

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
    paddingHorizontal: 5,
    paddingVertical: 2,
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
