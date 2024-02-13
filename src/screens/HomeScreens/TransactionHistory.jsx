import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {getAccountTransactions} from '../../stores/WalletStore';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import { useSelector } from 'react-redux';


const {width} = Dimensions.get('window');
const TransactionHistory = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [allUserTransactionsData, setAllUserTransactionsData] = useState([]);
  const [userTransactionsPages, setUserTransactionsPages] = useState([]);
  const [userTransactionsTotal, setUserTransactionsTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrevious, setPrevious] = useState(false);
  const [isNext, setNext] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const route = useRoute();

  const unsubGetAllTransactions = async () => {
    setIsLoadingTransaction(true);
    getAccountTransactions(0, 10)
      .then(res => {
        if (res) {
          if (!res?.error) {
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
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingTransaction(false);
      });
  };

  // Navigation useEffect Hook
  useFocusEffect(
    React.useCallback(() => {
      if (route?.name === 'TransactionHistory') {
        unsubGetAllTransactions();
      }
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      if (route?.name === 'TransactionHistory') {
        const res = await getAccountTransactions();
        if (res?.error == false) {
          if (
            res?.data?.transactions?.transaction !== undefined &&
            res?.data?.transactions?.transaction !== null
          ) {
            setAllUserTransactionsData(res?.data?.transactions.transaction);
          }
        }
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleGetPreviousPage = async () => {
    if (currentPage !== 0) {
      setPrevious(true);
      const prevPage = currentPage - 1;
      getAccountTransactions(prevPage, 10)
        .then(res => {
          if (res) {
            if (!res?.error) {
              setCurrentPage(currentPage - 1);
              setAllUserTransactionsData(res?.data?.transactions?.transaction);
              setUserTransactionsPages(res?.data?.transactions?.maxPages);
              setUserTransactionsTotal(res?.data?.transactions?.count);
            } else {
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
            }
          }
        })
        .catch(e => {})
        .finally(() => {
          setPrevious(false);
        });
    }
  };

  const handleGetNextPage = async () => {
    if (currentPage !== Number(userTransactionsPages)) {
      setNext(true);
      const nextPage = currentPage + 1;
      getAccountTransactions(nextPage, 10)
        .then(res => {
          if (res) {
            if (!res?.error) {
              setCurrentPage(nextPage);
              setAllUserTransactionsData(res?.data?.transactions?.transaction);
              setUserTransactionsPages(res?.data?.transactions?.maxPages);
              setUserTransactionsTotal(res?.data?.transactions?.count);
            } else {
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
            }
          }
        })
        .catch(e => {})
        .finally(() => {
          setNext(false);
        });
    }
  };

  return isLoadingTransaction ? (
    <Spinner
      textContent={'Getting transaction history...'}
      textStyle={{color: 'white'}}
      visible={true}
      overlayColor="rgba(78, 75, 102, 0.7)"
      animation="slide"
    />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
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
            <Text style={styles.TextHead}>TRANSACTION HISTORY</Text>
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
        showsVerticalScrollIndicator={true}
        style={[styles.scrollView]}
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}>
        {(allUserTransactionsData && allUserTransactionsData.length === 0) ||
        (allUserTransactionsData && allUserTransactionsData == undefined) ? (
          <View style={styles.transHistory}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,
                marginVertical: hp('15%'),
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>No transaction data available!</Text>
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

            const twelveHourFormat = hours > 12 ? hours - 12 : hours;

            const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
            let stringArray = item?.narration.split(' ')[0].trim();
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
                    : () => {
                        navigation.navigate('Transaction', {
                          transaction: item,
                          time: time,
                          day: date,
                        });
                      }
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
                        item?.narration?.includes('data bundle purchase') ? (
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
                      {item.transactionType === 'Tradelenda Internal Wallet' &&
                        (item.credit != null ||
                        item.credit > 0 ||
                        item.credit != undefined ? (
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
                          fontSize: hp(1.8),
                          color: COLORS.dark,
                        }}>
                        {item.transactionType === 'Tradelenda Internal Wallet'
                          ? // ? 'Internal Wallet'
                            'WALLET TRANSFER'
                          : item.transactionType === 'NIP'
                          ? item?.narration?.includes('airtime purchase') ||
                            item?.narration?.includes('data bundle purchase')
                            ? item?.narration.split(' ')[0].toUpperCase() +
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
                    {item.credit != null ||
                    item.credit > 0 ||
                    item.credit != undefined ||
                    item?.fromWalletAccountNumber !=
                      userWalletData?.walletIdAccountNumber ? (
                      <Icon name="plus" size={16} color={COLORS.googleGreen} />
                    ) : (
                      <Icon name="minus" size={16} color={COLORS.googleRed} />
                    )}
                    <Text
                      style={{
                        fontSize: hp(2),
                        color:
                          item.credit != null ||
                          item.credit > 0 ||
                          item.credit != undefined ||
                          item?.fromWalletAccountNumber !=
                            userWalletData?.walletIdAccountNumber
                            ? COLORS.googleGreen
                            : COLORS.googleRed,
                        alignSelf: 'flex-end',
                      }}>
                      {item.credit === null ? (
                        <>
                          ₦
                          {new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(item.debit))}
                        </>
                      ) : (
                        <>
                          ₦
                          {new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(item.credit))}
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
            disabled={currentPage === userTransactionsPages ? true : false}
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
    </SafeAreaView>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    height: hp('100%'),
    width: wp('100%'),
    paddingVertical: 10,
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
    fontSize: hp(2),
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
    height: hp(28),
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'left',
    borderColor: '#D9DBE9',
    borderRadius: 12,
    padding: wp(1),
  },
  transText: {
    fontWeight: 400,
    paddingLeft: wp(1),
    fontSize: hp(1.4),
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
