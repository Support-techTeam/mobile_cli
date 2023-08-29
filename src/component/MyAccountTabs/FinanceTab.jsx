import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import { StoreContext } from '../../config/mobX stores/RootStore';
import { observer } from 'mobx-react-lite';
import Buttons from '../buttons/Buttons';

const Finance = () => {
  const navigation = useNavigation();
  const { loansStore } = useContext(StoreContext);
  const { loanUserdetails } = loansStore;

  const bankDeets = loanUserdetails?.bankDetails;
  useEffect(() => {
    loansStore.getLoanUserDetails();
  }, [loansStore]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BankDetails', { paramKey: 'myAccount' })}
        style={{ marginBottom: 20 }}
      >
        <Buttons label={'Update Finance Details'} />
      </TouchableOpacity>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${bankDeets?.email === undefined ? 'N/A' : bankDeets?.email}`}
          subLabel="Email"
        />

        <CustomView
          label={`${bankDeets?.bankName === undefined ? 'N/A' : bankDeets?.bankName}`}
          subLabel="Bank name"
        />

        <CustomView
          label={`${bankDeets?.bankAccountName === undefined ? 'N/A' : bankDeets?.bankAccountName}`}
          subLabel="Bank account name"
        />

        <CustomView
          label={`${
            bankDeets?.bankAccountNumber === undefined ? 'N/A' : bankDeets?.bankAccountNumber
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
              : `${bankDeets?.wasLoanTakenWithinTheLast12Months === true ? 'Yes' : 'No'}`
          }`}
          subLabel="Have you taken a loan in the past 12months?"
        />

        <CustomView
          label={`${bankDeets?.loanAmount === undefined ? 'N/A' : bankDeets?.loanAmount}`}
          subLabel="Loan amount"
        />
      </ScrollView>
    </View>
  );
};

export default observer(Finance);
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
