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
import React, {useEffect, useState, useRef} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import Buttons from '../../component/buttons/Buttons';
import {useSelector, useDispatch} from 'react-redux';
import {createUserProfile, getCity, getState} from '../../stores/ProfileStore';
import {setReduxState} from '../../util/redux/locationData/location.data.slice';
import Toast from 'react-native-toast-message';
import {setProfile} from '../../util/redux/userProfile/user.profile.slice';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const titleData = [
  {value: '', label: 'Select Title'},
  {value: 'Mr', label: 'Mr'},
  {value: 'Mrs', label: 'Mrs'},
  {value: 'Miss', label: 'Miss'},
  {value: 'Dr', label: 'Dr'},
];

const genderData = [
  {value: '', label: 'Select Gender'},
  {value: 'Female', label: 'Female'},
  {value: 'Male', label: 'Male'},
  {value: 'Prefer Not To Say', label: 'Prefer Not To Say'},
];

const stateData = [{value: '', label: 'Select State'}];

const cityData = [
  {value: '', label: 'Select LGA'},
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

const PersonalDetails = () => {
  const [show, setShow] = useState(false);
  const date = new Date(2000, 0, 1);
  const insets = useSafeAreaInsets();
  const [currentState, setCurrentState] = useState(undefined);
  const [currentCity, setCurrentCity] = useState(undefined);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState();
  const [cityByState, setCitybyState] = useState([]);
  const [city, setCity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const user = useSelector(state => state.userAuth.user);
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({
    title: '',
    email: JSON.parse(user)?.email,
    firstName: JSON.parse(user)?.displayName?.split(' ')[0],
    lastName: JSON.parse(user)?.displayName?.split(' ')[1],
    phoneNumber: '',
    bvn: '',
    nin: '',
    dob: '',
    address: '',
    country: '',
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
  });

  useEffect(() => {
    setUserDetails({
      ...userDetails,
      firstName:
        (user && JSON.parse(user)?.displayName?.split(' ')[1] == undefined) ||
        JSON.parse(user)?.displayName?.split(' ')[1] == null ||
        JSON.parse(user)?.displayName?.split(' ')[0] == ''
          ? ''
          : JSON.parse(user)?.displayName?.split(' ')[0],
      lastName:
        (user && JSON.parse(user)?.displayName?.split(' ')[1] == undefined) ||
        JSON.parse(user)?.displayName?.split(' ')[1] == null ||
        JSON.parse(user)?.displayName?.split(' ')[1] == ''
          ? ''
          : JSON.parse(user)?.displayName?.split(' ')[1],
      email:
        (user && JSON.parse(user)?.email == undefined) ||
        JSON.parse(user)?.email == null ||
        JSON.parse(user)?.email == ''
          ? ''
          : JSON.parse(user)?.email,
    });
  }, [user]);

  useEffect(() => {
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
    // !userDetails.firstName ||
    // !userDetails.lastName ||
    // !userDetails.email ||
    !userDetails.bvn ||
    !userDetails.nin;

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = selectedDate => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setUserDetails({...userDetails, dob: formattedDate});
    setShow(false);
  };

  const handleCreateUser = async () => {
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
    }
    setIsLoading(false);
  };

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await getState();
        if (res?.data !== undefined) {
          setState(res?.data);
        }
        dispatch(setReduxState(res?.data));
      } catch (error) {
        // console.error(error);
      }
    };

    fetchState();
    return () => {
      fetchState();
    };
  }, []);

  useEffect(() => {
    const stateData =
      state &&
      state.map((item, index) => {
        return {value: item, label: item, key: index};
      });

    if (currentState == undefined || currentState == '') {
      setCurrentState(stateData);
    }
  }, [state]);

  useEffect(() => {
    if (userDetails.state !== '') {
      setCitybyState(state.filter(statee => statee === userDetails.state));
    }
  }, [state, userDetails.state]);

  const stateCity = cityByState[0];

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await getCity(stateCity);
        if (res?.data !== undefined) {
          setCity(res?.data);
        }
      } catch (error) {
        // console.error(error);
      }
    };

    fetchCity();
    return () => {
      fetchCity();
    };
  }, [stateCity]);

  useEffect(() => {
    const cityData =
      city &&
      city.map((item, index) => {
        return {value: item, label: item, key: index};
      });

    setCurrentCity(cityData);
  }, [city]);

  return (
    <>
      {isLoading ? (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
            paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
            paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
          }}>
          <Spinner
            textContent={'Loading Profile Details...'}
            textStyle={{color: 'white'}}
            visible={true}
            overlayColor="rgba(78, 75, 102, 0.7)"
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              source={require('../../../assets/icon.png')}
              style={{width: 120, height: 120}}
            />
          </View>
        </SafeAreaView>
      ) : (
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
              textContent={'Creating user Profile Details...'}
              textStyle={{color: 'white'}}
              visible={true}
              overlayColor="rgba(78, 75, 102, 0.7)"
            />
          )}
          <ImageBackground
            source={require('../../../assets/signup.png')}
            resizeMode="stretch"
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
                  <Text style={styles.TextHead}>CREATE PROFILE</Text>
                </View>
                <Text style={[styles.extraText, {marginBottom: 40}]}>
                  Please create a profile to get started.
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
                    // search
                    isNeeded={true}
                    // iconName="gender-male-female"
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
                  // onChangeText={text => handleOnchange(text, 'firstname')}
                  onChangeText={text =>
                    setUserDetails({...userDetails, firstName: text.trim()})
                  }
                  onFocus={() => handleError(null, 'firstName')}
                  iconName="account-outline"
                  label="First Name"
                  placeholder="Enter your first name"
                  error={errors.firstname}
                  isNeeded={true}
                  defaultValue={
                    user && JSON.parse(user)?.displayName?.split(' ')[0]
                  }
                />

                <Input
                  onChangeText={text =>
                    setUserDetails({...userDetails, lastName: text.trim()})
                  }
                  onFocus={() => handleError(null, 'lastName')}
                  iconName="account-outline"
                  label="Last Name"
                  placeholder="Enter your first name"
                  error={errors.lastName}
                  isNeeded={true}
                  defaultValue={
                    user && JSON.parse(user)?.displayName?.split(' ')[1]
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
                  editable={
                    user && JSON.parse(user)?.user?.email ? false : true
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
                  defaultValue={userDetails?.phoneNumber}
                  onChangeFormattedText={text =>
                    setUserDetails({...userDetails, phoneNumber: text})
                  }
                />

                <View style={{marginVertical: 10}}>
                  <CustomDropdown
                    label="Gender"
                    onFocus={() => handleError(null, 'gender')}
                    // search
                    isNeeded={true}
                    iconName="gender-male-female"
                    placeholder="Select Gender"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={genderData}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={userDetails.gender}
                    onChange={option => {
                      setUserDetails({...userDetails, gender: option.value});
                    }}
                    error={errors.gender}
                  />
                </View>

                <Input
                  onChangeText={text =>
                    setUserDetails({...userDetails, bvn: text.trim()})
                  }
                  onFocus={() => handleError(null, 'bvn')}
                  iconName="shield-lock-outline"
                  label="BVN"
                  placeholder="Enter your BVN"
                  error={errors.bvn}
                  keyboardType="numeric"
                  isNeeded={true}
                />

                <Input
                  label="NIN"
                  onChangeText={text =>
                    setUserDetails({...userDetails, nin: text.trim()})
                  }
                  onFocus={() => handleError(null, 'nin')}
                  iconName="shield-lock-outline"
                  placeholder="Enter your NIN"
                  error={errors.nin}
                  keyboardType="numeric"
                  isNeeded={true}
                />

                <Pressable onPress={showDatePicker}>
                  <Input
                    label="Date of Birth"
                    onFocus={() => handleError(null, 'dob')}
                    iconName="calendar-month-outline"
                    placeholder="2000 - 01 - 01"
                    defaultValue={
                      userDetails.dob ? userDetails.dob.toString() : ''
                    }
                    isDate={true}
                    editable={false}
                    showDatePicker={showDatePicker}
                    onChangeValue={text =>
                      setUserDetails({...userDetails, dob: text})
                    }
                    isNeeded={true}
                    error={errors.dob}
                  />
                </Pressable>

                <DateTimePickerModal
                  isVisible={show}
                  testID="dateTimePicker"
                  defaultValue={userDetails.dob}
                  mode="date"
                  is24Hour={true}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  textColor="#054B99"
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

                <Input
                  label="Country"
                  defaultValue={userDetails.country}
                  onChangeText={text =>
                    setUserDetails({...userDetails, country: text})
                  }
                  onFocus={() => handleError(null, 'country')}
                  iconName="flag-outline"
                  placeholder="Enter your country"
                  error={errors.country}
                  isNeeded={true}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{marginVertical: 10, paddingRight: 5, width: '50%'}}>
                    <CustomDropdown
                      label="State"
                      onFocus={() => handleError(null, 'state')}
                      isNeeded={true}
                      placeholder="Select State"
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={currentState ? currentState : stateData}
                      // data={genderData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.state}
                      onChange={option => {
                        setUserDetails({...userDetails, state: option.value});
                      }}
                      error={errors.state}
                    />
                  </View>
                  <View
                    style={{marginVertical: 10, paddingLeft: 5, width: '50%'}}>
                    <CustomDropdown
                      label="City"
                      onFocus={() => handleError(null, 'city')}
                      isNeeded={true}
                      placeholder="Select LGA"
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={currentCity ? currentCity : cityData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={userDetails.city}
                      onChange={option => {
                        setUserDetails({...userDetails, city: option.value});
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

                <TouchableOpacity
                  // onPress={() => handleCreateUser()}
                  onPress={() => validate()}
                  disabled={disableit}>
                  <View style={{marginBottom: 5, marginTop: 20}}>
                    <Buttons label="Save & Continue" disabled={disableit} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      )}
    </>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    marginTop: 34,
    // backgroundColor:'blue'
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 1,
  },
  extraText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
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
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
  },
});
