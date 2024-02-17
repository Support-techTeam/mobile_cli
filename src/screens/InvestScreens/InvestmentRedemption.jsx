import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import Buttons from '../../component/buttons/Buttons';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
import data from '../../constants/data';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  getArmOTP,
  getLendaOTP,
  redeemArmInvestment,
  redeemLendaInvestment,
} from '../../stores/InvestStore';
import appsFlyer from 'react-native-appsflyer';
import { Header } from '../../component/header/Header';

const durationData = [
  {value: '', label: 'Select Option'},
  {value: '3 Months', label: '3 Months'},
  {value: '6 Months', label: '6 Months'},
  {value: '12 Months', label: '12 Months'},
];

const InvestmentRedemption = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {name, investment, portfolio} = route.params;

  const [investmentDetails, setInvestmentDetails] = useState({
    id: investment._id,
    amount: investment.totalReturn,
    otp: '',
  });

  const [armDetails, setArmDetails] = useState({
    amount: '',
    otp: '',
    reason: '',
    investmentAmount: investment?.investmentAmount
      ? investment?.investmentAmount?.toString()
      : '0.00',
    productCode: investment?.productCode ? investment?.productCode : '',
    membershipId: investment?.membershipId ? investment?.membershipId : '',
    investmentId: portfolio?.investmentId ? portfolio?.investmentId : '',
  });

  const disableit =
    !investmentDetails.amount ||
    !investmentDetails.id ||
    investmentDetails.otp.length < 5;

  const disableitarm =
    !armDetails.productCode ||
    !armDetails.amount ||
    !armDetails.reason ||
    !armDetails.investmentAmount ||
    !armDetails.membershipId ||
    !armDetails.investmentId ||
    armDetails.otp.length < 5;

  const logAppsFlyer = (event, investmentName, activity, value) => {
    const eventName = event;
    const eventValues = {
      investment_type: investmentName,
      activity_type: activity,
      currency: 'NGN',
      revenue: value,
    };

    appsFlyer.logEvent(
      eventName,
      eventValues,
      res => {
        // console.log(res);
      },
      err => {
        // console.error(err);
      },
    );
  };

  const handleGetArmOtp = async () => {
    try {
      setIsLoading(true);
      const res = await getArmOTP(armDetails?.membershipId);

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
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };
  const handleArmInvestmentRedemption = async () => {
    try {
      setIsLoading(true);
      const res = await redeemArmInvestment(armDetails);
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
        logAppsFlyer(
          'invest',
          `ARM ${armDetails?.membershipId}`,
          'Investment Redemption',
          armDetails?.amount,
        );
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
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleGetLendaOtp = async () => {
    try {
      const param = {
        id: investment._id,
      };
      setIsLoading(true);
      const res = await getLendaOTP(param);

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
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleLendaInvestmentRedemption = async () => {
    try {
      const redemptionParams = {
        id: investmentDetails?.id,
        otp: investmentDetails?.otp?.toString(),
      };
      setIsLoading(true);
      const res = await redeemLendaInvestment(redemptionParams);
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
        logAppsFlyer(
          'invest',
          `Lenda ${investmentDetails?.id}`,
          'Investment Redemption',
          investmentDetails?.amount,
        );
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
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
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
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Processing...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <Header
        routeAction={() => navigation.goBack()}
        heading={
          name === 'Arm' ? 'REDEEM ARM INVESTMENT' : 'REDEEM LENDA INVESTMENT'
        }
        disable={false}
      />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {name === 'Arm' ? (
          <View style={styles.innerContainer}>
            <View style={{marginTop: 10}}>
              <Input
                onChangeText={text =>
                  setArmDetails({
                    ...armDetails,
                    amount: text.toString(),
                  })
                }
                iconName="cash"
                label="Amount"
                placeholder="Enter Amount"
                keyboardType="numeric"
                isNeeded={true}
                isInvestment={true}
                isBalance={
                  portfolio?.accountBalance
                    ? new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(portfolio.accountBalance))
                    : '0.00'
                }
              />

              <Input
                onChangeText={text =>
                  setArmDetails({
                    ...armDetails,
                    otp: text,
                  })
                }
                label="OTP"
                placeholder="Enter OTP"
                isNeeded={true}
              />

              <CustomDropdown
                label="Reason"
                isNeeded={true}
                placeholder="Select Option"
                data={data?.redemptionReasons}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={armDetails.reason}
                onChange={option => {
                  setArmDetails({
                    ...armDetails,
                    reason: option.value,
                  });
                }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  disabled={!disableitarm}
                  style={{
                    marginTop: 10,
                    width: wp(40),
                    fontSize: hp(5),
                    marginHorizontal: 5,
                  }}
                  onPress={() => {
                    handleGetArmOtp();
                  }}>
                  <Buttons label={'Get OTP'} disabled={!disableitarm} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    width: wp(40),
                    fontSize: hp(5),
                    marginHorizontal: 5,
                  }}
                  disabled={disableitarm}
                  onPress={() => {
                    if (Number(armDetails?.amount) <= 0) {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        topOffset: 50,
                        text1: 'ARM Investment',
                        text2: 'Invalid amount entered!',
                        visibilityTime: 5000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                      return;
                    } else if (
                      Number(armDetails?.amount) >
                      Number(armDetails?.investmentAmount)
                    ) {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        topOffset: 50,
                        text1: 'ARM Investment',
                        text2: 'Available balance exceeded!',
                        visibilityTime: 5000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                      return;
                    } else {
                      handleArmInvestmentRedemption();
                    }
                  }}>
                  <Buttons label={'Redeem Now'} disabled={disableitarm} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <View style={{marginTop: 10}}>
              <Input
                value={
                  investmentDetails?.amount
                    ? new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                        .format(investmentDetails?.amount)
                        .toString()
                    : '0.00'
                }
                iconName="cash"
                label="Amount"
                readOnly
                placeholder="Enter Amount"
                isNeeded={true}
                isInvestment={true}
                isBalance={
                  investment?.totalReturn
                    ? new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(investment?.totalReturn)
                    : '0.00'
                }
              />

              <Input
                onChangeText={text =>
                  setInvestmentDetails({
                    ...investmentDetails,
                    otp: text,
                  })
                }
                label="OTP"
                placeholder="Enter OTP"
                isNeeded={true}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  disabled={!disableit}
                  style={{
                    marginTop: 10,
                    width: wp(40),
                    fontSize: hp(5),
                    marginHorizontal: 5,
                  }}
                  onPress={() => {
                    handleGetLendaOtp();
                  }}>
                  <Buttons label={'Get OTP'} disabled={!disableit} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    width: wp(40),
                    fontSize: hp(5),
                    marginHorizontal: 5,
                  }}
                  disabled={disableit}
                  onPress={() => {
                    if (Number(investmentDetails?.amount) <= 0) {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Lenda Investment',
                        text2: 'Invalid amount entered!',
                        visibilityTime: 5000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                      return;
                    } else if (
                      Number(investmentDetails?.amount) >
                      Number(investment?.totalReturn)
                    ) {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Lenda Investment',
                        text2: 'Available balance exceeded!',
                        visibilityTime: 5000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                      return;
                    } else {
                      handleLendaInvestmentRedemption();
                    }
                  }}>
                  <Buttons label={'Redeem Now'} disabled={disableit} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentRedemption;

const styles = StyleSheet.create({
  pick: {
    marginBottom: 10,
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    justifyContent: 'center',
  },
  innerContainer: {
    margin: 20,
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
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    borderColor: 'gray',
    height: 40,
    fontSize: 16,
  },
  pinView: {
    alignItems: 'center',
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
});
