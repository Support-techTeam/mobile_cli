import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import Buttons from '../buttons/Buttons';
import {getLoanUserDetails} from '../../stores/LoanStore';

const ARM = () => {
  const navigation = useNavigation();
  const [bankDeets, setBankDeets] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'MyAccount') {
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
      const res = await getLoanUserDetails();
      if (res?.error) {
        // TODO: handle error
      } else {
        setBankDeets(res?.data?.armUserBankDetails);
      }
    } catch (e) {
      // TODO: handle error
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ArmDetails', {paramKey: 'myAccount'})
        }
        style={{marginBottom: 20}}>
        <Buttons label={'Update ARM Details'} />
      </TouchableOpacity>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${
            bankDeets?.annualExpectedAnnualIncomeRange === undefined
              ? 'N/A'
              : bankDeets?.annualExpectedAnnualIncomeRange
          }`}
          subLabel="Annual Income Range
          "
        />

        <CustomView
          label={`${
            bankDeets?.employmentStatus === undefined
              ? 'N/A'
              : bankDeets?.employmentStatus
          }`}
          subLabel="Employment Status"
        />

        <CustomView
          label={`${
            bankDeets?.issueDateOfId === undefined
              ? 'N/A'
              : bankDeets?.issueDateOfId
          }`}
          subLabel="Issue Date of ID"
        />

        <CustomView
          label={`${
            bankDeets?.expiryDateOfId === undefined
              ? 'N/A'
              : bankDeets?.expiryDateOfId
          }`}
          subLabel="Expiry Date of ID"
        />

        <CustomView
          label={`${
            bankDeets?.kycLevel === undefined ? 'N/A' : bankDeets?.kycLevel
          }`}
          subLabel="Kyc Level"
        />
      </ScrollView>
    </View>
  );
};

export default ARM;
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
