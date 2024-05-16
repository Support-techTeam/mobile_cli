import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Loader from '../../component/loader/loader';
import {Header} from '../../component/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Buttons from '../../component/buttons/Buttons';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  getDataPlanByProvider,
  verifyMeter,
  getCableTvProvider,
  verifyIUC,
} from '../../stores/BillStore';
import {getSeerbitWalletBalance} from '../../stores/WalletStore';

let bankerListData = [
  {value: '', label: 'Select Option'},
  {value: '', label: 'N/A'},
];

let selectedData = '';

const Overview = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const routes = useRoute();
  const dispatch = useDispatch();
  const [airtimeDetails, setAirtimeDetails] = useState({
    fromWalletIdAccountNumber: '',
    number: '',
    network: '',
    amount: '',
  });

  const [dataDetails, setDataDetails] = useState({
    fromWalletIdAccountNumber: '',
    number: '',
    network: '',
    amount: '',
    packages: '',
  });
  const insets = useSafeAreaInsets();
  const seerbitBalance = useSelector(state => state.userProfile.balanceSB);
  const userMultiWalletData = useSelector(
    state => state.userProfile.multiWallet,
  );
  const {details, billType} = routes.params;
  const [providerPlan, setProviderPlan] = useState([]);
  const [verificationDetails, setVerificationDetails] = useState({
    name: '',
    address: '',
  });
  const [powerDetails, setPowerDetails] = useState({
    fromWalletIdAccountNumber: '',
    number: '',
    network: '',
    amount: '',
    meterNumber: '',
  });
  const [tvBouquets, setTvBouquets] = useState([]);
  const [detailsIUC, setDetailsIUC] = useState({
    name: '',
    subscription: '',
  });

  const [cableDetails, setCableDetails] = useState({
    fromWalletIdAccountNumber: '',
    number: '',
    network: '',
    amount: '',
    cardNumber: '',
    variationCode: '',
  });

  useEffect(() => {
    if (billType === 'airtime') {
      setAirtimeDetails({...airtimeDetails, network: details?.servieType});
    }
    if (billType === 'data') {
      setDataDetails({...dataDetails, network: details?.serviceType});
    }

    if (billType === 'power') {
      setPowerDetails({...powerDetails, network: details?.serviceType});
    }

    if (billType === 'cable') {
      setCableDetails({...cableDetails, network: details?.value});
    }
  }, [details]);

  useEffect(() => {
    if (billType === 'data') {
      fetchingProviderDataPlans();
    }
  }, []);

  const fetchingProviderDataPlans = async e => {
    if (details?.serviceType)
      try {
        setIsLoading(true);
        const res = await getDataPlanByProvider(details?.serviceType);
        if (res?.error) {
          // TODO: handle error
        } else {
          setProviderPlan(res?.data?.data?.data);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
  };

  const fetchingMeterValidation = async () => {
    try {
      setIsLoading(true);
      const data = {
        serviceType: powerDetails.network,
        meterNumber: powerDetails.meterNumber.toString(),
      };
      const res = await verifyMeter(data);

      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.data?.message
            ? res?.data?.data?.message
            : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setVerificationDetails({
          name: res?.data?.data?.data?.customerName,
          address: res?.data?.data?.data?.address,
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (billType === 'cable') {
      fetchingCableTvProvider();
    }
  }, []);

  const fetchingCableTvProvider = async e => {
    try {
      setIsLoading(true);
      const res = await getCableTvProvider(details?.value);
      if (res?.error) {
        // TODO: handle error
      } else {
        setTvBouquets(res?.data?.data?.data);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchingCardValidation = async () => {
    try {
      setIsLoading(true);
      const data = {
        provider: cableDetails.network,
        cardNumber: cableDetails.cardNumber.toString(),
      };

      const res = await verifyIUC(data);

      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.data?.message
            ? res?.data?.data?.message
            : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setDetailsIUC({
          name: res?.data?.data?.data?.user?.name,
          subscription: res?.data?.data?.data?.user?.outstandingBalance,
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  // set bank list
  useEffect(() => {
    try {
      if (userMultiWalletData && userMultiWalletData?.length > 0) {
        bankerListData = [{value: 'Select Option', label: 'Select Option'}];
        userMultiWalletData?.map((walletData, index) => {
          bankerListData.push({
            label: walletData?.walletIdAccountNumber,
            value: `${walletData?.walletIdAccountNumber} - ${
              walletData?.banker === 'Providus'
                ? 'Providus Bank'
                : walletData?.banker
            }`,
            key: index,
          });
        });
      }
    } catch (e) {}
  }, [userMultiWalletData]);

  // Get seerbit balance
  const unsubGetSeerbitWalletBalance = async () => {
    try {
      if (userMultiWalletData && userMultiWalletData?.length > 0) {
        if (
          selectedData?.pocketId !== null &&
          selectedData?.pocketId !== undefined
        ) {
          setIsLoading(true);
          getSeerbitWalletBalance(selectedData?.pocketId)
            .then(res => {
              if (res) {
                if (!res?.error) {
                  dispatch(setBalanceSB(res?.data));
                }
              }
            })
            .catch(e => {})
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    } catch (e) {}
  };

  const defaultAmount = [
    {value: 100, label: '100'},
    {value: 200, label: '200'},
    {value: 400, label: '400'},
    {value: 500, label: '500'},
    {value: 1000, label: '1000'},
    {value: 2000, label: '2000'},
  ];

  const powerDefaultAmount = [
    {value: 1000, label: '1000'},
    {value: 2000, label: '2000'},
    {value: 5000, label: '5000'},
    {value: 8000, label: '8000'},
    {value: 10000, label: '10000'},
    {value: 15000, label: '15000'},
  ];

  const disableit =
    !airtimeDetails.number ||
    !airtimeDetails.network ||
    !airtimeDetails.amount ||
    !airtimeDetails?.fromWalletIdAccountNumber;

  const disableitdata =
    !dataDetails.number ||
    !dataDetails.network ||
    !dataDetails.amount ||
    !dataDetails?.fromWalletIdAccountNumber ||
    !dataDetails.packages;

  const disableitpower =
    !powerDetails.number ||
    !powerDetails.network ||
    !powerDetails.meterNumber ||
    !powerDetails?.fromWalletIdAccountNumber ||
    !powerDetails.amount;

  const disableitcable =
    !cableDetails.number ||
    !cableDetails.network ||
    !cableDetails.cardNumber ||
    !cableDetails.variationCode ||
    !cableDetails?.fromWalletIdAccountNumber ||
    !cableDetails.amount;
  const airtimeDashboard = () => {
    return (
      <View style={[styles.container, styles.transView]}>
        {defaultAmount &&
          defaultAmount?.map((data, index) => {
            let imageResource = require('../../../assets/images/airtime.png');
            if (details?.servieType?.toLowerCase() == 'mtn') {
              imageResource = require('../../../assets/images/mtn.png');
            }
            if (details?.servieType?.toLowerCase() == 'airtel') {
              imageResource = require('../../../assets/images/airtel.png');
            }
            if (details?.servieType?.toLowerCase() == 'glo') {
              imageResource = require('../../../assets/images/glo.png');
            }
            if (details?.servieType?.toLowerCase() == '9mobile') {
              imageResource = require('../../../assets/images/9mobile.png');
            }
            if (details?.servieType?.toLowerCase() == 'spectranet') {
              imageResource = require('../../../assets/images/spectranet.png');
            }
            if (details?.servieType?.toLowerCase() == 'smile') {
              imageResource = require('../../../assets/images/smile.png');
            }
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setAirtimeDetails({
                    ...airtimeDetails,
                    amount: String(data.value),
                  });
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                      ? '#D9DBE9'
                      : details.buttonBackground,
                    padding: pressed ? 10 : 0,
                    transform: [
                      {
                        scale: pressed ? 0.9 : 1,
                      },
                    ],
                  },
                  styles.transButtons,
                ]}>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    padding: 10,
                    position: 'relative',
                  }}>
                  <Image style={styles.PanelImage} source={imageResource} />
                </View>
                <View style={{alignSelf: 'center', marginTop: 5}}>
                  <Text
                    style={[
                      styles.transText,
                      {
                        color: data.buttonTextColor,
                      },
                    ]}>
                    {new Intl.NumberFormat('en-NG', {
                      currency: 'NGN',
                      style: 'currency',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Number(data.value))}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>
    );
  };
  const airTimeForm = () => {
    return (
      <Fragment>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: 10,
            fontSize: 18,
            fontWeight: '800',
            color: COLORS.lendaGreen,
          }}>
          Or
        </Text>
        <Text
          style={{
            textAlign: 'left',
            marginVertical: 5,
            fontSize: 18,
            fontWeight: '500',
          }}>
          Enter amount manually
        </Text>
        <KeyboardAvoidingWrapper>
          <View style={{marginTop: 19}}>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', marginVertical: 5}}>
                <Text style={styles.droplabel}>Select Account</Text>
                <Text style={{color: 'red', marginRight: 10}}>*</Text>
              </View>
              <SelectList
                setSelected={val => {
                  try {
                    const splitData = val && val?.length > 0 && val.split('-');
                    const selectedAccount = splitData[0]?.trim();
                    if (selectedAccount === 'Select Option') {
                      Toast.show({
                        type: 'warning',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Select Account',
                        text2: 'You need to select an account!',
                        visibilityTime: 3000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                    } else {
                      selectedData = userMultiWalletData?.find(
                        walletData =>
                          walletData?.walletIdAccountNumber ===
                          selectedAccount?.toString(),
                      );
                      setAirtimeDetails({
                        ...airtimeDetails,
                        fromWalletIdAccountNumber: selectedAccount.toString(),
                      });
                      if (selectedAccount[0] == '4') {
                        unsubGetSeerbitWalletBalance();
                      }
                    }
                  } catch (e) {}
                }}
                data={bankerListData}
                save="value"
                searchPlaceholder="Search for account"
                search={false}
                boxStyles={styles.inputContainer}
                closeicon={<Icon name="times-circle" size={26} color="#000" />}
                dropdownStyles={{
                  paddingHorizontal: 10,
                  marginTop: 2,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                dropdownItemStyles={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 3,
                }}
              />
            </View>

            <View style={{marginTop: 10}}>
              <InputPhone
                label="Mobile number"
                layout="first"
                isNeeded={true}
                defaultCode="NG"
                codeTextStyle={{color: '#6E7191'}}
                defaultValue={airtimeDetails?.number}
                onChangeFormattedText={text =>
                  setAirtimeDetails({...airtimeDetails, number: text})
                }
              />
            </View>
            <Input
              label="Amount"
              placeholder="Enter amount"
              defaultValue={airtimeDetails?.amount}
              isAirtime={true}
              isBalance={
                userMultiWalletData && selectedData?.banker === 'Providus'
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(selectedData?.availableBalance))
                  : selectedData?.banker === '9 Payment Service Bank'
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                      .format(Number(seerbitBalance))
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                  : '0.00'
              }
              keyboardType="numeric"
              onChangeText={text =>
                setAirtimeDetails({...airtimeDetails, amount: text})
              }
              isNeeded={true}
            />
            <TouchableOpacity
              style={{marginTop: 20}}
              disabled={disableit}
              onPress={() => {
                if (Number(airtimeDetails?.amount) <= 0) {
                  Toast.show({
                    type: 'error',
                    position: 'top',
                    topOffset: 50,
                    text1: 'Bill Bayment',
                    text2: 'Invalid amount entered!',
                    visibilityTime: 5000,
                    autoHide: true,
                    onPress: () => Toast.hide(),
                  });
                  return;
                } else if (
                  userMultiWalletData &&
                  selectedData?.banker === 'Providus'
                ) {
                  if (
                    selectedData?.availableBalance == undefined ||
                    selectedData?.availableBalance == null
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Balance not available!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else if (
                    Number(airtimeDetails?.amount) >
                    Number(selectedData?.availableBalance)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Available balance exceeded!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    navigation.navigate('AirtimeConfirm', {
                      airtimeDetails: {
                        fromWalletIdAccountNumber:
                          airtimeDetails?.fromWalletIdAccountNumber,
                        number: airtimeDetails?.number,
                        network: airtimeDetails?.network,
                        amount: airtimeDetails?.amount,
                        service: 'airtime purchase',
                      },
                    });
                  }
                } else if (
                  userMultiWalletData &&
                  selectedData?.banker === '9 Payment Service Bank'
                ) {
                  if (seerbitBalance == undefined || seerbitBalance == null) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Balance not available!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else if (
                    Number(airtimeDetails?.amount) > Number(seerbitBalance)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Available balance exceeded!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    navigation.navigate('AirtimeConfirm', {
                      airtimeDetails: {
                        fromWalletIdAccountNumber:
                          airtimeDetails?.fromWalletIdAccountNumber,
                        number: airtimeDetails?.number,
                        network: airtimeDetails?.network,
                        amount: airtimeDetails?.amount,
                        service: 'airtime purchase',
                      },
                    });
                  }
                } else {
                  navigation.navigate('AirtimeConfirm', {
                    airtimeDetails: {
                      fromWalletIdAccountNumber:
                        airtimeDetails?.fromWalletIdAccountNumber,
                      number: airtimeDetails?.number,
                      network: airtimeDetails?.network,
                      amount: airtimeDetails?.amount,
                      service: 'airtime purchase',
                    },
                  });
                }
              }}>
              <Buttons label={'Next'} disabled={disableit} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingWrapper>
      </Fragment>
    );
  };

  const dataDashboard = () => {
    return (
      <View style={[styles.container, styles.transView]}>
        {providerPlan &&
          providerPlan?.map((data, index) => {
            let imageResource = require('../../../assets/images/airtime.png');
            if (details?.serviceType?.toLowerCase() == 'mtn') {
              imageResource = require('../../../assets/images/mtn.png');
            }
            if (details?.serviceType?.toLowerCase() == 'airtel') {
              imageResource = require('../../../assets/images/airtel.png');
            }
            if (details?.serviceType?.toLowerCase() == 'glo') {
              imageResource = require('../../../assets/images/glo.png');
            }
            if (details?.serviceType?.toLowerCase() == '9mobile') {
              imageResource = require('../../../assets/images/9mobile.png');
            }
            if (details?.serviceType?.toLowerCase() == 'spectranet') {
              imageResource = require('../../../assets/images/spectranet.png');
            }
            if (details?.serviceType?.toLowerCase() == 'smile') {
              imageResource = require('../../../assets/images/smile.png');
            }
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setDataDetails({
                    ...dataDetails,
                    amount: String(data.price),
                    packages: String(data.datacode),
                  });
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                      ? '#D9DBE9'
                      : details.buttonBackground,
                    padding: pressed ? 10 : 0,
                    transform: [
                      {
                        scale: pressed ? 0.9 : 1,
                      },
                    ],
                  },
                  styles.transButtons,
                ]}>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    padding: billType == 'data' ? 2 : 10,
                    position: 'relative',
                  }}>
                  <Image style={styles.PanelImage} source={imageResource} />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    numberOfLines={4}
                    style={
                      ([styles.transText],
                      {
                        flexWrap: 'nowrap',
                        fontStyle: 'normal',
                        textAlign: 'center',
                      })
                    }>
                    {data?.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>
    );
  };

  const dataForm = () => {
    return (
      <Fragment>
        <KeyboardAvoidingWrapper>
          <View style={{marginTop: 19}}>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', marginVertical: 5}}>
                <Text style={styles.droplabel}>Select Account</Text>
                <Text style={{color: 'red', marginRight: 10}}>*</Text>
              </View>
              <SelectList
                setSelected={val => {
                  try {
                    const splitData = val && val?.length > 0 && val.split('-');
                    const selectedAccount = splitData[0].trim();
                    if (selectedAccount === 'Select Option') {
                      Toast.show({
                        type: 'warning',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Select Account',
                        text2: 'You need to select an account!',
                        visibilityTime: 3000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                    } else {
                      selectedData = userMultiWalletData?.find(
                        walletData =>
                          walletData?.walletIdAccountNumber ===
                          selectedAccount.toString(),
                      );
                      setDataDetails({
                        ...dataDetails,
                        fromWalletIdAccountNumber: selectedAccount.toString(),
                      });
                      if (selectedAccount[0] == '4') {
                        unsubGetSeerbitWalletBalance();
                      }
                    }
                  } catch (e) {}
                }}
                data={bankerListData}
                save="value"
                searchPlaceholder="Search for account"
                search={false}
                boxStyles={styles.inputContainer}
                closeicon={<Icon name="times-circle" size={26} color="#000" />}
                dropdownStyles={{
                  paddingHorizontal: 10,
                  marginTop: 2,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                dropdownItemStyles={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 3,
                }}
              />
            </View>
            <View style={{marginTop: 10}}>
              <InputPhone
                label="Mobile number"
                layout="first"
                isNeeded={true}
                defaultCode="NG"
                codeTextStyle={{color: '#6E7191'}}
                defaultValue={dataDetails?.number}
                onChangeFormattedText={text =>
                  setDataDetails({...dataDetails, number: text})
                }
              />
            </View>
            <Input
              label="(AutoFilled) Amount"
              placeholder="Enter amount"
              defaultValue={dataDetails.amount.toString()}
              isAirtime={true}
              isBalance={
                userMultiWalletData && selectedData?.banker === 'Providus'
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(selectedData?.availableBalance))
                  : selectedData?.banker === '9 Payment Service Bank'
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                      .format(Number(seerbitBalance))
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                  : '0.00'
              }
              keyboardType="numeric"
              onChangeText={text =>
                setDataDetails({...dataDetails, amount: text})
              }
              editable={false}
              isNeeded={true}
            />
            <TouchableOpacity
              style={{marginTop: 20}}
              disabled={disableitdata}
              onPress={() => {
                if (Number(dataDetails?.amount) <= 0) {
                  Toast.show({
                    type: 'error',
                    position: 'top',
                    topOffset: 50,
                    text1: 'Bill Bayment',
                    text2: 'Invalid amount entered!',
                    visibilityTime: 5000,
                    autoHide: true,
                    onPress: () => Toast.hide(),
                  });
                  return;
                } else if (
                  userMultiWalletData &&
                  selectedData?.banker === 'Providus'
                ) {
                  if (
                    selectedData?.availableBalance == undefined ||
                    selectedData?.availableBalance == null
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Balance not available!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else if (
                    Number(dataDetails?.amount) >
                    Number(selectedData?.availableBalance)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Available balance exceeded!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    navigation.navigate('AirtimeConfirm', {
                      airtimeDetails: {
                        fromWalletIdAccountNumber:
                          dataDetails?.fromWalletIdAccountNumber,
                        number: dataDetails?.number,
                        network: dataDetails?.network,
                        amount: dataDetails?.amount,
                        package: dataDetails?.packages,
                        service: 'data purchase',
                      },
                    });
                  }
                } else if (
                  userMultiWalletData &&
                  selectedData?.banker === '9 Payment Service Bank'
                ) {
                  if (seerbitBalance == undefined || seerbitBalance == null) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Balance not available!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else if (
                    Number(dataDetails?.amount) > Number(seerbitBalance)
                  ) {
                    Toast.show({
                      type: 'error',
                      position: 'top',
                      topOffset: 50,
                      text1: 'Bill Bayment',
                      text2: 'Available balance exceeded!',
                      visibilityTime: 5000,
                      autoHide: true,
                      onPress: () => Toast.hide(),
                    });
                    return;
                  } else {
                    navigation.navigate('AirtimeConfirm', {
                      airtimeDetails: {
                        fromWalletIdAccountNumber:
                          dataDetails?.fromWalletIdAccountNumber,
                        number: dataDetails?.number,
                        network: dataDetails?.network,
                        amount: dataDetails?.amount,
                        package: dataDetails?.packages,
                        service: 'data purchase',
                      },
                    });
                  }
                } else {
                  navigation.navigate('AirtimeConfirm', {
                    airtimeDetails: {
                      fromWalletIdAccountNumber:
                        dataDetails?.fromWalletIdAccountNumber,
                      number: dataDetails?.number,
                      network: dataDetails?.network,
                      amount: dataDetails?.amount,
                      package: dataDetails?.packages,
                      service: 'data purchase',
                    },
                  });
                }
              }}>
              <Buttons label={'Next'} disabled={disableitdata} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingWrapper>
      </Fragment>
    );
  };

  const powerDashboard = () => {
    return (
      <View style={[styles.container, styles.transView]}>
        {powerDefaultAmount &&
          powerDefaultAmount?.map((data, index) => {
            let imageResource = details.name.includes('prepaid')
              ? require('../../../assets/images/icons8-tesla_supercharger_pin.png')
              : require('../../../assets/images/icons8-voltage.png');
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setPowerDetails({
                    ...powerDetails,
                    amount: String(data.value),
                  });
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                      ? '#D9DBE9'
                      : details.buttonBackground,
                    padding: pressed ? 10 : 0,
                    transform: [
                      {
                        scale: pressed ? 0.9 : 1,
                      },
                    ],
                  },
                  styles.transButtons,
                ]}>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    padding: 10,
                    position: 'relative',
                  }}>
                  <Image style={styles.PanelImage} source={imageResource} />
                </View>
                <View style={{alignSelf: 'center', marginTop: 5}}>
                  <Text
                    style={[
                      styles.transText,
                      {
                        color: data.buttonTextColor,
                      },
                    ]}>
                    {new Intl.NumberFormat('en-NG', {
                      currency: 'NGN',
                      style: 'currency',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Number(data.value))}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>
    );
  };

  const powerForm = () => {
    return (
      <KeyboardAvoidingWrapper>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 20, paddingHorizontal: 10}}>
          <View style={{marginTop: 14}}>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', marginVertical: 5}}>
                <Text style={styles.droplabel}>Select Account</Text>
                <Text style={{color: 'red', marginRight: 10}}>*</Text>
              </View>
              <SelectList
                setSelected={val => {
                  try {
                    const splitData = val && val?.length > 0 && val.split('-');
                    const selectedAccount = splitData[0].trim();
                    if (selectedAccount === 'Select Option') {
                      Toast.show({
                        type: 'warning',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Select Account',
                        text2: 'You need to select an account!',
                        visibilityTime: 3000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                    } else {
                      selectedData = userMultiWalletData?.find(
                        walletData =>
                          walletData?.walletIdAccountNumber ===
                          selectedAccount.toString(),
                      );
                      setPowerDetails({
                        ...powerDetails,
                        fromWalletIdAccountNumber: selectedAccount.toString(),
                      });
                      if (selectedAccount[0] == '4') {
                        unsubGetSeerbitWalletBalance();
                      }
                    }
                  } catch (e) {}
                }}
                data={bankerListData}
                save="value"
                searchPlaceholder="Search for account"
                search={false}
                boxStyles={styles.inputContainer}
                closeicon={<Icon name="times-circle" size={26} color="#000" />}
                dropdownStyles={{
                  paddingHorizontal: 10,
                  marginTop: 2,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                dropdownItemStyles={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 3,
                }}
              />
            </View>
            <Input
              label="Meter Number"
              placeholder="Enter meter number"
              defaultValue={powerDetails?.meterNumber}
              keyboardType="numeric"
              onChangeText={text =>
                setPowerDetails({...powerDetails, meterNumber: text})
              }
              isNeeded={true}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  marginBottom: 10,
                  width: '50%',
                }}
                onPress={() => fetchingMeterValidation()}>
                <Buttons label={'Validate Meter'} />
              </TouchableOpacity>
            </View>
            {details.name !== '' && (
              <Input
                label="Meter Holder Name"
                placeholder="Auto generated meter holder name"
                isNeeded={true}
                defaultValue={verificationDetails?.name}
                editable={false}
              />
            )}

            {verificationDetails.address !== '' && (
              <Input
                label="Meter Holder Address"
                placeholder="Auto generated meter holder address"
                isNeeded={true}
                defaultValue={verificationDetails?.address}
                editable={false}
              />
            )}

            {verificationDetails.address !== '' &&
              verificationDetails.name !== '' && (
                <View style={{marginVertical: 10}}>
                  <Input
                    label="Amount"
                    placeholder="Enter amount"
                    defaultValue={powerDetails?.amount}
                    isAirtime={true}
                    isBalance={
                      userMultiWalletData && selectedData?.banker === 'Providus'
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(selectedData?.availableBalance))
                        : selectedData?.banker === '9 Payment Service Bank'
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                            .format(Number(seerbitBalance))
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                        : '0.00'
                    }
                    keyboardType="numeric"
                    onChangeText={text =>
                      setPowerDetails({...powerDetails, amount: text})
                    }
                    isNeeded={true}
                  />

                  <View style={{marginTop: 10}}>
                    <InputPhone
                      label="Mobile number"
                      layout="first"
                      isNeeded={true}
                      defaultCode="NG"
                      codeTextStyle={{color: '#6E7191'}}
                      defaultValue={powerDetails?.number}
                      onChangeFormattedText={text =>
                        setPowerDetails({...powerDetails, number: text})
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={{marginTop: 10, marginBottom: 70}}
                    disabled={disableitpower}
                    onPress={() => {
                      if (Number(powerDetails?.amount) <= 0) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Invalid amount entered!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else if (Number(powerDetails?.amount) < 1000) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Minimum amount is NGN 1,000 !',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else if (
                        userMultiWalletData &&
                        selectedData?.banker === 'Providus'
                      ) {
                        if (
                          selectedData?.availableBalance == undefined ||
                          selectedData?.availableBalance == null
                        ) {
                          Toast.show({
                            type: 'error',
                            position: 'top',
                            topOffset: 50,
                            text1: 'Bill Bayment',
                            text2: 'Balance not available!',
                            visibilityTime: 5000,
                            autoHide: true,
                            onPress: () => Toast.hide(),
                          });
                          return;
                        } else if (
                          Number(powerDetails?.amount) >
                          Number(selectedData?.availableBalance)
                        ) {
                          Toast.show({
                            type: 'error',
                            position: 'top',
                            topOffset: 50,
                            text1: 'Bill Bayment',
                            text2: 'Available balance exceeded!',
                            visibilityTime: 5000,
                            autoHide: true,
                            onPress: () => Toast.hide(),
                          });
                          return;
                        } else {
                          navigation.navigate('AirtimeConfirm', {
                            airtimeDetails: {
                              fromWalletIdAccountNumber:
                                powerDetails.fromWalletIdAccountNumber,
                              number: powerDetails?.number,
                              network: powerDetails?.network,
                              meter: powerDetails?.meterNumber,
                              amount: powerDetails?.amount,
                              service: 'electricity purchase',
                            },
                          });
                        }
                      } else if (
                        userMultiWalletData &&
                        selectedData?.banker === '9 Payment Service Bank'
                      ) {
                        if (
                          seerbitBalance == undefined ||
                          seerbitBalance == null
                        ) {
                          Toast.show({
                            type: 'error',
                            position: 'top',
                            topOffset: 50,
                            text1: 'Bill Bayment',
                            text2: 'Balance not available!',
                            visibilityTime: 5000,
                            autoHide: true,
                            onPress: () => Toast.hide(),
                          });
                          return;
                        } else if (
                          Number(powerDetails?.amount) > Number(seerbitBalance)
                        ) {
                          Toast.show({
                            type: 'error',
                            position: 'top',
                            topOffset: 50,
                            text1: 'Bill Bayment',
                            text2: 'Available balance exceeded!',
                            visibilityTime: 5000,
                            autoHide: true,
                            onPress: () => Toast.hide(),
                          });
                          return;
                        } else {
                          navigation.navigate('AirtimeConfirm', {
                            airtimeDetails: {
                              fromWalletIdAccountNumber:
                                powerDetails.fromWalletIdAccountNumber,
                              number: powerDetails?.number,
                              network: powerDetails?.network,
                              meter: powerDetails?.meterNumber,
                              amount: powerDetails?.amount,
                              service: 'electricity purchase',
                            },
                          });
                        }
                      } else {
                        navigation.navigate('AirtimeConfirm', {
                          airtimeDetails: {
                            fromWalletIdAccountNumber:
                              powerDetails.fromWalletIdAccountNumber,
                            number: powerDetails?.number,
                            network: powerDetails?.network,
                            meter: powerDetails?.meterNumber,
                            amount: powerDetails?.amount,
                            service: 'electricity purchase',
                          },
                        });
                      }
                    }}>
                    <Buttons label={'Next'} disabled={disableitpower} />
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    );
  };

  const cableDashboard = () => {
    return (
      <View style={[styles.container, styles.transView]}>
        {tvBouquets &&
          tvBouquets?.map((data, index) => {
            let imageResource =
              details.name?.toLowerCase() == 'dstv'
                ? require('../../../assets/images/dstv.png')
                : require('../../../assets/images/gotv.png');
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setCableDetails({
                    ...cableDetails,
                    amount: String(data.amount),
                    variationCode: data.variationCode,
                  });
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                      ? '#D9DBE9'
                      : details.buttonBackground,
                    padding: pressed ? 10 : 0,
                    transform: [
                      {
                        scale: pressed ? 0.9 : 1,
                      },
                    ],
                  },
                  styles.transButtons,
                ]}>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    padding: billType == 'cable' ? 2 : 10,
                    position: 'relative',
                  }}>
                  <Image
                    style={{width: 35, height: 35, resizeMode: 'contain'}}
                    source={imageResource}
                  />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text
                    numberOfLines={4}
                    style={
                      ([styles.transText],
                      {
                        flexWrap: 'nowrap',
                        fontStyle: 'normal',
                        textAlign: 'center',
                      })
                    }>
                    {data?.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>
    );
  };

  const cableForm = () => {
    return (
      <Fragment>
        <KeyboardAvoidingWrapper>
          <View style={{marginTop: 19}}>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', marginVertical: 5}}>
                <Text style={styles.droplabel}>Select Account</Text>
                <Text style={{color: 'red', marginRight: 10}}>*</Text>
              </View>
              <SelectList
                setSelected={val => {
                  try {
                    const splitData = val && val?.length > 0 && val.split('-');
                    const selectedAccount = splitData[0].trim();
                    if (selectedAccount === 'Select Option') {
                      Toast.show({
                        type: 'warning',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Select Account',
                        text2: 'You need to select an account!',
                        visibilityTime: 3000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                    } else {
                      selectedData = userMultiWalletData?.find(
                        walletData =>
                          walletData?.walletIdAccountNumber ===
                          selectedAccount.toString(),
                      );
                      setCableDetails({
                        ...cableDetails,
                        fromWalletIdAccountNumber: selectedAccount.toString(),
                      });
                      if (selectedAccount[0] == '4') {
                        unsubGetSeerbitWalletBalance();
                      }
                    }
                  } catch (e) {}
                }}
                data={bankerListData}
                save="value"
                searchPlaceholder="Search for account"
                search={false}
                boxStyles={styles.inputContainer}
                closeicon={<Icon name="times-circle" size={26} color="#000" />}
                dropdownStyles={{
                  paddingHorizontal: 10,
                  marginTop: 2,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                dropdownItemStyles={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: COLORS.lendaComponentBg,
                  borderColor: COLORS.lendaComponentBorder,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 3,
                }}
              />
            </View>
            <Input
              label="Card Number"
              placeholder="Enter meter number"
              defaultValue={cableDetails?.cardNumber}
              keyboardType="numeric"
              onChangeText={text =>
                setCableDetails({...cableDetails, cardNumber: text})
              }
              isNeeded={true}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  marginBottom: 10,
                  width: '50%',
                }}
                onPress={() => fetchingCardValidation()}>
                <Buttons label={'Validate'} />
              </TouchableOpacity>
            </View>
            {detailsIUC.name !== '' && (
              <Input
                label="Holder Name"
                placeholder="Auto generated meter holder name"
                isNeeded={true}
                defaultValue={detailsIUC?.name}
                editable={false}
              />
            )}

            {detailsIUC.subscription !== '' && (
              <Input
                label="Active Subscription Cost"
                placeholder="Auto generated meter holder subscription"
                isNeeded={true}
                defaultValue={detailsIUC?.subscription}
                editable={false}
              />
            )}

            {detailsIUC.subscription !== '' && detailsIUC.name !== '' && (
              <View style={{marginVertical: 10}}>
                {cableDetails?.amount != '' && (
                  <Input
                    label="Amount"
                    placeholder="Enter amount"
                    defaultValue={cableDetails.amount.toString()}
                    isAirtime={true}
                    isBalance={
                      userMultiWalletData && selectedData?.banker === 'Providus'
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(selectedData?.availableBalance))
                        : selectedData?.banker === '9 Payment Service Bank'
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                            .format(Number(seerbitBalance))
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                        : '0.00'
                    }
                    editable={false}
                    isNeeded={true}
                  />
                )}

                <View style={{marginTop: 10}}>
                  <InputPhone
                    label="Mobile number"
                    layout="first"
                    isNeeded={true}
                    defaultCode="NG"
                    codeTextStyle={{color: '#6E7191'}}
                    defaultValue={cableDetails?.number}
                    onChangeFormattedText={text =>
                      setCableDetails({...cableDetails, number: text})
                    }
                  />
                </View>
                <TouchableOpacity
                  style={{marginTop: 10, marginBottom: 70}}
                  disabled={disableitcable}
                  onPress={() => {
                    if (Number(cableDetails?.amount) <= 0) {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Bill Bayment',
                        text2: 'Invalid amount entered!',
                        visibilityTime: 5000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                      return;
                    } else if (
                      userMultiWalletData &&
                      selectedData?.banker === 'Providus'
                    ) {
                      if (
                        selectedData?.availableBalance == undefined ||
                        selectedData?.availableBalance == null
                      ) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Balance not available!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else if (
                        Number(cableDetails?.amount) >
                        Number(selectedData?.availableBalance)
                      ) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Available balance exceeded!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else {
                        navigation.navigate('AirtimeConfirm', {
                          airtimeDetails: {
                            fromWalletIdAccountNumber:
                              cableDashboard.fromWalletIdAccountNumber,
                            number: cableDetails?.number,
                            network: cableDetails?.network,
                            cardNumber: cableDetails?.cardNumber,
                            amount: cableDetails?.amount,
                            variationCode: cableDetails?.variationCode,
                            status:
                              Number(cableDetails?.amount) ==
                              Number(detailsIUC?.subscription)
                                ? 'renewal'
                                : 'update',
                            service: 'cable_tv purchase',
                          },
                        });
                      }
                    } else if (
                      userMultiWalletData &&
                      selectedData?.banker === '9 Payment Service Bank'
                    ) {
                      if (
                        seerbitBalance == undefined ||
                        seerbitBalance == null
                      ) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Balance not available!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else if (
                        Number(cableDetails?.amount) > Number(seerbitBalance)
                      ) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Available balance exceeded!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else {
                        navigation.navigate('AirtimeConfirm', {
                          airtimeDetails: {
                            fromWalletIdAccountNumber:
                              cableDashboard.fromWalletIdAccountNumber,
                            number: cableDetails?.number,
                            network: cableDetails?.network,
                            cardNumber: cableDetails?.cardNumber,
                            amount: cableDetails?.amount,
                            variationCode: cableDetails?.variationCode,
                            status:
                              Number(cableDetails?.amount) ==
                              Number(detailsIUC?.subscription)
                                ? 'renewal'
                                : 'update',
                            service: 'cable_tv purchase',
                          },
                        });
                      }
                    } else {
                      navigation.navigate('AirtimeConfirm', {
                        airtimeDetails: {
                          fromWalletIdAccountNumber:
                            cableDashboard.fromWalletIdAccountNumber,
                          number: cableDetails?.number,
                          network: cableDetails?.network,
                          cardNumber: cableDetails?.cardNumber,
                          amount: cableDetails?.amount,
                          variationCode: cableDetails?.variationCode,
                          status:
                            Number(cableDetails?.amount) ==
                            Number(detailsIUC?.subscription)
                              ? 'renewal'
                              : 'update',
                          service: 'cable_tv purchase',
                        },
                      });
                    }
                  }}>
                  <Buttons label={'Next'} disabled={disableitcable} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingWrapper>
      </Fragment>
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
        heading="BILLING OVERVIEW"
        disable={false}
      />
      <Text
        style={{
          textAlign: 'left',
          marginVertical: 10,
          fontSize: 18,
          fontWeight: '500',
          paddingHorizontal: 20,
        }}>
        {billType === 'airtime' && 'Select amount option'}
        {billType === 'data' && 'Select data option'}
        {billType === 'power' && 'Select amount option'}
        {billType === 'cable' && 'Select bouquet option'}
      </Text>
      {billType === 'data' && (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{flex: 1}}>
          {billType === 'data' && dataDashboard()}
        </ScrollView>
      )}
      {billType === 'cable' && (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{flex: 1}}>
          {billType === 'cable' && cableDashboard()}
        </ScrollView>
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
          flex: 1,
        }}>
        {billType === 'airtime' && airtimeDashboard()}
        {billType === 'airtime' && airTimeForm()}

        {billType === 'data' && dataForm()}
        {billType === 'cable' && cableForm()}
        {/* Power */}
        {billType === 'power' && powerDashboard()}
        {billType === 'power' && powerForm()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Overview;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: COLORS.lendaComponentBorder,
    marginHorizontal: 20,
    width: wp(90),
    alignSelf: 'center',
  },
  transView: {
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  transButtons: {
    borderWidth: 0.6,
    width: wp(24),
    height: hp(30),
    aspectRatio: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: '#D9DBE9',
    borderRadius: 10,
    padding: wp(2),
    backgroundColor: '#FCFCFC',
    marginVertical: 8,
  },
  transText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: hp(2),
    fontStyle: 'italic',
  },
  PanelImage: {
    width: 35,
    height: 35,
    borderRadius: 40,
  },
  innercontainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flex: 1,
  },
  inputContainer: {
    height: 55,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaComponentBorder,
    padding: 12,
    borderBottomWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
