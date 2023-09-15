import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import Buttons from '../buttons/Buttons';
import {getLoanUserDetails} from '../../stores/LoanStore';

const Business = () => {
  const navigation = useNavigation();
  const [orgDeets, setOrgDeets] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'MyAccount') {
      const unsubscribe = navigation.addListener('focus', async () => {
        unSubBusinessDetails();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    unSubBusinessDetails();
  }, []);

  const unSubBusinessDetails = async () => {
    const res = await getLoanUserDetails();
    if (res?.error) {
      // TODO: handle error
    } else {
      setOrgDeets(res?.data?.organizationDetails);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BusinessDetails', {paramKey: 'myAccount'})
        }
        style={{marginBottom: 20}}>
        <Buttons label={'Update Business Details'} />
      </TouchableOpacity>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${
            orgDeets?.businessType === undefined
              ? 'N/A'
              : orgDeets?.businessType
          }`}
          subLabel="Business type"
        />

        <CustomView
          label={`${
            orgDeets?.businessName === undefined
              ? 'N/A'
              : orgDeets?.businessName
          }`}
          subLabel="Business name"
        />
        <CustomView
          label={`${
            orgDeets?.positionInOrg === undefined
              ? 'N/A'
              : orgDeets?.positionInOrg
          }`}
          subLabel="Position in company"
        />
        <CustomView
          label={`${
            orgDeets?.shareInOrg === undefined ? 'N/A' : orgDeets?.shareInOrg
          }`}
          subLabel="Share in company"
        />

        <CustomView
          label={`${orgDeets?.rcNum === undefined ? 'N/A' : orgDeets?.rcNum}`}
          subLabel="RC/BN number"
        />

        <CustomView
          label={`${
            orgDeets?.establishmentDate === undefined
              ? 'N/A'
              : orgDeets?.establishmentDate?.substr(0, 10)
          }`}
          subLabel="Establishment date"
        />

        <CustomView
          label={`${
            orgDeets?.businessAddress === undefined
              ? 'N/A'
              : orgDeets?.businessAddress
          }`}
          subLabel="Business address"
        />

        <CustomView
          label={`${
            orgDeets?.country === undefined ? 'N/A' : orgDeets?.country
          }`}
          subLabel="Country"
        />

        <CustomView
          label={`${orgDeets?.state === undefined ? 'N/A' : orgDeets?.state}`}
          subLabel="State"
        />

        <CustomView
          label={`${orgDeets?.city === undefined ? 'N/A' : orgDeets?.city}`}
          subLabel="City"
        />

        <CustomView
          label={`${
            orgDeets?.whenDidYouMoveToThisBusinessLocation === undefined
              ? 'N/A'
              : orgDeets?.whenDidYouMoveToThisBusinessLocation?.substr(0, 10)
          }`}
          subLabel="When did you move to this business location?"
        />

        <CustomView
          label={`${
            orgDeets?.NoOfOutlets === undefined ? 'N/A' : orgDeets?.NoOfOutlets
          }`}
          subLabel="Number of outlets"
        />

        <CustomView
          label={`${
            orgDeets?.totalEmployees === undefined
              ? 'N/A'
              : orgDeets?.totalEmployees
          }`}
          subLabel="Total employees"
        />

        <CustomView
          label={`${
            orgDeets?.salesMethod === undefined ? 'N/A' : orgDeets?.salesMethod
          }`}
          subLabel="Sales method"
        />

        <CustomView
          label={`${
            orgDeets?.industry === undefined ? 'N/A' : orgDeets?.industry
          }`}
          subLabel="Industry"
        />

        <CustomView
          label={`${
            orgDeets?.monthlySales === undefined
              ? 'N/A'
              : orgDeets?.monthlySales
          }`}
          subLabel="Monthly sales"
        />

        <CustomView
          label={`${
            orgDeets?.monthlyExpenses === undefined
              ? 'N/A'
              : orgDeets?.monthlyExpenses
          }`}
          subLabel="Monthly expenses"
        />

        <CustomView
          label={`${
            orgDeets?.businessDuration === undefined
              ? 'N/A'
              : orgDeets?.businessDuration
          }`}
          subLabel="Business duration"
        />

        <CustomView
          label={`${
            orgDeets?.womenLed === undefined
              ? 'N/A'
              : `${orgDeets?.womenLed === true ? 'Yes' : 'No'}`
          }`}
          subLabel="Is your business woman led?"
        />

        <CustomView
          label={`${
            orgDeets?.shariaCom === undefined
              ? 'N/A'
              : `${orgDeets?.shariaCom === true ? 'Yes' : 'No'}`
          }`}
          subLabel="Is your business sharia compliant?"
        />

        <CustomView
          label={`${
            orgDeets?.registered === undefined
              ? 'N/A'
              : `${orgDeets?.registered === true ? 'Yes' : 'No'}`
          }`}
          subLabel="Is your business registered?"
        />

        <CustomView
          label={`${orgDeets?.tin === undefined ? 'N/A' : orgDeets?.tin}`}
          subLabel="Tin"
        />

        <CustomView
          label={`${orgDeets?.MAMERT === undefined ? 'N/A' : orgDeets?.MAMERT}`}
          subLabel="MAMERT"
        />
      </ScrollView>
    </View>
  );
};

export default Business;
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
