import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Buttons from '../../component/buttons/Buttons';
import {
  createInternalTransfer,
  createNIPTransfer,
} from '../../stores/WalletStore';

const Pin = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: ''});
  const disableit = !otp[1] || !otp[2] || !otp[3] || !otp[4];
  const {bankDetails} = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [transferDetails, setTransferDetails] = useState({});
  const [internalTransferDetails, setInternalTransferDetails] = useState({});

  useEffect(() => {
    setTransferDetails({
      receiverAccountFirstName:
        bankDetails?.receiverAccountFirstName === undefined
          ? ''
          : bankDetails?.receiverAccountFirstName,
      receiverAccountLastName:
        bankDetails?.receiverAccountLastName === undefined
          ? ''
          : bankDetails?.receiverAccountLastName,
      receiverAccountNumber:
        bankDetails?.receiverAccountNumber === undefined
          ? ''
          : bankDetails?.receiverAccountNumber,
      receiverBankName:
        bankDetails?.receiverBankName === undefined
          ? ''
          : bankDetails?.receiverBankName,
      amount:
        bankDetails?.amount === undefined
          ? 0
          : parseInt(bankDetails?.amount, 10),
      narration:
        bankDetails?.narration === undefined ? '' : bankDetails?.narration,
      saveBeneficiary:
        bankDetails?.saveBeneficiary === undefined
          ? false
          : bankDetails?.saveBeneficiary,
      transactionPin: `${otp[1] + otp[2] + otp[3] + otp[4]}`,
    });
  }, [bankDetails, otp]);

  useEffect(() => {
    setInternalTransferDetails({
      toWalletIdAccountNumber:
        bankDetails?.toWalletIdAccountNumber === undefined
          ? ''
          : bankDetails?.toWalletIdAccountNumber,
      beneficiaryAccountName:
        bankDetails?.beneficiaryAccountName === undefined
          ? ''
          : bankDetails?.beneficiaryAccountName,
      beneficiaryBankName:
        bankDetails?.beneficiaryBankName === undefined
          ? ''
          : bankDetails?.beneficiaryBankName,

      amount:
        bankDetails?.amount === undefined
          ? 0
          : parseInt(bankDetails?.amount, 10),
      narration:
        bankDetails?.narration === undefined ? '' : bankDetails?.narration,
      saveBeneficiary:
        bankDetails?.saveBeneficiary === undefined
          ? false
          : bankDetails?.saveBeneficiary,
      transactionPin: `${otp[1] + otp[2] + otp[3] + otp[4]}`,
    });
  }, [bankDetails, otp]);

  const handleTransfer = async () => {
    if (internalTransferDetails.toWalletIdAccountNumber !== '') {
      setIsLoading(true);
      const res = await createInternalTransfer(internalTransferDetails);
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
        navigation.navigate('Success');
      }
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const res = await createNIPTransfer(transferDetails);
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
        navigation.navigate('Success');
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Processing Please wait...'}
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
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>Enter your transaction pin</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.pinView}>
          <View style={styles.otpContainer}>
            <View style={styles.otpBox}>
              <TextInput
                style={styles.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={firstInput}
                onChangeText={text => {
                  setOtp({...otp, 1: text});
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
                  setOtp({...otp, 2: text});
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
                  setOtp({...otp, 3: text});
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
                  setOtp({...otp, 4: text});
                  !text && thirdInput.current.focus();
                }}
                secureTextEntry={true}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleTransfer}>
          <Buttons label={'Submit'} disabled={disableit} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pin;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingHorizontal: 20,
    // backgroundColor: '#ffffff',
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
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
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
});
