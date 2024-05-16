import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';

const Summary = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {bankDetails} = route.params;
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
      <Header
        routeAction={() => navigation.goBack()}
        heading={'TRANSFER SUMMARY'}
        disable={false}
      />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 16}}>
        <View style={{padding: 16}}>
          {bankDetails?.fromWalletIdAccountNumber !== '' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>From Wallet Number</Text>
              <Text style={styles.amount}>
                {bankDetails?.fromWalletIdAccountNumber}
              </Text>
            </View>
          )}

          {bankDetails?.receiverAccountNumber === '' ? (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>To Wallet Number</Text>
              <Text style={styles.amount}>
                {bankDetails?.toWalletIdAccountNumber}
              </Text>
            </View>
          ) : (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>To Account Number</Text>
              <Text style={styles.amount}>
                {bankDetails?.receiverAccountNumber}
              </Text>
            </View>
          )}

          {bankDetails?.receiverAccountFirstName === '' ? (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Account Name</Text>
              <Text style={styles.nameComponent}>
                {bankDetails?.beneficiaryAccountName}
              </Text>
            </View>
          ) : (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Account Name</Text>
              <Text style={styles.amount}>
                {bankDetails?.receiverAccountLastName}{' '}
                {bankDetails?.receiverAccountFirstName}
              </Text>
            </View>
          )}

          <View style={styles.detailsView}>
            <Text style={styles.desc}>Amount</Text>
            <Text style={styles.amount}>
              {bankDetails?.amount &&
                new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(bankDetails?.amount)}
            </Text>
          </View>

          <View style={styles.detailsView}>
            <Text style={styles.desc}>Transaction Fee</Text>
            <Text style={styles.amount}>
              {bankDetails?.fromWalletIdAccountNumber &&
              bankDetails?.fromWalletIdAccountNumber[0] == '4'
                ? '₦25.00'
                : '₦0.00'}
            </Text>
          </View>

          <View style={styles.detailsView}>
            <Text style={styles.desc}>Note</Text>
            <Text style={[styles.amount, {fontFamily: 'serif'}]}>
              {bankDetails?.narration}
            </Text>
          </View>

          <View style={styles.demark} />
          <View style={[styles.detailsView, {marginTop: 40}]}>
            <Text style={styles.desc}>Total</Text>
            <Text style={[styles.amount, {color: '#054B99'}]}>
              {bankDetails?.fromWalletIdAccountNumber &&
              bankDetails?.fromWalletIdAccountNumber[0] == '4'
                ? bankDetails?.amount &&
                  new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(bankDetails?.amount) + 25)
                : bankDetails?.amount &&
                  new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(bankDetails?.amount))}
            </Text>
          </View>
          <View style={styles.demark} />

          <TouchableOpacity
            style={{marginTop: 140}}
            onPress={() =>
              navigation.navigate('Pin', {bankDetails: bankDetails})
            }>
            <Buttons label={'Proceed'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  desc: {
    color: '#4E4B66',
    fontWeight: '500',
    fontSize: 14,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  amount: {
    fontFamily: 'serif',
    fontSize: 14,
  },
  nameComponent: {
    flexShrink: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    textAlign: 'right',
    fontFamily: 'serif',
    fontSize: 14,
    flexShrink: 1,
  },
});
