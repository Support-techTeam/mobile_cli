import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
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
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getLoanUserDetails, createArmDetails} from '../../stores/LoanStore';
import data from '../../constants/data.json';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const politicalViewData = [
  {value: '', label: 'Select Option'},
  {value: 'Yes', label: 'Yes'},
  {value: 'No', label: 'No'},
];

const ArmDetails = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [armDeets, setArmDeets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const route = useRoute();
  const previousRoute = navigation.getState()?.routes.slice(-2)[0]?.name;
  const [show, setShow] = useState(false);
  const [showOne, setShowOne] = useState(false);
  const date = new Date(2000, 0, 1);

  useEffect(() => {
    if (route.name === 'ArmDetails') {
      const unsubscribe = navigation.addListener('focus', async () => {
        unSubArmDetails();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    unSubArmDetails();
  }, []);

  const unSubArmDetails = async () => {
    try {
      setIsLoading(true);
      const res = await getLoanUserDetails();
      if (res?.error) {
        // TODO: handle error
      } else {
        setArmDeets(res?.data?.armUserBankDetails);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const [armDetails, setArmDetails] = useState({
    annualExpectedAnnualIncomeRange: '',
    politicallyExposedPersons: '',
    politicallyExposedPersonsCategory: '',
    employmentStatus: '',
    kycLevel: '',
    idType: '',
    issueDateOfId: '',
    expiryDateOfId: '',
    utilityBillIdType: '',
    reInvestDividends: 'Yes',
    expiryDateOfUtilityBill: new Date(),
    cardNumber: '000000000',
  });

  useEffect(() => {
    setArmDetails({
      annualExpectedAnnualIncomeRange:
        armDeets && armDeets?.annualExpectedAnnualIncomeRange === undefined
          ? ''
          : armDeets?.annualExpectedAnnualIncomeRange,
      politicallyExposedPersons:
        armDeets && armDeets?.politicallyExposedPersons === undefined
          ? ''
          : armDeets?.politicallyExposedPersons,
      politicallyExposedPersonsCategory:
        armDeets && armDeets?.politicallyExposedPersonsCategory === undefined
          ? ''
          : armDeets?.politicallyExposedPersonsCategory,
      employmentStatus:
        armDeets && armDeets?.employmentStatus === undefined
          ? ''
          : armDeets?.employmentStatus,
      kycLevel:
        armDeets && armDeets?.kycLevel === undefined
          ? true
          : armDeets?.kycLevel,
      idType:
        armDeets && armDeets?.idType === undefined ? false : armDeets?.idType,
      issueDateOfId:
        armDeets && armDeets?.issueDateOfId === undefined
          ? ''
          : armDeets?.issueDateOfId,
      expiryDateOfId:
        armDeets && armDeets?.expiryDateOfId === undefined
          ? ''
          : armDeets?.expiryDateOfId,
      utilityBillIdType:
        armDeets && armDeets?.utilityBillIdType === undefined
          ? ''
          : armDeets?.utilityBillIdType,
      reInvestDividends: 'Yes',
      expiryDateOfUtilityBill: new Date(),
      cardNumber: '000000000',
    });
  }, [armDeets, navigation]);

  const disableit =
    !armDetails?.annualExpectedAnnualIncomeRange ||
    !armDetails?.politicallyExposedPersons ||
    !armDetails?.employmentStatus ||
    !armDetails?.kycLevel ||
    !armDetails?.idType ||
    !armDetails?.issueDateOfId ||
    !armDetails?.expiryDateOfId ||
    !armDetails?.utilityBillIdType;

  const handleCreateArmDetails = async () => {
    try {
      setIsUpdating(true);
      const res = await createArmDetails(armDetails);
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

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const showDatePicker1 = () => {
    setShowOne(true);
  };

  const hideDatePicker1 = () => {
    setShowOne(false);
  };

  const handleConfirm = selectedDate => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setArmDetails({...armDetails, issueDateOfId: formattedDate});
    setShow(false);
  };

  const handleConfirm2 = selectedDate => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setArmDetails({...armDetails, expiryDateOfId: formattedDate});
    setShowOne(false);
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
      {isUpdating && (
        <Spinner
          textContent={'Please wait...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
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
              ARM DETAILS
            </Text>
          </View>

          <View>
            <Image source={require('../../../assets/images/indicator4.png')} />
          </View>
        </View>
      </View>
      <View style={[styles.form, {marginBottom: 10, justifyContent: 'center'}]}>
        <Text style={styles.header}>
          Industry regulation requires us to collect this information to begin
          investment.
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
              marginBottom: insets.top + 116,
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
              <View style={{marginVertical: 0}}>
                {armDetails?.kycLevel == 'Tier-1' && (
                  <View
                    style={{
                      backgroundColor: 'aliceblue',
                      padding: 10,
                      borderRadius: 10,
                    }}>
                    <View>
                      <Text style={{fontSize: 12}}>
                        {armDetails?.kycLevel} Investment Conditions
                      </Text>
                      <Text style={{fontSize: 12}}>
                        maximumSingleInvestmentAmount:{' '}
                        {data.kycLevel.map((item, key) => {
                          if (item.level === armDetails?.kycLevel) {
                            return (
                              <Text key={key}>
                                {item.maximumSingleInvestmentAmount}
                              </Text>
                            );
                          }
                        })}{' '}
                        | maximumSingleRedemptionAmount:{' '}
                        {data?.kycLevel.map((item, key) => {
                          if (item.level === armDetails?.kycLevel) {
                            return (
                              <Text key={key}>
                                {item?.maximumSingleRedemptionAmount}
                              </Text>
                            );
                          }
                        })}{' '}
                        | maximumCumulativeInvestmentAmount:{' '}
                        {data?.kycLevel.map((item, key) => {
                          if (item?.level === armDetails?.kycLevel) {
                            return (
                              <Text key={key}>
                                {item?.maximumCumulativeInvestmentAmount}
                              </Text>
                            );
                          }
                        })}
                      </Text>
                    </View>
                  </View>
                )}
                <CustomDropdown
                  label="KYC Level"
                  isNeeded={true}
                  placeholder="Select Option"
                  data={data.kycLevel}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.kycLevel}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      kycLevel: option.value,
                    });
                  }}
                />
              </View>
              <View style={{marginVertical: 0}}>
                <CustomDropdown
                  label="Employment Status"
                  isNeeded={true}
                  placeholder="Select Option"
                  search
                  data={data.employmentStatuses}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.employmentStatus}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      employmentStatus: option.value,
                    });
                  }}
                />
              </View>
              <View style={{marginVertical: 0}}>
                <CustomDropdown
                  label="Annual Expected Income Range"
                  isNeeded={true}
                  placeholder="Select Option"
                  search
                  data={data.incomeRanges}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.annualExpectedAnnualIncomeRange}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      annualExpectedAnnualIncomeRange: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 0}}>
                <CustomDropdown
                  label="Politically Exposed Person"
                  isNeeded={true}
                  placeholder="Select Option"
                  data={politicalViewData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.politicallyExposedPersons}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      politicallyExposedPersons: option.value,
                    });
                  }}
                />
              </View>

              {armDetails?.politicallyExposedPersons === 'Yes' && (
                <View style={{marginVertical: 0}}>
                  <CustomDropdown
                    label="Politically Exposed Persons Category"
                    placeholder="Select Option"
                    search
                    data={data?.politicallyExposedPersonsCategory}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={armDetails?.politicallyExposedPersonsCategory}
                    onChange={option => {
                      setArmDetails({
                        ...armDetails,
                        politicallyExposedPersonsCategory: option.value,
                      });
                    }}
                  />
                </View>
              )}

              <View style={{marginVertical: 0}}>
                <CustomDropdown
                  label="Identity Type"
                  isNeeded={true}
                  placeholder="Select Option"
                  data={data?.idTypes}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.idType}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      idType: option.value,
                    });
                  }}
                />
              </View>

              <Pressable onPress={showDatePicker}>
                <Input
                  label="Date Of Issue"
                  iconName="calendar-month-outline"
                  placeholder="2000-01-01"
                  defaultValue={
                    armDetails.issueDateOfId
                      ? armDetails.issueDateOfId.toString()
                      : ''
                  }
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                  onChangeValue={text =>
                    setArmDetails({...armDetails, issueDateOfId: text})
                  }
                  isNeeded={true}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={show}
                testID="dateTimePicker"
                defaultValue={armDetails.issueDateOfId}
                mode="date"
                is24Hour={true}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                textColor="#054B99"
              />

              <Pressable onPress={showDatePicker1}>
                <Input
                  label="Date Of Expiry"
                  iconName="calendar-month-outline"
                  placeholder="2000-01-01"
                  defaultValue={
                    armDetails.expiryDateOfId
                      ? armDetails.expiryDateOfId.toString()
                      : ''
                  }
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker1}
                  onChangeValue={text =>
                    setArmDetails({...armDetails, expiryDateOfId: text})
                  }
                  isNeeded={true}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={showOne}
                testID="dateTimePicker"
                defaultValue={armDetails.expiryDateOfId}
                mode="date"
                is24Hour={true}
                onConfirm={handleConfirm2}
                onCancel={hideDatePicker1}
                textColor="#054B99"
              />

              <View style={{marginVertical: 0}}>
                <CustomDropdown
                  label="Type Of Utility Bill"
                  isNeeded={true}
                  placeholder="Select Option"
                  data={data?.utilityBillTypes}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={armDetails?.utilityBillIdType}
                  onChange={option => {
                    setArmDetails({
                      ...armDetails,
                      utilityBillIdType: option.value,
                    });
                  }}
                />
              </View>

              <View
                style={{
                  marginBottom: 40,
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (previousRoute !== 'MyAccount') {
                      navigation.navigate('ValidIdentity');
                    } else {
                      navigation.navigate('MyAccount');
                    }
                  }}
                  disabled={disableit}>
                  <View style={{width: wp(20)}}>
                    <Buttons label="Skip" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateArmDetails}
                  disabled={disableit}>
                  <View style={{width: wp(60)}}>
                    <Buttons label="Save & Continue" disabled={disableit} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default ArmDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
