import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {Skeleton} from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTabBar from '../../component/CustomTabs/CustomTabBar';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  getApprovedLoans,
  getPendingLoans,
  getAllLoans,
  getPaidLoans,
  getLoanUserDetails,
} from '../../stores/LoanStore';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {getGuarantors} from '../../stores/GuarantorStore';

const {width, height} = Dimensions.get('window');

const Loanscreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [pendingLoansData, setPendingLoansData] = useState([]);
  const [paidLoansData, setPaidLoansData] = useState([]);
  const [approvedLoansData, setApprovedLoansData] = useState([]);
  const [allLoansData, setAllLoansData] = useState([]);
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [guarantor, setGuarantor] = useState([]);
  const route = useRoute();
  //total approvedLoans
  let totalApprovedLoanAmount = 0;

  for (const loan of approvedLoansData) {
    totalApprovedLoanAmount += loan.amount;
  }

  //total Pending
  let totalPendingLoanAmount = 0;

  for (const loan of pendingLoansData) {
    totalPendingLoanAmount += loan.amount;
  }

  //total Paid
  let totalPaidLoanAmount = 0;

  for (const loan of paidLoansData) {
    totalPaidLoanAmount += loan.amount;
  }

  useEffect(() => {
    if (route.name === 'LoanHome') {
      const unsubscribe = navigation.addListener('focus', async () => {
        getLoanuserData();
        getApprovedLoansData();
        getPendingLoansData();
        getAllLoansData();
        getPaidLoansData();
        getGuarantorData();
      });
      return unsubscribe;
    }
  }, [navigation]);

  const getLoanuserData = async () => {
    setIsLoading(true);
    const res = await getLoanUserDetails();
    if (res?.error) {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: res?.title,
      //   text2: res?.message,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      setLoanUserDetails(res?.data);
    }
    setIsLoading(false);
  };
  const getApprovedLoansData = async () => {
    setIsLoading(true);
    const res = await getApprovedLoans();
    if (res?.error) {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: res?.title,
      //   text2: res?.message,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      setApprovedLoansData(res?.data);
    }
    setIsLoading(false);
  };
  const getPendingLoansData = async () => {
    setIsLoading(true);
    const res = await getPendingLoans();
    if (res?.error) {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: res?.title,
      //   text2: res?.message,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      setPendingLoansData(res?.data);
    }
    setIsLoading(false);
  };
  const getAllLoansData = async () => {
    setIsLoading(true);
    const res = await getAllLoans();
    if (res?.error) {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: res?.title,
      //   text2: res?.message,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      setAllLoansData(res?.data);
    }
    setIsLoading(false);
  };
  const getPaidLoansData = async () => {
    setIsLoading(true);
    const res = await getPaidLoans();
    if (res?.error) {
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   topOffset: 50,
      //   text1: res?.title,
      //   text2: res?.message,
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   onPress: () => Toast.hide(),
      // });
    } else {
      setPaidLoansData(res?.data);
    }
    setIsLoading(false);
  };
  const getGuarantorData = async () => {
    const res = await getGuarantors();
    if (res?.error) {
    } else {
      setGuarantor(res?.data);
    }
  };

  const loadingList = ['string', 'string', 'string', 'string'];

  const Slide = ({item}) => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              width: width - 32,
              height: 120,
              marginRight: 15,
              borderRadius: 20,
              borderColor: '#F7F7FC',
              borderWidth: 1,
              overflow: 'hidden',
            }}>
            <View>
              <Skeleton animation="wave" width={120} height={120} />
            </View>
          </View>
        ) : (
          <ImageBackground
            source={require('../../../assets/icons/wallet_background.png')}>
            <View
              style={{
                width: width - 32,
                height: 170,
                marginRight: 16,
                borderRadius: 20,
                borderColor: '#F7F7FC',
                borderWidth: 1.5,
                overflow: 'hidden',
              }}>
              <View style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '70%'}}>
                    <Text style={styles.state}>{item.state}</Text>
                  </View>
                  <Image source={item.icon} />
                </View>
                <Text style={styles.amount}>{item.amount}</Text>
                <View
                  style={{
                    width: 140,
                    height: 170,
                    borderRadius: 100,
                    borderWidth: 12,
                    bottom: -185,
                    right: -20,
                    position: 'absolute',
                    borderColor:
                      item.id === 1
                        ? '#E6EDF5'
                        : item.id === 2
                        ? 'rgba(244, 183, 64, 0.2)'
                        : '#DAEED8',
                    opacity: 0.5,
                  }}
                />
                <View
                  style={{
                    width: 100,
                    height: 120,
                    borderRadius: 100,
                    borderWidth: 12,
                    bottom: -155,
                    right: item.id === 1 ? -15 : item.id === 2 ? 20 : -15,
                    position: 'absolute',
                    borderColor:
                      item.id === 1
                        ? 'linear-gradient(114.44deg, rgba(36, 52, 139, 0.5) 0%, rgba(99, 168, 235, 0.5) 100%)'
                        : item.id === 2
                        ? 'linear-gradient(114.44deg, rgba(235, 0, 85, 1) 100%, rgba(255, 250, 128, 1) 100%)'
                        : 'linear-gradient(180deg, rgba(68, 171, 59, 1) 0%, #D8FF69 100%)',
                    opacity: 0.3,
                  }}
                />
              </View>
            </View>
          </ImageBackground>
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
              <View key={i} style={{paddingHorizontal: 10}}>
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
          {allLoansData.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {allLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 10}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan.id,
                        })
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
                            source={
                              loan?.approvalStatus === 'approved'
                                ? require('../../../assets/images/approvedbox.png')
                                : loan.approvalStatus === 'paid'
                                ? require('../../../assets/images/unapprovedBox.png')
                                : loan.approvalStatus === 'pending'
                                ? require('../../../assets/images/unapprovedBox.png')
                                : require('../../../assets/images/unapprovedBox.png')
                            }
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
                justifyContent: 'center',
                marginHorizontal: 30,
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>
                Get a loan to boost your business
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
  const SecondRoute = () => (
    <>
      {isLoading ? (
        <View style={{flex: 1}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 10}}>
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
          {approvedLoansData.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {approvedLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 10}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id,
                        })
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
                justifyContent: 'center',
                marginHorizontal: 30,
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>
                You do not have an approved loan!
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
  const ThirdRoute = () => (
    <>
      {isLoading ? (
        <View style={{flex: 1}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 10}}>
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
          {paidLoansData.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {paidLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 10}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id,
                        })
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
                            source={require('../../../assets/images/pendingBox.png')}
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
                justifyContent: 'center',
                marginHorizontal: 30,
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>You do not have a paid loan!</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
  const fourthRoute = () => (
    <>
      {isLoading ? (
        <View style={{flex: 1}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 10}}>
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
          {pendingLoansData.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {pendingLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 10}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id,
                        })
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
                            source={require('../../../assets/images/unapprovedBox.png')}
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
                justifyContent: 'center',
                marginHorizontal: 30,
              }}>
              <Image source={require('../../../assets/images/Group.png')} />
              <Text style={styles.noTrans}>
                You do not have a pending loan!
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );

  const data = [
    {id: 'all', title: 'All Loans'},
    {id: 'approved', title: 'Approved Loans'},
    {id: 'pending', title: 'Pending Loans'},
    {id: 'paid', title: 'Paid Loans'},
  ];

  const renderScene = SceneMap({
    all: FirstRoute,
    approved: SecondRoute,
    pending: fourthRoute,
    paid: ThirdRoute,
  });

  const status = [
    {
      id: 1,
      state: 'Pending Loan',
      amount: `₦${
        totalPendingLoanAmount === undefined
          ? '0.00'
          : `${
              totalPendingLoanAmount === 0
                ? '0.00'
                : totalPendingLoanAmount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
            }`
      }`,
      icon: require('../../../assets/images/unapprovedBox.png'),
    },
    {
      id: 2,
      state: 'Approved Loan',
      amount: `₦${
        totalApprovedLoanAmount === undefined
          ? '0.00'
          : `${
              totalApprovedLoanAmount === 0
                ? '0.00'
                : totalApprovedLoanAmount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
            }`
      }`,
      icon: require('../../../assets/images/approvedbox.png'),
    },
    {
      id: 3,
      state: 'Paid Loan',
      amount: `₦${
        totalPaidLoanAmount === undefined
          ? '0.00'
          : `${
              totalPaidLoanAmount === 0
                ? '0.00'
                : totalPaidLoanAmount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
            }`
      }`,
      icon: require('../../../assets/images/pendingBox.png'),
      //   bottomIcon:require('')
    },
  ];

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

            <View style={styles.getLoanLoader}>
              <Skeleton animation="wave" width={80} height={25} />
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

            <View style={{flexDirection: 'row', width: '45%'}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Loan')}>
                  <View style={[styles.tobTab, {marginRight: 16}]}>
                    <Text style={[styles.tabText, {color: '#054B99'}]}>
                      Loans
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Guarantor')}>
                  <View style={styles.tobTab}>
                    <Text style={styles.tabText}>Guarantor</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

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
              }}>
              <View style={styles.getLoan}>
                <Text style={styles.getText}>Get Loan</Text>
              </View>
            </TouchableOpacity>
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

export default Loanscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    marginHorizontal: 20,
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
  getLoan: {
    backgroundColor: '#054B99',
    borderRadius: 12,
    width: '30%',
    left: '68%',
    bottom: 32,
    height: 35,
    justifyContent: 'center',
    //  paddingHorizontal:12,
  },
  getLoanLoader: {
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
    // fontWeight: '300',
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
    marginTop: 40,
    fontFamily: 'serif',
    fontSize: 20,

    marginBottom: -10,
    // fontWeight: 'bold',
  },
});
