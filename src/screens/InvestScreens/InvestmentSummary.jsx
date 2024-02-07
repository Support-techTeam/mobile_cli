import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import Spinner from 'react-native-loading-spinner-overlay';

const listData = [
  {id: '1', text: 'Long term income generation.'},
  {id: '2', text: 'Quarterly interest payments.'},
  {id: '3', text: 'Competitive interest rates.'},
  {id: '4', text: 'Quick access to your money.'},
  {id: '5', text: 'Low Risk Mutual Fund.'},
  {id: '6', text: 'Suitable for short term or long term investment.'},
  {id: '7', text: 'Minimum investment amount ₦ 1,000.00'},
];

const InvestmentSummaryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [yieldData, setYieldData] = useState();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {name, investment, yieldValue} = route.params;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: hp(100),
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Getting Investment Plans...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
          animation="slide"
        />
      )}
      <View
        style={{
          width: wp(90),
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.demark} />
      <ScrollView
        style={[styles.scrollView]}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 5,
            marginBottom: 20,
          }}>
          {name === 'Lenda' &&
            (investment.investmentName === 'BASIC LENDA' ? (
              <Image
                style={{height: hp(5), width: wp(95)}}
                source={require('../../../assets/images/basicLenda.png')}
              />
            ) : investment.investmentName === 'CLASSIC LENDA' ? (
              <Image
                style={{height: hp(5), width: wp(95)}}
                source={require('../../../assets/images/classicLenda.png')}
              />
            ) : investment.investmentName === 'ELITE LENDA' ? (
              <Image
                style={{height: hp(5), width: wp(95)}}
                source={require('../../../assets/images/eliteLenda.png')}
              />
            ) : (
              <Image
                style={{height: hp(5), width: wp(95)}}
                source={require('../../../assets/images/diamondLenda.png')}
              />
            ))}
        </View>

        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>
              {name === 'Arm'
                ? investment.productCode
                : investment.investmentName}
            </Text>
          </View>
        </View>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          // onScroll={() => setIsScrolling(true)}
          onMomentumScrollEnd={() =>
            setTimeout(() => {
              setIsScrolling(false);
            }, 500)
          }
          centerContent={true}
          alwaysBounceVertical={false}>
          {name === 'Arm' ? (
            <View style={styles.transHistory}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.noTrans}>
                  {new Date().toDateString()}: Yield{' '}
                  <Image
                    style={styles.InternalImage}
                    source={require('../../../assets/images/ArrowUp.png')}
                  />
                  <Text style={{color: COLORS.lendaGreen}}>
                    {yieldValue
                      ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(yieldValue))
                      : '0.00'}
                    %
                  </Text>
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Icon
                    name="information-outline"
                    style={{paddingRight: 3}}
                    size={20}
                    color={COLORS.microsoftBlue}
                  />
                  <Text style={styles.infoTrans}>
                    New investment / top-up processing time is 24Hrs, and
                    investment redemption is 48Hrs
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                  marginVertical: 2,
                }}>
                <Image
                  style={{height: hp(40), width: wp(100)}}
                  resizeMode="contain"
                  source={require('../../../assets/images/armChart.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginHorizontal: 30,
                }}>
                <View style={styles.TopView}>
                  <Text style={[styles.TextHead, {marginTop: 10}]}>
                    Learn more about this fund
                  </Text>
                  <Text
                    style={{
                      marginVertical: 10,
                      justifyContent: 'flex-start',
                      textAlign: 'justify',
                      fontSize: hp(1.6),
                      lineHeight: hp(3),
                    }}>
                    The ARM Money Market Fund offers a higher interest rate on
                    your savings than a traditional savings account. And it
                    doesn't have to be long term; the ARM MMF allows you quick
                    access to your money, competitive interest rates, regular
                    tax free returns and expert fund management.
                  </Text>
                  <Text style={[styles.TextHead, {marginTop: 10}]}>
                    Key Benefits
                  </Text>
                </View>
                {listData.map((item, index) => (
                  <View style={styles?.item} key={index}>
                    <Image
                      style={styles.InternalImage}
                      source={require('../../../assets/images/checkMark.png')}
                    />
                    <Text style={[styles?.itemText, {fontSize: hp(1.6)}]}>
                      {item?.text}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('InvestmentTransaction', {
                    investment: investment,
                    name: name,
                  });
                }}>
                <View style={styles.buttonAction}>
                  <Text style={styles.getText}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.transHistory}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.noTrans}>
                  Tenor returns{' '}
                  <Image
                    style={styles.InternalImage}
                    source={require('../../../assets/images/ArrowUp.png')}
                  />
                  {Number(investment.interestRate).toFixed(1)}%
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#EEEEEE',
                  paddingVertical: 5,
                  width: wp(90),
                }}>
                <Text style={styles.noTrans}>
                  Amount{' '}
                  <Text style={{color: COLORS.lendaBlue, alignSelf: 'center'}}>
                    ₦
                    {investment?.amountRange?.minAmount
                      ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(investment.amountRange.minAmount))
                      : '0.00'}{' '}
                    - ₦
                    {investment?.amountRange?.maxAmount
                      ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(investment.amountRange.maxAmount))
                      : '0.00'}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                  marginVertical: 20,
                }}>
                <Image
                  style={{height: hp(25), width: wp(100)}}
                  resizeMode="contain"
                  source={require('../../../assets/images/investChart.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginHorizontal: 30,
                }}>
                <View style={styles.TopView}>
                  <Text style={[styles.TextHead, {color: COLORS.lendaBlue}]}>
                    DETAILS
                  </Text>
                  <Text
                    style={{
                      marginVertical: 10,
                      justifyContent: 'flex-start',
                      textAlign: 'justify',
                      lineHeight: hp(4),
                    }}>
                    The Investment Lenda plan ranges between{' '}
                    <Text style={{color: COLORS.lendaBlue}}>
                      ₦
                      {investment?.amountRange?.minAmount
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(investment.amountRange.minAmount))
                        : '0.00'}{' '}
                      - ₦
                      {investment?.amountRange?.maxAmount
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(investment.amountRange.maxAmount))
                        : '0.00'}{' '}
                    </Text>
                    at 3 months minimum tenor and{' '}
                    <Text style={{color: COLORS.lendaGreen}}>
                      {Number(investment.interestRate).toFixed(1)}%
                    </Text>{' '}
                    interest rate monthly through-out investment duration.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('InvestmentTransaction', {
                    investment: investment,
                    name: name,
                  });
                }}>
                <View style={styles.buttonAction}>
                  <Text style={styles.getText}>Lend</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: wp(90),
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: hp(3),
    // lineHeight: 20,
    letterSpacing: 0.5,
  },
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  titleView: {
    paddingTop: 2,
    paddingBottom: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    width: wp(90),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: hp(2.5),
    color: '#14142B',
  },
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: hp(2),
    textAlign: 'center',
    // lineHeight: 26,
  },

  infoTrans: {
    fontFamily: 'MontSBold',
    fontSize: hp(1.7),
    textAlign: 'center',
    color: COLORS.microsoftBlue,
  },
  transHistory: {
    padding: 14,
    // height: hp(100),
  },
  PanelItemContainer: {
    borderWidth: 0.4,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: COLORS.white,
  },
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  InternalImage: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginVertical: 0,
  },
  buttonAction: {
    marginTop: hp(5),
    backgroundColor: COLORS.lendaBlue,
    borderRadius: 12,
    width: wp(80),
    height: hp(6),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  getText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp(2.5),
    fontWeight: '500',
  },
  scrollView: {
    flexGrow: 1,
    height: hp(100),
    width: wp('100%'),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(1),
  },
  itemText: {
    marginLeft: 4,
    fontSize: hp(2),
  },
});
