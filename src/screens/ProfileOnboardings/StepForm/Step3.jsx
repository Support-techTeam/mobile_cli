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
  Button,
} from 'react-native';
import React, {useLayoutEffect, useState, useRef, useEffect} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../../component/inputField/input.component';
import CustomDropdown from '../../../component/dropDown/dropdown.component';
import InputPhone from '../../../component/inputField/phone-input.component';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {
  createUserProfile,
  getCity,
  getState,
} from '../../../stores/ProfileStore';
import {setReduxState} from '../../../util/redux/locationData/location.data.slice';
import Toast from 'react-native-toast-message';
import {setProfile} from '../../../util/redux/userProfile/user.profile.slice';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import KeyboardAvoidingWrapper from '../../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {SIZES} from '../../../constants';
import CustomButton from '../../../component/buttons/CustomButtons';
import {SelectList} from 'react-native-dropdown-select-list';
import COLORS from '../../../constants/colors';
import Loader from '../../../component/loader/loader';
const countryList = require('country-list');

const titleData = [
  {value: '', label: 'Select Title'},
  {value: 'Mr', label: 'Mr'},
  {value: 'Mrs', label: 'Mrs'},
  {value: 'Miss', label: 'Miss'},
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

const residencyData = [
  {value: '', label: 'Select Residential Status'},
  {value: 'Renting', label: 'Renting'},
  {value: 'Owner', label: 'Owner'},
  {value: 'Subletting', label: 'Subletting'},
];

const wdymttaData = [
  {value: '', label: 'Select Duration'},
  {value: '0-1 years', label: '0-1 years'},
  {value: '1-3 years', label: '1-3 years'},
  {value: '3-5 years', label: '3-5 years'},
  {value: '5-10 years', label: '5-10 years'},
  {value: '10+ years', label: '10+ years'},
];

const maritalData = [
  {value: '', label: 'Select Marital Status'},
  {value: 'Single', label: 'Single'},
  {value: 'Married', label: 'Married'},
  {value: 'Divorced', label: 'Divorced'},
  {value: 'Widowed', label: 'Widowed'},
  {value: 'Separated', label: 'Separated'},
];

const educationalData = [
  {value: '', label: 'Select Educational Status'},
  {
    value: 'Ordinary National Diploma (OND)',
    label: 'Ordinary National Diploma (OND)',
  },
  {
    value: 'Higher National Diploma (HND)',
    label: 'Higher National Diploma (HND)',
  },
  {value: 'Bachelors', label: 'Bachelors'},
  {value: 'Masters', label: 'Masters'},
  {value: 'PHD', label: 'PHD'},
  {value: 'Post Graduate Diploma', label: 'Post Graduate Diploma'},
];

const referralOptionData = [
  {value: '', label: 'Select answer'},
  {value: 'By Referral', label: 'By Referral'},
  {value: 'From a friend', label: 'From a friend'},
  {value: 'Social Media', label: 'Social Media'},
  {value: 'Community or Influencer', label: 'Community or Influencer'},
  {value: 'TradeLenda Partner', label: 'TradeLenda Partner'},
  {value: 'Others', label: 'Others'},
];

let fetchedCity = [
  {value: '', label: '...Select LGA'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria', key: 0},
];
let currentState = [
  {value: '', label: '...Select State'},
  {value: 'Outside Nigeria', label: 'Outside Nigeria', key: 0},
];
const Step3 = props => {
  const insets = useSafeAreaInsets();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const user = useSelector(state => state.userAuth.user);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    title: '',
    email: user != undefined || user != null ? JSON.parse(user)?.email : '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bvn: '',
    nin: '',
    dob: '',
    address: '',
    country: 'Nigeria',
    state: '',
    city: '',
    maritalStatus: '',
    eduLevel: '',
    gender: '',
    residentialStatus: '',
    yearYouMovedToCurrentAddress: '',
    NoOfDependents: 0,
    referredByCode: undefined,
    referredByOption: '',
    referredByAnswer: undefined,
    signedOnDevice: '',
    bvnData: '',
    accountType: 'Personal',
  });
  const [preDetails, setPreDetails] = useState();

  const [totalSteps, setTotalSteps] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const {next, saveState, back, retrieveState, finish} = props;
  const [verifiedUser, setVerifiedUser] = useState();
  const [bvnData, setBvnData] = useState();
  const navigation = useNavigation();

  const countries = countryList.getData().map(country => ({
    value: country.name,
    label: country.name,
  }));

  useLayoutEffect(() => {
    setTotalSteps(props.getTotalSteps());
    setCurrentStep(props.getCurrentStep());
    if (retrieveState()?.profileData) {
      setPreDetails(retrieveState()?.profileData);
    }
  }, []);

  useLayoutEffect(() => {
    setVerifiedUser({
      accountType: retrieveState()?.accountType,
      bvn: retrieveState()?.bvn,
      dob: retrieveState()?.dateOfBirth,
      firstName: retrieveState()?.firstName?.split(' ')[0],
      gender: retrieveState()?.gender,
      lastName: retrieveState()?.lastname,
      phoneNumber: Number(retrieveState()?.phoneNumber).toString(),
    });
  }, [retrieveState()]);

  useLayoutEffect(() => {
    setBvnData({
      bvn: retrieveState()?.bvn,
      dateOfBirth: retrieveState()?.dateOfBirth,
      firstName: retrieveState()?.firstName,
      middleName: retrieveState()?.middlename,
      gender: retrieveState()?.gender,
      lastName: retrieveState()?.lastname,
      phoneNumber: retrieveState()?.phoneNumber,
    });
  }, [retrieveState()]);

  const goBack = () => {
    back();
  };
  const nextStep = () => {
    next();
  };

  const finishStep = () => {
    saveState(null);
    finish();
  };
  useLayoutEffect(() => {
    if (preDetails && preDetails?.firstName && preDetails?.lastName) {
      setUserDetails({...preDetails});
    }
  }, [preDetails, retrieveState()]);

  useLayoutEffect(() => {
    setUserDetails(prevData => ({
      ...prevData,
      firstName:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.firstName != undefined ||
            verifiedUser?.firstName != null ||
            verifiedUser?.firstName != ''
            ? verifiedUser?.firstName
            : ''
          : '',
      lastName:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.lastName != undefined ||
            verifiedUser?.lastName != null ||
            verifiedUser?.lastName != ''
            ? verifiedUser?.lastName
            : ''
          : '',
      email:
        user != undefined || user != null
          ? JSON.parse(user)?.email != undefined ||
            JSON.parse(user)?.email != null ||
            JSON.parse(user)?.email != ''
            ? JSON.parse(user)?.email
            : ''
          : '',
      bvn:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.bvn != undefined ||
            verifiedUser?.bvn != null ||
            verifiedUser?.bvn != ''
            ? verifiedUser?.bvn
            : ''
          : '',
      gender:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.gender != undefined ||
            verifiedUser?.gender != null ||
            verifiedUser?.gender != ''
            ? verifiedUser?.gender
            : ''
          : '',
      accountType:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.accountType != undefined ||
            verifiedUser?.accountType != null ||
            verifiedUser?.accountType != ''
            ? verifiedUser?.accountType
            : ''
          : '',
      dob:
        verifiedUser != undefined || verifiedUser != null
          ? verifiedUser?.dob != undefined ||
            verifiedUser?.dob != null ||
            verifiedUser?.dob != ''
            ? verifiedUser?.dob
            : ''
          : '',

      bvnData: bvnData != undefined || bvnData != null ? bvnData : '',
    }));
  }, [user, verifiedUser, bvnData]);

  useLayoutEffect(() => {
    const platform = Platform.OS;
    if (platform === 'ios') {
      setUserDetails({...userDetails, signedOnDevice: 'ios'});
      ('Running on iOS');
    } else if (platform === 'android') {
      setUserDetails({...userDetails, signedOnDevice: 'android'});
      ('Running on Android');
    }
  }, []);

  const validate = () => {
    let isValid = true;

    if (!userDetails.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!userDetails.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!userDetails.firstName) {
      handleError('Please input firstname', 'firstName');
      isValid = false;
    }

    if (!userDetails.lastName) {
      handleError('Please input lastname', 'lastName');
      isValid = false;
    }

    if (!userDetails.title) {
      handleError('Please input title', 'title');
      isValid = false;
    }

    if (!userDetails.phoneNumber) {
      handleError('Please input phone number', 'phoneNumber');
      isValid = false;
    }

    if (!userDetails.bvn) {
      handleError('Please input bvn', 'bvn');
      isValid = false;
    }

    if (!userDetails.nin) {
      handleError('Please input nin', 'nin');
      isValid = false;
    }
    if (!userDetails.dob) {
      handleError('Please input dob', 'dob');
      isValid = false;
    }
    if (!userDetails.address) {
      handleError('Please input address', 'address');
      isValid = false;
    }
    if (!userDetails.country) {
      handleError('Please input country', 'country');
      isValid = false;
    }
    if (!userDetails.state) {
      handleError('Please input state', 'state');
      isValid = false;
    }

    if (!userDetails.city) {
      handleError('Please input city', 'city');
      isValid = false;
    }

    if (!userDetails.maritalStatus) {
      handleError('Please input marital status', 'maritalStatus');
      isValid = false;
    }
    if (!userDetails.eduLevel) {
      handleError('Please input educational level', 'eduLevel');
      isValid = false;
    }

    if (!userDetails.gender) {
      handleError('Please input gender', 'gender');
      isValid = false;
    }

    if (!userDetails.residentialStatus) {
      handleError('Please input residential status', 'residentialStatus');
      isValid = false;
    }

    if (!userDetails.yearYouMovedToCurrentAddress) {
      handleError(
        'Please input year you moved to current address',
        'yearYouMovedToCurrentAddress',
      );
      isValid = false;
    }

    // if (!userDetails.NoOfDependents) {
    //   handleError('Please input No of dependents', 'NoOfDependents');
    //   isValid = false;
    // }
    if (!userDetails.referredByOption) {
      handleError('Please input referred by option', 'referredByOption');
      isValid = false;
    }

    if (isValid) {
      handleCreateUser();
    }
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const disableit =
    !userDetails.phoneNumber ||
    !userDetails.address ||
    !userDetails.title ||
    !userDetails.bvn ||
    !userDetails.city ||
    !userDetails.state ||
    !userDetails.nin;

  const handleCreateUser = async () => {
    const platform = Platform.OS;
    if (platform === 'ios') {
      setUserDetails({...userDetails, signedOnDevice: 'ios'});
      ('Running on iOS');
    } else if (platform === 'android') {
      setUserDetails({...userDetails, signedOnDevice: 'android'});
      ('Running on Android');
    }
    if (userDetails?.accountType === 'Personal') {
      try {
        setIsLoading(true);
        const res = await createUserProfile(userDetails);
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
          Toast.show({
            type: 'success',
            position: 'top',
            topOffset: 50,
            text1: res?.data?.title,
            text2: res?.data?.message,
            visibilityTime: 3000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
          dispatch(setProfile(res?.data));
          navigation.navigate('Home');
          finishStep();
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      saveState({
        profileData: userDetails,
        routeType: 'onboarding',
      });
      nextStep();
    }
  };

  useLayoutEffect(() => {
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
        dispatch(setReduxState(res?.data));
      } catch (error) {}
    };

    fetchState();
    return () => {
      fetchState();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: insets.top !== 0 ? insets.top : 'auto',
            paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
            paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
          }}>
          <Loader
            visible={isLoading}
            loadingText={'Loading Profile Details...'}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              source={require('../../../../assets/icon.png')}
              style={{width: 120, height: 120}}
            />
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
            paddingBottom:
              insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
            paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
            paddingRight:
              insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
          }}>
          <Loader
            visible={isLoading}
            loadingText={'Creating user Profile Details...'}
          />
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
                  marginBottom: tabBarHeight + 25,
                }}>
                <View style={styles.HeadView}>
                  <View style={styles.TopView}>
                    <Text style={styles.TextHead}>PROFILE FORM</Text>
                  </View>
                  <Text style={[styles.extraText]}>
                    Industry regulation requires us to collect this information
                    to verify your identity.
                  </Text>
                </View>
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
                      label="Title"
                      onFocus={() => handleError(null, 'title')}
                      isNeeded={true}
                      placeholder="Select Title"
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={titleData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.title}
                      onChange={option => {
                        setUserDetails({...userDetails, title: option.value});
                      }}
                      error={errors.title}
                    />
                  </View>
                  <Input
                    onFocus={() => handleError(null, 'firstName')}
                    iconName="account-outline"
                    label="First Name"
                    placeholder="Enter your first name"
                    error={errors.firstname}
                    isNeeded={true}
                    editable={false}
                    defaultValue={
                      userDetails?.firstName && userDetails?.firstName.trim()
                    }
                  />

                  <Input
                    onFocus={() => handleError(null, 'lastName')}
                    iconName="account-outline"
                    label="Last Name"
                    placeholder="Enter your first name"
                    error={errors.lastName}
                    isNeeded={true}
                    editable={false}
                    defaultValue={
                      userDetails?.lastName && userDetails?.lastName.trim()
                    }
                  />

                  <Input
                    onChangeText={text =>
                      setUserDetails({...userDetails, email: text.trim()})
                    }
                    onFocus={() => handleError(null, 'email')}
                    iconName="email-outline"
                    label="Email"
                    placeholder="Enter your email"
                    error={errors.email}
                    isNeeded={true}
                    value={userDetails?.email}
                    editable={
                      user && JSON.parse(user)?.email != undefined
                        ? false
                        : true
                    }
                    defaultValue={user && JSON.parse(user)?.email}
                  />

                  <InputPhone
                    label="Phone number"
                    onFocus={() => handleError(null, 'phoneNumber')}
                    layout="first"
                    isNeeded={true}
                    defaultCode="NG"
                    error={errors.phoneNumber}
                    codeTextStyle={{color: '#6E7191'}}
                    onChangeFormattedText={text => {
                      setUserDetails({...userDetails, phoneNumber: text});
                    }}
                  />

                  <View style={{marginVertical: 10}}>
                    <Input
                      onFocus={() => handleError(null, 'gender')}
                      iconName="gender-male-female"
                      label="Gender"
                      placeholder="Enter your gender"
                      error={errors.gender}
                      isNeeded={true}
                      editable={false}
                      defaultValue={
                        userDetails?.gender && userDetails?.gender.trim()
                      }
                    />
                  </View>

                  <Input
                    onFocus={() => handleError(null, 'bvn')}
                    iconName="shield-lock-outline"
                    label="BVN"
                    placeholder="Enter your BVN"
                    error={errors.bvn}
                    isNeeded={true}
                    editable={false}
                    defaultValue={
                      userDetails?.bvn && userDetails?.bvn.toString()
                    }
                  />

                  <Input
                    label="NIN"
                    onChangeText={text => {
                      if (text.length <= 11) {
                        setUserDetails({...userDetails, nin: text.trim()});
                      }
                    }}
                    value={userDetails?.nin}
                    defaultValue={userDetails?.nin?.toString()}
                    onFocus={() => handleError(null, 'nin')}
                    iconName="shield-lock-outline"
                    placeholder="Enter your NIN"
                    error={errors.nin}
                    keyboardType="numeric"
                    isNeeded={true}
                  />

                  <Input
                    label="Date of Birth"
                    onFocus={() => handleError(null, 'dob')}
                    iconName="calendar-month-outline"
                    placeholder="2000 - 01 - 01"
                    editable={false}
                    defaultValue={userDetails?.dob && userDetails?.dob}
                    isNeeded={true}
                    error={errors.dob}
                  />

                  <Input
                    label="Address"
                    defaultValue={userDetails.address}
                    onChangeText={text =>
                      setUserDetails({...userDetails, address: text})
                    }
                    onFocus={() => handleError(null, 'address')}
                    iconName="map-marker-outline"
                    placeholder="Enter your address"
                    error={errors.address}
                    isNeeded={true}
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
                        setUserDetails({
                          ...userDetails,
                          country: text,
                          state: '',
                          city: '',
                        })
                      }
                      defaultOption={{
                        value: userDetails?.country
                          ? userDetails?.country
                          : 'Nigeria',
                        key: userDetails?.country
                          ? userDetails?.country
                          : 'Nigeria',
                      }}
                      data={countries}
                      save="value"
                      placeholder="Select your country"
                      boxStyles={styles.inputContainer}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        marginVertical: 10,
                        paddingRight: 5,
                        width: '50%',
                      }}>
                      <CustomDropdown
                        label="State"
                        onFocus={() => handleError(null, 'state')}
                        isNeeded={true}
                        placeholder="Select State"
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={currentState ? currentState : stateData}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={userDetails.state}
                        defaultValue={userDetails?.state && userDetails?.state}
                        onChange={option => {
                          if (
                            userDetails.country === 'Nigeria' &&
                            option.value === 'Outside Nigeria'
                          ) {
                            setUserDetails({
                              ...userDetails,
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
                            setUserDetails({
                              ...userDetails,
                              state: option.value,
                            });

                            //Get cities by state
                            getCity(option.value)
                              .then(res => {
                                res?.data &&
                                  res?.data?.length > 0 &&
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
                        error={errors.state}
                      />
                    </View>
                    <View
                      style={{
                        marginVertical: 10,
                        paddingLeft: 5,
                        width: '50%',
                      }}>
                      <CustomDropdown
                        label="City"
                        onFocus={() => handleError(null, 'city')}
                        isNeeded={true}
                        placeholder="Select LGA"
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={fetchedCity.length > 0 ? fetchedCity : cityData}
                        disabled={!userDetails.state}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={userDetails.city}
                        defaultValue={userDetails?.city && userDetails?.city}
                        onChange={option => {
                          if (
                            userDetails.country === 'Nigeria' &&
                            option.value === 'Outside Nigeria'
                          ) {
                            setUserDetails({
                              ...userDetails,
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
                            setUserDetails({
                              ...userDetails,
                              city: option.value,
                            });
                          }
                        }}
                        error={errors.city}
                      />
                    </View>
                  </View>

                  <View style={{marginVertical: 10}}>
                    <CustomDropdown
                      label="Residential Status"
                      onFocus={() => handleError(null, 'residentialStatus')}
                      iconName="home-outline"
                      isNeeded={true}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={residencyData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.residentialStatus}
                      onChange={option => {
                        setUserDetails({
                          ...userDetails,
                          residentialStatus: option.value,
                        });
                      }}
                      error={errors.residentialStatus}
                    />
                  </View>

                  <View style={{marginVertical: 10}}>
                    <CustomDropdown
                      label="When did you move to that address?"
                      onFocus={() =>
                        handleError(null, 'yearYouMovedToCurrentAddress')
                      }
                      isNeeded={true}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={wdymttaData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.yearYouMovedToCurrentAddress}
                      onChange={option => {
                        setUserDetails({
                          ...userDetails,
                          yearYouMovedToCurrentAddress: option.value,
                        });
                      }}
                      error={errors.yearYouMovedToCurrentAddress}
                    />
                  </View>

                  <View style={{marginVertical: 10}}>
                    <CustomDropdown
                      label="Marital Status"
                      onFocus={() => handleError(null, 'maritalStatus')}
                      isNeeded={true}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={maritalData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.maritalStatus}
                      onChange={option => {
                        setUserDetails({
                          ...userDetails,
                          maritalStatus: option.value,
                        });
                      }}
                      error={errors.maritalStatus}
                    />
                  </View>

                  <View style={{marginVertical: 10}}>
                    <CustomDropdown
                      label="Educational Level"
                      onFocus={() => handleError(null, 'eduLevel')}
                      iconName="school-outline"
                      isNeeded={true}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={educationalData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.eduLevel}
                      onChange={option => {
                        setUserDetails({
                          ...userDetails,
                          eduLevel: option.value,
                        });
                      }}
                      error={errors.eduLevel}
                    />
                  </View>

                  <Input
                    label="Number of dependents"
                    onChangeText={text =>
                      setUserDetails({
                        ...userDetails,
                        NoOfDependents: parseInt(text, 10),
                      })
                    }
                    defaultValue={userDetails?.NoOfDependents?.toString()}
                    onFocus={() => handleError(null, 'NoOfDependents')}
                    error={errors.NoOfDependents}
                    keyboardType="numeric"
                    isNeeded={true}
                  />

                  <View style={{marginVertical: 10}}>
                    <CustomDropdown
                      label="How did you hear about TradeLenda?"
                      onFocus={() => handleError(null, 'referredByOption')}
                      iconName="account-voice"
                      isNeeded={true}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={referralOptionData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.referredByOption}
                      onChange={option => {
                        setUserDetails({
                          ...userDetails,
                          referredByOption: option.value,
                        });
                      }}
                      error={errors.referredByOption}
                    />
                  </View>

                  {userDetails.referredByOption &&
                  userDetails.referredByOption === 'By Referral' ? (
                    <Input
                      label="Referral Code (i.e XZRHNC)"
                      defaultValue={userDetails?.referredByCode}
                      onChangeText={text =>
                        setUserDetails({...userDetails, referredByCode: text})
                      }
                      isNeeded={true}
                    />
                  ) : userDetails?.referredByOption &&
                    userDetails?.referredByOption !== '' ? (
                    <Input
                      label={
                        userDetails?.referredByOption == 'From a friend'
                          ? 'Please specify friends email or name'
                          : userDetails?.referredByOption == 'Others'
                          ? 'Please specify other referral'
                          : userDetails?.referredByOption == 'Social Media'
                          ? `Please specify referral ${userDetails?.referredByOption.toLowerCase()} platform`
                          : `Please specify referral ${userDetails?.referredByOption.toLowerCase()} name`
                      }
                      defaultValue={userDetails?.referredByAnswer}
                      onChangeText={text =>
                        setUserDetails({...userDetails, referredByAnswer: text})
                      }
                      isNeeded={true}
                    />
                  ) : null}

                  <View style={styles.groupButton}>
                    <View style={{width: wp(30)}}>
                      <CustomButton
                        title={'Go Back'}
                        onPress={() => goBack()}
                      />
                    </View>

                    <View style={{width: wp(50)}}>
                      <CustomButton
                        disabled={disableit}
                        title={'Save & Continue'}
                        onPress={() => validate()}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </ImageBackground>
          </KeyboardAvoidingWrapper>
        </SafeAreaView>
      )}
    </>
  );
};

export default Step3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  TopView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: SIZES.h1,
    letterSpacing: 1,
  },
  extraText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    marginTop: SIZES.base,
    marginBottom: SIZES.radius,
    textAlign: 'center',
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
    color: '#14142B',
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
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
  signUpactivity: {
    backgroundColor: '#054B99',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdownLabel: {
    // marginVertical: 5,
    // fontSize: 14,
    // color: COLORS.labelColor,
    //
  },
  dropdown: {
    // height: 55,
    // backgroundColor: COLORS.light,
    // paddingHorizontal: 15,
    // width: '100%',
    // borderWidth: 0.5,
    // borderRadius: 8,
    // borderColor: COLORS.lendaBlue,
    // padding: 12,
    // justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  image: {
    // height: screenHeight,
    width: wp('100%'),
    justifyContent: 'center',
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
