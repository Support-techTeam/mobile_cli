/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
  ToastAndroid,
  NativeModules,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  VStack,
  Center,
  HStack,
  Box,
  Container,
  Flex,
  Stack,
  AspectRatio,
  Heading,
  Circle,
  Badge,
  Fab,
  Actionsheet,
} from 'native-base';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OctaIcon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useClipboard} from '@react-native-clipboard/clipboard';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {
  getAccountWallet,
  getAccountTransactions,
} from '../../stores/WalletStore/';
import Toast from 'react-native-toast-message';
import {
  setAccount,
  setTransactions,
  setWallet,
} from '../../util/redux/userProfile/user.profile.slice';
import {userLogOut} from '../../stores/AuthStore';
import {resetStore} from '../../util/redux/store';
import PersonalDetails from '../ProfileOnboardings/PersonalDetails';
import Splashscreen from '../../navigation/Splashscreen';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {getLoanUserDetails, getLoansAmount} from '../../stores/LoanStore';
import {checkPin} from '../../stores/ProfileStore';
// import RNRestart from 'react-native-restart';

const {width, height} = Dimensions.get('window');
const Homescreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMakeTransferVisible, setIsMakeTransferVisible] = useState(false);
  const [isFundWalletVisible, setIsFundWalletVisible] = useState(false);
  const [isAllTransactionVisible, setIsAllTransactionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrevious, setPrevious] = useState(false);
  const [isNext, setNext] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  //Redux Calls
  const userProfileData = useSelector(state => state.userProfile.profile);
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const userAccountData = useSelector(state => state.userProfile.account);
  const [userTransactionsData, setUserTransactionsData] = useState([]);
  const [allUserTransactionsData, setAllUserTransactionsData] = useState([]);
  const [userTransactionsPages, setUserTransactionsPages] = useState([]);
  const [userTransactionsTotal, setUserTransactionsTotal] = useState([]);
  const [userLoanAmount, setUserLoanAmount] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setString] = useClipboard();
  const [timeOut, setTimeOut] = useState(false);
  const route = useRoute();
  const isFocused = useIsFocused();
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [userPin, setUserPin] = useState(true);

  const dispatch = useDispatch();

  const toggleMakeTransfer = () => {
    setIsMakeTransferVisible(!isMakeTransferVisible);
  };

  const toggleFundWallet = () => {
    setIsFundWalletVisible(!isFundWalletVisible);
  };

  const toggleAllTransaction = async () => {
    setIsAllTransactionVisible(!isAllTransactionVisible);
    setIsFetching(true);
    // if (isAllTransactionVisible) {
    const res = await getAccountTransactions(1, 10);
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      setCurrentPage(1);
      if (
        res?.data?.transactions?.transaction !== undefined &&
        res.data?.transactions?.transaction !== null
      ) {
        setAllUserTransactionsData(res?.data?.transactions?.transaction);
        setUserTransactionsPages(res?.data?.transactions?.maxPages);
        setUserTransactionsTotal(res?.data?.transactions?.count);
      }
    }
    // }
    setIsFetching(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeOut(true);
    }, 3000);
  });

  useEffect(() => {
    unsubGetWallet();
  }, []);

  const unsubGetWallet = async () => {
    setIsLoading(true);
    const res = await getAccountWallet();
    if (res.error) {
      // TODO: handle error
    } else {
      dispatch(setWallet(res?.data?.data?.wallet));
      dispatch(setAccount(res?.data?.data?.accountDetails));
    }
    setIsLoading(false);
  };
  useEffect(() => {
    unsubGetAllTransactions();
  }, []);

  const unsubGetAllTransactions = async () => {
    setIsLoading(true);
    const res = await getAccountTransactions(1, 10);
    if (res.error) {
      // TODO:
    } else {
      setCurrentPage(1);
      if (
        res?.data?.transactions?.transaction !== undefined &&
        res.data?.transactions?.transaction !== null
      ) {
        setUserTransactionsData(res?.data?.transactions?.transaction);
        setAllUserTransactionsData(res?.data?.transactions?.transaction);
        setUserTransactionsPages(res?.data?.transactions?.maxPages);
        setUserTransactionsTotal(res?.data?.transactions?.count);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    unsubGetTransactions();
  }, []);

  const unsubGetTransactions = async () => {
    setIsLoading(true);
    const res = await getAccountTransactions(1, 10);
    if (res.error) {
      // TODO: handle error
    } else {
      setCurrentPage(1);
      setUserTransactionsData(res?.data?.transactions?.transaction);
      setUserTransactionsPages(res?.data?.transactions?.maxPages);
      setUserTransactionsTotal(res?.data?.transactions?.count);
    }
    setIsLoading(false);
  };

  const unsubGetLoanAmount = async () => {
    setIsLoading(true);
    const res = await getLoansAmount();
    if (res.error) {
      // TODO: handle error
    } else {
      setUserLoanAmount(res?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    unsubCheckPin();
  }, []);

  const unsubCheckPin = async () => {
    const res = await checkPin(1, 10);
    if (res.error) {
      // TODO: handle error
    } else {
      console.log('PIN', res?.data);
      setUserPin(res?.data?.data?.hasPin);
    }
  };

  //Navigation useEffect Hook
  useEffect(() => {
    if (route.name === 'Home') {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('Home Screen focused. Calling a function...');
        unsubGetWallet();
        unsubGetAllTransactions();
        unsubGetTransactions();
        unsubGetLoanAmount();
        getLoanUserData();
      });
      return unsubscribe;
    }
  }, [navigation]);

  // Timed useEffect
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getAccountWallet();
      if (res.error == false) {
        dispatch(setWallet(res?.data?.data?.wallet));
        dispatch(setAccount(res?.data?.data?.accountDetails));
      }
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getAccountTransactions();
      if (res.error == false) {
        if (
          res?.data?.transactions?.transaction !== undefined &&
          res.data?.transactions?.transaction !== null
        ) {
          setUserTransactionsData(res?.data?.transactions.transaction);
          setAllUserTransactionsData(res?.data?.transactions.transaction);
        }
      }
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleLongPress = async evt => {
    try {
      setString(evt);
      ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
    } catch (error) {
      // console.error('Error copying to clipboard:', error);
    }
  };

  const handleGetPreviousPage = async () => {
    if (currentPage !== 1) {
      setPrevious(true);
      const prevPage = currentPage - 1;
      const res = await getAccountTransactions(prevPage, 10);
      if (res.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res.title,
          text2: res.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setCurrentPage(currentPage - 1);
        setAllUserTransactionsData(res?.data?.transactions?.transaction);
        setUserTransactionsPages(res?.data?.transactions?.maxPages);
        setUserTransactionsTotal(res?.data?.transactions?.count);
      }
      setPrevious(false);
    }
  };

  const handleGetNextPage = async () => {
    if (currentPage !== Number(userTransactionsPages)) {
      setNext(true);
      const nextPage = currentPage + 1;
      const res = await getAccountTransactions(nextPage, 10);
      if (res.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res.title,
          text2: res.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setCurrentPage(nextPage);
        setAllUserTransactionsData(res?.data?.transactions?.transaction);
        setUserTransactionsPages(res?.data?.transactions?.maxPages);
        setUserTransactionsTotal(res?.data?.transactions?.count);
      }
      setNext(false);
    }
  };

  const slides = [
    {
      id: '1',
      title: 'Wallet balance',
      balance:
        userWalletData && userWalletData?.availableBalance
          ? Number(userWalletData?.availableBalance)
              ?.toString()
              ?.replace(/\B(?=(\d{3})+\b)/g, ',')
          : '0.00',
      accountName:
        userWalletData && userWalletData?.walletIdAccountNumber
          ? userWalletData?.walletIdAccountNumber
          : 'N/A',
      button: 'Fund wallet',
      extra: '',
      image: require('../../../assets/icons/wallet_background.png'),
    },
    {
      id: '2',
      title: 'Loan balance',
      balance: `${
        userLoanAmount?.totalLoanAmount === undefined
          ? '0.00'
          : `${
              userLoanAmount?.totalLoanAmount === 0
                ? '0.00'
                : userLoanAmount?.totalLoanAmount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
            }`
      }`,
      button: 'Get loan',
      extra: 'Loan details',
    },

    {
      id: '3',
      title: 'My investment',
      balance: '0.00',
      button: 'View investment',
      extra: '',
      image: require('../../../assets/icons/wallet_background.png'),
    },
  ];

  const Slide = ({item}) => {
    const [hideBalance, setHideBalance] = useState(true);
    const toggleHideBalance = () => {
      setHideBalance(!hideBalance);
    };

    return (
      <LinearGradient
        colors={
          item.title === 'Wallet balance'
            ? ['#F7F7FC', '#F7F7FC']
            : item.title === 'Loan balance'
            ? ['#010C4D', '#0384FF']
            : ['#06A75D', '#06A76B']
        }
        start={
          item.title === 'Wallet balance'
            ? {x: 0.01, y: 0}
            : item.title === 'Loan balance'
            ? {x: 0, y: 0}
            : {x: 0.01, y: 0}
        }
        end={
          item.title === 'Wallet balance'
            ? {x: 0.5, y: 0.5}
            : item.title === 'Loan balance'
            ? {x: 1, y: 1}
            : {x: 0.5, y: 0.5}
        }
        angle={114}
        style={[
          styles.gradient,
          {
            borderWidth: item.title === 'Wallet balance' ? 1 : 0,
            borderColor:
              item.title === 'Wallet balance' ? '#b7d8fd' : '#ffffff',
            borderRadius: 20,
          },
        ]}>
        <ImageBackground
          source={require('../../../assets/icons/wallet_background.png')}>
          <View style={{marginVertical: 10, marginHorizontal: 18}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {item.title === 'Wallet balance' && (
                <View style={styles.card}>
                  <EntypoIcon name="wallet" size={24} color="#054B99" />
                  <Text style={styles.wallet}>{item.title}</Text>
                </View>
              )}

              {item.title === 'Loan balance' && (
                <View style={styles.card}>
                  <Icon name="poll" size={24} color="white" />
                  <Text style={[styles.wallet, {color: '#fff'}]}>
                    {item.title}
                  </Text>
                </View>
              )}

              {item.title === 'My investment' && (
                <View style={styles.card}>
                  <Icon name="poll" size={24} color="white" />
                  <Text style={[styles.wallet, {color: '#fff'}]}>
                    {item.title}
                  </Text>
                </View>
              )}

              <FontIcon
                size={25}
                color={item.title === 'Wallet balance' ? '#054B99' : '#FFFFFF'}
                name={hideBalance ? 'eye' : 'eye-slash'}
                onPress={toggleHideBalance}
                //    style={{paddingRight:10}}
              />
            </View>

            <Text
              style={[
                styles.prices,
                {
                  color:
                    item.title === 'Wallet balance' ? '#054B99' : '#FFFFFF',
                },
              ]}>
              {hideBalance ? '₦******' : `₦${item.balance}`}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.button === 'Get loan' && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      `${
                        loanUserDetails?.loanDocumentDetails
                          ?.validIdentification === undefined
                          ? 'OnboardingHome'
                          : 'GetLoan'
                      }`,
                    )
                  }
                  style={styles.fundView}>
                  <Text style={styles.FundButton}>{item.button}</Text>
                </TouchableOpacity>
              )}

              {item.button === 'View investment' && (
                <TouchableOpacity
                  onPress={() => console.log('get investment')}
                  style={styles.fundView}>
                  <Text style={styles.FundButton}>{item.button}</Text>
                </TouchableOpacity>
              )}

              {item.button === 'Fund wallet' && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={[styles.fundView, {backgroundColor: '#054B99'}]}
                    onPress={() => toggleFundWallet()}>
                    <Text style={[styles.FundButton, {color: '#FFFFFF'}]}>
                      {item.button}
                    </Text>
                  </TouchableOpacity>
                  {item.accountName && (
                    <View>
                      <Text
                        style={{
                          color: '#6E7191',
                          marginTop: 5,
                          fontFamily: 'Montserat',
                          fontWeight: '400',
                          textAlign: 'right',
                        }}>
                        Providus Bank
                      </Text>
                      <TouchableWithoutFeedback
                        onLongPress={() => handleLongPress(item.accountName)}>
                        <Text
                          style={{
                            color: '#14142A',
                            marginTop: 5,
                            fontFamily: 'Montserat',
                            fontWeight: '400',
                            textAlign: 'right',
                          }}>
                          {item.accountName}
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  console.log('Clicking on');
                  // navigation.navigate('Loan')
                }}>
                <Text
                  style={[styles.extrat, {color: '#fff', fontWeight: 'bold'}]}>
                  {item.extra}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    );
  };
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  borderColor: '#054B99',
                  borderWidth: 2,
                  backgroundColor: '',
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleSignOut = async () => {
    const res = await userLogOut();
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      await resetStore();
    }
  };

  useEffect(() => {
    if (userProfileData?.profileProgress == 31) {
      NativeModules.DevSettings.reload();
    }
  }, []);

  useEffect(() => {
    getLoanUserData();
  }, []);

  const getLoanUserData = async () => {
    setIsLoading(true);
    const res = await getLoanUserDetails();
    if (res.error) {
      // Todo : error handling
    } else {
      if (res.data === undefined || res.data == null || res.data.length <= 0) {
        setLoanUserDetails(undefined);
      } else {
        setLoanUserDetails(res?.data);
      }
    }
    setIsLoading(false);
  };
  // useEffect(() => {
  //   // Resetting default value for the input on restart
  //   console.log('Resetting default value');
  //   RNRestart.restart();
  // }, [userProfileData?.profileProgress]);

  // console.log('userProfileData', userProfileData?.profileProgress);
  return !timeOut ? (
    <Splashscreen text="Getting Profile Details..." />
  ) : timeOut &&
    userProfileData &&
    userProfileData?.profileProgress === null ? (
    <PersonalDetails />
  ) : (
    timeOut &&
    userProfileData &&
    userProfileData?.profileProgress !== null && (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FCFCFC',
          paddingHorizontal: 10,
          paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
          paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
          paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
          paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
        }}>
        {isLoading && (
          <Spinner
            textContent={'Getting Profile Details...'}
            textStyle={{color: 'white'}}
            visible={true}
            overlayColor="rgba(78, 75, 102, 0.7)"
            animation="slide"
          />
        )}
        {/* Fund Wallet Section */}
        <View style={styles.container}>
          <Actionsheet
            isOpen={isFundWalletVisible}
            onClose={toggleFundWallet}
            hideDragIndicator={true}>
            <Actionsheet.Content justifyContent="center">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 15,
                }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#D9DBE9',
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={toggleFundWallet}>
                      <Icon name="chevron-left" size={36} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <View
                  style={[
                    styles.HeadView,
                    {
                      flex: 1,
                    },
                  ]}>
                  <View style={styles.TopView}>
                    <Text style={styles.TextHead}>Fund Wallet</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 2,
                    }}>
                    <Text>{'      '}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'MontSBold',
                  color: '#4E4B66',
                  textAlign: 'center',
                  margin: 4,
                }}>
                Transfer Money to the account details below to fund your account
              </Text>
              <View
                style={[styles.demark, {marginLeft: 16, marginRight: 16}]}
              />
              <View style={{marginTop: 16, marginHorizontal: 16}}>
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#CDDBEB',
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FontIcon name="bank" size={24} color="#054B99" />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                      width: '90%',
                    }}>
                    <View>
                      <Text
                        style={[
                          styles.TextHead,
                          {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                        ]}>
                        Bank Name:
                      </Text>
                    </View>
                    <Text style={styles.TextHead}>Providus bank</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.demark, {marginLeft: 16}]} />
              <View style={{marginTop: 16, marginHorizontal: 16}}>
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#CDDBEB',
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="account-box-outline"
                      size={24}
                      color="#054B99"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                      width: '90%',
                    }}>
                    <View>
                      <Text
                        style={[
                          styles.TextHead,
                          {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                        ]}>
                        Account Name:
                      </Text>
                    </View>
                    <Text
                      style={
                        (styles.TextHead,
                        {
                          fontSize: width * 0.05,
                          textAlign: 'right',
                          fontFamily: 'MontSBold',
                          lineHeight: 20,
                          letterSpacing: 0.5,
                          flexShrink: 1,
                        })
                      }>
                      {userProfileData?.firstName} {userProfileData?.lastName}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.demark, {marginLeft: 16}]} />
              <View style={{marginTop: 16, marginHorizontal: 16}}>
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#CDDBEB',
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <OctaIcon name="number" size={24} color="#054B99" />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                      width: '90%',
                    }}>
                    <View>
                      <Text
                        style={[
                          styles.TextHead,
                          {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                        ]}>
                        Account Number:
                      </Text>
                    </View>
                    <TouchableWithoutFeedback
                      onLongPress={() =>
                        handleLongPress(userWalletData?.walletIdAccountNumber)
                      }>
                      <Text
                        selectable={true}
                        selectionColor={'#CED4DA'}
                        style={styles.TextHead}>
                        {userWalletData && userWalletData?.walletIdAccountNumber
                          ? userWalletData?.walletIdAccountNumber
                          : 'N/A'}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </Actionsheet.Content>
          </Actionsheet>
        </View>

        {/* Make Transfer Section */}
        <View style={styles.container}>
          <Actionsheet
            isOpen={isMakeTransferVisible}
            onClose={toggleMakeTransfer}
            hideDragIndicator={true}>
            <Actionsheet.Content justifyContent="center">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 15,
                }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#D9DBE9',
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={toggleMakeTransfer}>
                      <Icon name="chevron-left" size={36} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <View
                  style={[
                    styles.HeadView,
                    {
                      flex: 1,
                    },
                  ]}>
                  <View style={styles.TopView}>
                    <Text style={styles.TextHead}>SELECT TRANSFER TYPE</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 2,
                    }}>
                    <Text>{'      '}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.demark} />
              <View
                style={{
                  marginTop: 16,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{
                    marginBottom: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setIsMakeTransferVisible(false);
                    navigation.navigate('Transfer', {
                      paramKey: 'InternalTransfer',
                    });
                  }}>
                  <View
                    style={{
                      backgroundColor: '#CDDBEB',
                      // width: 40,
                      // height: 40,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <EntypoIcon name="wallet" size={24} color="#054B99" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.TextHead,
                        {fontSize: 14, color: '#4E4B66', marginHorizontal: 12},
                      ]}>
                      Transfer to Trade Lenda wallet
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Montserat',
                        color: '#4E4B66',
                        marginHorizontal: 12,
                      }}>
                      Make transfer to other trade Lenda wallets
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="black" />
                </TouchableOpacity>
                <View style={[styles.demark, {width: width * 0.8}]} />
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setIsMakeTransferVisible(false);
                    navigation.navigate('Transfer', {
                      paramKey: 'Nip',
                    });
                  }}>
                  <View
                    style={{
                      backgroundColor: '#CDDBEB',
                      // width: 40,
                      // height: 40,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <EntypoIcon name="wallet" size={24} color="#054B99" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.TextHead,
                        {fontSize: 14, color: '#4E4B66'},
                      ]}>
                      Transfer to Bank
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Montserat',
                        color: '#4E4B66',
                      }}>
                      Make transfer to other bank accounts{'         '}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.demark} />
              </View>
            </Actionsheet.Content>
          </Actionsheet>
        </View>

        {/* Show All Transaction */}
        <View style={styles.container}>
          <Actionsheet
            isOpen={isAllTransactionVisible}
            onClose={toggleAllTransaction}
            hideDragIndicator={true}>
            <Actionsheet.Content justifyContent="center">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 15,
                }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#D9DBE9',
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={toggleAllTransaction}>
                      <Icon name="chevron-left" size={36} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <View
                  style={[
                    styles.HeadView,
                    {
                      flex: 1,
                    },
                  ]}>
                  <View style={styles.TopView}>
                    <Text style={styles.TextHead}> TRANSACTION HISTORY </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 2,
                    }}>
                    <Text>{'      '}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.demark} />
              <View style={{marginTop: 16, height: '90%'}}>
                {isFetching ? (
                  <Spinner
                    textContent={'Fetching All Transactions...'}
                    textStyle={{color: 'white'}}
                    visible={true}
                    overlayColor="rgba(78, 75, 102, 0.7)"
                    animation="slide"
                  />
                ) : (
                  <ScrollView
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    centerContent={true}
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    alwaysBounceVertical={false}>
                    {(allUserTransactionsData &&
                      allUserTransactionsData.length === 0) ||
                    (allUserTransactionsData &&
                      allUserTransactionsData == undefined) ? (
                      <View style={styles.transHistory}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 20,
                            marginVertical: '20%',
                          }}>
                          <Text style={styles.noTrans}>
                            You do not have recent transactions
                          </Text>
                        </View>
                      </View>
                    ) : (
                      allUserTransactionsData &&
                      allUserTransactionsData.map((trans, i) => {
                        const dateObj = new Date(trans.createdAt);
                        const hours = dateObj.getHours();
                        const minutes = dateObj.getMinutes();
                        const seconds = dateObj.getSeconds();
                        const date = trans.createdAt.substring(0, 10);

                        const amOrPm = hours >= 12 ? 'PM' : 'AM';

                        const twelveHourFormat =
                          hours > 12 ? hours - 12 : hours;

                        const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
                        return (
                          <View key={i}>
                            <View style={{marginTop: 10}}>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Transaction', {
                                    transaction: trans,
                                    time: time,
                                    day: date,
                                  })
                                }>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: 35,
                                      height: 35,
                                      borderRadius: 5,
                                      marginRight: 16,
                                      marginLeft: 8,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    {trans.transactionType === 'NIP' && (
                                      <>
                                        <Image
                                          source={require('../../../assets/images/transfer_out.png')}
                                        />
                                      </>
                                    )}
                                    {trans.transactionType ===
                                      'Tradelenda Internal Wallet' && (
                                      <>
                                        <Image
                                          source={require('../../../assets/images/transfer_out.png')}
                                        />
                                      </>
                                    )}
                                    {trans.title === 'Loan Application' && (
                                      <>
                                        <Image
                                          source={require('../../../assets/images/LoanBox.png')}
                                        />
                                      </>
                                    )}
                                    {trans.title === 'PayBills' && (
                                      <>
                                        <Image
                                          source={require('../../../assets/images/paybilBox.png')}
                                        />
                                      </>
                                    )}
                                  </View>
                                  <View style={{flex: 1}}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text style={styles.title}>
                                        {trans.transactionType}
                                      </Text>
                                      {trans.credit === null ? (
                                        <Text style={styles.price}>
                                          ₦{trans.debit}
                                        </Text>
                                      ) : (
                                        <Text style={styles.price}>
                                          ₦{trans.credit}
                                        </Text>
                                      )}
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text style={styles.desc}>
                                        {time} {date}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </TouchableOpacity>

                              <View style={styles.demark} />
                            </View>
                          </View>
                        );
                      })
                    )}
                    <View
                      style={{
                        flex: 1,
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <Text
                        style={{
                          backgroundColor: COLORS.light,
                          borderColor: COLORS.lightGray,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          textAlign: 'center',
                          alignItems: 'center',
                          width: '6%',
                          height: '60%',
                          color: COLORS.lendaBlue,
                          paddingVertical: 2,
                        }}>
                        {currentPage ? currentPage : 1}
                      </Text>
                      <Button
                        icon="arrow-left"
                        mode="elevated"
                        textColor={COLORS.lendaBlue}
                        buttonColor={COLORS.lightGray}
                        loading={isPrevious}
                        disabled={currentPage === 1 ? true : false}
                        style={{width: '35%'}}
                        onPress={() => handleGetPreviousPage(currentPage - 1)}>
                        Previous
                      </Button>
                      <Button
                        icon="arrow-right"
                        mode="elevated"
                        textColor={COLORS.lendaBlue}
                        buttonColor={COLORS.lightGray}
                        contentStyle={{flexDirection: 'row-reverse'}}
                        style={{width: '35%'}}
                        loading={isNext}
                        disabled={
                          currentPage === userTransactionsPages ? true : false
                        }
                        onPress={() => handleGetNextPage(currentPage + 1)}>
                        Next
                      </Button>
                      <Text
                        style={{
                          backgroundColor: COLORS.light,
                          borderColor: COLORS.lightGray,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          textAlign: 'center',
                          alignItems: 'center',
                          width: '6%',
                          height: '60%',
                          color: COLORS.lendaBlue,
                          paddingVertical: 2,
                        }}>
                        {userTransactionsPages ? userTransactionsPages : 1}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </Actionsheet.Content>
          </Actionsheet>
        </View>

        {/* First Section */}
        <View
          style={{
            width: '100%',
            height: '8%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FCFCFC',
            marginVertical: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 2,
            }}>
            <TouchableOpacity
              onPress={async () => {
                navigation.navigate('More');
              }}
              style={styles.personIcon}>
              <Icon name="account-circle" size={36} color="#6E7191" />
            </TouchableOpacity>
            <Text style={styles.hello}>
              {/* Hello {profile?.firstName === undefined ? '' : profile?.firstName}! */}
              Hello {userProfileData?.firstName}!
            </Text>
            <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
              <Image source={require('../../../assets/images/HeadLogo.png')} />
            </View>
          </View>
        </View>
        {/* Second Section */}
        <View>
          <FlatList
            onMomentumScrollEnd={updateCurrentSlideIndex}
            data={slides}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({item}) => <Slide item={item} />}
          />
          <Footer />
        </View>

        {/* Optional Section */}
        {!userPin ? (
          <TouchableOpacity
            style={{
              height: '9%',
              backgroundColor: '#CDDBEB',
              marginHorizontal: 15,
              marginVertical: 5,
              borderRadius: 8,
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('SetPin')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  marginRight: 16,
                  marginLeft: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={require('../../../assets/images/badge.png')} />
              </View>

              <View style={{flex: 1, marginHorizontal: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>Attention Needed !!!</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.desc}>
                    Click here to create your transaction pin
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Optional Section */}
        {loanUserDetails == undefined ||
        loanUserDetails?.loanDocumentDetails === undefined ? (
          <TouchableOpacity
            style={{
              height: '9%',
              backgroundColor: '#CDDBEB',
              marginHorizontal: 15,
              marginVertical: 5,
              borderRadius: 8,
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('OnboardingHome')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  marginRight: 16,
                  marginLeft: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={require('../../../assets/images/badge.png')} />
              </View>

              <View style={{flex: 1, marginHorizontal: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>Complete Account Setup</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.desc}>Update your profile details</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
        {/* Third Section */}
        <View style={styles.transView}>
          <Pressable
            onPress={toggleFundWallet}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#D9DBE9' : '#FFFFFF',
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
                  },
                ],
              },
              styles.transButtons,
            ]}>
            <View
              style={{
                alignSelf: 'flex-start',
                justifyContent: 'center',
                marginLeft: 17,
              }}>
              <Image
                source={require('../../../assets/images/fundVector.png')}
              />
            </View>
            <View style={{marginHorizontal: 2, marginTop: 5}}>
              <Text style={styles.transText}>Fund Wallet</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={toggleMakeTransfer}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#D9DBE9' : '#FFFFFF',
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
                  },
                ],
              },
              styles.transButtons,
            ]}>
            <View
              style={{
                alignSelf: 'flex-start',
                justifyContent: 'center',
                marginLeft: 12,
              }}>
              <Image
                source={require('../../../assets/images/TransferVector.png')}
              />
            </View>
            <View style={{marginHorizontal: 2, marginTop: 5}}>
              <Text style={styles.transText}>Make Transfer</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              console.log('Bill Payment');
              // toggleModal3()
            }}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? COLORS.Danger : COLORS.Secondary,
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
                  },
                ],
              },
              styles.transButtons,
            ]}>
            <View
              style={{
                alignSelf: 'flex-start',
                justifyContent: 'center',
                marginLeft: 14,
              }}>
              <Image
                source={require('../../../assets/images/payBillVector.png')}
              />
            </View>
            <View style={{marginHorizontal: 2, marginTop: 5}}>
              <Text style={styles.transText}>Bill Payment</Text>
            </View>
          </Pressable>
        </View>

        {/* Forth Section */}
        <View style={styles.transHistory}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.history}>Recent Transactions</Text>
            <TouchableOpacity
              disabled={
                (userTransactionsData && userTransactionsData.length === 0) ||
                userTransactionsData == undefined
                  ? true
                  : false
              }
              onPress={toggleAllTransaction}>
              <Text
                style={[
                  styles.seeHistory,
                  {
                    color:
                      (userTransactionsData &&
                        userTransactionsData.length === 0) ||
                      userTransactionsData == undefined
                        ? COLORS.grey
                        : COLORS.lendaBlue,
                  },
                ]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.demark} />
        </View>

        {/* Fifth Section */}
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent={true}
          style={[styles.scrollView, {paddingHorizontal: 16}]}
          contentContainerStyle={styles.contentContainer}
          alwaysBounceVertical={false}>
          {(userTransactionsData && userTransactionsData.length === 0) ||
          userTransactionsData == undefined ? (
            <View style={styles.transHistory}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                  marginVertical: '20%',
                }}>
                <Text style={styles.noTrans}>
                  You do not have recent transactions
                </Text>
              </View>
            </View>
          ) : (
            userTransactionsData &&
            userTransactionsData.map((trans, i) => {
              const dateObj = new Date(trans.createdAt);
              const hours = dateObj.getHours();
              const minutes = dateObj.getMinutes();
              const seconds = dateObj.getSeconds();
              const date = trans.createdAt.substring(0, 10);

              const amOrPm = hours >= 12 ? 'PM' : 'AM';

              const twelveHourFormat = hours > 12 ? hours - 12 : hours;

              const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
              return (
                <View key={i}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Transaction', {
                          transaction: trans,
                          time: time,
                          day: date,
                        })
                      }>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 5,
                            marginRight: 16,
                            marginLeft: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {trans.transactionType === 'NIP' && (
                            <>
                              <Image
                                source={require('../../../assets/images/transfer_out.png')}
                              />
                            </>
                          )}
                          {trans.transactionType ===
                            'Tradelenda Internal Wallet' && (
                            <>
                              <Image
                                source={require('../../../assets/images/transfer_out.png')}
                              />
                            </>
                          )}
                          {trans.title === 'Loan Application' && (
                            <>
                              <Image
                                source={require('../../../assets/images/LoanBox.png')}
                              />
                            </>
                          )}
                          {trans.title === 'PayBills' && (
                            <>
                              <Image
                                source={require('../../../assets/images/paybilBox.png')}
                              />
                            </>
                          )}
                        </View>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.title}>
                              {trans.transactionType}
                            </Text>
                            {trans.credit === null ? (
                              <Text style={styles.price}>₦{trans.debit}</Text>
                            ) : (
                              <Text style={styles.price}>₦{trans.credit}</Text>
                            )}
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.desc}>
                              {time} {date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.demark} />
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    )
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingHorizontal: 16,
    // backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    // minHeight: '100%',
    // paddingBottom: 500,
    paddingBottom: 10,
  },
  transHistory: {
    padding: 14,
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  cont: {
    position: 'relative',
    bottom: -50,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
  },
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  history: {
    fontFamily: 'MontSBold',
    color: '#14142B',
    fontSize: 16,
  },
  seeHistory: {
    color: '#054B99',
    fontFamily: 'MontSBold',
    fontSize: 16,
  },
  transView: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  transButtons: {
    borderWidth: 1,
    width: '32%',
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  transText: {
    fontFamily: 'MontSBold',
    fontSize: 14,
    textAlign: 'center',
  },
  personIcon: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 30,
    paddingHorizontal: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
  bellIcon: {
    paddingHorizontal: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
  hello: {
    fontFamily: 'Montserat',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  toptabs: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#D9DBE9',
  },
  tabtexts: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradient: {
    marginLeft: 5,
    marginRight: 15,
    borderRadius: 15,
    marginTop: 20,
    width: width * 0.9,
    height: '85%',
  },
  wallet: {
    color: '#054B99',
    fontFamily: 'Montserat',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 10,
  },
  prices: {
    fontFamily: 'MontBold',
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
    marginTop: 20,
  },
  FundButton: {
    color: '#054B99',
    fontFamily: 'Montserat',
    fontWeight: '500',
    fontSize: 16,
  },
  fundView: {
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },
  extrat: {
    fontFamily: 'MontSBold',
    color: '#054B99',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  demark: {
    width: '97%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  title: {
    fontFamily: 'Montserat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontFamily: 'Montserat',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    color: '#14142B',
  },
  desc: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    paddingBottom: 15,
  },
});
