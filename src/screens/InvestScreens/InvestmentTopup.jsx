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

const durationData = [
  {value: '', label: 'Select Option'},
  {value: '3 Months', label: '3 Months'},
  {value: '6 Months', label: '6 Months'},
  {value: '12 Months', label: '12 Months'},
];

const InvestmentTopup = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [isLoading, setIsLoading] = useState(false);
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: ''});
  const route = useRoute();
  const {name, investment} = route.params;

  const [investmentDetails, setInvestmentDetails] = useState({
    investmentType: investment?.investmentType,
    investmentTenor: investment?.investmentTenor,
    investmentAmount: 0,
    transactionPin: '',
  });

  const [armDetails, setArmDetails] = useState({
    productCode: investment?.productCode,
    investmentAmount: 0,
    membershipId: investment?.membershipId,
    leadId: investment?.leadId,
    potentialClientId: investment?.potentialClientId,
  });

  const disableit =
    !otp[1] ||
    !otp[2] ||
    !otp[3] ||
    !otp[4] ||
    investmentDetails.investmentAmount == 0;

  const disableitarm =
    !armDetails.productCode || armDetails.investmentAmount == 0;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
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
            <Text style={styles.TextHead}>
              {name === 'Arm' ? 'ARM INVESTMENT' : 'LENDA INVESTMENT'}
            </Text>
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
        {name === 'Arm' ? (
          <View style={styles.innerContainer}>
            <View style={{marginTop: 10}}>
              <Input
                onChangeText={text =>
                  setArmDetails({
                    ...armDetails,
                    investmentAmount: Number(text),
                  })
                }
                iconName="cash"
                label="Amount"
                placeholder="Enter Amount"
                keyboardType="numeric"
                isNeeded={true}
                isAirtime={true}
                isBalance={
                  userWalletData &&
                  userWalletData?.availableBalance
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                }
              />
              {investment?.minimumInvestmentAmount && (
                <Text
                  style={{
                    color: COLORS.lendaBlue,
                    fontWeight: '500',
                    textAlign: 'right',
                    marginBottom: 15,
                  }}>
                  Minimum Investment (₦
                  {investment?.minimumInvestmentAmount
                    ? investment?.minimumInvestmentAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : '0.00'}
                  )
                </Text>
              )}
              <TouchableOpacity
                style={{marginTop: 40}}
                disabled={disableitarm}
                onPress={() => {
                  if (Number(armDetails?.investmentAmount) <= 0) {
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
                    Number(armDetails?.investmentAmount) >
                    Number(userWalletData?.availableBalance)
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
                  } else if (
                    Number(armDetails?.investmentAmount) <
                    Number(investment?.minimumInvestmentAmount)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'ARM Investment',
                      text2: 'Investment amount is below minimum investment',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    navigation.navigate('TransactionSummary', {
                      description: `${investment?.productCode} Top-Up`,
                      name: name,
                      ...armDetails,
                      action: 'TOP-UP',
                    });
                  }
                }}>
                <Buttons label={'Invest Now'} disabled={disableitarm} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <View style={{marginTop: 10}}>
              <Input
                onChangeText={text =>
                  setInvestmentDetails({
                    ...investmentDetails,
                    investmentAmount: Number(text),
                  })
                }
                iconName="cash"
                label="Amount"
                placeholder="Enter Amount"
                keyboardType="numeric"
                isNeeded={true}
                isAirtime={true}
                isBalance={
                  userWalletData &&
                  userWalletData?.availableBalance
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                }
              />
              {investment?.amountRange && (
                <Text
                  style={{
                    color: COLORS.lendaBlue,
                    fontWeight: '500',
                    textAlign: 'right',
                    marginBottom: 15,
                  }}>
                  Investment Range (₦
                  {investment?.amountRange
                    ? `${investment?.amountRange?.minAmount
                        .toString()
                        .replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ',',
                        )} - ${investment?.amountRange?.maxAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : '0.00'}
                  )
                </Text>
              )}
              <Text
                style={{
                  color: '#4E4B66',
                  fontWeight: '500',
                  marginBottom: 10,
                }}>
                Transaction Pin <Text style={{color: COLORS.googleRed}}>*</Text>
              </Text>
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
              <TouchableOpacity
                style={{marginTop: 40}}
                disabled={disableit}
                onPress={() => {
                  if (Number(investmentDetails?.investmentAmount) <= 0) {
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
                    Number(investmentDetails?.investmentAmount) >
                    Number(userWalletData?.availableBalance)
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
                  } else if (
                    Number(investmentDetails?.investmentAmount) <
                    Number(investment?.amountRange?.minAmount)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Lenda Investment',
                      text2: 'Investment amount is below minimum investment',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else if (
                    Number(investmentDetails?.investmentAmount) >
                    Number(investment?.amountRange?.maxAmount)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Lenda Investment',
                      text2: 'Investment amount is above maximum investment',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    setInvestmentDetails({
                      ...investmentDetails,
                      transactionPin: `${otp[1] + otp[2] + otp[3] + otp[4]}`,
                    });

                    navigation.navigate('TransactionSummary', {
                      description: `${investment?.investmentType} Top-Up`,
                      id: investment?._id,
                      name: name,
                      ...investmentDetails,
                      transactionPin: `${otp[1] + otp[2] + otp[3] + otp[4]}`,
                      action: 'TOP-UP',
                    });
                  }
                }}>
                <Buttons label={'Invest Now'} disabled={disableit} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentTopup;

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
