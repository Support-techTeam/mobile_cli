import {
  View,
  Text,
  Animated,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Buttons from '../../component/buttons/Buttons';
import {
  createInternalTransfer,
  createNIPTransfer,
} from '../../stores/WalletStore';
import appsFlyer from 'react-native-appsflyer';
import {Header} from '../../component/header/Header';
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
import COLORS from '../../constants/colors';
import {Center, Checkbox} from 'native-base';
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

const Pin = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {bankDetails} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [hideValue, setHideValue] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const disableit = value.length === 4 ? false : true;

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

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
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

  const [transferDetails, setTransferDetails] = useState({});
  const [internalTransferDetails, setInternalTransferDetails] = useState({});

  useEffect(() => {
    setTransferDetails({
      fromWalletIdAccountNumber:
        bankDetails?.fromWalletIdAccountNumber === undefined
          ? ''
          : bankDetails?.fromWalletIdAccountNumber,
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
      transactionPin: value,
    });
  }, [bankDetails, value]);

  useEffect(() => {
    setInternalTransferDetails({
      fromWalletIdAccountNumber:
        bankDetails?.fromWalletIdAccountNumber === undefined
          ? ''
          : bankDetails?.fromWalletIdAccountNumber,
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
      transactionPin: value,
    });
  }, [bankDetails, value]);

  const logAppsFlyer = (event, serviceType, value) => {
    const eventName = event;
    const eventValues = {
      service_type: serviceType,
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

  const handleTransfer = async () => {
    try {
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
          logAppsFlyer(
            'Transfer',
            'Internal Transfer',
            transferDetails?.amount,
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
          logAppsFlyer(
            'Transfer',
            'NIP Transfer',
            internalTransferDetails?.amount,
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
          navigation.navigate('Success');
        }
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Loader visible={isLoading} loadingText={'Processing please wait...'} />

      <Header
        routeAction={() => navigation.goBack()}
        heading={'TRANSACTION PIN'}
        disable={false}
      />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
        }}>
        <Text style={styles.title}>{''}</Text>
        <Icon
          name="lock-check"
          size={60}
          color={COLORS.lendaGreen}
          style={{marginLeft: 'auto', marginRight: 'auto'}}
        />
        <Text style={styles.subTitle}>
          Please enter your transaction pin{'\n'}
          to authorize this transfer
        </Text>

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

        <TouchableOpacity
          onPress={handleTransfer}
          style={{marginBottom: 20, marginHorizontal: 20}}>
          <Buttons label={'Verify'} disabled={disableit} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pin;

const internalStyles = StyleSheet.create({
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
  checkboxContainer: {
    // Styles for the touchable opacity
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  checkboxLabel: {
    // Label styles
  },
});
