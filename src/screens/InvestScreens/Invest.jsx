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

const Investscreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [allInvestmentData, setAllInvestmentData] = useState([]);
  const [allArmData, setAllArmData] = useState([]);
  const [allILendaData, setAllLendaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  //total ARM Investment
  let totalArmAmount = 0;

  for (const invest of allArmData) {
    totalArmAmount += invest.amount;
  }

  //total Lenda Investment
  let totalLendaAmount = 0;

  for (const invest of allILendaData) {
    totalLendaAmount += invest.amount;
  }

  useEffect(() => {
    if (route.name === 'Invest') {
      const unsubscribe = navigation.addListener('focus', async () => {
        getLoanuserData();
      });
      return unsubscribe;
    }
  }, [navigation]);

  const getLoanuserData = async () => {
    setIsLoading(true);
    // const res = await getLoanUserDetails();
    // if (res?.error) {
    // } else {
    //   setLoanUserDetails(res?.data);
    // }
    setIsLoading(false);
  };

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
                : totalLendaAmount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
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
        totalArmAmount === undefined
          ? '0.00'
          : `${
              totalArmAmount === 0
                ? '0.00'
                : totalArmAmount?.toString()?.replace(/\B(?=(\d{3})+\b)/g, ',')
            }`
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
              width: wp('43.5%'),
              height: hp('25%'),
              marginHorizontal: 2,
              borderRadius: 20,
              borderColor: '#F7F7FC',
              borderWidth: 2,
              overflow: 'hidden',
              shadowOffset: 4,
              shadowColor: '#F7F7FC',
              shadowOpacity: 1,
            }}>
            <View style={{paddingHorizontal: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{width: '70%'}}>
                  <Text style={styles.state}>{item.state}</Text>
                </View>
                <Image
                  source={item.icon}
                  style={{width: wp('10%')}}
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
                      navigation.navigate('InvestmentOption', {
                        name: 'Arm',
                        header: 'SAVE WITH ARM',
                      });
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
            {loadingList.map((loan, i) => (
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
              {allInvestmentData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 10}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        // navigation.navigate('LoanTransaction', {
                        //   paramKey: loan.id,
                        // })
                        console.log('Open Investment')
                      }>
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
                            width: 40,
                            height: 40,
                            borderRadius: 5,
                            marginRight: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={require('../../../assets/images/approvedbox.png')}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.title}>{loan?.loanType}</Text>
                            <Text style={styles.price}>
                              ₦
                              {loan?.amount
                                ?.toString()
                                ?.replace(/\B(?=(\d{3})+\b)/g, ',')}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.desc}>{loan?.reason}</Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={[styles.desc]}>
                                {loan?.createdAt?.substr(11, 5)}
                                {'  '}
                              </Text>
                              <Text style={styles.desc}>
                                {loan?.createdAt?.substr(0, 10)}
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
                // justifyContent: 'center',
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
    fontSize: 12,
    fontWeight: '400',
    color: '#4E4B66',
  },
  amount: {
    marginTop: hp(0.5),
    fontFamily: 'serif',
    fontSize: hp(3),
    marginVertical: hp(2.2),
  },
});
