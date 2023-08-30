import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { observer } from 'mobx-react-lite';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import PhoneInput from 'react-native-phone-number-input';
import { StoreContext } from '../../config/mobX stores/RootStore';

const NextOfKin = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { loansStore } = useContext(StoreContext);
  const { success, sending, loanUserdetails, loading } = loansStore;

  useEffect(() => {
    loansStore.getLoanUserDetails();
  }, [loansStore]);

  const nokDetails = loanUserdetails?.nextOfKinDetails;

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
      firstName: nokDetails && nokDetails?.firstName === undefined ? '' : nokDetails?.firstName,
      lastName: nokDetails && nokDetails?.lastName === undefined ? '' : nokDetails?.lastName,
      relationship:
        nokDetails && nokDetails?.relationship === undefined ? '' : nokDetails?.relationship,
      email: nokDetails && nokDetails?.email === undefined ? '' : nokDetails?.email,
      Address: nokDetails && nokDetails?.Address === undefined ? '' : nokDetails?.Address,
      phoneNumber:
        nokDetails && nokDetails?.phoneNumber === undefined ? '' : nokDetails?.phoneNumber,
      gender: nokDetails && nokDetails?.gender === undefined ? '' : nokDetails?.gender,
    });
  }, [nokDetails]);

  const disableit =
    !kinDetails.firstName ||
    !kinDetails.lastName ||
    !kinDetails.relationship ||
    !kinDetails.email ||
    !kinDetails.Address ||
    !kinDetails.phoneNumber ||
    !kinDetails.gender;

  const handleCreateNokDetails = () => {
    loansStore.createNextOfKin(kinDetails);
  };

  const handleUpdateNokDetails = () => {
    loansStore.updateNokDetails(kinDetails);
  };

  const prevRoutes = route?.params?.paramKey;

  useEffect(() => {
    if (success === 'nok successful') {
      if (prevRoutes !== 'myAccount') {
        navigation.navigate('BankDetails');
      } else {
        navigation.navigate('MyAccount');
        loansStore.getLoanUserDetails();
      }
    }
  }, [loansStore, navigation, prevRoutes, success]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}
    >
      {sending && (
        <Spinner
          textContent={'Please wait...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      {loading && (
        <Spinner
          textContent={'Loading...'}
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
          marginHorizontal: 15,
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
        <View>
          <View>
            <Text style={styles.TextHead}>NEXT OF KIN</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.innercontainer]}
      >
        <View style={styles.form}>
          <Text style={styles.header}>
            Trade Lenda requires this information of your next of kin
          </Text>
        </View>
        <View>
          <CustomInput
            label="First name"
            defaultValue={kinDetails.firstName}
            onChangeText={(text) => setKinDetails({ ...kinDetails, firstName: text })}
            isNeeded={true}
          />
          <CustomInput
            label="Last name"
            defaultValue={kinDetails.lastName}
            onChangeText={(text) => setKinDetails({ ...kinDetails, lastName: text })}
            isNeeded={true}
          />
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
                Gender
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={kinDetails.gender}
                onValueChange={(itemValue) => setKinDetails({ ...kinDetails, gender: itemValue })}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Next of kin's Relationship"
            value={kinDetails.relationship}
            onChangeText={(text) => setKinDetails({ ...kinDetails, relationship: text })}
            isNeeded={true}
          />

          <CustomInput
            label="Email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            defaultValue={kinDetails.email}
            onChangeText={(text) => setKinDetails({ ...kinDetails, email: text })}
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
                defaultValue={kinDetails?.phoneNumber}
                codeTextStyle={{ color: '#6E7191' }}
                onChangeFormattedText={(text) =>
                  setKinDetails({ ...kinDetails, phoneNumber: text })
                }
              />
            </View>
          </View>

          <CustomInput
            label="Address"
            defaultValue={kinDetails.Address}
            onChangeText={(text) => setKinDetails({ ...kinDetails, Address: text })}
            isNeeded={true}
          />

          <TouchableOpacity
            onPress={
              nokDetails?.firstName === undefined ? handleCreateNokDetails : handleUpdateNokDetails
            }
            disabled={disableit}
          >
            <View style={{ marginBottom: 40, marginTop: 20 }}>
              <Buttons label="Save & Continue" disabled={disableit} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(NextOfKin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginTop: 34,
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
    shadowOffset: { width: 0, height: 2 },
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
