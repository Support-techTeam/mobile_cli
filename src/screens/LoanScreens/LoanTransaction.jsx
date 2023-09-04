import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getLoanById} from '../../stores/LoanStore';
import COLORS from '../../constants/colors';
import ViewShot from 'react-native-view-shot';
import SendIntentAndroid from 'react-native-send-intent';
import Share from 'react-native-share';

const LoanTransactions = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const loanIdd = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState([]);
  const viewShotRef = React.useRef(null);

  useEffect(() => {
    getLoan();
  }, [loanIdd, navigation]);

  const getLoan = async () => {
    setIsLoading(true);
    const res = await getLoanById(loanIdd);
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      setLoanDetails(res?.data);
    }
    setIsLoading(false);
  };

  const openSendEmail = Id => {
    const text = `Hello, I would like to report a loan transaction, with Transaction ID: ${Id}`;

    SendIntentAndroid.sendMail(
      'support@tradelenda.com',
      `Report Loan Transaction`,
      `${text}`,
    );
  };

  const shareToSocialMedia = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const shareOptions = {
        title: 'Share via',
        url: `file://${uri}`,
        type: 'image/jpeg',
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Fetching loan details...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
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
              marginLeft: 5,
            }}>
            <AntDesign name="left" size={30} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>Loan Details</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            shareToSocialMedia();
            console.log('Share to social media');
          }}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
              marginRight: 5,
            }}>
            <AntDesign name="sharealt" size={30} color={COLORS.lendaBlue} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'png',
            quality: 1,
          }}>
          <View
            style={{
              backgroundColor: COLORS.Light,
            }}>
            <View
              style={{
                alignItems: 'center',
                marginTop: 24,
              }}>
              <View style={styles.titleView}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 25,
                    marginRight: 8,
                  }}>
                  <Image
                    source={require('../../../assets/images/Loanapplicon.png')}
                  />
                </View>
                <Text style={styles.title}>Loan Application</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <Text style={{fontFamily: 'Montserat', fontWeight: '400'}}>
                  On
                </Text>
                <Text style={{fontWeight: '600'}}>
                  {' '}
                  {loanDetails?.createdAt?.substr(0, 10)}
                </Text>
                <Text style={{fontFamily: 'Montserat', fontWeight: '400'}}>
                  {' '}
                  at
                </Text>
                <Text style={{fontWeight: '600'}}>
                  {' '}
                  {loanDetails?.createdAt?.substr(11, 5)}
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 15}}>
              <View style={{marginTop: 40}}>
                <Text style={styles.infotext}>Amount</Text>
                <Text style={styles.values}>
                  ₦
                  {loanDetails?.amount
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')}
                </Text>
              </View>
              <View style={styles.demark} />
              <View style={{marginTop: 15}}>
                <Text style={styles.infotext}>Reason</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text style={styles.values}>{loanDetails?.reason}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.demark} />

              <View style={{marginTop: 15}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.infotext}>Loan Tenor</Text>
                  <Text style={styles.infotext}>Interest</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.values}>{loanDetails?.loanTenor}</Text>
                  <Text style={styles.values}>{loanDetails?.interest}%</Text>
                </View>
              </View>

              {loanDetails?.monthlyRepaymentAmount && (
                <>
                  <View style={styles.demark} />
                  <View style={{marginTop: 15}}>
                    <Text style={styles.infotext}>
                      Monthly Repayment Amount
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Text style={styles.values}>
                          ₦
                          {loanDetails?.monthlyRepaymentAmount
                            ?.toFixed(2)
                            .toString()
                            ?.replace(/\B(?=(\d{3})+\b)/g, ',')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}

              <View style={styles.demark} />

              <View style={{marginTop: 15}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.infotext}>Date of Approval</Text>
                  <Text style={styles.infotext}>Number Of Repayments</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontFamily: 'Montserat', fontSize: 16}}>
                    {loanDetails?.dateOfApproval === undefined
                      ? '00-00-000'
                      : loanDetails?.dateOfApproval?.substr(0, 10)}
                  </Text>
                  <Text style={{fontFamily: 'Montserat', fontSize: 16}}>
                    {loanDetails?.numberOfRepayments === undefined
                      ? '0'
                      : loanDetails?.numberOfRepayments}
                  </Text>
                </View>
              </View>
              <View style={styles.demark} />
              <View style={{marginTop: 15}}>
                <Text style={styles.infotext}>Status</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={[
                      loanDetails?.approvalStatus === 'pending' && {
                        backgroundColor: '#F4B740',
                      },
                      loanDetails?.approvalStatus === 'approved' && {
                        backgroundColor: '#054B99',
                      },
                      loanDetails?.approvalStatus === 'rejected' && {
                        backgroundColor: '#ED2E7E',
                      },
                      {width: 15, height: 15, borderRadius: 500},
                    ]}
                  />
                  <Text
                    style={[
                      styles.values,
                      loanDetails?.approvalStatus === 'pending' && {
                        color: '#F4B740',
                      },
                      loanDetails?.approvalStatus === 'approved' && {
                        color: '#054B99',
                      },
                      loanDetails?.approvalStatus === 'rejected' && {
                        color: '#ED2E7E',
                      },
                      {marginLeft: 11, textTransform: 'capitalize'},
                    ]}>
                    {loanDetails?.approvalStatus}
                  </Text>
                </View>
              </View>
              <View style={styles.demark} />

              <View style={{marginTop: 15}}>
                <Text style={styles.infotext}>PayBack dates</Text>

                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  {loanDetails?.repaymentScheduleDates?.length === 0 && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 20,
                          backgroundColor: '#054B99',
                        }}
                      />
                      <Text style={[styles.values, {marginLeft: 11}]}>
                        00/00/0000
                      </Text>
                    </View>
                  )}
                  {loanDetails?.repaymentScheduleDates?.map((date, i) => (
                    <View
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      key={i}>
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 20,
                          backgroundColor: '#054B99',
                        }}
                      />
                      <Text style={[styles.values, {marginLeft: 11}]}>
                        {date?.length === 0 ? '00/00/0000' : date}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.demark} />

              <View style={{marginTop: 30, marginBottom: 50}}>
                <Text style={styles.values}>More Action</Text>
                <TouchableOpacity onPress={() => openSendEmail(loanIdd)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: '#D9DBE9',
                        borderRadius: 5,
                        marginRight: 8,
                        padding: 2,
                      }}>
                      <MaterialCommunityIcons
                        name="alert-octagon"
                        size={24}
                        color="#ED2E7E"
                      />
                    </View>

                    <View>
                      <Text style={styles.report}>Report Transaction</Text>
                      <Text style={styles.reportdesc}>
                        Report an issue with this transaction
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ViewShot>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoanTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'Montserat',
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
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    borderColor: '#D9DBE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Montserat',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 21,
    color: '#14142B',
  },
  infotext: {
    fontFamily: 'Montserat',
    color: '#6E7191',
    marginBottom: 4,
  },
  values: {
    fontFamily: 'Montserat',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
  },
  report: {
    color: '#ED2E7E',
    fontSize: 14,
    fontFamily: 'Montserat',
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  reportdesc: {
    color: '#6E7191',
    fontFamily: 'Montserat',
    fontSize: 12,
    lineHeight: 18,
  },
});
