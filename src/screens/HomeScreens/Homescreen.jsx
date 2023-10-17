/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
  ToastAndroid,
  NativeModules,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Actionsheet} from 'native-base';
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
  setWallet,
} from '../../util/redux/userProfile/user.profile.slice';
import PersonalDetails from '../ProfileOnboardings/PersonalDetails';
import Splashscreen from '../../navigation/Splashscreen';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {getLoanUserDetails, getLoansAmount} from '../../stores/LoanStore';
import {checkPin} from '../../stores/ProfileStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
// import * as All from '../../../assets/images/';

const {width} = Dimensions.get('window');
const Homescreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isMakeTransferVisible, setIsMakeTransferVisible] = useState(false);
  const [isFundWalletVisible, setIsFundWalletVisible] = useState(false);
  const [isAllTransactionVisible, setIsAllTransactionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPullDown, setIsLoadingPullDown] = useState(false);
  const [isPrevious, setPrevious] = useState(false);
  const [isNext, setNext] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  //Redux Calls
  const userProfileData = useSelector(state => state.userProfile.profile);
  const userWalletData = useSelector(state => state.userProfile.wallet);
  // const userAccountData = useSelector(state => state.userProfile.account);
  const [userTransactionsData, setUserTransactionsData] = useState([]);
  const [allUserTransactionsData, setAllUserTransactionsData] = useState([]);
  const [userTransactionsPages, setUserTransactionsPages] = useState([]);
  const [userTransactionsTotal, setUserTransactionsTotal] = useState([]);
  const [userLoanAmount, setUserLoanAmount] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setString] = useClipboard();
  const [timeOut, setTimeOut] = useState(false);
  const route = useRoute();
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [userPin, setUserPin] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
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
    const res = await getAccountTransactions(0, 10);
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
      setCurrentPage(0);
      if (
        res?.data?.transactions?.transaction !== undefined &&
        res?.data?.transactions?.transaction !== null
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
    if (res?.error) {
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
    const res = await getAccountTransactions(0, 10);
    if (res?.error) {
      // TODO:
    } else {
      setCurrentPage(1);
      if (
        res?.data?.transactions?.transaction !== undefined &&
        res?.data?.transactions?.transaction !== null
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
    const res = await getAccountTransactions(0, 10);
    if (res?.error) {
      // TODO: handle error
    } else {
      setCurrentPage(0);
      setUserTransactionsData(res?.data?.transactions?.transaction);
      setUserTransactionsPages(res?.data?.transactions?.maxPages);
      setUserTransactionsTotal(res?.data?.transactions?.count);
    }
    setIsLoading(false);
  };

  const unsubGetTransactionsonPullDown = async () => {
    setIsLoadingPullDown(true);
    const res = await getAccountTransactions(0, 10);
    if (res?.error) {
      // TODO: handle error
    } else {
      setCurrentPage(0);
      setUserTransactionsData(res?.data?.transactions?.transaction);
      setUserTransactionsPages(res?.data?.transactions?.maxPages);
      setUserTransactionsTotal(res?.data?.transactions?.count);
    }

    const resWallet = await getAccountWallet();
    if (resWallet?.error) {
      // TODO: handle error
    } else {
      dispatch(setWallet(resWallet?.data?.data?.wallet));
      dispatch(setAccount(resWallet?.data?.data?.accountDetails));
    }
    setIsLoadingPullDown(false);
  };

  const unsubGetLoanAmount = async () => {
    setIsLoading(true);
    const res = await getLoansAmount();
    if (res?.error) {
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
    if (res?.error) {
      // TODO: handle error
    } else {
      // console.log('PIN', res?.data);
      setUserPin(res?.data?.data?.hasPin);
    }
  };

  //Navigation useEffect Hook
  useEffect(() => {
    if (route.name === 'Home') {
      const unsubscribe = navigation.addListener('focus', async () => {
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
      if (res?.error == false) {
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
      if (res?.error == false) {
        if (
          res?.data?.transactions?.transaction !== undefined &&
          res?.data?.transactions?.transaction !== null
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
    if (currentPage !== 0) {
      setPrevious(true);
      const prevPage = currentPage - 1;
      const res = await getAccountTransactions(prevPage, 10);
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
        setCurrentPage(nextPage);
        setAllUserTransactionsData(res?.data?.transactions?.transaction);
        setUserTransactionsPages(res?.data?.transactions?.maxPages);
        setUserTransactionsTotal(res?.data?.transactions?.count);
      }
      setNext(false);
    }
  };

  const carouselRef = useRef(null);

  const slides = [
    {
      id: '3',
      title: 'My investment',
      balance: '0.00',
      button: 'View investment',
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
                  onPress={() => {
                    // console.log('get investment')
                  }}
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
                  navigation.navigate('Loan');
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
    if (res?.error) {
      // Todo : error handling
    } else {
      if (
        res?.data === undefined ||
        res?.data == null ||
        res?.data?.length <= 0
      ) {
        setLoanUserDetails(undefined);
      } else {
        setLoanUserDetails(res?.data);
      }
    }
    setIsLoading(false);
  };

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
          height: hp('100%'),
          width: wp('100%'),
          backgroundColor: '#FCFCFC',
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
        <ScrollView
          bounces={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingPullDown}
              onRefresh={unsubGetTransactionsonPullDown}
            />
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent={true}
          style={[styles.scrollView, {marginBottom: 10, height: hp('100%')}]}
          contentContainerStyle={styles.contentContainer}
          alwaysBounceVertical={true}>
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
                  Transfer Money to the account details below to fund your
                  account
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
                            fontSize: 14,
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
                          {userWalletData &&
                          userWalletData?.walletIdAccountNumber
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
                          {
                            fontSize: 14,
                            color: '#4E4B66',
                            marginHorizontal: 12,
                          },
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flexGrow: 1,
                      }}>
                      <Icon name="chevron-right" size={24} color="black" />
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.demark, {width: width * 0.8}]} />
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      flexDirection: 'row',
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
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 20,
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

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flexGrow: 1,
                      }}>
                      <Icon name="chevron-right" size={24} color="black" />
                    </View>
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
                    marginTop: 10,
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
                      showsVerticalScrollIndicator={true}
                      onScroll={() => setIsScrolling(true)}
                      onMomentumScrollEnd={() =>
                        setTimeout(() => {
                          setIsScrolling(false);
                        }, 500)
                      }
                      centerContent={true}
                      style={[styles.scrollView]}
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
                        allUserTransactionsData.map((item, i) => {
                          const dateObj = new Date(item.createdAt);
                          const hours = dateObj.getHours();
                          const minutes = dateObj.getMinutes();
                          const seconds = dateObj.getSeconds();
                          const date = item.createdAt.substring(0, 10);

                          const amOrPm = hours >= 12 ? 'PM' : 'AM';

                          const twelveHourFormat =
                            hours > 12 ? hours - 12 : hours;

                          const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
                          let stringArray = item?.narration
                            .split(' ')[0]
                            .trim();
                          let imageResource = require('../../../assets/images/approvedLoan.png');
                          if (stringArray == 'mtn') {
                            imageResource = require('../../../assets/images/mtn.png');
                          }
                          if (stringArray == 'airtel') {
                            imageResource = require('../../../assets/images/airtel.png');
                          }
                          if (stringArray == 'glo') {
                            imageResource = require('../../../assets/images/glo.png');
                          }
                          if (stringArray == '9mobile') {
                            imageResource = require('../../../assets/images/9mobile.png');
                          }
                          if (stringArray == 'spectranet') {
                            imageResource = require('../../../assets/images/spectranet.png');
                          }
                          if (stringArray == 'smile') {
                            imageResource = require('../../../assets/images/smile.png');
                          }
                          return (
                            <TouchableOpacity
                              key={i}
                              style={{marginHorizontal: 15}}
                              onPress={
                                isScrolling
                                  ? null
                                  : () =>
                                      navigation.navigate('Transaction', {
                                        transaction: item,
                                        time: time,
                                        day: date,
                                      })
                              }>
                              <View style={styles.PanelItemContainer}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View style={{marginRight: 10}}>
                                    {item.transactionType === 'NIP' &&
                                      (item?.narration?.includes(
                                        'airtime purchase',
                                      ) ||
                                      item?.narration?.includes(
                                        'data bundle purchase',
                                      ) ? (
                                        <>
                                          <Image
                                            style={styles.PanelImage}
                                            source={imageResource}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <Image
                                            style={styles.PanelImage}
                                            source={require('../../../assets/images/Transfer.png')}
                                          />
                                        </>
                                      ))}
                                    {/* {item.transactionType === 'NIP' &&
                                      (item.credit != null &&
                                      item.credit > 0 ? (
                                        <>
                                          <Image
                                            style={[
                                              styles.PanelImage,
                                              {
                                                transform: [{rotate: '180deg'}],
                                              },
                                            ]}
                                            source={require('../../../assets/images/Transfer.png')}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <Image
                                            style={styles.PanelImage}
                                            source={require('../../../assets/images/Transfer.png')}
                                          />
                                        </>
                                      ))} */}
                                    {item.transactionType ===
                                      'Tradelenda Internal Wallet' &&
                                      (item.credit != null &&
                                      item.credit > 0 ? (
                                        <>
                                          <Image
                                            style={[
                                              styles.PanelImage,
                                              {
                                                transform: [{rotate: '180deg'}],
                                              },
                                            ]}
                                            source={require('../../../assets/images/Transfer.png')}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <Image
                                            style={styles.PanelImage}
                                            source={require('../../../assets/images/Transfer.png')}
                                          />
                                        </>
                                      ))}
                                    {item.title === 'Loan Application' && (
                                      <>
                                        <Image
                                          style={styles.PanelImage}
                                          source={require('../../../assets/images/LoanBox.png')}
                                        />
                                      </>
                                    )}
                                    {item.title === 'PayBills' && (
                                      <>
                                        <Image
                                          style={styles.PanelImage}
                                          source={require('../../../assets/images/paybilBox.png')}
                                        />
                                      </>
                                    )}
                                  </View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: hp('2%'),
                                        color: COLORS.dark,
                                      }}>
                                      {item.transactionType ===
                                      'Tradelenda Internal Wallet'
                                        ? // ? 'Internal Wallet'
                                          'WALLET TRANSFER'
                                        : item.transactionType === 'NIP'
                                        ? item?.narration?.includes(
                                            'airtime purchase',
                                          ) ||
                                          item?.narration?.includes(
                                            'data bundle purchase',
                                          )
                                          ? item?.narration
                                              .split(' ')[0]
                                              .toUpperCase() +
                                            ' ' +
                                            item?.narration
                                              .split(' ')[1]
                                              .toUpperCase()
                                          : 'NIP TRANSFER'
                                        : item.transactionType}
                                    </Text>
                                    <Text
                                      style={[
                                        styles.desc,
                                        {
                                          color: COLORS.dark,
                                          opacity: 0.8,
                                          marginTop: 1,
                                        },
                                      ]}>
                                      {date} : {time}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  {item.credit ? (
                                    <Icon
                                      name="plus"
                                      size={16}
                                      color={COLORS.googleGreen}
                                    />
                                  ) : (
                                    <Icon
                                      name="minus"
                                      size={16}
                                      color={COLORS.googleRed}
                                    />
                                  )}
                                  <Text
                                    style={{
                                      fontSize: hp('2.4%'),
                                      color: item.credit
                                        ? COLORS.googleGreen
                                        : COLORS.googleRed,
                                      alignSelf: 'flex-end',
                                    }}>
                                    {item.credit === null ? (
                                      <>
                                        ₦
                                        {item.debit
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                          )}
                                      </>
                                    ) : (
                                      <>
                                        ₦
                                        {item.credit
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                          )}
                                      </>
                                    )}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
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
                          {currentPage ? currentPage : 0}
                        </Text>
                        <Button
                          icon="arrow-left"
                          mode="elevated"
                          textColor={COLORS.lendaBlue}
                          buttonColor={COLORS.lightGray}
                          loading={isPrevious}
                          disabled={currentPage === 0 ? true : false}
                          style={{width: '35%'}}
                          onPress={() =>
                            handleGetPreviousPage(currentPage - 1)
                          }>
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
            style={[
              styles.container,
              {
                width: wp('100%'),
                height: hp('8%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FCFCFC',
                marginVertical: 1,
              },
            ]}>
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
                Hello {userProfileData?.firstName}!
              </Text>

              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  marginRight: 10,
                }}>
                <Image
                  source={require('../../../assets/images/HeadLogo.png')}
                  style={{width: 83, height: 32}}
                />
              </View>
            </View>
          </View>
          {/* Second Section */}
          <View>
            <Carousel
              layout={'stack'}
              layoutCardOffset={10}
              ref={carouselRef}
              data={slides}
              renderItem={({item}) => <Slide item={item} />}
              sliderWidth={wp('100%')}
              itemWidth={wp('100%') - 10}
              inactiveSlideOpacity={0.4}
              useScrollView={true}
              containerCustomStyle={{flex: 1}}
              slideStyle={{flex: 1}}
              firstItem={2}
              initialScrollIndex={2}
              autoplay={true}
              autoplayDelay={6000}
              autoplayInterval={12000}
            />
            {/* <FlatList
              onMomentumScrollEnd={updateCurrentSlideIndex}
              data={slides}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={({item}) => <Slide item={item} />}
            />
            <Footer /> */}
          </View>

          {/* Optional Section */}
          {!userPin ? (
            <TouchableOpacity
              style={[
                styles.container,
                {
                  height: hp('9%'),
                  width: wp('90%'),
                  alignSelf: 'center',
                  backgroundColor: '#CDDBEB',
                  marginHorizontal: 15,
                  marginVertical: 5,
                  borderRadius: 8,
                  justifyContent: 'center',
                },
              ]}
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
              style={[
                styles.container,
                {
                  height: hp('9%'),
                  width: wp('90%'),
                  alignSelf: 'center',
                  backgroundColor: '#CDDBEB',
                  marginHorizontal: 15,
                  marginVertical: 5,
                  borderRadius: 8,
                  justifyContent: 'center',
                },
              ]}
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
          <View
            style={[
              styles.container,
              styles.transView,
              {height: hp('10%'), marginTop: userPin ? hp('5%') : hp('1%')},
            ]}>
            <Pressable
              onPress={toggleFundWallet}
              style={({pressed}) => [
                {
                  // backgroundColor: pressed ? '#D9DBE9' : '#FFFFFF',
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.lendaBlue,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="wallet-plus-outline"
                  size={29}
                  color={COLORS.white}
                />
                {/* <Image
                  source={require('../../../assets/images/fundVector.png')}
                /> */}
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.textLight,
                    },
                  ]}>
                  Fund Wallet
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={toggleMakeTransfer}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.lendaOrange,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="bank-transfer" size={29} color={COLORS.white} />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.textLight,
                    },
                  ]}>
                  Make Transfer
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Paybills')}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.lendaGreen,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="cash-multiple" size={29} color={COLORS.white} />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.textLight,
                    },
                  ]}>
                  Bill Payment
                </Text>
              </View>
            </Pressable>
          </View>
          {/* Forth Section */}
          <View
            style={[styles.container, styles.transView, {height: hp('10%')}]}>
            <Pressable
              onPress={toggleFundWallet}
              style={({pressed}) => [
                {
                  // backgroundColor: pressed ? '#D9DBE9' : '#FFFFFF',
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.white,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: 32,
                    width: 32,
                    resizeMode: 'contain',
                    backgroundColor: COLORS.white,
                    borderRadius: 100,
                  }}
                  source={require('../../../assets/images/arm.png')}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.highwayRed,
                    },
                  ]}>
                  ARM Funding
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={toggleMakeTransfer}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.white,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: 32,
                    width: 32,
                    resizeMode: 'contain',
                    backgroundColor: COLORS.white,
                    borderRadius: 100,
                  }}
                  source={require('../../../assets/images/lenda.png')}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.lendaGreen,
                    },
                  ]}>
                  Lenda Funding
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Paybills')}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#D9DBE9' : COLORS.white,
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
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: 32,
                    width: 32,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/approvedLoan.png')}
                />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: COLORS.lendaBlue,
                    },
                  ]}>
                  Get Loan
                </Text>
              </View>
            </Pressable>
          </View>
          {/* Fifth Section */}
          <View
            style={{
              flex: 1,
              marginHorizontal: wp('5%'),
              width: wp('90%'),
              height: hp('25%'),
              borderRadius: 5,
            }}>
            <View
              style={{
                marginVertical: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  marginVertical: 10,
                }}>
                <Text
                  style={
                    ([styles.history],
                    {
                      fontWeight: 800,
                      fontSize: hp('2.5%'),
                      color: COLORS.grey,
                    })
                  }>
                  Recent Transactions
                </Text>
                <TouchableOpacity
                  style={{flexDirection: 'row', justifyContent: 'center'}}
                  disabled={
                    (userTransactionsData &&
                      userTransactionsData.length === 0) ||
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
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={
                      (userTransactionsData &&
                        userTransactionsData.length === 0) ||
                      userTransactionsData == undefined
                        ? COLORS.grey
                        : COLORS.lendaBlue
                    }
                  />
                </TouchableOpacity>
              </View>

              {(userTransactionsData && userTransactionsData.length === 0) ||
              userTransactionsData == undefined ? (
                <View style={styles.transHistory}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 20,
                      marginVertical: hp('6%'),
                    }}>
                    <Text style={styles.noTrans}>
                      You do not have recent transactions
                    </Text>
                  </View>
                </View>
              ) : (
                userTransactionsData &&
                userTransactionsData.slice(0, 2).map((item, i) => {
                  const dateObj = new Date(item.createdAt);
                  const hours = dateObj.getHours();
                  const minutes = dateObj.getMinutes();
                  const seconds = dateObj.getSeconds();
                  const date = item.createdAt.substring(0, 10);

                  const amOrPm = hours >= 12 ? 'PM' : 'AM';

                  const twelveHourFormat = hours > 12 ? hours - 12 : hours;

                  const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
                  let stringArray = item?.narration.split(' ')[0].trim();
                  let imageResource = require('../../../assets/images/Transfer.png');
                  if (stringArray == 'mtn') {
                    imageResource = require('../../../assets/images/mtn.png');
                  }
                  if (stringArray == 'airtel') {
                    imageResource = require('../../../assets/images/airtel.png');
                  }
                  if (stringArray == 'glo') {
                    imageResource = require('../../../assets/images/glo.png');
                  }
                  if (stringArray == '9mobile') {
                    imageResource = require('../../../assets/images/9mobile.png');
                  }
                  if (stringArray == 'spectranet') {
                    imageResource = require('../../../assets/images/spectranet.png');
                  }
                  if (stringArray == 'smile') {
                    imageResource = require('../../../assets/images/smile.png');
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      // delayPressIn={500}
                      onPress={() =>
                        navigation.navigate('Transaction', {
                          transaction: item,
                          time: time,
                          day: date,
                        })
                      }>
                      <View style={styles.PanelItemContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View style={{marginRight: 10}}>
                            {item.transactionType === 'NIP' &&
                              (item?.narration?.includes('airtime purchase') ||
                              item?.narration?.includes(
                                'data bundle purchase',
                              ) ? (
                                <>
                                  <Image
                                    style={styles.PanelImage}
                                    source={imageResource}
                                  />
                                </>
                              ) : (
                                <>
                                  <Image
                                    style={styles.PanelImage}
                                    source={require('../../../assets/images/Transfer.png')}
                                  />
                                </>
                              ))}
                            {/* {item.transactionType === 'NIP' &&
                              (item.credit != null && item.credit > 0 ? (
                                <>
                                  <Image
                                    style={[
                                      styles.PanelImage,
                                      {
                                        transform: [{rotate: '180deg'}],
                                      },
                                    ]}
                                    source={require('../../../assets/images/Transfer.png')}
                                  />
                                </>
                              ) : (
                                <>
                                  <Image
                                    style={styles.PanelImage}
                                    source={require('../../../assets/images/Transfer.png')}
                                  />
                                </>
                              ))} */}
                            {item.transactionType ===
                              'Tradelenda Internal Wallet' && (
                              <>
                                <Image
                                  style={styles.PanelImage}
                                  source={require('../../../assets/images/Transfer.png')}
                                />
                              </>
                            )}
                            {item.title === 'Loan Application' && (
                              <>
                                <Image
                                  style={styles.PanelImage}
                                  source={require('../../../assets/images/LoanBox.png')}
                                />
                              </>
                            )}
                            {item.title === 'PayBills' && (
                              <>
                                <Image
                                  style={styles.PanelImage}
                                  source={require('../../../assets/images/paybilBox.png')}
                                />
                              </>
                            )}
                          </View>
                          <View>
                            <Text
                              style={{fontSize: hp('2%'), color: COLORS.dark}}>
                              {item.transactionType ===
                              'Tradelenda Internal Wallet'
                                ? // ? 'Internal Wallet'
                                  'WALLET TRANSFER'
                                : item.transactionType === 'NIP'
                                ? item?.narration?.includes(
                                    'airtime purchase',
                                  ) ||
                                  item?.narration?.includes(
                                    'data bundle purchase',
                                  )
                                  ? item?.narration
                                      .split(' ')[0]
                                      .toUpperCase() +
                                    ' ' +
                                    item?.narration.split(' ')[1].toUpperCase()
                                  : 'NIP TRANSFER'
                                : item.transactionType}
                            </Text>
                            <Text
                              style={[
                                styles.desc,
                                {
                                  color: COLORS.dark,
                                  opacity: 0.8,
                                  marginTop: 1,
                                },
                              ]}>
                              {date} : {time}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {item.credit ? (
                            <Icon
                              name="plus"
                              size={16}
                              color={COLORS.googleGreen}
                            />
                          ) : (
                            <Icon
                              name="minus"
                              size={16}
                              color={COLORS.googleRed}
                            />
                          )}
                          <Text
                            style={{
                              fontSize: hp('2.4%'),
                              color: item.credit
                                ? COLORS.googleGreen
                                : COLORS.googleRed,
                              alignSelf: 'flex-end',
                            }}>
                            {item.credit === null ? (
                              <>
                                ₦
                                {item.debit
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              </>
                            ) : (
                              <>
                                ₦
                                {item.credit
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              </>
                            )}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    height: hp('100%'),
    width: wp('100%'),
  },
  contentContainer: {
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
    marginHorizontal: 2,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  transButtons: {
    borderWidth: 1,
    width: wp('28%'),
    height: hp('28%'),
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'left',
    borderColor: '#D9DBE9',
    borderRadius: 12,
    padding: wp('1%'),
    // backgroundColor: '#FFFFFF',
  },
  transText: {
    fontWeight: 400,
    paddingLeft: wp('2%'),
    fontSize: hp('2%'),
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
  netInfo: {
    fontFamily: 'Montserat',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.Success,
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
    marginHorizontal: 16,
    borderRadius: 15,
    marginTop: 20,
    width: width - 32,
    height: 'auto',
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
    width: '100%',
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
  PanelHandle: {
    height: 6,
    width: 50,
    backgroundColor: '#666',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 6,
  },
  PanelItemContainer: {
    borderWidth: 0.4,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 5,
    backgroundColor: COLORS.lightGray,
  },
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
  PanelButton: {
    padding: 14,
    // marginBottom: 50,
    width: 200,
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
  },
  PanelButtonText: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'center',
  },
  image: {
    width: wp('100%'),
    justifyContent: 'center',
  },
});
