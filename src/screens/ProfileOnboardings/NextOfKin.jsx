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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import Buttons from '../../component/buttons/Buttons';
import {
  createNextOfKin,
  getLoanUserDetails,
  updateNokDetails,
} from '../../stores/LoanStore';

const genderData = [
  {value: '', label: 'Select Gender'},
  {value: 'Female', label: 'Female'},
  {value: 'Male', label: 'Male'},
  {value: 'Prefer Not To Say', label: 'Prefer Not To Say'},
];

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const NextOfKin = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [nokDetails, setNokDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const route = useRoute();
  const curentRoute = route.name;
  const previousRoute = navigation.getState()?.routes.slice(-2)[0]?.name;

  useEffect(() => {
    if (route.name === 'NextOfKin') {
      const unsubscribe = navigation.addListener('focus', async () => {
        unSubNOKDetails();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    unSubNOKDetails();
  }, []);

  const unSubNOKDetails = async () => {
    setIsLoading(true);
    const res = await getLoanUserDetails();
    if (res.error) {
      // TODO: handle error
    } else {
      setNokDetails(res?.data?.nextOfKinDetails);
    }
    setIsLoading(false);
  };

  const [kinDetails, setKinDetails] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    email: '',
    Address: '',
    phoneNumber: '',
    gender: '',
  });

  useEffect(() => {
    setKinDetails({
      firstName:
        nokDetails && nokDetails?.firstName === undefined
          ? ''
          : nokDetails?.firstName,
      lastName:
        nokDetails && nokDetails?.lastName === undefined
          ? ''
          : nokDetails?.lastName,
      relationship:
        nokDetails && nokDetails?.relationship === undefined
          ? ''
          : nokDetails?.relationship,
      email:
        nokDetails && nokDetails?.email === undefined ? '' : nokDetails?.email,
      Address:
        nokDetails && nokDetails?.Address === undefined
          ? ''
          : nokDetails?.Address,
      phoneNumber:
        nokDetails && nokDetails?.phoneNumber === undefined
          ? ''
          : nokDetails?.phoneNumber,
      gender:
        nokDetails && nokDetails?.gender === undefined
          ? ''
          : nokDetails?.gender,
    });
  }, [nokDetails, navigation]);

  const disableit =
    !kinDetails.firstName ||
    !kinDetails.lastName ||
    !kinDetails.relationship ||
    !kinDetails.email ||
    !kinDetails.Address ||
    !kinDetails.phoneNumber ||
    !kinDetails.gender;

  const handleCreateNokDetails = async () => {
    setIsUpdating(true);
    const res = await createNextOfKin(kinDetails);
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
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      setTimeout(() => {
        if (previousRoute !== 'MyAccount') {
          navigation.navigate('BankDetails');
        } else {
          navigation.navigate('MyAccount');
        }
      }, 1000);
    }
    setIsUpdating(false);
  };

  const handleUpdateNokDetails = async () => {
    setIsUpdating(true);
    const res = await updateNokDetails(kinDetails);
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
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      setTimeout(() => {
        if (previousRoute !== 'MyAccount') {
          navigation.navigate('BankDetails');
        } else {
          navigation.navigate('MyAccount');
        }
      }, 1000);
    }
    setIsUpdating(false);
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
              NEXT OF KIN
            </Text>
          </View>

          <View>
            <Image source={require('../../../assets/images/indicator3.png')} />
          </View>
        </View>
      </View>
      <View style={[styles.form, {marginBottom: 10, justifyContent: 'center'}]}>
        <Text style={styles.header}>
          Trade Lenda requires this information of your next of kin
        </Text>
      </View>
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
            <Input
              iconName="account-outline"
              label="First Name"
              placeholder="Enter kin's first name"
              isNeeded={true}
              defaultValue={kinDetails?.firstName}
              onChangeText={text =>
                setKinDetails({...kinDetails, firstName: text})
              }
              Needed={true}
            />

            <Input
              iconName="account-outline"
              label="Last Name"
              placeholder="Enter kin's last name"
              defaultValue={kinDetails?.lastName}
              onChangeText={text =>
                setKinDetails({...kinDetails, lastName: text})
              }
              isNeeded={true}
            />
            <View style={{marginVertical: 10}}>
              <CustomDropdown
                label="Gender"
                isNeeded={true}
                iconName="gender-male-female"
                placeholder="Select Gender"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={genderData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={kinDetails.gender}
                onChange={option => {
                  setKinDetails({...kinDetails, gender: option.value});
                }}
              />
            </View>
            <Input
              label="Next of kin's Relationship"
              placeholder="Enter kin's Relationship"
              defaultValue={kinDetails?.relationship}
              onChangeText={text =>
                setKinDetails({...kinDetails, relationship: text})
              }
              isNeeded={true}
            />

            <Input
              iconName="email-outline"
              label="Email"
              placeholder="Enter kin's email"
              keyboardType="email-address"
              defaultValue={kinDetails?.email}
              onChangeText={text =>
                setKinDetails({...kinDetails, email: text.trim()})
              }
              isNeeded={true}
            />

            <InputPhone
              label="Phone number"
              layout="first"
              isNeeded={true}
              defaultCode="NG"
              codeTextStyle={{color: '#6E7191'}}
              defaultValue={kinDetails?.phoneNumber}
              onChangeFormattedText={text =>
                setKinDetails({...kinDetails, phoneNumber: text})
              }
            />
            <Input
              label="Address"
              defaultValue={kinDetails?.Address}
              onChangeText={text =>
                setKinDetails({...kinDetails, Address: text})
              }
              iconName="map-marker-outline"
              placeholder="Enter address"
            />
            <TouchableOpacity
              onPress={
                nokDetails?.firstName === undefined
                  ? handleCreateNokDetails
                  : handleUpdateNokDetails
              }
              disabled={disableit}>
              <View style={{marginBottom: 40, marginTop: 20}}>
                <Buttons label="Save & Continue" disabled={disableit} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NextOfKin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
  },
  innercontainer: {
    paddingHorizontal: 16,
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
    color: '#14142B',
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontFamily: 'Montserat',
  },
});
