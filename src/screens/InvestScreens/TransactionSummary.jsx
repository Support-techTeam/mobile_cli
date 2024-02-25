import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';

import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createArmInvestment,
  createLendaInvestment,
  topUpArmInvestment,
  topUpLendaInvestment,
} from '../../stores/InvestStore';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import appsFlyer from 'react-native-appsflyer';

const TransactionSummary = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {
    investmentType,
    investmentTenor,
    investmentAmount,
    transactionPin,
    productCode,
    id,
    name,
    description,
    membershipId,
    leadId,
    potentialClientId,
    action,
  } = route.params;

  const logAppsFlyer = (event, investmentName, activity, value) => {
    const eventName = event;
    const eventValues = {
      investment_type: investmentName,
      activity_type: activity,
      currency: 'NGN',
      revenue: value,
    };

    appsFlyer.logEvent(
      eventName,
      eventValues,
      res => {
        // console.log(res);
      },
      err => {
        // console.error(err);
      },
    );
  };

  const handleCreateARMInvestment = async () => {
    try {
      const payload = {
        productCode: productCode,
        investmentAmount: Number(investmentAmount),
      };
      setIsLoading(true);
      const res = await createArmInvestment(payload);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        logAppsFlyer(
          'invest',
          `ARM ${productCode}`,
          'Initial Investment',
          investmentAmount,
        );
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleTopupARMInvestment = async () => {
    try {
      const payload = {
        membershipId: membershipId,
        productCode: productCode,
        investmentAmount: Number(investmentAmount),
        leadId: leadId,
        potentialClientId: potentialClientId,
      };
      setIsLoading(true);
      const res = await topUpArmInvestment(payload);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        logAppsFlyer(
          'invest',
          `ARM ${productCode} ${membershipId}`,
          'Investment Topup',
          investmentAmount,
        );
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleCreateLendaInvestment = async () => {
    try {
      const payload = {
        investmentType: investmentType,
        investmentTenor: investmentTenor,
        investmentAmount: investmentAmount.toString(),
        transactionPin: transactionPin,
      };
      setIsLoading(true);
      const res = await createLendaInvestment(payload);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        logAppsFlyer(
          'invest',
          `Lenda ${investmentType}`,
          'Initial Investment',
          investmentAmount,
        );
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleTopupLendaInvestment = async () => {
    try {
      const payload = {
        id: id,
        topUpAmount: investmentAmount.toString(),
        transactionPin: transactionPin,
      };
      setIsLoading(true);
      const res = await topUpLendaInvestment(payload);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        logAppsFlyer(
          'invest',
          `Lenda ${investmentType}`,
          'Investment Topup',
          investmentAmount,
        );
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          navigation.navigate('Invest');
        }, 1000);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={
            action === 'TOP-UP'
              ? 'Investment Top-Up...'
              : 'Creating Investment...'
          }
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
          animation="slide"
        />
      )}
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

          {name === 'Lenda' && action === 'TOP-UP' && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Description</Text>
              <Text style={styles.amount}>{description}</Text>
            </View>
          )}

          {name === 'Arm' && membershipId && (
            <View style={styles.detailsView}>
              <Text style={styles.desc}>Membership ID</Text>
              <Text style={styles.amount}>{membershipId}</Text>
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
              if (name === 'Arm' && action === 'TOP-UP') {
                handleTopupARMInvestment();
              }

              if (name === 'Arm' && action == undefined) {
                handleCreateARMInvestment();
              }

              if (name === 'Lenda' && action == undefined) {
                handleCreateLendaInvestment();
              }
              if (name === 'Lenda' && action === 'TOP-UP') {
                handleTopupLendaInvestment();
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
