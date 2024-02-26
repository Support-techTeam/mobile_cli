import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createBankDetails,
  getLoanUserDetails,
  updateBankDetails,
} from '../../stores/LoanStore';
import {getAllBankDetails} from '../../stores/WalletStore';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Loader from '../../component/loader/loader';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const defaultData = [
  {value: '', label: 'Select Option'},
  {value: '', label: 'N/A'},
];

const onlinebankData = [
  {value: '', label: 'Select Option'},
  {value: true, label: 'Yes'},
  {value: false, label: 'No'},
];

const BankDetails = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [bankDeets, setBankDeets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const route = useRoute();
  const curentRoute = route.name;
  const previousRoute = navigation.getState()?.routes.slice(-2)[0]?.name;
  const [currentBanks, setCurrentBanks] = useState(undefined);

  useEffect(() => {
    if (route.name === 'BankDetails') {
      const unsubscribe = navigation.addListener('focus', async () => {
        unSubBankDetails();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    unSubBankDetails();
  }, []);

  const unSubBankDetails = async () => {
    try {
      setIsLoading(true);
      const res = await getLoanUserDetails();
      if (res?.error) {
        // TODO: handle error
      } else {
        setBankDeets(res?.data?.bankDetails);
      }
      setIsLoading(false);
    } catch (e) {}
  };

  const [bankDetails, setBankDetails] = useState({
    email: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    hasOnlineBanking: true,
    wasLoanTakenWithinTheLast12Months: false,
    loanAmount: '',
  });

  useEffect(() => {
    setBankDetails({
      email: bankDeets && bankDeets?.email === undefined ? '' : '',
      bankName:
        bankDeets && bankDeets?.bankName === undefined
          ? ''
          : bankDeets?.bankName,
      bankAccountNumber:
        bankDeets && bankDeets?.bankAccountNumber === undefined
          ? ''
          : bankDeets?.bankAccountNumber,
      bankAccountName:
        bankDeets && bankDeets?.bankAccountName === undefined
          ? ''
          : bankDeets?.bankAccountName,
      hasOnlineBanking:
        bankDeets && bankDeets?.hasOnlineBanking === undefined
          ? true
          : bankDeets?.hasOnlineBanking,
      wasLoanTakenWithinTheLast12Months:
        bankDeets && bankDeets?.wasLoanTakenWithinTheLast12Months === undefined
          ? false
          : bankDeets?.wasLoanTakenWithinTheLast12Months,
      loanAmount:
        bankDeets && bankDeets?.loanAmount === undefined
          ? ''
          : bankDeets?.loanAmount,
    });
  }, [bankDeets, navigation]);

  const [credailsDetails, setCredailsDetails] = React.useState({
    email: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const disableit =
    !bankDetails.bankName ||
    // !bankDetails.email ||
    !bankDetails.bankAccountNumber ||
    !bankDetails.bankAccountName ||
    !bankDetails.hasOnlineBanking;

  const onEmailChange = text => {
    setBankDetails({...bankDetails, email: text});
    setCredailsDetails({...credailsDetails, email: text});
  };

  const onBankNameChange = text => {
    setBankDetails({...bankDetails, bankName: text});
    setCredailsDetails({...credailsDetails, bankName: text});
  };

  const onBankAccountNameChange = text => {
    setBankDetails({...bankDetails, bankAccountName: text});
    setCredailsDetails({...credailsDetails, bankAccountName: text});
  };

  const onBankAccountNumberChange = text => {
    setBankDetails({...bankDetails, bankAccountNumber: text});
    setCredailsDetails({...credailsDetails, bankAccountNumber: text});
  };

  const handleCreateBankDetails = async () => {
    try {
      setIsUpdating(true);
      const res = await createBankDetails(bankDetails);
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
          if (previousRoute !== 'MyAccount') {
            navigation.navigate('ValidIndentity');
          } else {
            navigation.navigate('MyAccount');
          }
        }, 1000);
      }
      setIsUpdating(false);
    } catch (e) {
      setIsUpdating(false);
    }
  };

  const handleUpdateBankDetails = async () => {
    try {
      setIsUpdating(true);
      const res = await updateBankDetails(bankDetails);
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
          if (previousRoute !== 'MyAccount') {
            navigation.navigate('ValidIdentity');
          } else {
            navigation.navigate('MyAccount');
          }
        }, 1000);
      }
      setIsUpdating(false);
    } catch (e) {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    handleGetAllBanks();
  }, []);

  const handleGetAllBanks = async () => {
    try {
      const res = await getAllBankDetails();
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        const bankData = res?.data?.map((banks, i) => {
          return {value: banks?.bankName, label: banks?.bankName, key: i};
        });

        if (currentBanks == undefined || currentBanks == '') {
          setCurrentBanks(bankData);
        }
      }
    } catch (e) {}
  };

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
       <Loader visible={isUpdating} loadingText={'Please wait...'} />
       <Loader visible={isLoading} loadingText={'Please wait...'} />
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
        <View style={[styles.HeadView, {justifyContent: 'center', flex: 1}]}>
          <View style={styles.TopView}>
            <Text style={[styles.TextHead, {marginBottom: 5}]}>
              BANK DETAILS
            </Text>
          </View>

          <View>
            <Image source={require('../../../assets/images/indicator4.png')} />
          </View>
        </View>
      </View>
      <View style={[styles.form, {marginBottom: 10, justifyContent: 'center'}]}>
        <Text style={styles.header}>
          Industry regulation requires us to collect this information to verify
          your identity.
        </Text>
        <Text style={[styles.header, {color: 'red'}]}>
          *Please enter your valid bank account details*
        </Text>
      </View>
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../assets/signup.png')}
          resizeMode="cover"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
              marginTop: 10,
              marginBottom: insets.top + 60,
            }}>
            <View
              style={{
                paddingTop: 25,
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                paddingHorizontal: 15,
                paddingVertical: 15,
                opacity: 0.86,
                borderColor: '#D9DBE9',
                borderWidth: 2,
              }}>
              {/* <Input
              iconName="email-outline"
              label="Email"
              placeholder="Enter email"
              keyboardType="email-address"
              defaultValue={bankDetails?.email}
              onChangeText={text => onEmailChange(text)}
              isNeeded={true}
              autoCapitalize="none"
            /> */}
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Bank Name"
                  isNeeded={true}
                  iconName="bank-outline"
                  placeholder="Select Bank"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  search
                  data={currentBanks ? currentBanks : defaultData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={bankDetails?.receiverBankName}
                  onChange={text => onBankNameChange(text.value)}
                />
              </View>
              <Input
                label="Bank account name"
                placeholder="Enter account name"
                defaultValue={bankDetails?.bankAccountName}
                onChangeText={text => onBankAccountNameChange(text)}
                isNeeded={true}
              />
              <Input
                label="Bank account number"
                placeholder="Enter account number"
                keyboardType="numeric"
                defaultValue={bankDetails?.bankAccountNumber}
                onChangeText={text => onBankAccountNumberChange(text)}
                isNeeded={true}
              />

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Do you use online banking?"
                  isNeeded={true}
                  placeholder="Select Option"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={onlinebankData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={bankDetails?.hasOnlineBanking}
                  onChange={text =>
                    setBankDetails({
                      ...bankDetails,
                      hasOnlineBanking:
                        text.value === false
                          ? Toast.show({
                              type: 'error',
                              position: 'top',
                              topOffset: 50,
                              text1: 'Online Banking',
                              text2:
                                'Please open a mobile application with your bank to continue with this process!',
                              visibilityTime: 5000,
                              autoHide: true,
                              onPress: () => Toast.hide(),
                            })
                          : true,
                    })
                  }
                />
              </View>
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Have you taken a loan in the past 12months?"
                  isNeeded={true}
                  placeholder="Select Option"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={onlinebankData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={bankDetails?.wasLoanTakenWithinTheLast12Months}
                  onChange={text =>
                    setBankDetails({
                      ...bankDetails,
                      wasLoanTakenWithinTheLast12Months: text.value,
                    })
                  }
                />
              </View>
              <Input
                label="If yes, how much?"
                keyboardType="numeric"
                placeholder="Enter loan amount"
                defaultValue={bankDetails?.loanAmount}
                onChangeText={text =>
                  setBankDetails({...bankDetails, loanAmount: text})
                }
              />
              <TouchableOpacity
                onPress={
                  bankDeets?.email === undefined
                    ? handleCreateBankDetails
                    : handleUpdateBankDetails
                }
                disabled={disableit}>
                <View style={{marginBottom: 40, marginTop: 20}}>
                  <Buttons label="Save & Continue" disabled={disableit} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default BankDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  image: {
    // height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
  },
  inputSearchStyle: {
    borderColor: 'gray',
    height: 40,
    fontSize: 16,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  HeadView: {
    alignItems: 'center',
    marginTop: 34,
    // backgroundColor:'blue'
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  extraText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    color: '#14142B',
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
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    // borderWidth:.5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',

    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  extraView: {
    alignItems: 'center',
    marginTop: 30,
  },
  extra: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontWeight: '500',
  },
  continue: {
    marginVertical: 30,
    backgroundColor: '#054B99',
    width: '50%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonetextContainer: {
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 0,
    // alignItems:'center',
    height: 30,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 1,
  },
  phoneContainer: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    marginTop: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonetext: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
});
