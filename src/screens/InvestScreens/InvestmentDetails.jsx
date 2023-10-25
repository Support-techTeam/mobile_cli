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

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createArmInvestment,
  createLendaInvestment,
  getSingleArmInvestment,
} from '../../stores/InvestStore';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
        // if (name === 'Lenda') {
        //   getLendaProducts();
        // }
        if (name === 'Arm') {
          getArmInvestment();
        }
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    // if (name === 'Lenda') {
    //   getLendaProducts();
    // }
    if (name === 'Arm') {
      getArmInvestment();
    }
  }, []);

  const getArmInvestment = async () => {
    setIsLoading(true);
    const res = await getSingleArmInvestment(
      investment?.membershipId,
      investment?.productCode,
    );
    if (res?.error) {
    } else {
      setInvestmentDetail(res?.data?.getArmUserInvestment[0]);
      setPortfolioDetail(res?.data?.portfolio[0]);
    }
    setIsLoading(false);
  };

  const handleCreateARMInvestment = async () => {
    const payload = {
      productCode: productCode,
      investmentAmount: Number(investmentAmount),
    };
    setIsLoading(true);
    const res = await createArmInvestment(payload);
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
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res?.title,
        text2: res?.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      setTimeout(() => {
        navigation.navigate('Invest');
      }, 1000);
    }
    setIsLoading(false);
  };

  const handleCreateLendaInvestment = async () => {
    const payload = {
      investmentType: investmentType,
      investmentTenor: investmentTenor,
      investmentAmount: investmentAmount.toString(),
      transactionPin: transactionPin,
    };
    setIsLoading(true);
    const res = await createLendaInvestment(payload);
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
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res?.title,
        text2: res?.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      setTimeout(() => {
        navigation.navigate('Invest');
      }, 1000);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Getting Investment...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
          animation="slide"
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
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
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>INVESTMENT DETAILS</Text>
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
        showsVerticalScrollIndicator={false}>
        <View style={{padding: 16}}>
          <View style={styles.detailsView}>
            <Text style={styles.desc}>Investment</Text>
            <Text style={styles.amount}>
              {investment?.productCode ?? investment?.investmentType}
            </Text>
          </View>

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Membership ID</Text>
              <Text style={styles.amount}>{investment?.membershipId}</Text>
            </View>
          )}

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment ID</Text>
              <Text style={styles.amount}>
                {portfolioDetail?.investmentId ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Commencement Date</Text>
              <Text style={styles.amount}>
                {investment?.createdAt?.substr(0, 10)}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Referrer ID</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?._id}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Commencement Date</Text>
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
              {Number(investment?.investmentAmount)
                .toFixed(2)
                ?.toString()
                ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
            </Text>
          </View>

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Account Balance</Text>
              <Text style={styles.amount}>
                ₦
                {Number(portfolioDetail?.accountBalance)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && (
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

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Pending Top-Up</Text>
              <Text style={styles.amount}>
                ₦
                {Number(investment?.topUpAmount)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Redeemed Amount</Text>
              <Text style={styles.amount}>
                ₦
                {Number(investment?.redemptionAmount)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Accrued Interest</Text>
              <Text style={styles.amount}>
                ₦
                {portfolioDetail?.accruedInterest
                  ? Number(portfolioDetail?.accruedInterest)
                      .toFixed(2)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                  : '0.00'}
              </Text>
            </View>
          )}

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Tracking ID</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.trackingId ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Tenor</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.investmentTenor ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Interest Rate</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.interestRate ?? 'NIL'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Monthly Return</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {Number(investment?.monthlyReturn)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Daily Return</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {Number(investment?.dailyReturn)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Top-Up Amount</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {Number(investment?.topUpAmount)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Total Redeemed Amount</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {Number(investment?.redemptionAmount)
                  .toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+\b)/g, ',') ?? '0.00'}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
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

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Return Date</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investment?.expectedReturnDate?.substr(0, 10)}
              </Text>
            </View>
          )}

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Service Charge</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                ₦
                {investment?.serviceCharge
                  ? Number(investment?.serviceCharge)
                      .toFixed(2)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+\b)/g, ',')
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
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: wp(40),
                fontSize: hp(5),
                marginHorizontal: 5,
              }}
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
              }}>
              <Buttons label={'Top Up'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: wp(40),
                fontSize: hp(5),
                marginHorizontal: 5,
              }}
              onPress={() => {
                if (name === 'Arm') {
                  handleCreateARMInvestment();
                }
                if (name === 'Lenda') {
                  handleCreateLendaInvestment();
                }
              }}>
              <Buttons label={'Redeem'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingHorizontal: 16,
    // backgroundColor: '#fff',
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
});
