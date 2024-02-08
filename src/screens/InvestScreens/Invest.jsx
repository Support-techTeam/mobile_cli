import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {Skeleton} from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTabBar from '../../component/CustomTabs/CustomTabBar3';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {getLoanUserDetails} from '../../stores/LoanStore';
import {useRoute} from '@react-navigation/native';
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

  //total ARM Investment
  let totalArmAmount =
    allArmData &&
    allArmData?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.investmentAmount,
      0,
    );

  //total Lenda Investment
  let totalLendaAmount =
    allILendaData &&
    allILendaData
      ?.filter(item => item?.investmentStatus === 'ACTIVE')
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalReturn,
        0,
      );

  useEffect(() => {
    if (route.name === 'Invest') {
      const unsubscribe = navigation.addListener('focus', async () => {
        getLoanuserData();
        getAllLendaInvestments();
        getAllArmInvestments();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    getAllLendaInvestments();
    getAllArmInvestments();
  }, []);

  useEffect(() => {
    const mergedData = [...allArmData, ...allILendaData];
    setAllInvestmentData(mergedData);
  }, [allArmData, allILendaData]);

  const getLoanuserData = async () => {
    try {
      setIsLoading(true);
      const res = await getLoanUserDetails();
      if (res?.error) {
      } else {
        setLoanUserDetails(res?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getAllLendaInvestments = async () => {
    try {
      setIsLoading(true);
      const res = await getAllLendaInvestment();
      if (res?.error) {
      } else {
        setAllLendaData(res?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getAllArmInvestments = async () => {
    try {
      setIsLoading(true);
      const res = await getAllArmInvestment();
      if (res?.error) {
      } else {
        setAllArmData(res?.data?.data);
        getSingleArmInvestment(
          res?.data?.data[0]?.membershipId,
          res?.data?.data[0]?.productCode,
        ).then(res => {
          if (!res?.error) {
            if (res?.data?.length > 0) {
              setPortfolioDetail(res?.data?.portfolio[0]?.accountBalance);
            }
          }
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };
  const isReadyToInvest =
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
    loanUserDetails?.armUserBankDetails?.maximumSingleInvestmentAmount != '' &&
    loanUserDetails?.armUserBankDetails?.maximumSingleRedemptionAmount !=
      undefined &&
    loanUserDetails?.armUserBankDetails?.maximumSingleRedemptionAmount != '' &&
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
    loanUserDetails?.loanDocumentDetails?.personalPhoto != '';

  const loadingList = ['string', 'string', 'string'];
  const status = [
    {
      id: 1,
      state: 'Lend with Trade Lenda',
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
              width: wp('43.5%'),
              height: hp('25%'),
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
                <TouchableOpacity
                  onPress={() => {
                    if (item.id == 1) {
                      navigation.navigate('InvestmentOption', {
                        name: 'Lenda',
                        header: 'LEND WITH TRADELENDA',
                      });
                    } else if (item.id == 2) {
                      if (isReadyToInvest) {
                        navigation.navigate('InvestmentOption', {
                          name: 'Arm',
                          header: 'SAVE WITH ARM',
                        });
                      } else {
                        navigation.navigate('OnboardingHome');
                      }
                    }
                  }}>
                  <View style={styles.buttonAction}>
                    <Text style={styles.getText}>{item.buttonText}</Text>
                  </View>
                </TouchableOpacity>
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
            {loadingList.map((investment, i) => (
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
                            <Skeleton animation="wave" width={90} height={20} />
                          </Text>
                          <Text style={{marginTop: 10}}>
                            <Skeleton animation="wave" width={70} height={20} />
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
          {allInvestmentData.length > 0 ? (
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
                        investment?.productCode && investment?.membershipId
                          ? false
                          : true
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

  return (
    <>
      {isLoading ? (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top !== 0 ? insets.top : 18,
            paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
            paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
          }}>
          <View style={styles.innerContainer}>
            <View style={{flexDirection: 'row', width: '45%'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 16}}>
                  <Skeleton animation="wave" width={70} height={20} />
                </View>

                <Skeleton animation="wave" width={70} height={20} />
              </View>
            </View>

            <View style={styles.getInvestmentLoader}>
              <Skeleton animation="wave" width={80} height={25} />
            </View>

            <FlatList
              data={status}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flex: 1, justifyContent: 'center'}}
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
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top !== 0 ? insets.top : 18,
            paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
            paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
          }}>
          <View style={styles.innerContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                marginRight: 15,
              }}>
              <Image
                source={require('../../../assets/images/HeadLogo.png')}
                style={{width: 83, height: 32}}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('More')}
                style={{
                  backgroundColor: '#D9DBE9',
                  padding: 8,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="account-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={status}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flex: 1, justifyContent: 'center'}}
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
      )}
    </>
  );
};

export default Investscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    marginHorizontal: 16,
  },
  tobTab: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonAction: {
    backgroundColor: COLORS.lendaBlue,
    borderRadius: 12,
    width: wp(22),
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

    fontSize: 14,
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
