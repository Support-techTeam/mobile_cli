import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
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
  } = props;
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);

  const slides = [
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
                          fontFamily: 'Montserrat',
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
        containerStyle={{alignSelf: 'flex-end', paddingVertical: 0, paddingTop: 10, paddingBottom: 5, marginVertical: 0}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: index == 0 ? COLORS.lendaOrange : index == 1 ? COLORS.lendaBlue : COLORS.lendaGreen,
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
