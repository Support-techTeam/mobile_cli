import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import Buttons from '../buttons/Buttons';
import {getLoanUserDetails} from '../../stores/LoanStore';

const Finance = () => {
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
    const res = await getLoanUserDetails();
    if (res?.error) {
      // TODO: handle error
    } else {
      setBankDeets(res?.data?.bankDetails);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BankDetails', {paramKey: 'myAccount'})
        }
        style={{marginBottom: 20}}>
        <Buttons label={'Update Finance Details'} />
      </TouchableOpacity>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* <CustomView
          label={`${bankDeets?.email === undefined ? 'N/A' : bankDeets?.email}`}
          subLabel="Email"
        /> */}

        <CustomView
          label={`${
            bankDeets?.bankName === undefined ? 'N/A' : bankDeets?.bankName
          }`}
          subLabel="Bank name"
        />

        <CustomView
          label={`${
            bankDeets?.bankAccountName === undefined
              ? 'N/A'
              : bankDeets?.bankAccountName
          }`}
          subLabel="Bank account name"
        />

        <CustomView
          label={`${
            bankDeets?.bankAccountNumber === undefined
              ? 'N/A'
              : bankDeets?.bankAccountNumber
          }`}
          subLabel="Bank account number"
        />

        <CustomView
          label={`${
            bankDeets?.hasOnlineBanking === undefined
              ? 'N/A'
              : `${bankDeets?.hasOnlineBanking === true ? 'Yes' : 'No'}`
          }`}
          subLabel="Do you use online banking?"
        />

        <CustomView
          label={`${
            bankDeets?.wasLoanTakenWithinTheLast12Months === undefined
              ? 'N/A'
              : `${
                  bankDeets?.wasLoanTakenWithinTheLast12Months === true
                    ? 'Yes'
                    : 'No'
                }`
          }`}
          subLabel="Have you taken a loan in the past 12months?"
        />

        <CustomView
          label={`${
            bankDeets?.loanAmount === undefined ? 'N/A' : bankDeets?.loanAmount
          }`}
          subLabel="Loan amount"
        />
      </ScrollView>
    </View>
  );
};

export default Finance;
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
