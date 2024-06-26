import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from '@rneui/themed';
// import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getSingleArmInvestment} from '../../stores/InvestStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header} from '../../component/header/Header';
import COLORS from '../../constants/colors';
import CustomButton from '../../component/buttons/CustomButtons';
import Loader from '../../component/loader/loader';
const InvestmentDetails = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {name, investment} = route?.params?.paramKey;
  const [investmentDetail, setInvestmentDetail] = useState([]);
  const [portfolioDetail, setPortfolioDetail] = useState([]);

  useEffect(() => {
    if (route.name === 'InvestmentDetails') {
      const unsubscribe = navigation.addListener('focus', async () => {
        if (name === 'Arm') {
          getArmInvestment();
        }
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    if (name === 'Arm') {
      getArmInvestment();
    }
  }, []);

  const getArmInvestment = async () => {
    setIsLoading(true);
    try {
      const res = await getSingleArmInvestment(
        investment?.membershipId,
        investment?.productCode,
      );
      if (res?.error) {
      } else {
        if (res?.data.length !== 0) {
          if (res?.data?.getArmUserInvestment[0]) {
            setInvestmentDetail(res?.data?.getArmUserInvestment[0]);
          }
          if (res?.data?.portfolio[0]) {
            setPortfolioDetail(res?.data?.portfolio[0]);
          }
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
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
      <Loader visible={isLoading} loadingText={'Getting investment...'} />
      <Header
        routeAction={() => navigation.goBack()}
        heading={`${name?.toUpperCase()} INVESTMENT DETAILS`}
        disable={false}
      />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
        }}>
        <View style={{padding: 16}}>
          <View style={styles.detailsView}>
            <Text style={styles.desc}>Investment</Text>
            <Text style={styles.amount}>
              {investment?.productCode ?? investment?.investmentType}
            </Text>
          </View>

          {name === 'Arm' && investment?.membershipId && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Membership ID</Text>
              <Text style={styles.amount}>
                {investment?.membershipId ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Arm' && portfolioDetail?.investmentId && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment ID</Text>
              <Text style={styles.amount}>
                {portfolioDetail?.investmentId ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Arm' && investment?.createdAt && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Commencement Date</Text>
              <Text style={styles.amount}>
                {investment?.createdAt?.substr(0, 10)}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.investmentStatus && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>investment Status</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.investmentStatus}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?._id && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Referrer ID</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?._id}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.created_at && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Commencement Date</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.created_at?.substr(0, 10)}
              </Text>
            </View>
          )}

          <View style={styles.detailsView}>
            <Text style={styles.desc}>
              {name === 'Lenda'
                ? 'Initial  Investment Amount'
                : 'Total Investment Amount'}
            </Text>
            <Text style={styles.amount}>
              ₦
              {investment?.investmentAmount
                ? new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(investment?.investmentAmount))
                : '0.00'}
            </Text>
          </View>

          {name === 'Arm' && portfolioDetail?.accountBalance && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Account Balance</Text>
              <Text style={styles.amount}>
                ₦
                {portfolioDetail?.accountBalance
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(portfolioDetail?.accountBalance))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && investment?.redemptionStatus && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Status</Text>
              <Text style={styles.amount}>
                {investment?.redemptionStatus == 'REDEMPTION_NONE'
                  ? 'ACTIVE'
                  : investment?.redemptionStatus == 'REDEMPTION_PENDING'
                  ? 'PENDING REDEMPTION'
                  : investment?.redemptionStatus == 'PARTIAL_REDEMPTION'
                  ? 'PARTIAL REDEMPTION'
                  : investment?.redemptionStatus == 'COMPLETE_REDEMPTION'
                  ? 'COMPLETE REDEMPTION'
                  : investment?.redemptionStatus == 'REDEMPTION_FAILED'
                  ? 'REDEMPTION FAILED'
                  : 'REDEMPTION SUCCESSFUL'}
              </Text>
            </View>
          )}

          {name === 'Arm' && investment?.topUpAmount !== 0 && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Pending Top-Up</Text>
              <Text style={styles.amount}>
                ₦
                {investment?.topUpAmount
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.topUpAmount))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && investment?.redemptionAmount !== 0 && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Redeemed Amount</Text>
              <Text style={styles.amount}>
                ₦
                {investment?.redemptionAmount
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.redemptionAmount))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && portfolioDetail?.accruedInterest && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Accrued Interest</Text>
              <Text style={styles.amount}>
                ₦
                {portfolioDetail?.accruedInterest
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(portfolioDetail?.accruedInterest))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && investment?.trackingId && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Tracking ID</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.trackingId}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.investmentTenor && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Tenor</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.investmentTenor ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.interestRate && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Interest Rate</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.interestRate ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.monthlyReturn && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Monthly Return</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.monthlyReturn
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.monthlyReturn))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.dailyReturn && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Daily Return</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.dailyReturn
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.dailyReturn))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.topUpAmount !== 0 && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Top-Up Amount</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.topUpAmount
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.topUpAmount))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.redemptionAmount !== 0 && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Redeemed Amount</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.redemptionAmount
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.redemptionAmount))
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.totalReturn && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Expected Return</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.totalReturn
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(investment?.totalReturn)
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Accrued Interest</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.totalReturn
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(
                      Number(investment?.totalReturn) -
                        Number(investment?.investmentAmount) -
                        Number(investment?.topUpAmount),
                    )
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.expectedReturnDate && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Return Date</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.expectedReturnDate?.substr(0, 10)}
              </Text>
            </View>
          )}

          {name === 'Lenda' && investment?.serviceCharge !== 0 && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Service Charge</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.serviceCharge
                  ? new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(investment?.serviceCharge))
                  : '0.00'}
              </Text>
            </View>
          )}

          <View style={styles.demark} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomButton
              disabled={
                (name === 'Lenda' &&
                  investment?.investmentStatus === 'CLOSED') ||
                (name === 'Arm' && investment?.membershipId === null) ||
                (name === 'Arm' && investment?.membershipId === '') ||
                (name === 'Arm' && investment?.membershipId === undefined)
                  ? true
                  : false
              }
              onPress={() => {
                if (name === 'Arm') {
                  navigation.navigate('InvestmentTopup', {
                    name: 'Arm',
                    investment: investmentDetail,
                  });
                }
                if (name === 'Lenda') {
                  navigation.navigate('InvestmentTopup', {
                    name: 'Lenda',
                    investment: investment,
                  });
                }
              }}
              title="Top Up"
              textStyle={{
                fontSize: 14,
                fontWeight: '500',
              }}
              buttonStyle={[styles.btnStyle, styles.btnContainer]}
            />
            <CustomButton
              disabled={
                (name === 'Lenda' &&
                  investment?.investmentStatus === 'CLOSED') ||
                (name === 'Arm' && investment?.membershipId === null) ||
                (name === 'Arm' && investment?.membershipId === '') ||
                (name === 'Arm' && investment?.membershipId === undefined)
                  ? true
                  : false
              }
              onPress={() => {
                if (name === 'Arm') {
                  navigation.navigate('InvestmentRedemption', {
                    name: 'Arm',
                    investment: investmentDetail,
                    portfolio: portfolioDetail,
                  });
                }
                if (name === 'Lenda') {
                  navigation.navigate('InvestmentRedemption', {
                    name: 'Lenda',
                    investment: investment,
                  });
                }
              }}
              title="Withdraw"
              textStyle={{
                fontSize: 14,
                fontWeight: '500',
              }}
              buttonStyle={[styles.btnStyle, styles.btnContainer]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentDetails;

const styles = StyleSheet.create({
  container: {
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
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
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
  nameComponent: {
    textAlign: 'right',
    fontFamily: 'serif',
    fontSize: 16,
    flexShrink: 1,
  },
  btnStyle: {
    borderRadius: 5,
    borderColor: COLORS.lendaBlue,
    paddingHorizontal: 15,
    backgroundColor: COLORS.lendaBlue,
    fontSize: hp(2.5),
    height: 40,
    width: '40%',
  },
  btnContainer: {
    marginTop: 10,
    width: wp(40),
    fontSize: hp(5),
    height: 50,
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: COLORS.lendaBlue,
    backgroundColor: COLORS.lendaBlue,
  },
});
