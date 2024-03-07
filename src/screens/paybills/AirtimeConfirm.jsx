import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import { Header } from '../../component/header/Header';

const AirtimeConfirm = ({route}) => {
  const navigation = useNavigation();
  const {airtimeDetails} = route?.params;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <View>
     
      <Header
        routeAction={() => navigation.goBack()}
        heading="BILLING SUMMARY"
        disable={false}
      />
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[styles.innercontainer]}>
          <View style={{marginTop: 24, alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{marginBottom: 8}}>Amount</Text>
              <Text style={{fontFamily: 'serif', marginBottom: 8}}>
                ₦{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(airtimeDetails?.amount))}
              </Text>
              <Text style={{marginBottom: 8}}>To:</Text>
              <Text style={{fontFamily: 'serif', marginBottom: 8}}>
                {airtimeDetails?.number}
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.detailView}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{marginBottom: 8}}>Bill Type:</Text>
                <Text
                  style={{
                    fontFamily: 'serif',
                    marginBottom: 8,
                    color: '#054B99',
                  }}>
                  {airtimeDetails?.service}
                </Text>
              </View>
              {airtimeDetails.package && (
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 8}}>Data Plan:</Text>
                  <Text
                    style={{
                      fontFamily: 'serif',
                      marginBottom: 8,
                      color: '#054B99',
                    }}>
                    {airtimeDetails?.package}
                  </Text>
                </View>
              )}
              {airtimeDetails?.service == 'electricity purchase' && (
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 8}}>Meter Number:</Text>
                  <Text
                    style={{
                      fontFamily: 'serif',
                      marginBottom: 8,
                      color: '#000',
                    }}>
                    {airtimeDetails?.meter}
                  </Text>
                </View>
              )}
              {airtimeDetails?.service == 'cable_tv purchase' && (
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 8}}>Card Number:</Text>
                  <Text
                    style={{
                      fontFamily: 'serif',
                      marginBottom: 8,
                      color: '#000',
                    }}>
                    {airtimeDetails?.cardNumber}
                  </Text>
                </View>
              )}
              {airtimeDetails?.service == 'cable_tv purchase' && (
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 8}}>Bouquet:</Text>
                  <Text
                    style={{
                      fontFamily: 'serif',
                      marginBottom: 8,
                      color: '#000',
                    }}>
                    {airtimeDetails?.variationCode}
                  </Text>
                </View>
              )}

              {airtimeDetails?.service == 'cable_tv purchase' && (
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 8}}>Subscription:</Text>
                  <Text
                    style={{
                      fontFamily: 'serif',
                      marginBottom: 8,
                      color: '#000',
                    }}>
                    {airtimeDetails?.status}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <Text style={{marginBottom: 8}}>Transaction Fee:</Text>
                <Text style={{fontFamily: 'serif', marginBottom: 8}}>
                  ₦{' '}
                  {airtimeDetails?.transactionFee
                    ? new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(parseFloat(airtimeDetails?.transactionFee))
                    : '0.00'}
                </Text>
              </View>
            </View>
            <View style={[styles.detailView, {backgroundColor: '#fff'}]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{marginBottom: 8}}>Description</Text>
                <Text style={{fontFamily: 'serif', marginBottom: 8}}>
                  {airtimeDetails?.network} {airtimeDetails?.service}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <Text style={{marginBottom: 8}}>
                  {airtimeDetails?.service == 'electricity purchase' ||
                  airtimeDetails?.service == 'cable_tv purchase'
                    ? 'Provider'
                    : 'Network'}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: 'serif',
                      marginBottom: 8,
                    }}>
                    {airtimeDetails?.network}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{marginTop: 60}}
              onPress={() =>
                navigation.navigate('BillPin', {
                  airtimeDetails,
                })
              }>
              <Buttons label="Proceed" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AirtimeConfirm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },

  detailView: {
    backgroundColor: '#F7F7FC',
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  cont: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
  },
  TextHead: {
    fontFamily: 'serif',

    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },

  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },

  desc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
});
