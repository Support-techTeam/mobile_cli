import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import Buttons from '../buttons/Buttons';
import {getLoanUserDetails} from '../../stores/LoanStore';

const NextOfKin = () => {
  const navigation = useNavigation();
  const [nokDeets, setNokDeets] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'MyAccount') {
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
    const res = await getLoanUserDetails();
    if (res.error) {
      // TODO: handle error
    } else {
      setNokDeets(res?.data?.nextOfKinDetails);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('NextOfKin', {paramKey: 'myAccount'})
        }
        style={{marginBottom: 20}}>
        <Buttons label={'Update Next Of Kin Details'} />
      </TouchableOpacity>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${
            nokDeets?.firstName === undefined ? 'N/A' : nokDeets?.firstName
          } ${nokDeets?.lastName === undefined ? 'N/A' : nokDeets?.lastName}`}
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
          label={`${
            nokDeets?.phoneNumber === undefined ? 'N/A' : nokDeets?.phoneNumber
          }`}
          subLabel="Phone number"
        />

        <CustomView
          label={`${
            nokDeets?.relationship === undefined
              ? 'N/A'
              : nokDeets?.relationship
          }`}
          subLabel="Next of kin's Relationship"
        />

        <CustomView
          label={`${
            nokDeets?.Address === undefined ? 'N/A' : nokDeets?.Address
          }`}
          subLabel="Address"
        />
      </ScrollView>
    </View>
  );
};

export default NextOfKin;
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
