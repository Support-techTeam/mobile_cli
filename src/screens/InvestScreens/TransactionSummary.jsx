import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const TransactionSummary = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    investmentType,
    investmentTenor,
    investmentAmount,
    transactionPin,
    productCode,
    name,
    description,
  } = route.params;

  const handleCreateARMInvestment = () => {
    const payload = {
      productCode: productCode,
      investmentAmount: Number(investmentAmount),
    };

    console.log(payload);
  };

  const handleCreateLendaInvestment = () => {
    const payload = {
      investmentType: investmentType,
      investmentTenor: investmentTenor,
      investmentAmount: Number(investmentAmount),
      transactionPin: transactionPin,
    };

    console.log(payload);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
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
            <Text style={styles.TextHead}>INVESTMENT SUMMARY</Text>
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
          <View style={styles.detailsView}>
            <Text style={styles.desc}>Investment</Text>
            <Text style={styles.amount}>
              {name === 'Arm' ? productCode : investmentType}
            </Text>
          </View>

          {name === 'Arm' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Description</Text>
              <Text style={styles.amount}>{description}</Text>
            </View>
          )}

          <View style={styles.detailsView}>
            <Text style={styles.desc}>Investment Amount</Text>
            <Text style={styles.amount}>
              ₦{investmentAmount?.toString()?.replace(/\B(?=(\d{3})+\b)/g, ',')}
            </Text>
          </View>

          {name === 'Lenda' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Investment Tenor</Text>
              <Text style={[styles.amount, {fontFamily: 'serif'}]}>
                {investmentTenor}
              </Text>
            </View>
          )}
          <View style={styles.detailsView}>
            <Text style={styles.desc}>Transaction fee</Text>
            <Text style={styles.amount}>₦ 0.00</Text>
          </View>

          <View style={styles.demark} />
          <View style={[styles.detailsView, {marginTop: 40}]}>
            <Text style={styles.desc}>Total</Text>
            <Text style={[styles.amount, {color: '#054B99'}]}>
              ₦{investmentAmount?.toString()?.replace(/\B(?=(\d{3})+\b)/g, ',')}
            </Text>
          </View>
          <View style={styles.demark} />

          <TouchableOpacity
            style={{marginTop: 140}}
            onPress={() => {
              if (name === 'Arm') {
                handleCreateARMInvestment();
              }
              if (name === 'Lenda') {
                handleCreateLendaInvestment();
              }
            }}>
            <Buttons label={'Confirm'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionSummary;

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
