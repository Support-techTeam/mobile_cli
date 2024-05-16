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
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Skeleton} from '@rneui/base';
import CustomTabBar from '../../component/CustomTabs/CustomTabBar';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@rneui/themed';
import {
  getApprovedLoans,
  getPendingLoans,
  getAllLoans,
  getPaidLoans,
  getLoanUserDetails,
} from '../../stores/LoanStore';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {getGuarantors} from '../../stores/GuarantorStore';
import {IntroSection} from '../../component/homescreen/Intro-Section';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import Toast from 'react-native-toast-message';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import CustomButton from '../../component/buttons/CustomButtons';

const SLIDE_WIDTH = Dimensions.get('window').width * 0.88;
const ITEM_WIDTH = SLIDE_WIDTH;
const {width, height} = Dimensions.get('window');

const Loanscreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const userProfileData = useSelector(state => state.userProfile.profile);
  const [index, setIndex] = useState(0);
  const [pendingLoansData, setPendingLoansData] = useState([]);
  const [paidLoansData, setPaidLoansData] = useState([]);
  const [approvedLoansData, setApprovedLoansData] = useState([]);
  const [allLoansData, setAllLoansData] = useState([]);
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [guarantor, setGuarantor] = useState([]);
  const route = useRoute();
  const carouselRef = useRef(null);
  const [slide, setSlide] = useState(0);
  //total approvedLoans
  let totalApprovedLoanAmount = approvedLoansData?.reduce(
    (total, loan) => total + (loan?.amount || 0),
    0,
  );

  //total Pending
  let totalPendingLoanAmount = pendingLoansData?.reduce(
    (total, loan) => total + (loan?.amount || 0),
    0,
  );

  //total Paid
  let totalPaidLoanAmount = paidLoansData?.reduce(
    (total, loan) => total + (loan?.totalPaidBack || 0),
    0,
  );

  useFocusEffect(
    useCallback(() => {
      fetchLoanUserData();
      fetchApprovedLoansData();
      fetchPendingLoansData();
      fetchAllLoansData();
      fetchPaidLoansData();
      fetchGuarantorData();
    }, []),
  );

  const fetchLoanUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getLoanUserDetails();
      if (!response?.error) {
        setLoanUserDetails(response?.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchApprovedLoansData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getApprovedLoans();
      if (!response?.error) {
        setApprovedLoansData(response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPendingLoansData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPendingLoans();
      setPendingLoansData(response?.data);
    } catch (error) {
      // Handle error here
    } finally {
      setIsLoading(false);
    }
  }, []);
  const fetchAllLoansData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllLoans();
      if (!response?.error) {
        setAllLoansData(response?.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPaidLoansData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPaidLoans();
      if (!response?.error) {
        setPaidLoansData(response?.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGuarantorData = useCallback(async () => {
    try {
      const response = await getGuarantors();
      if (!response?.error) {
        setGuarantor(response?.data);
      }
    } catch (error) {
      // Handle error
    }
  }, []);

  const loadingList = ['string', 'string', 'string', 'string'];

  const Slide = ({item}) => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              width: ITEM_WIDTH,
              borderRadius: 15,
              justifyContent: 'center',
              alignSelf: 'center',
              borderWidth: 0.5,
              borderColor: COLORS.lendaComponentBorder,
            }}>
            <Skeleton
              animation="wave"
              width={ITEM_WIDTH}
              height={170}
              style={{borderRadius: 15}}
            />
          </View>
        ) : (
          <View
            style={{
              width: ITEM_WIDTH,
              borderRadius: 15,
              justifyContent: 'center',
              alignSelf: 'center',
              borderWidth: 0.5,
              borderColor: COLORS.lendaComponentBorder,
            }}>
            <ImageBackground
              source={require('../../../assets/icons/wallet_background.png')}>
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  height: 170,
                }}>
                <View>
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
          </View>
        )}
      </>
    );
  };

  const FirstRoute = () => (
    <>
      {isLoading ? (
        <View style={{flex: 1, marginHorizontal: 15}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 0}}>
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          {allLoansData?.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {allLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 0}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id ? loan._id : loan.id,
                          data: loan,
                          type: 'all',
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 0}}>
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          {approvedLoansData?.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {approvedLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 0}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id ? loan._id : loan.id,
                          data: loan,
                          type: 'approved',
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 0}}>
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          {paidLoansData?.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {paidLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 0}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id ? loan._id : loan.id,
                          data: loan,
                          type: 'paid',
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
                              {loan?.amount && loan?.amount > 0
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(Number(loan?.amount))
                                : new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(Number(loan?.totalPaidBack))}
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
                                {loan?.updatedAt?.substr(11, 5)}
                                {'  '}
                              </Text>
                              <Text style={styles.desc}>
                                {loan?.updatedAt?.substr(0, 10)}
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {loadingList.map((loan, i) => (
              <View key={i} style={{paddingHorizontal: 0}}>
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
        <View style={{flex: 1, marginHorizontal: 15}}>
          {pendingLoansData?.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {pendingLoansData.map((loan, i) => (
                <View key={i} style={{paddingHorizontal: 0}}>
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LoanTransaction', {
                          paramKey: loan._id ? loan._id : loan.id,
                          data: loan,
                          type: 'pending',
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

  const reanderIntroSection = () => {
    return isLoading ? (
      <View
        style={[
          styles.headerContainer,
          {justifyContent: 'center', width: wp(100), marginHorizontal: 10},
        ]}>
        <Skeleton
          animation="wave"
          width={'100%'}
          height={50}
          style={[styles.tobTab, {justifyContent: 'center'}]}
        />
      </View>
    ) : (
      <IntroSection
        userProfileData={userProfileData}
        loanUserDetails={loanUserDetails}
      />
    );
  };

  const renderHeaderComponents = () => {
    return isLoading ? (
      <View
        style={[
          styles.headerContainer,
          {justifyContent: 'center', width: wp(100), marginHorizontal: 10},
        ]}>
        <View style={styles.leftView}>
          <View style={{flexDirection: 'row'}}>
            <Skeleton
              animation="wave"
              width={70}
              height={20}
              style={styles.tobTab}
            />
            <Skeleton
              animation="wave"
              width={70}
              height={20}
              style={styles.tobTab}
            />
          </View>
        </View>

        <View style={styles.rightView}>
          <Skeleton
            animation="wave"
            width={70}
            height={20}
            style={styles.tobTab}
          />
        </View>
      </View>
    ) : (
      <View style={[styles.headerContainer]}>
        <View style={styles.leftView}>
          <View style={{flexDirection: 'row'}}>
            <CustomButton
              onPress={() => navigation.navigate('LoanHome')}
              title="Loan"
              textStyle={{
                color: COLORS.lendaBlue,
                fontSize: 14,
                fontWeight: '500',
              }}
              buttonStyle={[
                styles.tobTab,
                {
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.lendaBlue,
                  borderWidth: 1,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                },
              ]}
            />
            <CustomButton
              onPress={() => navigation.navigate('Guarantor')}
              title="Guarantor"
              textStyle={{
                color: COLORS.lendaBlue,
                fontSize: 14,
                fontWeight: '500',
              }}
              buttonStyle={[
                styles.tobTab,
                {
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.lendaBlue,
                  borderWidth: 1,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.rightView}>
          <CustomButton
            onPress={() => {
              if (guarantor && guarantor?.length <= 0) {
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
                  guarantor && guarantor?.length > 0
                    ? 'GetLoan'
                    : 'AddGuarantors'
                }`,
              );
            }}
            title="Get Loan"
            textStyle={{
              fontSize: 14,
              fontWeight: '500',
            }}
            buttonStyle={[
              styles.tobTab,
              {
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                borderColor: COLORS.lendaBlue,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderSlideComponent = () => {
    return (
      <>
        <View style={styles.innerContainer}>
          <Carousel
            layout={'default'}
            ref={carouselRef}
            data={status}
            renderItem={({item}) => <Slide item={item} />}
            sliderWidth={SLIDE_WIDTH}
            itemWidth={ITEM_WIDTH}
            useScrollView={true}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={0.6}
            firstItem={0}
            initialScrollIndex={0}
            onSnapToItem={index => setSlide(index)}
          />
        </View>
        <Pagination
          dotsLength={status?.length}
          activeDotIndex={slide}
          carouselRef={carouselRef}
          containerStyle={{
            alignSelf: 'flex-end',
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginVertical: 6,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor:
              slide == 0
                ? COLORS.lendaBlue
                : slide == 1
                ? COLORS.lendaLightOrange
                : COLORS.lendaGreen,
          }}
          tappableDots={true}
          inactiveDotStyle={{
            backgroundColor: 'black',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </>
    );
  };

  const renderRootComponents = () => {
    return (
      <>
        {reanderIntroSection()}
        {renderHeaderComponents()}
        {renderSlideComponent()}
      </>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: COLORS.lendaLightGrey,
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
      {/* Intro Component */}
      {renderRootComponents()}

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

export default React.memo(Loanscreen);

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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
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
  getLoan: {
    backgroundColor: '#054B99',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
  rightView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  leftView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
});
