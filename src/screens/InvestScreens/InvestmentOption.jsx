import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import {
  getAllArmProduct,
  getAllLendaProduct,
  getArmProductYield,
} from '../../stores/InvestStore';
import Spinner from 'react-native-loading-spinner-overlay';

const InvestmentOptionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [yieldData, setYieldData] = useState();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {name, header} = route.params;

  useEffect(() => {
    if (route.name === 'InvestmentOption') {
      const unsubscribe = navigation.addListener('focus', async () => {
        if (name === 'Lenda') {
          getLendaProducts();
        }
        if (name === 'Arm') {
          getArmProducts();
          getSingleArmProductYield();
        }
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    if (name === 'Lenda') {
      getLendaProducts();
    }
    if (name === 'Arm') {
      getArmProducts();
    }
  }, []);

  const getLendaProducts = async () => {
    setIsLoading(true);
    getAllLendaProduct()
      .then(res => {
        if (res?.data?.length > 0) {
          setData(res?.data);
        }
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

  const getArmProducts = async data => {
    setIsLoading(true);
    getAllArmProduct(data)
      .then(res => {
        if (res?.data?.length > 0) {
          setData(res?.data);
        }
        getSingleArmProductYield();
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

  const getSingleArmProductYield = async () => {
    setIsLoading(true);
    getArmProductYield('ARMMMF')
      .then(res => {
        if (res?.error) {
        } else {
          setYieldData(res?.data);
        }

        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

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
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>{header}</Text>
          </View>
        </View>
      </View>
      <View style={styles.demark} />

      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: '#fff',
              flexGrow: 1,
              height: hp(90),
              marginBottom: 20,
            },
          ]}>
          <View style={{alignItems: 'center', marginTop: 24}}>
            <View style={styles.titleView}>
              <Text style={styles.title}>
                {name === 'Arm' ? 'Recommended Products' : 'Lenda’s Plans'}
              </Text>
            </View>
          </View>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            style={[styles.scrollView]}
            alwaysBounceVertical={false}>
            {(data && data?.length == 0) || (data && data == undefined) ? (
              <View style={styles.transHistory}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 20,
                    marginVertical: hp('20%'),
                  }}>
                  <Image source={require('../../../assets/images/Group.png')} />
                  <Text style={styles.noTrans}>
                    No Investment data available!
                  </Text>
                </View>
              </View>
            ) : (
              data &&
              data?.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{marginHorizontal: 15}}
                    onPress={
                      isScrolling
                        ? null
                        : () =>
                            navigation.navigate('InvestmentSummary', {
                              yieldValue: yieldData?.yield ?? 0.0,
                              name: name,
                              investment: item,
                            })
                    }>
                    <View style={styles.PanelItemContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View style={{marginRight: 10}}>
                          <>
                            {name === 'Arm' ? (
                              <Image
                                style={styles.PanelImage}
                                source={require('../../../assets/images/investGraph.png')}
                              />
                            ) : (
                              <Image
                                style={styles.PanelImage}
                                source={require('../../../assets/images/InvestIcon.png')}
                              />
                            )}
                          </>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: hp('2%'),
                              color: COLORS.dark,
                            }}>
                            {name === 'Arm'
                              ? item?.productCode
                              : item?.investmentName}
                          </Text>
                          <Text
                            style={[
                              styles.desc,
                              {
                                color: COLORS.lendaGreen,
                                opacity: 0.8,
                                marginTop: 1,
                              },
                            ]}>
                            <Image
                              style={styles.InternalImage}
                              source={require('../../../assets/images/ArrowUp.png')}
                            />
                            {name === 'Arm'
                              ? `${
                                  yieldData
                                    ? Number(yieldData?.yield)?.toFixed(2)
                                    : '0.00'
                                }% Yield`
                              : `${Number(item?.interestRate)?.toFixed(
                                  1,
                                )}% Interest`}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: hp('2.2%'),
                            color: COLORS.dark,
                            alignSelf: 'flex-end',
                          }}>
                          ₦
                          {name === 'Arm' ? (
                            `${
                              item?.minimumInvestmentAmount
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(
                                    Number(item.minimumInvestmentAmount),
                                  )
                                : '0.00'
                            }`
                          ) : (
                            <>
                              {item?.amountRange?.minAmount
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(Number(item.amountRange.minAmount))
                                : '0.00'}
                            </>
                          )}
                        </Text>
                        {name === 'Lenda' && (
                          <Text
                            style={{
                              fontSize: hp('2.2%'),
                              color: COLORS.dark,
                              alignSelf: 'flex-end',
                            }}>
                            ₦
                            {item?.amountRange?.maxAmount
                              ? new Intl.NumberFormat('en-US', {
                                  style: 'decimal',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(Number(item.amountRange.maxAmount))
                              : '0.00'}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={styles.demark} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  scrollView: {
    alignContent: 'flex-start',
  },
  HeadView: {
    flexDirection: 'row',
    width: wp(80),
    justifyContent: 'center',
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
  titleView: {
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
    // lineHeight: 21,
    color: '#14142B',
  },
  noTrans: {
    // fontFamily: 'MontSBold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  transHistory: {
    padding: 14,
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
});
