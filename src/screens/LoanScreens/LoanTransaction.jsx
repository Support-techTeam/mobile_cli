import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getLoanById,
  getLoanScheduleById,
  repayLoan,
} from '../../stores/LoanStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import email from 'react-native-email';
import {Header} from '../../component/header/Header';
import Loader from '../../component/loader/loader';
import VerifyModal from '../../component/modals/verifyModal';

const LoanTransactions = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const loanIdd = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState([]);
  const viewShotRef = React.useRef(null);
  const {paramKey, data, type} = route?.params;
  const [loanRepayments, setLoanRepayments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loanPaymentId, setLoanPaymentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    // getLoan();
    getLoanSchedule();
  }, [paramKey, navigation]);

  const getLoan = async () => {
    try {
      setIsLoading(true);
      const res = await getLoanById(loanIdd);
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
        setLoanDetails(res?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getLoanSchedule = async () => {
    const loanId = type === 'paid' ? data.loanId : paramKey;
    if (type === 'paid') {
      const res = await getLoanScheduleById(loanId);
      if (res?.data !== null && res.data !== undefined) {
        setLoanRepayments(res?.data);
      }
    } else if (
      data?.repaymentScheduleDates &&
      data?.repaymentScheduleDates.length > 0 &&
      type !== 'paid'
    ) {
      const res = await getLoanScheduleById(loanId);
      if (res?.data !== null && res.data !== undefined) {
        setLoanRepayments(res?.data);
      }
    } else {
      // console.log('No schedule');
    }
  };

  const openSendEmail = Id => {
    const text = `Hello, I would like to report a loan transaction, with Transaction ID: ${Id}`;

    email('support@tradelenda.com', {
      subject: `Report transaction issue from ${Platform.OS}`,
      body: `${text}`,
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
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
      // console.error('Error sharing:', error);
    }
  };

  function toggleConfirm() {
    setShowConfirm(!showConfirm);
  }

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const res = await repayLoan(loanPaymentId);
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
        getLoanSchedule();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const renderTopIntro = () => {
    return (
      <View style={styles.intro}>
        <View style={[styles.titleView]}>
          <Text style={styles.title}>
            ₦{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(
              type != 'paid' ? Number(data.amount) : Number(data.totalPaidBack),
            )}
          </Text>
          <View style={styles.statusView}>
            <View style={styles.status} />
          </View>
          <View style={styles.body}>
            <View style={[styles.leftView]}>
              <Text style={styles.infotext}>Amount</Text>
            </View>
            <View style={[styles.rightView]}>
              <Text style={styles.values}>
                ₦{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  type != 'paid'
                    ? Number(data.amount)
                    : Number(data.totalPaidBack),
                )}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={[styles.leftView]}>
              <Text style={styles.infotext}>Status</Text>
            </View>
            <View style={[styles.rightView]}>
              <Text style={styles.values}>
                {type === 'paid'
                  ? data.status.toUpperCase()
                  : data?.approvalStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLoanDetails = () => {
    return (
      <View style={styles.details}>
        <View style={styles.detailsView}>
          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Application Date</Text>
            </View>
            <View style={styles.rightView}>
              <Text style={styles.values}>
                <Text style={{fontWeight: 'bold'}}>
                  {' '}
                  {data?.createdAt?.substr(0, 10)}
                </Text>{' '}
              </Text>
            </View>
          </View>

          {data?.dateOfApproval && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Approval Date</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>
                  <Text style={{fontWeight: 'bold'}}>
                    {' '}
                    {data?.dateOfApproval?.substr(0, 10)}
                  </Text>{' '}
                </Text>
              </View>
            </View>
          )}
          {data?.loanType && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Loan Type</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{data?.loanType}</Text>
              </View>
            </View>
          )}
          {data?.reason && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Reason for Loan</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{data?.reason}</Text>
              </View>
            </View>
          )}
          {data?.loanTenor && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Loan Tenor</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{data?.loanTenor}</Text>
              </View>
            </View>
          )}
          {data?.interest && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Interest</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{data?.interest}%</Text>
              </View>
            </View>
          )}
          {data?.monthlyRepaymentAmount && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Monthly Repayment</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>
                  {' '}
                  ₦{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(data?.monthlyRepaymentAmount))}
                </Text>
              </View>
            </View>
          )}
          {data?.totalrepaymentAmount && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Total Repayment</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>
                  {' '}
                  ₦{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(data?.totalrepaymentAmount))}
                </Text>
              </View>
            </View>
          )}
          {data?.totalInterestAmount && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Total Interest</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>
                  {' '}
                  ₦{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(data?.totalInterestAmount))}
                </Text>
              </View>
            </View>
          )}
          {data?.paybackDate && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Last Repayment Date</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>
                  <Text style={{fontWeight: 'bold'}}>
                    {' '}
                    {data?.paybackDate?.substr(0, 10)}
                  </Text>
                </Text>
              </View>
            </View>
          )}
          {loanRepayments && loanRepayments.length > 0 && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Repayment Schedule</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}> </Text>
              </View>
            </View>
          )}

          {loanRepayments &&
            loanRepayments.length > 0 &&
            loanRepayments?.map((item, i) => (
              <View style={[styles.body, {alignItems: 'center'}]} key={i}>
                <View style={[styles.leftView, {flexDirection: 'row'}]}>
                  <Text style={styles.infotext}>
                    {item?.paybackDate?.substr(0, 10)} |{' '}
                  </Text>
                  <Text style={styles.infotext}>₦</Text>
                  <Text style={styles.infotext}>
                    {item?.status === 'new'
                      ? item?.amount
                        ? new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(item?.amount))
                        : '0.00'
                      : item?.totalPaidBack
                      ? new Intl.NumberFormat('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(item?.totalPaidBack))
                      : '0.00'}
                  </Text>
                </View>
                <View style={[styles.rightView]}>
                  <TouchableOpacity
                    disabled={item?.status === 'paid' ? true : false}
                    onPress={() => {
                      setLoanPaymentId(item?._id);
                      setPaymentAmount(item?.amount);
                      toggleConfirm(true);
                    }}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor:
                          item?.status === 'paid'
                            ? COLORS.lendaBlue
                            : COLORS.white,
                        backgroundColor:
                          item?.status === 'paid'
                            ? COLORS.white
                            : COLORS.lendaBlue,
                        borderRadius: 5,
                        padding: 2,
                        paddingHorizontal: 8,
                        flexDirection: 'row',
                        height: 30,
                        minWidth: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View>
                        {item?.status === 'paid' ? (
                          <Text
                            style={[styles.report, {color: COLORS.lendaBlue}]}>
                            Paid
                          </Text>
                        ) : (
                          <Text style={[styles.report, {color: COLORS.white}]}>
                            Pay now
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {data?.note && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Remark</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{data?.note}</Text>
              </View>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Loan Ref</Text>
            </View>
            <View style={styles.rightView}>
              <TouchableWithoutFeedback
                onPress={() => handleLongPress(paramKey)}>
                <Text style={styles.values}>{paramKey}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Icon
                  size={17}
                  color={COLORS.lendaBlue}
                  name="content-copy"
                  style={{marginLeft: 4}}
                  onPress={() => handleLongPress(paramKey)}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <View style={styles.footerView}>
          <View style={styles.footerBody}>
            <Text style={[styles.values, {textAlign: 'left'}]}>
              More Actions
            </Text>

            <View
              style={[
                styles.body,
                {
                  paddingHorizontal: 0,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 10,
                },
              ]}>
              <View>
                <TouchableOpacity onPress={() => shareToSocialMedia()}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: COLORS.lendaBlue,
                      backgroundColor: COLORS.lendaBlue,
                      borderRadius: 5,
                      padding: 2,
                      flexDirection: 'row',
                      width: wp('40%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                      }}>
                      <Icon name="share" size={24} color="#fff" />
                    </View>

                    <View>
                      <Text style={[styles.report, {color: '#fff'}]}>
                        Share Record
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => openSendEmail(paramKey)}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: COLORS.lendaBlue,
                      backgroundColor: COLORS.white,
                      borderRadius: 5,
                      padding: 2,
                      flexDirection: 'row',
                      width: wp('40%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                      }}>
                      <Icon
                        name="alert-octagon"
                        size={24}
                        color={COLORS.highwayRed}
                      />
                    </View>

                    <View>
                      <Text style={styles.report}>Report an issue</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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
      <Header
        routeAction={() => navigation.goBack()}
        heading="LOAN DETAILS"
        disable={false}
      />
      <Loader visible={isLoading} loadingText={'Processing payment...'} />

      <VerifyModal visible={showConfirm}>
        <View style={{alignItems: 'center'}}>
          <Icon
            name="help-circle"
            size={45}
            color={COLORS.lendaGreen}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
          <Text
            style={[styles.resetPinText, {fontSize: 24, fontFamily: 'serif'}]}>
            Loan Repayment!
          </Text>
          <Text style={styles.question}>
            Are you sure you want to process loan repayment ₦{paymentAmount}?
          </Text>

          <TouchableOpacity
            style={styles.signUpactivity}
            onPress={() => {
              toggleConfirm();
              handlePayment();
            }}>
            <Text style={styles.confirmText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleConfirm();
            }}
            style={[
              styles.signUpactivity,
              {
                borderColor: '#054B99',
                backgroundColor: '#fff',
                borderWidth: 1,
              },
            ]}>
            <Text style={[styles.confirmText, {color: '#054B99'}]}>No</Text>
          </TouchableOpacity>
        </View>
      </VerifyModal>

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
            style={[
              styles.container,
              {
                backgroundColor: '#fff',
                flexGrow: 1,
                height: '100%',
                marginBottom: 20,
              },
            ]}>
            {renderTopIntro()}
            {renderLoanDetails()}
            {renderFooter()}
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
  intro: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // width: wp('90%'),
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
    height: hp('22%'),
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: wp('90%'),
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
    height: 'auto',
    paddingVertical: 10,
  },
  footerBody: {
    paddingHorizontal: 10,
    width: wp('90%'),
    marginVertical: 4,
  },
  footerView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
  },
  details: {
    paddingVertical: 10,
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
  },
  detailsView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
    gap: 15,
  },
  body: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rightView: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  leftView: {
    flexGrow: 1,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    height: 12,
    width: 12,
    borderRadius: 20,
    marginRight: 10,
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
  titleView: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    color: '#14142B',
  },
  infotext: {
    color: '#6E7191',
    marginBottom: 4,
    fontSize: hp('1.8%'),
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  values: {
    fontSize: hp('1.8%'),
    color: '#000',
    fontWeight: '600',
    textAlign: 'right',
    justifyContent: 'center',
    alignItems: 'center',
  },
  report: {
    color: COLORS.lendaBlue,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  reportdesc: {
    color: '#6E7191',
    fontSize: 12,
    lineHeight: 18,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpactivity: {
    backgroundColor: COLORS.lendaBlue,
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signOutView: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
