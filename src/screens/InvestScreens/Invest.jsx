import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Skeleton} from '@rneui/base';
import CustomTabBar from '../../component/CustomTabs/CustomTabBar3';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getLoanUserDetails} from '../../stores/LoanStore';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import {
  getAllArmInvestment,
  getAllLendaInvestment,
  getSingleArmInvestment,
} from '../../stores/InvestStore';
import appsFlyer from 'react-native-appsflyer';
import {IntroSection} from '../../component/homescreen/Intro-Section';
import {FlashList} from '@shopify/flash-list';
import CustomButton from '../../component/buttons/CustomButtons';

const SLIDE_WIDTH = Dimensions.get('window').width * 0.88;
const ITEM_WIDTH = SLIDE_WIDTH;

const Investscreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [allInvestmentData, setAllInvestmentData] = useState([]);
  const [allArmData, setAllArmData] = useState([]);
  const [allILendaData, setAllLendaData] = useState([]);
  const [loanUserDetails, setLoanUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const [portfolioDetail, setPortfolioDetail] = useState(0);
  const userProfileData = useSelector(state => state.userProfile.profile);

  //total ARM Investment
  let totalArmAmount =
    allArmData &&
    allArmData?.length > 0 &&
    allArmData?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.investmentAmount,
      0,
    );

  //total Lenda Investment
  let totalLendaAmount =
    allILendaData &&
    allILendaData?.length > 0 &&
    allILendaData
      ?.filter(item => item?.investmentStatus === 'ACTIVE')
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalReturn,
        0,
      );

  useFocusEffect(
    useCallback(() => {
      getLoanuserData();
      getAllLendaInvestments();
      getAllArmInvestments();
    }, []),
  );

  useEffect(() => {
    if (route.name === 'Invest') {
      const mergedData = [...allArmData, ...allILendaData];
      setAllInvestmentData(mergedData);
    }
  }, [allArmData, allILendaData]);

  const getLoanuserData = useCallback(async () => {
    // console.log('getLoanuserData');
    try {
      setIsLoading(true);
      const res = await getLoanUserDetails();
      if (!res?.error) {
        setLoanUserDetails(res?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  const getAllLendaInvestments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllLendaInvestment();
      if (!res?.error && res?.data?.length > 0) {
        setAllLendaData(res?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  const getAllArmInvestments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllArmInvestment();
      if (!res?.error && res?.data?.data?.length > 0) {
        setAllArmData(res?.data?.data);
        const singleArmInvestmentRes = await getSingleArmInvestment(
          res?.data?.data[0]?.membershipId,
          res?.data?.data[0]?.productCode,
        );
        if (
          !singleArmInvestmentRes?.error &&
          singleArmInvestmentRes?.data?.length > 0
        ) {
          setPortfolioDetail(
            singleArmInvestmentRes?.data?.portfolio[0]?.accountBalance,
          );
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  const isReadyToInvest = useMemo(() => {
    return (
      loanUserDetails?.armUserBankDetails &&
      loanUserDetails?.nextOfKinDetails &&
      loanUserDetails?.loanDocumentDetails &&
      loanUserDetails?.armUserBankDetails != null &&
      loanUserDetails?.loanDocumentDetails != null &&
      loanUserDetails?.nextOfKinDetails != null &&
      loanUserDetails?.armUserBankDetails?.annualExpectedAnnualIncomeRange !=
        undefined &&
      loanUserDetails?.armUserBankDetails?.annualExpectedAnnualIncomeRange !=
        '' &&
      loanUserDetails?.armUserBankDetails?.bankAccountName != undefined &&
      loanUserDetails?.armUserBankDetails?.bankAccountName != '' &&
      loanUserDetails?.armUserBankDetails?.bankAccountNumber != undefined &&
      loanUserDetails?.armUserBankDetails?.bankAccountNumber != '' &&
      loanUserDetails?.armUserBankDetails?.bankCode != undefined &&
      loanUserDetails?.armUserBankDetails?.bankCode != '' &&
      loanUserDetails?.armUserBankDetails?.bankName != undefined &&
      loanUserDetails?.armUserBankDetails?.bankName != '' &&
      loanUserDetails?.armUserBankDetails?.branchCode != undefined &&
      loanUserDetails?.armUserBankDetails?.branchCode != '' &&
      loanUserDetails?.armUserBankDetails?.employmentStatus != undefined &&
      loanUserDetails?.armUserBankDetails?.employmentStatus != '' &&
      loanUserDetails?.armUserBankDetails?.expiryDateOfId != undefined &&
      loanUserDetails?.armUserBankDetails?.expiryDateOfId != '' &&
      loanUserDetails?.armUserBankDetails?.idType != undefined &&
      loanUserDetails?.armUserBankDetails?.idType != '' &&
      loanUserDetails?.armUserBankDetails?.kycLevel != undefined &&
      loanUserDetails?.armUserBankDetails?.kycLevel != '' &&
      loanUserDetails?.armUserBankDetails?.maximumSingleInvestmentAmount !=
        undefined &&
      loanUserDetails?.armUserBankDetails?.maximumSingleInvestmentAmount !=
        '' &&
      loanUserDetails?.armUserBankDetails?.maximumSingleRedemptionAmount !=
        undefined &&
      loanUserDetails?.armUserBankDetails?.maximumSingleRedemptionAmount !=
        '' &&
      loanUserDetails?.armUserBankDetails?.reInvestDividends != undefined &&
      loanUserDetails?.armUserBankDetails?.reInvestDividends != '' &&
      loanUserDetails?.armUserBankDetails?.utilityBillIdType != undefined &&
      loanUserDetails?.armUserBankDetails?.utilityBillIdType != null &&
      loanUserDetails?.armUserBankDetails?.utilityBillIdType != '' &&
      loanUserDetails?.loanDocumentDetails?.identityCard != undefined &&
      loanUserDetails?.loanDocumentDetails?.identityCard != null &&
      loanUserDetails?.loanDocumentDetails?.identityCard != '' &&
      loanUserDetails?.loanDocumentDetails?.utilityBill != undefined &&
      loanUserDetails?.loanDocumentDetails?.utilityBill != null &&
      loanUserDetails?.loanDocumentDetails?.utilityBill != '' &&
      loanUserDetails?.loanDocumentDetails?.personalPhoto != undefined &&
      loanUserDetails?.loanDocumentDetails?.personalPhoto != null &&
      loanUserDetails?.loanDocumentDetails?.personalPhoto != ''
    );
  }, [loanUserDetails]);

  const loadingList = ['string', 'string', 'string'];
  const status = [
    {
      id: 1,
      state: 'Earn With Us',
      amount: `₦${
        totalLendaAmount === undefined
          ? '0.00'
          : `${
              totalLendaAmount === 0
                ? '0.00'
                : new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(totalLendaAmount))
            }`
      }`,
      icon: require('../../../assets/images/lenda.png'),
      bottomIcon: require('../../../assets/images/tradeLendaCoin.png'),
      buttonText: 'Lend Now',
      buttonRoute: 'InvestmentOption',
    },
    {
      id: 2,
      state: 'Save with ARM',
      amount: `₦${
        portfolioDetail !== 0
          ? new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(portfolioDetail))
          : totalArmAmount !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(totalArmAmount))
          : '0.00'
      }`,
      icon: require('../../../assets/images/arm.png'),
      bottomIcon: require('../../../assets/images/armCoin.png'),
      buttonText: 'Save Now',
      buttonRoute: 'InvestmentOption',
    },
  ];

  const Slide = ({item}) => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              width: wp(43.5),
              height: hp(26),
              marginHorizontal: 2,
              borderRadius: 20,
              borderColor: '#F7F7FC',
              borderWidth: 1,
              overflow: 'hidden',
            }}>
            <View>
              <Skeleton
                animation="wave"
                width={wp('43.5%')}
                height={hp('25%')}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              width: wp(43.5),
              height: hp(26),
              marginHorizontal: 2,
              borderRadius: 20,
              borderColor: '#F7F7FC',
              borderWidth: 2,
              overflow: 'hidden',
              justifyContent: 'center',
            }}>
            <View style={{paddingHorizontal: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{width: wp(27)}}>
                  <Text style={styles.state}>{item.state}</Text>
                </View>
                <Image
                  source={item.icon}
                  style={{width: wp(10)}}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.amount}>{item.amount}</Text>
                <CustomButton
                  onPress={() => {
                    if (item.id == 1) {
                      logAppsFlyer(
                        'invest',
                        'lend with tradelenda',
                        'view plans',
                        0,
                      );
                      navigation.navigate('InvestmentOption', {
                        name: 'Lenda',
                        header: 'LEND WITH TRADELENDA',
                      });
                    } else if (item.id == 2) {
                      if (isReadyToInvest) {
                        logAppsFlyer(
                          'invest',
                          'save with arm',
                          'view plans',
                          0,
                        );
                        navigation.navigate('InvestmentOption', {
                          name: 'Arm',
                          header: 'SAVE WITH ARM',
                        });
                      } else {
                        navigation.navigate('OnboardingHome');
                      }
                    }
                  }}
                  title={item.buttonText}
                  buttonStyle={{width: '70%'}}
                  textStyle={{fontSize: 14}}
                />
              </View>
              <View
                style={{
                  bottom: -hp(8),
                  right: -wp(20),
                  position: 'absolute',
                }}>
                <Image
                  source={item.bottomIcon}
                  style={{width: wp('50%'), height: hp('10%')}}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  const FirstRoute = () => (
    <>
      {isLoading ? (
        <View style={{flex: 1}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList &&
              loadingList?.length > 0 &&
              loadingList.map((investment, i) => (
                <View key={i} style={{paddingHorizontal: 20}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            backgroundColor: '#CDDBEB',
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginRight: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Skeleton animation="wave" width={20} height={20} />
                        </View>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Skeleton animation="wave" width={70} height={20} />
                            <Skeleton animation="wave" width={50} height={20} />
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={{marginTop: 10}}>
                              <Skeleton
                                animation="wave"
                                width={90}
                                height={20}
                              />
                            </Text>
                            <Text style={{marginTop: 10}}>
                              <Skeleton
                                animation="wave"
                                width={70}
                                height={20}
                              />
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      ) : (
        <View style={{flex: 1}}>
          {allInvestmentData && allInvestmentData?.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {allInvestmentData.map((investment, i) => (
                <View
                  key={i}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    backgroundColor:
                      investment?.investmentStatus === 'CLOSED'
                        ? COLORS.lendaOrange
                        : COLORS.white,
                  }}>
                  <View style={{marginTop: 0}}>
                    <TouchableOpacity
                      disabled={
                        !investment?.investmentType
                          ? investment?.productCode && investment?.membershipId
                            ? false
                            : true
                          : false
                      }
                      onPress={() =>
                        navigation.navigate('InvestmentDetails', {
                          paramKey: {
                            investment: investment,
                            name: investment?.investmentType ? 'Lenda' : 'Arm',
                          },
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
                            backgroundColor: '#CDDBEB',
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            marginRight: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {investment?.investmentType && (
                            <Image
                              style={{width: 30, height: 30, borderRadius: 40}}
                              source={require('../../../assets/images/lendaCube.png')}
                            />
                          )}
                          {investment?.productCode && (
                            <Image
                              style={{width: 30, height: 30, borderRadius: 40}}
                              source={require('../../../assets/images/armCube.png')}
                            />
                          )}
                        </View>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.title}>
                              {investment?.investmentType ??
                                investment?.productCode}
                            </Text>
                            <Text style={styles.price}>
                              ₦
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(investment?.investmentAmount)) ??
                                '0.00'}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.desc}>
                              {investment?.investmentType && 'Trade Lenda'}
                              {investment?.productCode &&
                                !investment?.membershipId &&
                                'Processing '}
                              {investment?.productCode && 'ARM'}
                              {investment?.productCode &&
                                !investment?.membershipId &&
                                ' Investment... '}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={[styles.desc]}>
                                {investment?.createdAt?.substr(11, 5) ??
                                  investment?.created_at?.substr(11, 5)}
                                {'  '}
                              </Text>
                              <Text style={styles.desc}>
                                {investment?.createdAt?.substr(0, 10) ??
                                  investment?.created_at?.substr(0, 10)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 20,
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>
                Lend to the supply chain and earn more
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );

  const data = [{id: 'myInvesments', title: 'My Investment'}];

  const renderScene = SceneMap({
    myInvesments: FirstRoute,
  });

  const logAppsFlyer = useCallback((event, investmentName, activity, value) => {
    const eventName = event;
    const eventValues = {
      investment_type: investmentName,
      activity_type: activity,
      currency: 'NGN',
      revenue: value,
    };

    appsFlyer.logEvent(
      eventName,
      eventValues,
      res => {
        // console.log(res);
      },
      err => {
        // console.error(err);
      },
    );
  }, []);

  const reanderIntroSection = () => {
    return isLoading ? (
      <View style={[styles.headerContainer, {justifyContent: 'center'}]}>
        <Skeleton animation="wave" width={wp(90)} height={50} />
      </View>
    ) : (
      <IntroSection
        userProfileData={userProfileData}
        loanUserDetails={loanUserDetails}
      />
    );
  };

  const renderRootComponents = () => {
    return <>{reanderIntroSection()}</>;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop:
          insets.top !== 0 ? (insets.top < 10 ? insets.top : 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0
            ? insets.bottom < 10
              ? insets.bottom
              : 10
            : 'auto',
        paddingLeft:
          insets.left !== 0 ? (insets.left < 10 ? insets.left : 10) : 'auto',
        paddingRight:
          insets.right !== 0 ? (insets.right < 10 ? insets.right : 10) : 'auto',
      }}>
      {renderRootComponents()}
      <View style={styles.innerContainer}>
        <FlatList
          data={status ? status : []}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex: 1, justifyContent: 'space-evenly'}}
          horizontal
          renderItem={({item}) => <Slide item={item} />}
        />
      </View>
      <TabView
        navigationState={{
          index,
          routes: data?.map(item => ({key: item.id, title: item.title})),
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        swipeEnabled={false}
        tabBarPosition="top"
        renderTabBar={props => (
          <CustomTabBar {...props} onIndexChange={setIndex} />
        )}
      />
    </SafeAreaView>
  );
};

export default Investscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  innerContainer: {
    marginHorizontal: 16,
  },
  tobTab: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonAction: {
    backgroundColor: COLORS.lendaBlue,
    borderRadius: 12,
    width: wp(23),
    height: 35,
    justifyContent: 'center',
  },
  getInvestmentLoader: {
    left: '78%',
    bottom: 28,
    height: 35,
    justifyContent: 'center',
  },
  getText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp('1.8'),
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  indicator: {
    backgroundColor: '#054B99',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    color: '#14142B',
  },
  desc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  noTrans: {
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  state: {
    fontSize: hp(1.6),
    fontWeight: '400',
    color: '#4E4B66',
  },
  amount: {
    marginTop: hp(0.5),
    fontFamily: 'serif',
    fontSize: hp(2.2),
    marginVertical: hp(2.2),
  },
});
