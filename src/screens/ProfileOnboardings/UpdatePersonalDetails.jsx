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
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import Buttons from '../../component/buttons/Buttons';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {getCity, getState} from '../../stores/ProfileStore';
import {createUserProfile, updatePersonalDetails} from '../../stores/LoanStore';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

let fetchedCity = [];

const UpdatePersonalDetails = () => {
  const navigation = useNavigation();
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
  const [isUpdating, setIsUpdating] = useState(false);
  const profileDetails = useSelector(state => state.userProfile.profile);
  const route = useRoute();
  const curentRoute = route.name;
  const previousRoute = navigation.getState()?.routes.slice(-2)[0]?.name;

  // const profileDetails = profile;

  const [userDetails, setUserDetails] = useState({
    title: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bvn: '',
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
  });

  useEffect(() => {
    setUserDetails({
      firstName:
      profileDetails && profileDetails?.firstName === undefined
      ? ''
      : profileDetails?.firstName,
      lastName:
      profileDetails && profileDetails?.lastName === undefined
      ? ''
      : profileDetails?.lastName,
      email:
      profileDetails && profileDetails?.email === undefined
      ? ''
      : profileDetails?.email,
      title:
      profileDetails && profileDetails?.title === undefined
      ? ''
      : profileDetails?.title,
      phoneNumber:
      profileDetails && profileDetails?.phoneNumber === undefined
      ? ''
      : profileDetails?.phoneNumber,
      bvn:
      profileDetails && profileDetails?.bvn === undefined
      ? ''
      : profileDetails?.bvn,
      dob:
      profileDetails && profileDetails?.dob === undefined
      ? ''
      : profileDetails?.dob?.substr(0, 10),
      address:
      profileDetails && profileDetails?.address === undefined
      ? ''
      : profileDetails?.address,
      country:
      profileDetails && profileDetails?.country === undefined
      ? ''
      : profileDetails?.country,
      state:
      profileDetails && profileDetails?.state === undefined
      ? ''
      : profileDetails?.state,
      city:
      profileDetails && profileDetails?.city === undefined
      ? ''
      : profileDetails?.city,
      maritalStatus:
      profileDetails && profileDetails?.maritalStatus === undefined
      ? ''
      : profileDetails?.maritalStatus,
      eduLevel:
      profileDetails && profileDetails?.eduLevel === undefined
      ? ''
      : profileDetails?.eduLevel,
      gender:
      profileDetails && profileDetails?.gender === undefined
      ? ''
      : profileDetails?.gender,

      residentialStatus:
      profileDetails && profileDetails?.residentialStatus === undefined
      ? ''
      : profileDetails?.residentialStatus,
      yearYouMovedToCurrentAddress:
      profileDetails &&
      profileDetails?.yearYouMovedToCurrentAddress === undefined
      ? ''
      : profileDetails?.yearYouMovedToCurrentAddress,
      NoOfDependents:
      profileDetails && profileDetails?.NoOfDependents === undefined
      ? 0
      : profileDetails?.NoOfDependents,
    });
  }, [profileDetails, navigation]);

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

    if (isValid) {
      profileDetails?.email === undefined
      ? handleCreatePersonalDetails()
      : handleUpdatePersonalDetails();

      if (previousRoute !== 'MyAccount') {
        setTimeout(() => {
          navigation.navigate('BusinessDetails');
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.navigate('MyAccount');
        }, 1000);
      }
    }
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await getState();
        if (res?.data !== undefined) {
          setState(res?.data);
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
    if (userDetails?.state !== '' && state !== undefined) {
      setCitybyState(state?.filter(statee => statee === userDetails.state));
    }
  }, [state, userDetails.state]);

  const stateCity = cityByState?.length > 0 ? cityByState[0] : null;

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await getCity(stateCity);
        if (
          (res?.data && res?.data !== undefined) ||
          (res?.data && res?.data !== null)
          ) {
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
    if(userDetails.state !== ''){
     const getStateData = getCity(userDetails.state).then((res) => {
      fetchedCity = [];
      res?.data && res?.data.map((item, index) => {
        fetchedCity.push({value: item, label: item, key: index});
      });
    }).catch(err => {
                            // console.log(err);
    })
  }

}, [userDetails.state]);

  const disableit =
  !userDetails.phoneNumber ||
  !userDetails.address ||
  !userDetails.title ||
  !userDetails.firstName ||
  !userDetails.lastName ||
  !userDetails.email;

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

  const handleCreatePersonalDetails = async () => {
    setIsLoading(true);
    const res = await createUserProfile(userDetails);
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
    }
    setIsLoading(false);
  };

  const handleUpdatePersonalDetails = async () => {
    setIsUpdating(true);
    const res = await updatePersonalDetails(userDetails);
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
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

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
    {isLoading && (
      <Spinner
      textContent={'Loading...'}
      textStyle={{color: 'white'}}
      visible={true}
      overlayColor="rgba(78, 75, 102, 0.7)"
      />
      )}
    {isUpdating && (
      <Spinner
      textContent={'Please wait...'}
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
      paddingHorizontal: 16,
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
    PERSONAL DETAILS
    </Text>
    </View>

    <View>
    <Image source={require('../../../assets/images/indicator.png')} />
    </View>
    </View>
    </View>
    <View
    style={[styles.HeadView, {marginBottom: 10, justifyContent: 'center'}]}>
    <Text style={styles.extraText}>
    Please update your personal details to get started.
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
    <View style={{marginVertical: 20}}>
    <CustomDropdown
    label="Title"
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
    onFocus={() => handleError(null, 'title')}
    error={errors.title}
    />
    </View>

    <Input
    iconName="account-outline"
    label="First Name"
    placeholder="Enter your first name"
    isNeeded={true}
    defaultValue={profileDetails?.firstName}
    onChangeText={text =>
    setUserDetails({...userDetails, firstName: text.trim()})
  }
  onFocus={() => handleError(null, 'firstName')}
  error={errors.firstname}
  />

  <Input
  iconName="account-outline"
  label="Last Name"
  placeholder="Enter your last name"
  defaultValue={profileDetails?.lastName}
  onChangeText={text =>
  setUserDetails({...userDetails, lastName: text.trim()})
}
isNeeded={true}
onFocus={() => handleError(null, 'lastName')}
error={errors.lastName}
/>

<Input
iconName="email-outline"
label="Email"
placeholder="Enter your email"
keyboardType="email-address"
defaultValue={profileDetails?.email}
onChangeText={text =>
setUserDetails({...userDetails, email: text.trim()})
}
isNeeded={true}
onFocus={() => handleError(null, 'email')}
error={errors.email}
/>

<InputPhone
label="Phone number"
layout="first"
isNeeded={true}
defaultCode="NG"
codeTextStyle={{color: '#6E7191'}}
defaultValue={profileDetails?.phoneNumber}
onChangeFormattedText={text =>
setUserDetails({...userDetails, phoneNumber: text})
}
onFocus={() => handleError(null, 'phoneNumber')}
error={errors.phoneNumber}
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
                // onChangeText={text =>
                //   setUserDetails({...userDetails, bvn: text.trim()})
                // }
onFocus={() => handleError(null, 'bvn')}
iconName="shield-lock-outline"
label="BVN"
placeholder="Enter your BVN"
error={errors.bvn}
keyboardType="numeric"
isNeeded={true}
defaultValue={userDetails.bvn}
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
style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                    // data={stateData}
maxHeight={300}
labelField="label"
valueField="value"
value={userDetails.state}
onChange={option => {
  setUserDetails({...userDetails, state: option.value});
  const getStateData = getCity(option.value).then((res) => {
    fetchedCity = [];
    res?.data && res?.data.map((item, index) => {
      fetchedCity.push({value: item, label: item, key: index});
    });
  }).catch(err => {
                            // console.log(err);
  })
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
data={fetchedCity.length > 0 ? fetchedCity : cityData}
disabled={!userDetails.state}
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
defaultValue={profileDetails?.NoOfDependents?.toString()}
keyboardType="numeric"
isNeeded={true}
/>

<TouchableOpacity
onPress={validate}
disabled={disableit}
style={{marginBottom: 30}}>
<View style={{marginBottom: 30, marginTop: 20}}>
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

export default UpdatePersonalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  image: {
    // height: screenHeight,
    width: wp('100%'),
    justifyContent: 'center',
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
  extraText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    color: '#14142B',
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
});
