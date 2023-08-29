import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import { StoreContext } from '../../config/mobX stores/RootStore';
import { observer } from 'mobx-react-lite';
import Buttons from '../buttons/Buttons';

const NextOfKin = () => {
  const navigation = useNavigation();
  const { loansStore } = useContext(StoreContext);
  const { loanUserdetails } = loansStore;

  const nokDeets = loanUserdetails?.nextOfKinDetails;

  useEffect(() => {
    loansStore.getLoanUserDetails();
  }, [loansStore]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('NextOfKin', { paramKey: 'myAccount' })}
        style={{ marginBottom: 20 }}
      >
        <Buttons label={'Update Next Of Kin Details'} />
      </TouchableOpacity>

      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${nokDeets?.firstName === undefined ? 'N/A' : nokDeets?.firstName} ${
            nokDeets?.lastName === undefined ? 'N/A' : nokDeets?.lastName
          }`}
          subLabel="Full name"
        />

        <CustomView
          label={`${nokDeets?.gender === undefined ? 'N/A' : nokDeets?.gender}`}
          subLabel="Gender"
        />

        <CustomView
          label={`${nokDeets?.email === undefined ? 'N/A' : nokDeets?.email}`}
          subLabel="Email"
        />

        <CustomView
          label={`${nokDeets?.phoneNumber === undefined ? 'N/A' : nokDeets?.phoneNumber}`}
          subLabel="Phone number"
        />

        <CustomView
          label={`${nokDeets?.relationship === undefined ? 'N/A' : nokDeets?.relationship}`}
          subLabel="Next of kin's Relationship"
        />

        <CustomView
          label={`${nokDeets?.Address === undefined ? 'N/A' : nokDeets?.Address}`}
          subLabel="Address"
        />
      </ScrollView>
    </View>
  );
};

export default observer(NextOfKin);
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
