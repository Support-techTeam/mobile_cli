import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../../component/inputField/input.component';
import CustomDropdown from '../../../component/dropDown/dropdown.component';
import Toast from 'react-native-toast-message';
import {
  createUserProfile,
  getCity,
  getState,
} from '../../../stores/ProfileStore';
import {createBusinessDetails} from '../../../stores/LoanStore';
import KeyboardAvoidingWrapper from '../../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../component/buttons/CustomButtons';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../../constants/colors';
const countryList = require('country-list');
import {SelectList} from 'react-native-dropdown-select-list';
import Loader from '../../../component/loader/loader';

const businessTypeData = [
  {value: '', label: 'Select type'},
  {value: 'Sole Proprietorship', label: 'Sole Proprietorship'},
  {value: 'Private Limited Company', label: 'Private Limited Company'},
  {value: 'Public Limited Company', label: 'Public Limited Company'},
  {
    value: 'Public Company Limited by Guarantee',
    label: 'Public Company Limited by Guarantee',
  },
  {value: 'Private Unlimited Company', label: 'Private Unlimited Company'},
  {value: 'Others', label: 'Others'},
];

const businessRegData = [
  {value: '', label: 'Select Option'},
  {value: true, label: 'Yes'},
  {value: false, label: 'No'},
];

const stateData = [
  {value: '', label: 'Select State'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria'},
  {value: '', label: 'N/A'},
];

const cityData = [
  {value: '', label: 'Select LGA'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria'},
  {value: '', label: 'N/A'},
];

const ownedOrRentedData = [
  {value: '', label: 'Select Option'},
  {value: 'Owned', label: 'Owned'},
  {value: 'Rented', label: 'Rented'},
];

const womanLedData = [
  {value: '', label: 'Select Option'},
  {value: true, label: 'Yes'},
  {value: false, label: 'No'},
];

const sharComData = [
  {value: '', label: 'Select Option'},
  {value: true, label: 'Yes'},
  {value: false, label: 'No'},
];

const salesMethodData = [
  {value: '', label: 'Select Option'},
  {
    value: 'I sell online (Jumia, Konga etc)',
    label: 'I sell online (Jumia, Konga etc)',
  },
  {value: 'I distribute FMCG Goods', label: 'I distribute FMCG Goods'},
  {
    value: 'I buy and sell Agro-Commodities',
    label: 'I buy and sell Agro-Commodities',
  },
  {value: 'I have a physical shop', label: 'I have a physical shop'},
  {value: 'Others', label: 'Others'},
];

const industryData = [
  {value: '', label: 'Select Industry'},
  {value: 'Agriculture', label: 'Agriculture'},
  {value: 'Autos', label: 'Autos'},
  {value: 'Agency Banking', label: 'Agency Banking'},
  {value: 'Beauty products', label: 'Beauty products'},
  {value: 'Consulting Services', label: 'Consulting Services'},
  {value: 'Education', label: 'Education'},
  {value: 'Electronics', label: 'Electronics'},
  {value: 'Fashion', label: 'Fashion'},
  {value: 'Food and Beverages', label: 'Food and Beverages'},
  {value: 'Furniture and Fittings', label: 'Furniture and Fittings'},
  {value: 'Health and Pharma Products', label: 'Health and Pharma Products'},
  {value: 'Home Services', label: 'Home Services'},
  {value: 'Industrial goods', label: 'Industrial goods'},
  {value: 'Media and Entertainment', label: 'Media and Entertainment'},
  {value: 'Office supplies', label: 'Office supplies'},
  {value: 'Packaging and Plastics', label: 'Packaging and Plastics'},
  {value: 'Personal Care', label: 'Personal Care'},
  {value: 'Professional Services', label: 'Professional Services'},
  {value: 'Technology Services', label: 'Technology Services'},
  {value: 'Utility Services', label: 'Utility Services'},
  {value: 'Others', label: 'Others'},
];

const monthlySalesData = [
  {value: '', label: 'Select Option'},
  {value: 'Less than ₦10,000', label: 'Less than ₦10,000'},
  {value: '₦10,000 to ₦100,000', label: '₦10,000 to ₦100,000'},
  {value: '₦100,000 to ₦500,000', label: '₦100,000 to ₦500,000'},
  {value: '₦500,000 to ₦1,000,000', label: '₦500,000 to ₦1,000,000'},
  {value: 'Above ₦1,000,000', label: 'Above ₦1,000,000'},
];

const businessDurationData = [
  {value: '', label: 'Select Option'},
  {value: '0-1 years', label: '0-1 years'},
  {value: '1-3 years', label: '1-3 years'},
  {value: '3-5 years', label: '3-5 years'},
  {value: '5-10 years', label: '5-10 years'},
  {value: '10+ years', label: '10+ years'},
];

const monthlyExpData = [
  {value: '', label: 'Select Option'},
  {value: 'Less than ₦10,000', label: 'Less than ₦10,000'},
  {value: '₦10,000 to ₦100,000', label: '₦10,000 to ₦100,000'},
  {value: '₦100,000 to ₦500,000', label: '₦100,000 to ₦500,000'},
  {value: '₦500,000 to ₦1,000,000', label: '₦500,000 to ₦1,000,000'},
  {value: 'Above ₦1,000,000', label: 'Above ₦1,000,000'},
];

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

let fetchedCity = [
  {value: '', label: '...Select LGA'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria', key: 0},
];
let currentState = [
  {value: '', label: '...Select State'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria', key: 0},
];

const BusinessDetails = props => {
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const date = new Date(2000, 0, 1);
  const addressDate = new Date(2000, 0, 1);
  const [isLoading, setIsLoading] = useState(false);
  const countries = countryList.getData().map(country => ({
    value: country.name,
    label: country.name,
  }));
  const [businessDetails, setBusinessDetails] = useState({
    businessType: '',
    businessName: '',
    positionInOrg: '',
    shareInOrg: '',
    rcNum: '',
    establishmentDate: '',
    businessAddress: '',
    country: 'Nigeria',
    state: '',
    city: '',
    ownedOrRented: '',
    NoOfOutlets: 0,
    totalEmployees: 0,
    salesMethod: '',
    industry: '',
    monthlySales: '',
    monthlyExpenses: '',
    businessDuration: '',
    womenLed: false,
    shariaCom: false,
    tin: '',
    registered: false,
    MAMERT: '',
    whenDidYouMoveToThisBusinessLocation: '',
  });
  const {next, saveState, back, retrieveState, finish} = props;
  const [totalSteps, setTotalSteps] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setTotalSteps(props.getTotalSteps());
    setCurrentStep(props.getCurrentStep());
  }, []);

  const goBack = () => {
    back();
  };

  const finishStep = () => {
    saveState(null);
    finish();
  };

  const disableit =
    !businessDetails.businessType ||
    !businessDetails.businessName ||
    !businessDetails.businessAddress ||
    !businessDetails.state ||
    !businessDetails.city ||
    !businessDetails.positionInOrg ||
    !businessDetails.totalEmployees ||
    !businessDetails.industry ||
    !businessDetails.monthlyExpenses ||
    !businessDetails.monthlySales;

  const showDatePicker = () => {
    setShow(true);
  };

  const showAddressDatePicker = () => {
    setShowDate(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const hideAddressDatePicker = () => {
    setShowDate(false);
  };

  const handleConfirm = selectedDate => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setBusinessDetails({...businessDetails, establishmentDate: formattedDate});
    setShow(false);
  };

  const handleConfirmAddressDate = selectedDate => {
    const currentDate = selectedDate || addressDate;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setBusinessDetails({
      ...businessDetails,
      whenDidYouMoveToThisBusinessLocation: formattedDate,
    });
    setShowDate(false);
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    createUserProfile(retrieveState()?.profileData)
      .then(async res => {
        if (res?.data?.error) {
          Toast.show({
            type: 'error',
            position: 'top',
            topOffset: 50,
            text1: res?.data?.title,
            text2: res?.data?.message,
            visibilityTime: 5000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
        } else {
          await handleCreateBusinessDetails();
        }
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'PROFILE CREATION',
          text2: err?.message || err?.data?.message || 'Something went wrong',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateBusinessDetails = async () => {
    try {
      setIsLoading(true);
      const res = await createBusinessDetails(businessDetails);
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
        finishStep();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  //set State
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await getState();
        if (res?.data !== undefined) {
          res?.data &&
            res?.data?.length > 0 &&
            res?.data.map((item, index) => {
              currentState.push({
                value: item,
                label: item,
                key: index + 1,
              });
            });
        }
      } catch (error) {
        // console.error(error);
      }
    };

    fetchState();
    return () => {
      fetchState();
    };
  }, []);

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
      <Loader visible={isLoading} loadingText={'Loading...'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (retrieveState()?.routeType === 'onboarding') {
              back();
            } else {
              navigation.goBack();
            }
          }}></TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}> BUSINESS DETAILS</Text>
          </View>
          <Text style={[styles.extraText]}>
            Trade Lenda requires this information to give you a better
            experience
          </Text>
        </View>
      </View>
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../../assets/signup.png')}
          resizeMode="cover"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
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
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Type of business"
                  isNeeded={true}
                  placeholder="Select type"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={businessTypeData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.businessType}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      businessType: option.value,
                    });
                  }}
                />
              </View>

              <Input
                iconName="domain"
                label="Name of business"
                placeholder="Enter name of business"
                isNeeded={true}
                defaultValue={businessDetails?.businessName}
                onChangeText={text =>
                  setBusinessDetails({
                    ...businessDetails,
                    businessName: text.trim(),
                  })
                }
              />

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Is your business registered?"
                  isNeeded={true}
                  placeholder="Select status"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={businessRegData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.registered}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      registered: option.value,
                    });
                  }}
                />
              </View>

              <Input
                label="Position in the company"
                placeholder="Enter your position"
                isNeeded={true}
                defaultValue={businessDetails?.positionInOrg}
                onChangeText={text =>
                  setBusinessDetails({...businessDetails, positionInOrg: text})
                }
              />

              <Input
                label="Shares in the company"
                placeholder="Enter your shares percentage"
                defaultValue={businessDetails?.shareInOrg}
                onChangeText={text =>
                  setBusinessDetails({...businessDetails, shareInOrg: text})
                }
              />

              <Pressable onPress={showDatePicker}>
                <Input
                  label="Date of establishment"
                  placeholder="2000 - 01 - 01"
                  iconName="calendar-month-outline"
                  defaultValue={
                    businessDetails.establishmentDate
                      ? businessDetails.establishmentDate?.substr(0, 10)
                      : ''
                  }
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                  onChangeValue={text =>
                    setBusinessDetails({
                      ...businessDetails,
                      establishmentDate: text,
                    })
                  }
                  isNeeded={true}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={show}
                testID="dateTimePicker"
                defaultValue={businessDetails?.establishmentDate}
                mode="date"
                is24Hour={true}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                textColor="#054B99"
              />

              <Input
                label="RC/BN Number"
                placeholder="Enter RC/BN number"
                defaultValue={businessDetails?.rcNum}
                onChangeText={text =>
                  setBusinessDetails({...businessDetails, rcNum: text})
                }
                keyboardType="numeric"
              />

              <Input
                label="Business address"
                placeholder="Enter business address"
                isNeeded={true}
                defaultValue={businessDetails?.businessAddress}
                iconName="home-outline"
                onChangeText={text =>
                  setBusinessDetails({
                    ...businessDetails,
                    businessAddress: text,
                  })
                }
              />

              <Pressable onPress={showAddressDatePicker}>
                <Input
                  label="When did you move to this address?"
                  placeholder="2000 - 01 - 01"
                  defaultValue={
                    businessDetails.whenDidYouMoveToThisBusinessLocation
                      ? businessDetails.whenDidYouMoveToThisBusinessLocation?.substr(
                          0,
                          10,
                        )
                      : ''
                  }
                  iconName="calendar-month-outline"
                  isDate={true}
                  editable={false}
                  showDatePicker={showAddressDatePicker}
                  onChangeValue={text =>
                    setBusinessDetails({
                      ...businessDetails,
                      whenDidYouMoveToThisBusinessLocation: text,
                    })
                  }
                  isNeeded={true}
                />
              </Pressable>

              <DateTimePickerModal
                isVisible={showDate}
                testID="dateTimePicker"
                defaultValue={
                  businessDetails?.whenDidYouMoveToThisBusinessLocation
                }
                mode="date"
                is24Hour={true}
                onConfirm={handleConfirmAddressDate}
                onCancel={hideAddressDatePicker}
                textColor="#054B99"
              />

              <View style={{marginBottom: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginVertical: 5,
                        fontSize: 14,
                        color: COLORS.labelColor,
                      }}>
                      Country
                    </Text>
                    <Text style={{color: 'red', marginRight: 10}}>*</Text>
                  </View>
                </View>
                <SelectList
                  setSelected={text =>
                    setBusinessDetails({
                      ...businessDetails,
                      country: text,
                      state: '',
                      city: '',
                    })
                  }
                  defaultOption={{
                    value: businessDetails?.country
                      ? businessDetails?.country
                      : 'Nigeria',
                    key: businessDetails?.country
                      ? businessDetails?.country
                      : 'Nigeria',
                  }}
                  data={countries}
                  save="value"
                  placeholder="Select your country"
                  boxStyles={styles.inputContainer}
                />
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{marginVertical: 10, paddingRight: 5, width: '50%'}}>
                  <CustomDropdown
                    label="State"
                    isNeeded={true}
                    placeholder="Select State"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={currentState ? currentState : stateData}
                    // data={stateData}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={businessDetails.state}
                    onChange={option => {
                      if (
                        userDetails.country === 'Nigeria' &&
                        option.value === 'Outside Nigeria'
                      ) {
                        setBusinessDetails({
                          ...businessDetails,
                          state: '',
                          city: '',
                        });

                        Toast.show({
                          type: 'warning',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Warning',
                          text2:
                            'Option selected is not available for this country',
                          visibilityTime: 3000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                      } else {
                        setBusinessDetails({
                          ...businessDetails,
                          state: option.value,
                        });
                        getCity(option.value)
                          .then(res => {
                            fetchedCity = [];
                            res?.data &&
                              res?.data.map((item, index) => {
                                fetchedCity.push({
                                  value: item,
                                  label: item,
                                  key: index,
                                });
                              });
                          })
                          .catch(err => {});
                      }
                    }}
                  />
                </View>
                <View
                  style={{marginVertical: 10, paddingLeft: 5, width: '50%'}}>
                  <CustomDropdown
                    label="City"
                    isNeeded={true}
                    placeholder="Select LGA"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={fetchedCity.length > 0 ? fetchedCity : cityData}
                    disabled={!businessDetails.state}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={businessDetails.city}
                    onChange={option => {
                      if (
                        userDetails.country === 'Nigeria' &&
                        option.value === 'Outside Nigeria'
                      ) {
                        setBusinessDetails({
                          ...businessDetails,
                          city: '',
                        });

                        Toast.show({
                          type: 'warning',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Warning',
                          text2:
                            'Option selected is not available for this country',
                          visibilityTime: 3000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                      } else {
                        setBusinessDetails({
                          ...businessDetails,
                          city: option.value,
                        });
                      }
                    }}
                  />
                </View>
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Is your business location owned or rented"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={ownedOrRentedData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails?.ownedOrRented}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      ownedOrRented: option.value,
                    });
                  }}
                />
              </View>

              <Input
                label="Number of employees"
                placeholder="Enter number of employees"
                iconName="account-group-outline"
                isNeeded={true}
                keyboardType="numeric"
                defaultValue={businessDetails?.totalEmployees?.toString()}
                onChangeText={text =>
                  setBusinessDetails({
                    ...businessDetails,
                    totalEmployees: Number(text),
                  })
                }
              />

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Is your business women led?"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={womanLedData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails?.womenLed}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      womenLed: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Is your business sharia compliant?"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={sharComData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.shariaCom}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      shariaCom: option.value,
                    });
                  }}
                />
              </View>
              <Input
                label="Number of outlets"
                placeholder="Enter number of outlets"
                isNeeded={true}
                keyboardType="numeric"
                defaultValue={businessDetails?.NoOfOutlets?.toString()}
                onChangeText={text =>
                  setBusinessDetails({
                    ...businessDetails,
                    NoOfOutlets: Number(text),
                  })
                }
              />

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="How do you sell"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={salesMethodData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.salesMethod}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      salesMethod: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Industry"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={industryData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.industry}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      industry: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Average monthly sales"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={monthlySalesData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.monthlySales}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      monthlySales: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Average monthly expenses"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={monthlyExpData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.monthlyExpenses}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      monthlyExpenses: option.value,
                    });
                  }}
                />
              </View>

              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="How long have you been in business?"
                  isNeeded={true}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={businessDurationData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={businessDetails.businessDuration}
                  onChange={option => {
                    setBusinessDetails({
                      ...businessDetails,
                      businessDuration: option.value,
                    });
                  }}
                />
              </View>

              <Input
                label="MAMERT"
                placeholder="Enter mamert"
                // keyboardType="numeric"
                defaultValue={businessDetails?.MAMERT}
                onChangeText={text =>
                  setBusinessDetails({...businessDetails, MAMERT: text})
                }
              />

              <Input
                label="TIN"
                placeholder="Enter Tax Id Number"
                defaultValue={businessDetails?.tin}
                onChangeText={text =>
                  setBusinessDetails({...businessDetails, tin: text})
                }
              />

              <View style={styles.groupButton}>
                <View style={{width: wp(30)}}>
                  <CustomButton title={'Go Back'} onPress={() => goBack()} />
                </View>

                <View style={{width: wp(50)}}>
                  <CustomButton
                    disabled={disableit}
                    title={'Save & Finish'}
                    onPress={() => handleCreateUser()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default BusinessDetails;

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
  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  HeadView: {
    alignItems: 'center',
    // marginTop: 34,
    // backgroundColor:'blue'
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
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  extraText: {
    marginTop: 20,
    marginBottom: 10,
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
  groupButton: {
    marginBottom: 40,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  inputContainer: {
    height: 55,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaComponentBorder,
    padding: 12,
    borderBottomWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
