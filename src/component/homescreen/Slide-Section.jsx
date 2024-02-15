import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import COLORS from '../../constants/colors';
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';

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
  } = props;
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const slides = [
    {
      id: '3',
      title: 'My investment',
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
    {
      id: '1',
      title: 'Wallet balance',
      balance:
        userWalletData &&
        userWalletData?.availableBalance &&
        userWalletData?.availableBalance !== null &&
        userWalletData?.availableBalance !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(userWalletData?.availableBalance)
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
  ];

  const Slide = ({item}) => {


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
                        loanUserDetails === undefined ||
                        loanUserDetails?.loanDocumentDetails
                          ?.validIdentification === undefined
                          ? 'OnboardingHome'
                          : guarantor && guarantor.length > 0
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
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableWithoutFeedback>
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
                        <TouchableWithoutFeedback>
                          <FontIcon
                            size={17}
                            color={COLORS.lendaBlue}
                            name="copy"
                            style={{marginLeft: 4}}
                            onPress={() => handleLongPress(item.accountName)}
                          />
                        </TouchableWithoutFeedback>
                      </View>
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
      {/* <Carousel
        layout={'stack'}
        ref={carouselRef}
        data={slides}
        renderItem={({item}) => <Slide item={item} />}
        sliderWidth={wp('100%')}
        itemWidth={wp('100%') * 0.88}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.4}
        activeSlideAlignment="start"
        containerCustomStyle={styles.carouselContainer}
        contentContainerCustomStyle={styles.carouselContentContainer}
        firstItem={1}
        initialScrollIndex={1}
        hasParallaxImages={true}
      /> */}
      <FlatList
        data={slides}
        horizontal
        snapToAlign="center"
        declarationRate="fast"
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
        contentContainerStyle={styles.carouselContentContainer}
        snapToInterval={wp('100%') - 55}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  gradient: {
    // marginHorizontal: 16,
    borderRadius: 15,
    marginTop: 20,
    width: wp(100) - 55,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 'auto',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  carouselContainer: {
    // paddingHorizontal: 7,
    // gap: 10,
  },
  carouselContentContainer: {
    alignItems: 'center',
    paddingHorizontal: 7,
    gap: 10,
  },
});
