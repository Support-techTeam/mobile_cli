import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  Pressable
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getAccountTransactions} from '../../stores/WalletStore';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import {useSelector} from 'react-redux';
import Input from '../../component/inputField/input.component';
import {Header} from '../../component/header/Header';
import {FlashList} from '@shopify/flash-list';

let filter = '';
const {width} = Dimensions.get('window');
const TransactionHistory = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [allUserTransactionsData, setAllUserTransactionsData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [userTransactionsPages, setUserTransactionsPages] = useState([]);
  const [userTransactionsTotal, setUserTransactionsTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState('');
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);
  const route = useRoute();
  const [userInput, setUserInput] = useState('');
  const [filter, setFilter] = useState('');


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
              setNextPage(1);
            }
          }
        }
        setIsLoadingTransaction(false);
        !isFirstPageReceived && setIsFirstPageReceived(true);
      })
      .catch(e => {
        setIsLoadingTransaction(false);
      })
      .finally(() => {});
  };

  // Navigation useEffect Hook
  useFocusEffect(
    React.useCallback(() => {
      if (route?.name === 'TransactionHistory') {
        unsubGetAllTransactions();
      }
    }, []),
  );

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (route?.name === 'TransactionHistory') {
  //       setIsLoadingTransaction(true);
  //       const res = await getAccountTransactions();
  //       if (res?.error == false) {
  //         if (
  //           res?.data?.transactions?.transaction !== undefined &&
  //           res?.data?.transactions?.transaction !== null
  //         ) {
  //           setAllUserTransactionsData(res?.data?.transactions.transaction);
  //         }
  //       }

  //       setIsLoadingTransaction(false);
  //     }
  //   }, 60000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const handleLoadMore = async () => {
    if (isLoadingTransaction) {
      return;
    }
    if (currentPage !== Number(userTransactionsPages)) {
      // console.log('Loading more', currentPage, ' | ', userTransactionsPages);
      setIsLoading(true);
      const nextPage = currentPage + 1;
      getAccountTransactions(nextPage, 10)
        .then(res => {
          if (res) {
            if (!res?.error) {
              setCurrentPage(nextPage);
              setAllUserTransactionsData(predData => {
                return [...predData, ...res?.data?.transactions?.transaction];
              });
              setNextPage(nextPage + 1);
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
          setIsLoading(false);
        })
        .catch(e => {
          setIsLoading(false);
        })
        .finally(() => {});
    }
  };

  const RenderItem = item => {
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
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            marginHorizontal: 15,
            backgroundColor: pressed ? COLORS.lendaLightGrey : COLORS.lendaComponentBg,
          },
        ]}
        onPress={
          isScrolling
            ? null
            : () => {
                navigation.navigate('Transaction', {
                  transaction: item,
                  wallet: userWalletData,
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
                    <Image style={styles.PanelImage} source={imageResource} />
                  </>
                ) : item.credit != null ||
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
              {item.transactionType === 'Reversal' &&
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
            <Icon name="chevron-right" size={16} color={COLORS.lendaBlue} />
          </View>
        </View>
      </Pressable>
    );
  };

  const RenderEmptyItem = () => {
    return (
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
    );
  };

  const ListEndLoader = () => {
    return isLoading && <View><ActivityIndicator size={'large'} /></View>
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Header
        routeAction={() => navigation.navigate('Home')}
        heading="TRANSACTION HISTORY"
        disable={false}
      />
      <View
        style={{
          margin: 0,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 5,
          width: wp(95),
        }}>
        <Input
          // onChangeText={handleSearch}
          style={{width: wp('60%')}}
          iconName="magnify"
          placeholder="Search by transaction type"
        />
        <TouchableOpacity>
          <Icon name="tune-vertical" size={30} color={COLORS.lendaBlue} />
        </TouchableOpacity>
      </View>
      {!isFirstPageReceived && isLoadingTransaction ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlashList
          data={
            userInput !== ''
              ? filteredList
              : filter !== ''
              ? filteredList
              : allUserTransactionsData
          }
          renderItem={({item}) => RenderItem(item)}
          contentContainerStyle={{paddingVertical: 10}}
          refreshing={isLoadingTransaction}
          onRefresh={unsubGetAllTransactions}
          scrollEnabled={true}
          ListEmptyComponent={<RenderEmptyItem />}
          ListFooterComponent={<ListEndLoader />}
          showsVerticalScrollIndicator={true}
          estimatedItemSize={userTransactionsTotal}
          onEndReached={() => handleLoadMore()}
          // onEndReachedThreshold={2}
        />
      )}
      {/* {FloatBtn()} */}
    </SafeAreaView>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
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
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  demark: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  desc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  button:{
    borderWidth: 0.2,
    borderColor: COLORS.lendaComponentBorder,
    borderRadius: 6,
    paddingVertical: 5,
    marginBottom: 10,
  },
  PanelItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
});
