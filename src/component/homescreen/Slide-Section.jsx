import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import COLORS from '../../constants/colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {getSeerbitWalletBalance} from '../../stores/WalletStore';
import {setBalanceSB} from '../../util/redux/userProfile/user.profile.slice';

const SLIDE_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDE_WIDTH - 60;

export const SlideSection = props => {
  const {
    portfolioDetail,
    userWalletData,
    totalLendaAmount,
    totalArmAmount,
    userLoanAmount,
    guarantor,
    hideBalance,
    toggleHideBalance,
    toggleFundWallet,
    handleLongPress,
    userMultiWalletData,
    // seerbitWalletBalance,
    handleCreateSecondWallet,
  } = props;
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const [seerbitWalletBalance, setSeerbitWalletBalance] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      unsubGetSeerbitWalletBalance();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Get seerbit balance
  const unsubGetSeerbitWalletBalance = async () => {
    try {
      if (userMultiWalletData && userMultiWalletData?.length > 0) {
        const selectedData = userMultiWalletData.find(
          walletData => walletData?.walletIdAccountNumber[0] === '4',
        );
        if (
          selectedData?.pocketId !== null &&
          selectedData?.pocketId !== undefined
        ) {
          getSeerbitWalletBalance(selectedData?.pocketId)
            .then(res => {
              if (res) {
                if (!res?.error) {
                  dispatch(setBalanceSB(res?.data));
                  setSeerbitWalletBalance(res?.data);
                }
              }
            })
            .catch(e => {})
            .finally(() => {});
        }
      }
    } catch (e) {}
  };

  const slides =
    userMultiWalletData && userMultiWalletData.length === 1
      ? [
          {
            id: '1',
            title: 'First Wallet Balance',
            balance:
              userMultiWalletData[0].banker === 'Providus'
                ? userMultiWalletData[0] &&
                  userMultiWalletData[0]?.availableBalance &&
                  userMultiWalletData[0]?.availableBalance !== null &&
                  userMultiWalletData[0]?.availableBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(userMultiWalletData[0]?.availableBalance)
                  : '0.00'
                : userMultiWalletData[0]?.banker === '9 Payment Service Bank'
                ? seerbitWalletBalance &&
                  seerbitWalletBalance !== null &&
                  seerbitWalletBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(seerbitWalletBalance)
                  : '0.00'
                : '0.00',
            accountName:
              userMultiWalletData[0] &&
              userMultiWalletData[0]?.walletIdAccountNumber
                ? userWalletData?.walletIdAccountNumber
                : 'N/A',
            button: 'Fund wallet',
            banker: userMultiWalletData[0].banker,
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '2',
            title: 'Second Wallet Balance',
            balance: '0.00',
            accountName: 'N/A',
            button: 'Add Second wallet',
            banker: 'N/A',
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '3',
            title: 'Loan Balance',
            balance: `${
              userLoanAmount?.totalLoanAmount === undefined
                ? '0.00'
                : `${
                    userLoanAmount?.totalLoanAmount === 0
                      ? '0.00'
                      : new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(userLoanAmount?.totalLoanAmount)
                  }`
            }`,
            button: 'Get loan',
            extra: 'Loan details',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '4',
            title: 'My Investment',
            balance:
              Number(portfolioDetail) !== 0
                ? new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(portfolioDetail) + totalLendaAmount)
                : new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalArmAmount + totalLendaAmount),
            button: 'View investment',
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
        ]
      : userMultiWalletData && userMultiWalletData.length === 2
      ? [
          {
            id: '1',
            title: 'First Wallet Balance',
            balance:
              userMultiWalletData[0].banker === 'Providus'
                ? userMultiWalletData[0] &&
                  userMultiWalletData[0]?.availableBalance &&
                  userMultiWalletData[0]?.availableBalance !== null &&
                  userMultiWalletData[0]?.availableBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(userMultiWalletData[0]?.availableBalance)
                  : '0.00'
                : userMultiWalletData[0]?.banker === '9 Payment Service Bank'
                ? seerbitWalletBalance &&
                  seerbitWalletBalance !== null &&
                  seerbitWalletBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(seerbitWalletBalance)
                  : '0.00'
                : '0.00',
            accountName:
              userMultiWalletData[0] &&
              userMultiWalletData[0]?.walletIdAccountNumber
                ? userWalletData?.walletIdAccountNumber
                : 'N/A',
            button: 'Fund wallet',
            banker: userMultiWalletData[0].banker,
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '2',
            title: 'Second Wallet Balance',
            balance:
              userMultiWalletData[1].banker === 'Providus'
                ? userMultiWalletData[1] &&
                  userMultiWalletData[1]?.availableBalance &&
                  userMultiWalletData[1]?.availableBalance !== null &&
                  userMultiWalletData[1]?.availableBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(userMultiWalletData[1]?.availableBalance)
                  : '0.00'
                : userMultiWalletData[1]?.banker === '9 Payment Service Bank'
                ? seerbitWalletBalance &&
                  seerbitWalletBalance !== null &&
                  seerbitWalletBalance !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(seerbitWalletBalance)
                  : '0.00'
                : '0.00',
            accountName:
              userMultiWalletData[1] &&
              userMultiWalletData[1]?.walletIdAccountNumber
                ? userMultiWalletData[1]?.walletIdAccountNumber
                : 'N/A',
            button: 'Fund wallet',
            banker: userMultiWalletData[1].banker,
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '3',
            title: 'Loan Balance',
            balance: `${
              userLoanAmount?.totalLoanAmount === undefined
                ? '0.00'
                : `${
                    userLoanAmount?.totalLoanAmount === 0
                      ? '0.00'
                      : new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(userLoanAmount?.totalLoanAmount)
                  }`
            }`,
            button: 'Get loan',
            extra: 'Loan details',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '4',
            title: 'My Investment',
            balance:
              Number(portfolioDetail) !== 0
                ? new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(portfolioDetail) + totalLendaAmount)
                : new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalArmAmount + totalLendaAmount),
            button: 'View investment',
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
        ]
      : [
          {
            id: '3',
            title: 'Loan Balance',
            balance: `${
              userLoanAmount?.totalLoanAmount === undefined
                ? '0.00'
                : `${
                    userLoanAmount?.totalLoanAmount === 0
                      ? '0.00'
                      : new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(userLoanAmount?.totalLoanAmount)
                  }`
            }`,
            button: 'Get loan',
            extra: 'Loan details',
            image: require('../../../assets/icons/wallet_background.png'),
          },
          {
            id: '4',
            title: 'My Investment',
            balance:
              Number(portfolioDetail) !== 0
                ? new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(portfolioDetail) + totalLendaAmount)
                : new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalArmAmount + totalLendaAmount),
            button: 'View investment',
            extra: '',
            image: require('../../../assets/icons/wallet_background.png'),
          },
        ];

  const Slide = ({item}) => {
    return (
      <LinearGradient
        colors={
          item.title === 'First Wallet Balance'
            ? ['#F7F7FC', '#F7F7FC']
            : item.title === 'Second Wallet Balance'
            ? ['#a6001a', '#a6001a']
            : item.title === 'Loan Balance'
            ? ['#010C4D', '#0384FF']
            : ['#06A75D', '#06A76B']
        }
        start={
          item.title === 'First Wallet Balance' ||
          item.title === 'Second Wallet Balance'
            ? {x: 0.01, y: 0}
            : item.title === 'Loan Balance'
            ? {x: 0, y: 0}
            : {x: 0.01, y: 0}
        }
        end={
          item.title === 'First Wallet Balance' ||
          item.title === 'Second Wallet Balance'
            ? {x: 0.5, y: 0.5}
            : item.title === 'Loan Balance'
            ? {x: 1, y: 1}
            : {x: 0.5, y: 0.5}
        }
        angle={114}
        style={[
          styles.gradient,
          {
            borderWidth:
              item.title === 'First Wallet Balance' ||
              item.title === 'Second Wallet Balance'
                ? 1
                : 0,
            borderColor:
              item.title === 'First Wallet Balance'
                ? '#b7d8fd'
                : item.title === 'Second Wallet Balance'
                ? '#ffffff'
                : '#ffffff',
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
              {item.title === 'First Wallet Balance' && (
                <View style={styles.card}>
                  <EntypoIcon name="wallet" size={24} color="#054B99" />
                  <Text style={styles.wallet}>{item.title}</Text>
                </View>
              )}

              {item.title === 'Second Wallet Balance' && (
                <View style={styles.card}>
                  <Icon name="wallet" size={24} color="white" />
                  <Text style={[styles.wallet, {color: '#fff'}]}>
                    {item.title}
                  </Text>
                </View>
              )}
              {item.title === 'Loan Balance' && (
                <View style={styles.card}>
                  <Icon name="poll" size={24} color="white" />
                  <Text style={[styles.wallet, {color: '#fff'}]}>
                    {item.title}
                  </Text>
                </View>
              )}

              {item.title === 'My Investment' && (
                <View style={styles.card}>
                  <Icon name="poll" size={24} color="white" />
                  <Text style={[styles.wallet, {color: '#fff'}]}>
                    {item.title}
                  </Text>
                </View>
              )}

              <FontIcon
                size={25}
                color={
                  item.title === 'First Wallet Balance'
                    ? '#054B99'
                    : item.title === 'Second Wallet Balance'
                    ? '#FFFFFF'
                    : '#FFFFFF'
                }
                name={hideBalance ? 'eye' : 'eye-slash'}
                onPress={toggleHideBalance}
              />
            </View>

            <Text
              style={[
                styles.prices,
                {
                  color:
                    item.title === 'First Wallet Balance'
                      ? '#054B99'
                      : item.title === 'Second Wallet Balance'
                      ? '#FFFFFF'
                      : '#FFFFFF',
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
                  onPress={() => {
                    if (guarantor && guarantor.length <= 0) {
                      Toast.show({
                        type: 'warning',
                        position: 'top',
                        topOffset: 50,
                        text1: 'Guarantor Data',
                        text2: 'Guarantor Data is not available',
                        visibilityTime: 2000,
                        autoHide: true,
                        onPress: () => Toast.hide(),
                      });
                    }
                    navigation.navigate(
                      `${
                        guarantor && guarantor.length > 0
                          ? 'GetLoan'
                          : 'AddGuarantors'
                      }`,
                    );
                  }}
                  style={styles.fundView}>
                  <Text style={styles.FundButton}>{item.button}</Text>
                </TouchableOpacity>
              )}

              {item.button === 'View investment' && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Invest');
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
                    style={[
                      styles.fundView,
                      {
                        backgroundColor:
                          item.title === 'First Wallet Balance'
                            ? '#054B99'
                            : '#FFFFFF',
                      },
                    ]}
                    onPress={() => toggleFundWallet()}>
                    <Text
                      style={[
                        styles.FundButton,
                        {
                          color:
                            item.title === 'First Wallet Balance'
                              ? '#FFFFFF'
                              : '#054B99',
                        },
                      ]}>
                      {item.button}
                    </Text>
                  </TouchableOpacity>
                  {item.accountName && (
                    <View>
                      {item.title === 'First Wallet Balance' && (
                        <>
                          <Text
                            style={{
                              color: '#6E7191',
                              marginTop: 5,
                              fontFamily: 'Montserrat',
                              fontWeight: '400',
                              textAlign: 'right',
                            }}>
                            {item.banker === 'Providus'
                              ? 'Providus Bank'
                              : item.banker}
                          </Text>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() => handleLongPress(item.accountName)}>
                              <Text
                                style={{
                                  color: '#14142A',
                                  marginTop: 5,
                                  fontFamily: 'Montserrat',
                                  fontWeight: '400',
                                  textAlign: 'right',
                                }}>
                                {item.accountName}
                              </Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                              <Icon
                                size={17}
                                color={COLORS.lendaBlue}
                                name="content-copy"
                                style={{marginLeft: 4}}
                                onPress={() =>
                                  handleLongPress(item.accountName)
                                }
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </>
                      )}

                      {item.title === 'Second Wallet Balance' && (
                        <>
                          <Text
                            style={{
                              color: 'white',
                              marginTop: 5,
                              fontFamily: 'Montserrat',
                              fontWeight: '400',
                              textAlign: 'right',
                            }}>
                            {item.banker === 'Providus'
                              ? 'Providus Bank'
                              : item.banker}
                          </Text>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() => handleLongPress(item.accountName)}>
                              <Text
                                style={{
                                  color: 'white',
                                  marginTop: 5,
                                  fontFamily: 'Montserrat',
                                  fontWeight: '400',
                                  textAlign: 'right',
                                }}>
                                {item.accountName}
                              </Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                              <Icon
                                size={17}
                                color={COLORS.white}
                                name="content-copy"
                                style={{marginLeft: 4}}
                                onPress={() =>
                                  handleLongPress(item.accountName)
                                }
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </>
                      )}
                    </View>
                  )}
                </View>
              )}

              {item.button === 'Add Second wallet' && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.fundView,
                      {
                        backgroundColor: '#FFFFFF',
                      },
                    ]}
                    onPress={() => handleCreateSecondWallet()}>
                    <Text
                      style={[
                        styles.FundButton,
                        {
                          color: '#054B99',
                        },
                      ]}>
                      {item.button}
                    </Text>
                  </TouchableOpacity>
                  {item.accountName && (
                    <View>
                      <>
                        <Text
                          style={{
                            color: 'white',
                            marginTop: 5,
                            fontFamily: 'Montserrat',
                            fontWeight: '400',
                            textAlign: 'right',
                          }}>
                          {item.banker === 'Providus'
                            ? 'Providus Bank'
                            : item.banker}
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              marginTop: 5,
                              fontFamily: 'Montserrat',
                              fontWeight: '400',
                              textAlign: 'right',
                            }}>
                            {item.accountName}
                          </Text>
                        </View>
                      </>
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
  return (
    <View style={styles.container}>
      <Carousel
        layout={'default'}
        ref={carouselRef}
        data={slides}
        renderItem={({item}) => <Slide item={item} />}
        sliderWidth={SLIDE_WIDTH}
        itemWidth={ITEM_WIDTH}
        useScrollView={true}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.6}
        firstItem={0}
        initialScrollIndex={0}
        onSnapToItem={index => setIndex(index)}
      />
      <Pagination
        dotsLength={slides?.length}
        activeDotIndex={index}
        carouselRef={carouselRef}
        containerStyle={{
          alignSelf: 'flex-end',
          paddingVertical: 0,
          paddingTop: 10,
          paddingBottom: 5,
          marginVertical: 0,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor:
            index == 0
              ? COLORS.lendaGrey
              : index == 1
              ? COLORS.highwayRed
              : index == 2
              ? COLORS.lendaBlue
              : COLORS.lendaGreen,
        }}
        tappableDots={true}
        inactiveDotStyle={{
          backgroundColor: 'black',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    marginTop: 20,
    width: ITEM_WIDTH,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 'auto',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  FundButton: {
    color: '#054B99',
    fontFamily: 'Montserrat',
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
  wallet: {
    color: '#054B99',
    fontFamily: 'Montserrat',
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
});
