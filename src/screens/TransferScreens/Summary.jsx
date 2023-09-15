import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {AntDesign} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const Summary = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {bankDetails} = route.params;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left : 'auto',
        paddingRight: insets.right !== 0 ? insets.right : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>PAYMENT SUMMARY</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{padding: 16}}>
          {bankDetails?.receiverAccountNumber === '' ? (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Wallet Number</Text>
              <Text style={styles.amount}>
                {bankDetails?.toWalletIdAccountNumber}
              </Text>
            </View>
          ) : (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Account Number</Text>
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
              ₦
              {bankDetails?.amount
                ?.toString()
                ?.replace(/\B(?=(\d{3})+\b)/g, ',')}
            </Text>
          </View>

          {/* <View style={styles.detailsView}>
            <Text style={styles.desc}>Transaction Fee</Text>
            <Text style={styles.amount}>₦52.00</Text>
          </View> */}

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
              ₦
              {bankDetails?.amount
                ?.toString()
                ?.replace(/\B(?=(\d{3})+\b)/g, ',')}
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
    // flex: 1,
    // paddingHorizontal: 16,
    // backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    
    fontWeight: '700',
    fontSize: 16,
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
  },
  amount: {
    fontFamily: 'serif',
    fontSize: 16,
  },
  nameComponent: {
    textAlign: 'right',
    fontFamily: 'serif',
    fontSize: 16,
    flexShrink: 1,
  },
});
