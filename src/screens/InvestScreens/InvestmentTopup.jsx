import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import Buttons from '../../component/buttons/Buttons';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
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
import {Center, Checkbox} from 'native-base';
import {Header} from '../../component/header/Header';
import Loader from '../../component/loader/loader';

const {Value, Text: AnimatedText} = Animated;
const CELL_COUNT = 4;

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
  const [value, setValue] = useState('');
  const [hideValue, setHideValue] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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

  const disableit = value.length < 4 || investmentDetails.investmentAmount == 0;

  const disableitarm =
    !armDetails.productCode || armDetails.investmentAmount == 0;

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
          }),
        },
      ],
    };

    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={
          hideValue
            ? [styles.cell, animatedCellStyle]
            : [styles.cell, isFocused && styles.focusCell]
        }
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
       <Loader visible={isLoading} loadingText={'Please wait...'} />
      <Header
        routeAction={() => navigation.goBack()}
        heading={`${name?.toUpperCase()} INVESTMENT TOP-UP`}
        disable={false}
      />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {name === 'Arm' ? (
          <View style={internalStyles.innerContainer}>
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
                  new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(userWalletData.availableBalance))
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
                    ? new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(investment?.minimumInvestmentAmount))
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
          <View style={internalStyles.innerContainer}>
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
                  new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(userWalletData?.availableBalance))
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
                    ? `${new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        Number(investment?.amountRange?.minAmount),
                      )} - ${new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(investment?.amountRange?.maxAmount))}`
                    : '0.00'}
                  )
                </Text>
              )}
              <Text
                style={{
                  color: '#4E4B66',
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                Transaction Pin <Text style={{color: COLORS.googleRed}}>*</Text>
              </Text>
              <View style={internalStyles.pinView}>
                <View style={internalStyles.otpContainer}>
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
                <View style={{marginVertical: 25}}>
                  <Center>
                    <Checkbox
                      size="md"
                      colorScheme="info"
                      defaultIsChecked={!hideValue}
                      onChange={state => {
                        setHideValue(!state);
                      }}>
                      Show transaction pin
                    </Checkbox>
                  </Center>
                </View>
              </View>
              <TouchableOpacity
                style={{marginTop: 0}}
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
                      transactionPin: value,
                    });

                    navigation.navigate('TransactionSummary', {
                      description: `${investment?.investmentType} Top-Up`,
                      id: investment?._id,
                      name: name,
                      ...investmentDetails,
                      transactionPin: value,
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

const internalStyles = StyleSheet.create({
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
