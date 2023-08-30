import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../config/mobX stores/RootStore';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BankDetails = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { loansStore } = useContext(StoreContext);
  const { success, sending, credrails, loanUserdetails, loading } = loansStore;

  useEffect(() => {
    loansStore.getLoanUserDetails();
  }, [loansStore]);

  const bankDeets = loanUserdetails?.bankDetails;

  const [bankDetails, setBankDetails] = useState({
    email: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    hasOnlineBanking: true,
    wasLoanTakenWithinTheLast12Months: false,
    loanAmount: '',
  });

  useEffect(() => {
    setBankDetails({
      email: bankDeets && bankDeets?.email === undefined ? '' : bankDeets?.email,
      bankName: bankDeets && bankDeets?.bankName === undefined ? '' : bankDeets?.bankName,
      bankAccountNumber:
        bankDeets && bankDeets?.bankAccountNumber === undefined ? '' : bankDeets?.bankAccountNumber,
      bankAccountName:
        bankDeets && bankDeets?.bankAccountName === undefined ? '' : bankDeets?.bankAccountName,
      hasOnlineBanking:
        bankDeets && bankDeets?.hasOnlineBanking === undefined ? true : bankDeets?.hasOnlineBanking,
      wasLoanTakenWithinTheLast12Months:
        bankDeets && bankDeets?.wasLoanTakenWithinTheLast12Months === undefined
          ? false
          : bankDeets?.wasLoanTakenWithinTheLast12Months,
      loanAmount: bankDeets && bankDeets?.loanAmount === undefined ? '' : bankDeets?.loanAmount,
    });
  }, [bankDeets]);

  const [credailsDetails, setCredailsDetails] = React.useState({
    email: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const disableit =
    !bankDetails.bankName ||
    !bankDetails.email ||
    !bankDetails.bankAccountNumber ||
    !bankDetails.bankAccountName ||
    bankDetails.wasLoanTakenWithinTheLast12Months === '' ||
    !bankDetails.hasOnlineBanking;

  useEffect(() => {
    loansStore.getCredailsBanks();
  }, [loansStore]);

  const onEmailChange = (text) => {
    setBankDetails({ ...bankDetails, email: text });
    setCredailsDetails({ ...credailsDetails, email: text });
  };

  const onBankNameChange = (text) => {
    setBankDetails({ ...bankDetails, bankName: text });
    setCredailsDetails({ ...credailsDetails, bankName: text });
  };

  const onBankAccountNameChange = (text) => {
    setBankDetails({ ...bankDetails, bankAccountName: text });
    setCredailsDetails({ ...credailsDetails, bankAccountName: text });
  };

  const onBankAccountNumberChange = (text) => {
    setBankDetails({ ...bankDetails, bankAccountNumber: text });
    setCredailsDetails({ ...credailsDetails, bankAccountNumber: text });
  };

  const handleCreateBankDetails = () => {
    loansStore.createBankDetails(bankDetails);
    loansStore.createCredailsDetails(credailsDetails);
  };

  const handleUpdateBankDetails = () => {
    loansStore.updateBankDetails(bankDetails);
  };

  const prevRoutes = route?.params?.paramKey;

  useEffect(() => {
    if (success === 'bank successful') {
      if (prevRoutes !== 'myAccount') {
        navigation.navigate('ValidIndentity');
      } else {
        navigation.navigate('MyAccount');
        loansStore.getLoanUserDetails();
      }
    }
  }, [loansStore, navigation, prevRoutes, success]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}
    >
      {sending && (
        <Spinner
          textContent={'Please wait...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      {loading && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}
          >
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View>
          <View>
            <Text style={styles.TextHead}>BANK DETAILS</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.innercontainer]}
      >
        <View style={styles.form}>
          <Text style={styles.header}>
            Industry regulation requires us to collect this information to verify your identity.
          </Text>
          <Text style={[styles.header, { color: 'red' }]}>
            *Please enter your valid bank account details*
          </Text>
        </View>

        <View>
          <CustomInput
            label="Email"
            autoCorrect={false}
            defaultValue={bankDetails?.email}
            autoCapitalize="none"
            onChangeText={(text) => onEmailChange(text)}
            isNeeded={true}
          />

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Bank name
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={bankDetails?.bankName}
                onValueChange={(text) => onBankNameChange(text)}
              >
                <Picker.Item label="Select Bank" value="" />

                {credrails?.map((bank, i) => (
                  <Picker.Item label={bank} value={bank} key={i} />
                ))}
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Bank account name"
            defaultValue={bankDetails?.bankAccountName}
            onChangeText={(text) => onBankAccountNameChange(text)}
            isNeeded={true}
          />

          <CustomInput
            label="Bank account number"
            keyboardType="numeric"
            defaultValue={bankDetails?.bankAccountNumber}
            onChangeText={(text) => onBankAccountNumberChange(text)}
            isNeeded={true}
          />

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Do you use online banking?
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={bankDetails?.hasOnlineBanking}
                onValueChange={(text) =>
                  setBankDetails({
                    ...bankDetails,
                    hasOnlineBanking:
                      text === false
                        ? // eslint-disable-next-line no-undef
                          toast.show(
                            'Please open a mobile application with your bank to continue with this process!',
                            {
                              type: 'danger',
                              duration: 6000,
                            },
                          )
                        : true,
                  })
                }
              >
                <Picker.Item label="Select value" value="" />
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Have you taken a loan in the past 12months?
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={bankDetails?.wasLoanTakenWithinTheLast12Months}
                onValueChange={(text) =>
                  setBankDetails({
                    ...bankDetails,
                    wasLoanTakenWithinTheLast12Months: text,
                  })
                }
              >
                <Picker.Item label="Select Value" value="" />
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="If yes, how much?"
            keyboardType="numeric"
            defaultValue={bankDetails?.loanAmount}
            onChangeText={(text) => setBankDetails({ ...bankDetails, loanAmount: text })}
          />

          <TouchableOpacity
            onPress={
              bankDeets?.email === undefined ? handleCreateBankDetails : handleUpdateBankDetails
            }
            disabled={disableit}
          >
            <View style={{ marginBottom: 40, marginTop: 20 }}>
              <Buttons label="Save & Continue" disabled={disableit} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(BankDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  HeadView: {
    alignItems: 'center',
    marginTop: 34,
    // backgroundColor:'blue'
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontFamily: 'Montserat',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  extraText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    color: '#14142B',
  },
  pick: {
    marginBottom: 10,
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    // padding:10,
    justifyContent: 'center',
  },
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    // borderWidth:.5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',
    fontFamily: 'Montserat',
    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  extraView: {
    alignItems: 'center',
    marginTop: 30,
  },
  extra: {
    fontFamily: 'Montserat',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontWeight: '500',
  },
  continue: {
    marginVertical: 30,
    backgroundColor: '#054B99',
    width: '50%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonetextContainer: {
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 0,
    // alignItems:'center',
    height: 30,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 1,
  },
  phoneContainer: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    marginTop: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonetext: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontFamily: 'Montserat',
  },
});
