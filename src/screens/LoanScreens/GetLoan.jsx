import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Pdf from 'react-native-pdf';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import Buttons from '../../component/buttons/Buttons';
import {createLoan, getDuration, getLoanDetails} from '../../stores/LoanStore';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getGuarantors} from '../../stores/GuarantorStore';

const durationData = [
  {value: '', label: 'Select Duration'},
  {value: '30 days', label: '30 Days'},
  {value: '45 Days', label: '45 Days'},
  {value: '60 Days', label: '60 Days'},
  {value: '90 Days', label: '90 Days'},
  {value: '180 Days', label: '180 Days'},
  {value: '365 Days', label: '365 Days'},
];

const typeData = [
  {value: '', label: 'Select Loan Type'},
  {value: 'Local Purchase Order', label: 'Local Purchase Order'},
  {value: 'Working Capital', label: 'Working Capital'},
];

const reasonData = [
  {value: '', label: 'Select Reason'},
  {value: 'Purchase Inventory', label: 'Purchase Inventory'},
  {value: 'Pay Suppliers', label: 'Pay Suppliers'},
  {value: 'General Working Capital', label: 'General Working Capital'},
  {value: 'Make a Supply', label: 'Make a Supply'},
  {value: 'Discount an Invoice', label: 'Discount an Invoice'},
  {value: 'Other', label: 'Other'},
];

const GetLoan = () => {
  const navigation = useNavigation();
  const source = {uri: 'https://tradelenda.com/LOAN%20POLICY.pdf', cache: true};
  const source2 = {
    uri: 'https://tl-app-production.s3.us-east-2.amazonaws.com/loanterms.pdf',
    cache: true,
  };
  const [showPdf, setShowPdf] = useState(false);
  const [pdfmain, setPdfmain] = useState(true);
  const [pdfTerms, setPdfTerm] = useState(false);
  const [showBut, setShowBut] = useState(false);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState([]);
  // const [profile, setProfile] = useState([]);
  const profile = useSelector(state => state.userProfile.profile);
  const [guarantors, setGuarantors] = useState([]);
  const route = useRoute();

  const handleClosePdf = () => {
    setShowPdf(false);
  };
  const handleCloseMain = () => {
    setPdfmain(false);
  };
  const [loanDetails, setLoanDetails] = useState({
    email: '',
    reason: '',
    loanType: '',
    amount: 0,
    loanTenor: '',
    note: '',
    interest: '',
  });
  const [duration, setDuration] = useState([]);
  const [currentDuration, setCurrentDuration] = useState([]);

  useEffect(() => {
    if (route.name === 'GetLoan') {
      const unsubscribe = navigation.addListener('focus', async () => {
        getLoanDuration();
        getGuarantor();
      });
      return unsubscribe;
    }
  }, []);

  const getLoanDuration = async () => {
    setIsLoading(true);
    const res = await getDuration();
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
      setDuration(res?.data);
    }
    setIsLoading(false);
  };

  const getGuarantor = async () => {
    setIsLoading(true);
    const res = await getGuarantors();
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
      setGuarantors(res?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (loanDetails.amount !== 0 && loanDetails.loanTenor !== '') {
      getLoanDetail(loanDetails.amount, loanDetails.loanTenor);
    }
  }, [loanDetails.amount, loanDetails.loanTenor]);

  const getLoanDetail = async (amount, loanTenor) => {
    setIsLoading(true);
    const res = await getLoanDetails(amount, loanTenor);
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
      setDetails(res?.data);
      // setLoanDetails({...loanDetails, interest: res?.data?.InterestRate});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const Data =
      duration &&
      duration.map((item, index) => {
        return {value: item.name, label: item.name, key: index.name};
      });

    setCurrentDuration(Data);
  }, [duration]);

  useEffect(() => {
    setLoanDetails({
      email: profile?.email === undefined ? '' : profile?.email,
      reason: '',
      loanType: '',
      amount: parseInt(details?.Amount === undefined ? 0 : details?.Amount, 10),
      loanTenor: details?.Tenor === undefined ? '' : details?.Tenor,
      note: '',
      interest:
        details?.InterestRate === undefined ? '' : details?.InterestRate,
    });
  }, [
    profile?.email,
    details?.Amount,
    details?.Tenor,
    details?.InterestRate,
    details?.PaybackSchedule,
  ]);

  const disableit =
    !loanDetails.email ||
    !loanDetails.reason ||
    !loanDetails.loanType ||
    !loanDetails.amount ||
    !loanDetails.loanTenor;

  const handleCreateLoan = async () => {
    if (guarantors.length !== 0) {
      setIsLoading(true);
      const res = await createLoan(loanDetails);
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
        navigation.navigate('Loan');
      }
      setIsLoading(false);
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: 'Get Guarantors',
        text2: 'Please add a guarantor before applying for a loan.',
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      navigation.navigate('AddGuarantors');
    }
  };

  function formatDateArray(dates) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDates = dates?.map(dateString => {
      const date = new Date(dateString);

      return date.toLocaleDateString('en-US', options) + '\n';
    });
    return formattedDates;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {pdfmain ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 15,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#D9DBE9',
                  borderRadius: 5,
                }}>
                <AntDesign name="left" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <View style={styles.HeadView}>
              <View style={styles.TopView}>
                <Text style={styles.TextHead}>Terms and Policy Agreement</Text>
              </View>
            </View>
            <View>
              <Text> </Text>
            </View>
          </View>
          <View style={styles.demark} />
          <Pdf
            trustAllCerts={false}
            source={source2}
            style={styles.pdf}
            onPageChanged={(page, numberOfPages) => {
              {
                page === numberOfPages && setShowBut(true);
              }
            }}
          />
          {showBut && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View>
                <TouchableOpacity
                  style={{margin: 20}}
                  onPress={() => navigation.navigate('Loan')}>
                  <View
                    style={[
                      styles.getLoan,
                      {
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#054B99',
                      },
                    ]}>
                    <Text style={[styles.getText, {color: '#054B99'}]}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={{margin: 20}} onPress={handleCloseMain}>
                <View style={styles.getLoan}>
                  <Text style={styles.getText}>Accept</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          {showPdf ? (
            <>
              <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
              <TouchableOpacity style={{margin: 20}} onPress={handleClosePdf}>
                <Buttons label="Close Policy" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {pdfTerms ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: 15,
                    }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: '#D9DBE9',
                          borderRadius: 5,
                        }}>
                        <AntDesign name="left" size={24} color="black" />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.HeadView}>
                      <View style={styles.TopView}>
                        <Text style={styles.TextHead}>
                          Terms and Policy Agreement
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text> </Text>
                    </View>
                  </View>
                  <View style={styles.demark} />
                  <Pdf
                    trustAllCerts={false}
                    source={source2}
                    style={styles.pdf}
                    onPageChanged={(page, numberOfPages) => {
                      {
                        page === numberOfPages && setShowBut(true);
                      }
                    }}
                  />
                  {showBut && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <View>
                        <TouchableOpacity
                          style={{margin: 20}}
                          onPress={() => setPdfTerm(false)}>
                          <View
                            style={[
                              styles.getLoan,
                              {
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: '#054B99',
                              },
                            ]}>
                            <Text style={[styles.getText, {color: '#054B99'}]}>
                              Close
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {isLoading && (
                    <Spinner
                      textContent={'Loading...'}
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
                      marginHorizontal: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: '#D9DBE9',
                          borderRadius: 5,
                        }}>
                        <AntDesign name="left" size={30} color="black" />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.HeadView}>
                      <View style={styles.TopView}>
                        <Text style={styles.TextHead}>LOAN APPLICATION</Text>
                      </View>
                    </View>
                    <View>
                      <Text> </Text>
                    </View>
                  </View>
                  <View style={styles.demark} />
                  <ImageBackground
                    source={require('../../../assets/signup.png')}
                    resizeMode="stretch"
                    style={styles.image}>
                    <ScrollView
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      style={[styles.innercontainer]}>
                      <View
                        style={{
                          marginTop: 20,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 15,
                          paddingHorizontal: 10,
                          paddingVertical: 15,
                          opacity: 0.86,
                          borderColor: '#D9DBE9',
                          borderWidth: 2,
                          marginBottom: 50,
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#054B99',
                              fontSize: 16,
                              fontFamily: 'serif',
                              // fontWeight: '700',
                              letterSpacing: 0.4,
                              lineHeight: 20,
                            }}>
                            REQUEST NEW LOAN {'\n'}
                          </Text>
                          <Text
                            style={{
                              fontWeight: '400',
                              fontSize: 13,
                            }}>
                            To apply for a loan, please complete the form below.
                            If approved, you will receive a loan offer and the
                            loan term will begin once the money has been
                            deposited into your account. You will be notified of
                            your approval status. {'\n\n'}
                            <Text style={{color: '#054B99', marginLeft: 10}}>
                              <Text
                                onPress={() => setShowPdf(true)}
                                style={{
                                  color: '#054B99',
                                  fontFamily: 'serif',
                                  fontSize: 16,
                                }}>
                                Click here to read our loan policy agreement{' '}
                                {'\n\n'}
                              </Text>
                              <Text
                                onPress={() => setPdfTerm(true)}
                                style={{
                                  color: '#054B99',
                                  fontFamily: 'serif',
                                  fontSize: 16,
                                }}>
                                Click here to read our term agreement
                              </Text>
                            </Text>{' '}
                          </Text>
                        </View>
                        <Input
                          iconName="email-outline"
                          label="Email Address"
                          placeholder="Enter your email"
                          onChangeText={text =>
                            setLoanDetails({...loanDetails, email: text})
                          }
                          autoCorrect={false}
                          autoCapitalize="none"
                          defaultValue={
                            profile?.email === undefined ? '' : profile?.email
                          }
                          disabled
                          isNeeded={true}
                        />
                        <Input
                          iconName="cash"
                          label="How much do you need?"
                          placeholder="Enter amount"
                          keyboardType="numeric"
                          // value={details?.Amount}
                          onChangeText={text =>
                            setLoanDetails({
                              ...loanDetails,
                              amount: parseInt(text, 10),
                            })
                          }
                          isNeeded={true}
                        />

                        <View style={{marginVertical: 10}}>
                          <CustomDropdown
                            label="Loan Duration"
                            isNeeded={true}
                            placeholder="Select Duration"
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            // data={
                            //   currentDuration ? currentDuration : durationData
                            // }
                            data={durationData}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={loanDetails?.loanTenor || ''}
                            onChange={text =>
                              setLoanDetails({
                                ...loanDetails,
                                loanTenor: text.value,
                              })
                            }
                          />
                        </View>

                        {details &&
                          details?.Amount !== undefined &&
                          details?.Tenor !== undefined && (
                            <>
                              <View style={{marginVertical: 10}}>
                                <CustomDropdown
                                  label="Loan Type"
                                  isNeeded={true}
                                  placeholder="Select Loan Type"
                                  placeholderStyle={styles.placeholderStyle}
                                  selectedTextStyle={styles.selectedTextStyle}
                                  data={typeData}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  value={loanDetails?.loanType}
                                  onChange={text =>
                                    setLoanDetails({
                                      ...loanDetails,
                                      loanType: text.value,
                                    })
                                  }
                                />
                              </View>

                              <View style={{marginVertical: 10}}>
                                <Text
                                  style={{
                                    paddingBottom: 4,
                                    fontWeight: '400',
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: '#14142B',
                                  }}>
                                  Interest Rate (Monthly)
                                </Text>
                                <View
                                  style={[
                                    styles.textFeild,
                                    {paddingVertical: 15},
                                  ]}>
                                  <Text style={{fontSize: 16}}>
                                    {/* {details?.InterestRate / details?.PaybackSchedule.length}% */}
                                    {details?.InterestRate}%
                                  </Text>
                                </View>
                              </View>

                              <View style={{marginVertical: 10}}>
                                <CustomDropdown
                                  label="Reason"
                                  isNeeded={true}
                                  placeholder="Select Reason"
                                  placeholderStyle={styles.placeholderStyle}
                                  selectedTextStyle={styles.selectedTextStyle}
                                  data={reasonData}
                                  maxHeight={300}
                                  labelField="label"
                                  valueField="value"
                                  value={loanDetails?.reason}
                                  onChange={text =>
                                    setLoanDetails({
                                      ...loanDetails,
                                      reason: text.value,
                                    })
                                  }
                                />
                              </View>

                              <View style={{marginVertical: 10}}>
                                <Text
                                  style={{
                                    paddingBottom: 4,
                                    fontWeight: '400',
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: '#14142B',
                                  }}>
                                  Payback Amount
                                </Text>
                                <View
                                  style={[
                                    styles.textFeild,
                                    {paddingVertical: 15},
                                  ]}>
                                  <Text style={{fontSize: 16}}>
                                    ₦{' '}
                                    {details?.TotalPaybackAmount
                                      ? new Intl.NumberFormat('en-US', {
                                          style: 'decimal',
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(
                                          parseFloat(
                                            details?.TotalPaybackAmount,
                                          ),
                                        )
                                      : '0.00'}
                                  </Text>
                                </View>
                              </View>

                              <View style={{marginVertical: 10}}>
                                <Text
                                  style={{
                                    paddingBottom: 4,
                                    fontWeight: '400',
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: '#14142B',
                                  }}>
                                  Payback plan
                                </Text>
                                <View
                                  style={[
                                    styles.textFeild,
                                    {paddingVertical: 15},
                                  ]}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                    }}>
                                    Amount to be paid monthly: ₦{' '}
                                    {details?.TotalPaybackAmount &&
                                    details?.PaybackSchedule
                                      ? new Intl.NumberFormat('en-US', {
                                          style: 'decimal',
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(
                                          parseFloat(
                                            details?.TotalPaybackAmount /
                                              details?.PaybackSchedule?.length,
                                          ),
                                        )
                                      : '0.00'}
                                    {'\n'}
                                    <Text
                                      style={{
                                        fontSize: 16,
                                      }}>
                                      Total interest rate:{' '}
                                      {details?.InterestRate}%{' '}
                                    </Text>
                                    {'\n'}
                                    <Text
                                      style={{
                                        fontSize: 16,
                                      }}>
                                      APR: {details?.APR}%{' '}
                                    </Text>
                                    {'\n'}
                                  </Text>
                                  <Text style={{fontSize: 16}}>
                                    {formatDateArray(
                                      // loansStore?.details?.PaybackSchedule,
                                      details?.PaybackSchedule,
                                    )}
                                  </Text>
                                </View>
                              </View>

                              <View>
                                <Text style={styles.label}>Note</Text>
                                <View style={styles.textFeild}>
                                  <TextInput
                                    style={styles.input}
                                    value={loanDetails.note}
                                    onChangeText={text =>
                                      setLoanDetails({
                                        ...loanDetails,
                                        note: text,
                                      })
                                    }
                                  />
                                </View>
                              </View>

                              <Text
                                onPress={() => setShowPdf(true)}
                                style={{
                                  color: '#054B99',
                                  fontFamily: 'serif',
                                  fontSize: 16,
                                  marginTop: 30,
                                }}>
                                Click here to read our loan policy agreement
                              </Text>

                              <Text
                                onPress={() => setPdfTerm(true)}
                                style={{
                                  color: '#054B99',
                                  fontFamily: 'serif',
                                  fontSize: 16,
                                  marginVertical: 30,
                                }}>
                                Click here to read our term agreement
                              </Text>
                            </>
                          )}

                        <TouchableOpacity
                          style={{marginBottom: 20}}
                          disabled={disableit}
                          onPress={handleCreateLoan}>
                          <Buttons label="Submit" disabled={disableit} />
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </ImageBackground>
                </>
              )}
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default GetLoan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pick: {
    marginBottom: 10,
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    // padding:10,
    justifyContent: 'center',
  },

  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  textFeild: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    padding: 10,
    justifyContent: 'center',
  },
  input: {
    color: '#14142B',
    height: 85,
  },
  getLoan: {
    backgroundColor: '#054B99',
    borderRadius: 25,
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    //  paddingHorizontal:12,
  },
  getText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'serif',
    fontSize: 16,
  },
});
