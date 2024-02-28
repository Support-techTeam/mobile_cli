import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Buttons from '../../component/buttons/Buttons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  purchaseAirtime,
  purchaseDataPlan,
  purchaseElectricity,
  renewSubscription,
  updateSubscription,
} from '../../stores/BillStore';
import appsFlyer from 'react-native-appsflyer';
import Loader from '../../component/loader/loader';
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

const BillPin = ({route}) => {
  const {airtimeDetails, acctNumber, selectedPackageData} = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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

  const details = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: value,
  };
  const dataDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: value,
    DataCode: airtimeDetails.package,
  };

  const powerDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: value,
    meterNumber: airtimeDetails.meter,
  };
  const cableDetails = {
    serviceType: airtimeDetails.network,
    amount: Number(airtimeDetails.amount),
    phone: airtimeDetails.number,
    transactionPin: value,
    variationCode: airtimeDetails.variationCode,
    cardNumber: airtimeDetails.cardNumber,
  };

  const logAppsFlyer = (event, serviceType, phone, value) => {
    const eventName = event;
    const eventValues = {
      service_type: serviceType,
      contact: phone,
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

  const createPayment = async () => {
    if (airtimeDetails.service === 'airtime purchase') {
      try {
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
          logAppsFlyer(
            'bill_purchase',
            details?.serviceType,
            details?.phone,
            details?.amount,
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
            navigation.navigate('StatusSuc');
          }, 1000);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    if (airtimeDetails.service === 'data purchase') {
      try {
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
          logAppsFlyer(
            'bill_purchase',
            dataDetails?.serviceType,
            dataDetails?.phone,
            dataDetails?.amount,
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
            navigation.navigate('StatusSuc');
          }, 1000);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    if (airtimeDetails.service === 'electricity purchase') {
      try {
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
          logAppsFlyer(
            'bill_purchase',
            powerDetails?.serviceType,
            powerDetails?.phone,
            powerDetails?.amount,
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
            navigation.navigate('StatusSuc');
          }, 1000);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    if (airtimeDetails.service === 'cable_tv purchase') {
      try {
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
          logAppsFlyer(
            'bill_purchase',
            cableDetails?.serviceType,
            cableDetails?.phone,
            cableDetails?.amount,
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
            navigation.navigate('StatusSuc');
          }, 1000);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
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
        heading="TRANSACTION PIN"
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
          onPress={createPayment}
          style={{marginBottom: 20, marginHorizontal: 20}}>
          <Buttons label={'Verify'} disabled={disableit} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillPin;

const internalStyles = StyleSheet.create({
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
