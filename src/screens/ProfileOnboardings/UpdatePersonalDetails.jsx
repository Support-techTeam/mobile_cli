import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import { StoreContext } from '../../config/mobX stores/RootStore';

const UpdatePersonalDetails = ({ route }) => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const date = new Date(2000, 0, 1);
  const insets = useSafeAreaInsets();
  // const [profileDetails, setProfileDetails] = useState({});

  const { loansStore, authStore } = useContext(StoreContext);
  const { loadingProfile, profile } = authStore;
  const { success, sending } = loansStore;

  useEffect(() => {
    authStore.getProfileDetails();
  }, [authStore]);

  const profileDetails = profile;

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
        profileDetails && profileDetails?.firstName === undefined ? '' : profileDetails?.firstName,
      lastName:
        profileDetails && profileDetails?.lastName === undefined ? '' : profileDetails?.lastName,
      email: profileDetails && profileDetails?.email === undefined ? '' : profileDetails?.email,
      title: profileDetails && profileDetails?.title === undefined ? '' : profileDetails?.title,
      phoneNumber:
        profileDetails && profileDetails?.phoneNumber === undefined
          ? ''
          : profileDetails?.phoneNumber,
      bvn: profileDetails && profileDetails?.bvn === undefined ? '' : profileDetails?.bvn,
      dob:
        profileDetails && profileDetails?.dob === undefined
          ? ''
          : profileDetails?.dob?.substr(0, 10),
      address:
        profileDetails && profileDetails?.address === undefined ? '' : profileDetails?.address,
      country:
        profileDetails && profileDetails?.country === undefined ? '' : profileDetails?.country,
      state: profileDetails && profileDetails?.state === undefined ? '' : profileDetails?.state,
      city: profileDetails && profileDetails?.city === undefined ? '' : profileDetails?.city,
      maritalStatus:
        profileDetails && profileDetails?.maritalStatus === undefined
          ? ''
          : profileDetails?.maritalStatus,
      eduLevel:
        profileDetails && profileDetails?.eduLevel === undefined ? '' : profileDetails?.eduLevel,
      gender: profileDetails && profileDetails?.gender === undefined ? '' : profileDetails?.gender,

      residentialStatus:
        profileDetails && profileDetails?.residentialStatus === undefined
          ? ''
          : profileDetails?.residentialStatus,
      yearYouMovedToCurrentAddress:
        profileDetails && profileDetails?.yearYouMovedToCurrentAddress === undefined
          ? ''
          : profileDetails?.yearYouMovedToCurrentAddress,
      NoOfDependents:
        profileDetails && profileDetails?.NoOfDependents === undefined
          ? 0
          : profileDetails?.NoOfDependents,
    });
  }, [profileDetails]);

  const disableit =
    !userDetails.phoneNumber ||
    !userDetails.address ||
    !userDetails.title ||
    !userDetails.firstName ||
    !userDetails.lastName ||
    !userDetails.email;

  const [state, setState] = useState([]);
  const [cityByState, setCitybyState] = useState([]);
  const [city, setCity] = useState([]);

  useEffect(() => {
    setState(toJS(loansStore.state));
    setCity(toJS(loansStore.city));
  }, [loansStore.state, loansStore.city]);

  useEffect(() => {
    if (userDetails.state !== '') {
      setCitybyState(state.filter((statee) => statee === userDetails.state));
    }
  }, [userDetails.state, state]);

  const stateCity = cityByState[0];

  useEffect(() => {
    loansStore.getState();
    loansStore.getCity(stateCity);
  }, [loansStore, stateCity]);

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = (selectedDate) => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setUserDetails({ ...userDetails, dob: formattedDate });
    setShow(false);
  };

  const handleCreatePersonalDetails = () => {
    loansStore.createUserProfile(userDetails);
  };

  const handleUpdatePersonalDetails = () => {
    loansStore.updatePersonalDetails(userDetails);
  };

  const prevRoutes = route?.params?.paramKey;

  useEffect(() => {
    if (success === 'profile successful') {
      if (prevRoutes !== 'myAccount') {
        navigation.navigate('BusinessDetails');
      } else {
        navigation.navigate('MyAccount');
        authStore.getProfileDetails();
      }
    }
  }, [authStore, navigation, prevRoutes, success]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}
    >
      {loadingProfile && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      {sending && (
        <Spinner
          textContent={'Updating Profile Details...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}
          >
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>PERSONAL DETAILS</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.HeadView}>
            <Text style={styles.extraText}>
              Please update your personal details to get started.
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Title
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.title}
                onValueChange={(text) => setUserDetails({ ...userDetails, title: text })}
              >
                <Picker.Item label="Select Title" value="" />
                <Picker.Item label="Mr" value="Mr" />
                <Picker.Item label="Mrs" value="Mrs" />
                <Picker.Item label="Miss" value="Miss" />
                <Picker.Item label="Dr" value="Dr" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="First name"
            defaultValue={profileDetails?.firstName}
            onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text.trim() })}
            isNeeded={true}
          />

          <CustomInput
            label="Last name"
            defaultValue={profileDetails?.lastName}
            onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text.trim() })}
            isNeeded={true}
          />

          <CustomInput
            label="Email"
            keyboardType="email-address"
            defaultValue={profileDetails?.email}
            onChangeText={(text) => setUserDetails({ ...userDetails, email: text.trim() })}
            isNeeded={true}
          />

          <View style={{ marginVertical: 10 }}>
            <View style={{ marginBottom: -14 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Phone number</Text>
                <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
              </View>
            </View>
            <View>
              <PhoneInput
                defaultCode="NG"
                layout="first"
                textContainerStyle={styles.phonetextContainer}
                textInputStyle={styles.phonetext}
                containerStyle={styles.phoneContainer}
                placeholder=" "
                defaultValue={profileDetails?.phoneNumber}
                codeTextStyle={{ color: '#6E7191' }}
                onChangeFormattedText={(text) =>
                  setUserDetails({ ...userDetails, phoneNumber: text })
                }
              />
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Gender
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.gender}
                onValueChange={(text) => setUserDetails({ ...userDetails, gender: text })}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Prefer Not To Say" value="Prefer Not To Say" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="BVN"
            defaultValue={userDetails.bvn}
            onChangeText={(text) => setUserDetails({ ...userDetails, bvn: text.trim() })}
            keyboardType="numeric"
          />

          <Pressable onPress={showDatePicker}>
            <CustomInput
              label="Date of Birth"
              placeholder="2000 - 01 - 01"
              defaultValue={userDetails.dob ? userDetails.dob.toString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
              onChangeValue={(text) => setUserDetails({ ...userDetails, dob: text })}
              isNeeded={true}
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

          <CustomInput
            label="Address"
            defaultValue={userDetails.address}
            onChangeText={(text) => setUserDetails({ ...userDetails, address: text })}
            isNeeded={true}
          />

          <CustomInput
            label="Country"
            defaultValue={userDetails.country}
            onChangeText={(text) => setUserDetails({ ...userDetails, country: text })}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginVertical: 10, paddingRight: 5, width: '50%' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                State
              </Text>
              <View style={styles.pick}>
                <Picker
                  selectedValue={userDetails.state}
                  onValueChange={(text) => setUserDetails({ ...userDetails, state: text })}
                >
                  {state.map((stateee) => (
                    <Picker.Item label={stateee} value={stateee} key={stateee} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{ marginVertical: 10, paddingLeft: 5, width: '50%' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                LGA
              </Text>
              <View style={styles.pick}>
                {city && (
                  <Picker
                    selectedValue={userDetails.city}
                    onValueChange={(text) => setUserDetails({ ...userDetails, city: text })}
                  >
                    {city.map((lg) => (
                      <Picker.Item label={lg} value={lg} key={lg} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Residential Status
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.residentialStatus}
                onValueChange={(text) =>
                  setUserDetails({ ...userDetails, residentialStatus: text })
                }
              >
                <Picker.Item label="Select status" value="" />
                <Picker.Item label="Renting" value="Renting" />
                <Picker.Item label="Owner" value="Owner" />
                <Picker.Item label="Subletting" value="Subletting" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              When did you move to that address?
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.yearYouMovedToCurrentAddress}
                onValueChange={(text) =>
                  setUserDetails({ ...userDetails, yearYouMovedToCurrentAddress: text })
                }
              >
                <Picker.Item label="Select status" value="" />
                <Picker.Item label="0-1 years" value="0-1 years" />
                <Picker.Item label="1-3 years" value="1-3 years" />
                <Picker.Item label="3-5 years" value="3-5 years" />
                <Picker.Item label="5-10 years" value="5-10 years" />
                <Picker.Item label="10+ years" value="10+ years" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Marital Status
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.maritalStatus}
                onValueChange={(text) => setUserDetails({ ...userDetails, maritalStatus: text })}
              >
                <Picker.Item label="Select status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Married" value="Married" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
                <Picker.Item label="Separated" value="Separated" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Educational Level
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={userDetails.eduLevel}
                onValueChange={(text) => setUserDetails({ ...userDetails, eduLevel: text })}
              >
                <Picker.Item label="Select status" value="" />
                <Picker.Item label="Primary School" value="Primary School" />
                <Picker.Item label="Secondary School" value="Secondary School" />
                <Picker.Item
                  label="Ordinary National Diploma (OND)"
                  value="Ordinary National Diploma (OND)"
                />
                <Picker.Item
                  label="Higher National Diploma (HND)"
                  value="Higher National Diploma (HND)"
                />
                <Picker.Item label="Bachelors" value="Bachelors" />
                <Picker.Item label="Masters" value="Masters" />
                <Picker.Item label="PHD" value="PHD" />
                <Picker.Item label="Post Graduate Diploma" value="Post Graduate Diploma" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Number of dependents"
            defaultValue={profileDetails?.NoOfDependents?.toString()}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, NoOfDependents: parseInt(text, 10) })
            }
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={
              profileDetails?.email === undefined
                ? handleCreatePersonalDetails
                : handleUpdatePersonalDetails
            }
            disabled={disableit}
            style={{ marginBottom: 30 }}
          >
            <View style={{ marginBottom: 30, marginTop: 20 }}>
              <Buttons label="Save & Continue" disabled={disableit} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(UpdatePersonalDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
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
    fontFamily: 'Montserat',
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
    shadowOffset: { width: 0, height: 2 },
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
});
