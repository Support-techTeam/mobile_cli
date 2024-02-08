import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SelectList} from 'react-native-dropdown-select-list';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import CustomInput from '../../component/custominput/CustomInput';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import Buttons from '../../component/buttons/Buttons';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {
  getAllBankDetails,
  verifyBeneficiaryInfo,
  verifyNIPAccountInfo,
} from '../../stores/WalletStore';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';

const defaultData = [
  {value: '', label: 'Select Option'},
  {value: '', label: 'N/A'},
];

const BankDeets = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const prevRoute = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentBanks, setCurrentBanks] = useState(undefined);
  const [numComplete, setNumComplete] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  // const route = useRoute();
  const [bankDetails, setBankDetails] = useState({
    receiverAccountFirstName: '',
    receiverAccountLastName: '',
    receiverAccountNumber: '',
    receiverBankName: '',
    amount: 0,
    narration: '',
    saveBeneficiary: false,
    toWalletIdAccountNumber: '',
    beneficiaryAccountName: '',
    beneficiaryBankName: 'Providus',
  });

  const disableit =
    bankDetails?.amount === 0 ||
    bankDetails?.amount === '' ||
    bankDetails?.narration === '';

  const [holdersName, setHoldersName] = useState('');

  useEffect(() => {
    if (bankDetails?.toWalletIdAccountNumber?.length === 10) {
      setHoldersName('');
      setIsLoading(true);
      const unsubVerifyBeneficiaryInfo = async () => {
        try {
          const res = await verifyBeneficiaryInfo(
            bankDetails?.toWalletIdAccountNumber,
          );
          if (res?.data?.error) {
            Toast.show({
              type: 'error',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.data?.message,
              visibilityTime: 5000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
            setHoldersName('');
          } else {
            setBankDetails({
              ...bankDetails,
              amount: 0,
              narration: '',
              saveBeneficiary: false,
              beneficiaryAccountName: res?.data,
            });
            setHoldersName(res?.data);
          }
        } catch (e) {}
      };

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      unsubVerifyBeneficiaryInfo();
    } else {
    }
  }, [bankDetails?.toWalletIdAccountNumber?.length === 10]);

  useEffect(() => {
    if (prevRoute === 'Nip') {
      handleGetAllBanks();
    }
  }, []);

  useEffect(() => {
    if (route?.name === 'Transfer') {
      if (prevRoute === 'Nip') {
        handleGetAllBanks();
      }
    }
  }, [route]);

  const handleGetAllBanks = async () => {
    setIsFetching(true);
    getAllBankDetails()
      .then(res => {
        if (res) {
          if (res?.error) {
            Toast.show({
              type: 'error',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.data?.message ?? 'Unable to retrieve banks',
              visibilityTime: 5000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
          } else {
            const bankData = res?.data?.map((banks, i) => {
              return {value: banks?.bankName, label: banks?.bankName, key: i};
            });

            if (currentBanks == undefined || currentBanks == '') {
              setCurrentBanks(bankData);
            }
          }
        }
      })
      .catch(error => {})
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (
      bankDetails?.receiverAccountNumber?.length === 10 &&
      bankDetails?.receiverBankName !== ''
    ) {
      setBankDetails({
        ...bankDetails,
        receiverAccountFirstName: '',
        receiverAccountLastName: '',
      });
      setIsLoading(true);
      const unsubVerifyBeneficiaryInfo = async () => {
        try {
          const res = await verifyNIPAccountInfo(
            bankDetails?.receiverAccountNumber,
            bankDetails?.receiverBankName,
          );
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
            setHoldersName('');
          } else {
            setNumComplete(true);
            const [firstPart, ...restParts] = res?.data?.split(/\s(.+)/);
            setBankDetails({
              ...bankDetails,
              receiverAccountFirstName:
                res?.data?.length === undefined ? '' : [...restParts][0],
              receiverAccountLastName:
                res?.data?.length === undefined ? '' : firstPart,
            });
          }
        } catch (e) {}
      };

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      unsubVerifyBeneficiaryInfo();
    } else {
    }
  }, [bankDetails?.receiverAccountNumber?.length === 10]);

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
      {isLoading && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}>
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
            <Text style={styles.TextHead}>TRANSFER FUND</Text>
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
        <View style={styles.innerContainer}>
          <Text
            style={{
              color: '#4E4B66',

              fontWeight: '500',
              marginBottom: 10,
            }}>
            Enter bank account details
          </Text>

          {prevRoute === 'InternalTransfer' ? (
            <>
              <Input
                onChangeText={text =>
                  setBankDetails({
                    ...bankDetails,
                    toWalletIdAccountNumber: text,
                  })
                }
                label="Wallet Number"
                placeholder="Enter beneficiary wallet number"
                keyboardType="numeric"
                isNeeded={true}
              />

              <View style={{marginTop: 10}}>
                {(bankDetails?.toWalletIdAccountNumber).toString().length ===
                  10 && (
                  <>
                    <Input
                      onChangeText={text =>
                        setBankDetails({
                          ...bankDetails,
                          toWalletIdAccountNumber: text,
                        })
                      }
                      iconName="card-account-details"
                      label="Account Name"
                      placeholder="Auto generated Account Name"
                      value={holdersName}
                      defaultValue={bankDetails?.beneficiaryAccountName}
                      isNeeded={true}
                      editable={false}
                    />
                    {holdersName !== '' && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10,
                          }}>
                          <Text style={{color: '#054B99', fontFamily: 'serif'}}>
                            Save Beneficiary
                          </Text>
                          <ToggleSwitch
                            isOn={bankDetails.saveBeneficiary}
                            onColor="#054B99"
                            offColor="#A0A3BD"
                            label=""
                            size="small"
                            onToggle={() =>
                              setBankDetails({
                                ...bankDetails,
                                saveBeneficiary: !bankDetails.saveBeneficiary,
                              })
                            }
                          />
                        </View>

                        <Input
                          onChangeText={text =>
                            setBankDetails({...bankDetails, amount: text})
                          }
                          iconName="cash"
                          label="Amount"
                          placeholder="Enter Amount"
                          keyboardType="numeric"
                          isNeeded={true}
                          isAirtime={true}
                          isBalance={
                            userWalletData &&
                            userWalletData?.availableBalance
                              ?.toString()
                              ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                          }
                        />
                        {bankDetails.amount > 0 && (
                          <>
                            <Input
                              onChangeText={text =>
                                setBankDetails({
                                  ...bankDetails,
                                  narration: text,
                                })
                              }
                              iconName="information"
                              label="Add Narration"
                              placeholder="Enter transaction narration"
                              defaultValue={bankDetails?.narration}
                              isNeeded={true}
                            />

                            {bankDetails?.narration.length >= 3 && (
                              <TouchableOpacity
                                style={{marginTop: 10}}
                                disabled={disableit}
                                onPress={() => {
                                  if (Number(bankDetails?.amount) <= 0) {
                                    Toast.show({
                                      type: 'error',
                                      position: 'top',
                                      topOffset: 50,
                                      text1: 'Wallet Internal Transfer',
                                      text2: 'Invalid amount entered!',
                                      visibilityTime: 5000,
                                      autoHide: true,
                                      onPress: () => Toast.hide(),
                                    });
                                    return;
                                  } else if (
                                    Number(bankDetails?.amount) >
                                    Number(userWalletData?.availableBalance)
                                  ) {
                                    Toast.show({
                                      type: 'error',
                                      position: 'top',
                                      topOffset: 50,
                                      text1: 'Wallet Internal Transfer',
                                      text2: 'Available balance exceeded!',
                                      visibilityTime: 5000,
                                      autoHide: true,
                                      onPress: () => Toast.hide(),
                                    });
                                    return;
                                  } else {
                                    navigation.navigate('Summary', {
                                      bankDetails: bankDetails,
                                    });
                                  }
                                }}>
                                <Buttons
                                  label={'Transfer'}
                                  disabled={disableit}
                                />
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={{marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.droplabel}>Bank Name</Text>
                  <Text style={{color: 'red', marginRight: 10}}>*</Text>
                </View>
                <SelectList
                  setSelected={val =>
                    setBankDetails({
                      ...bankDetails,
                      receiverBankName: val,
                    })
                  }
                  data={currentBanks ? currentBanks : defaultData}
                  save="value"
                  placeholder="Select Bank"
                  boxStyles={styles.inputContainer}
                  // inputStyles={}
                />
              </View>

              {bankDetails?.receiverBankName !== '' && (
                <Input
                  onChangeText={text => {
                    setBankDetails({
                      ...bankDetails,
                      receiverAccountNumber: text,
                    });
                  }}
                  label="Account Number"
                  placeholder="Enter beneficiary wallet number"
                  keyboardType="numeric"
                  isNeeded={true}
                />
              )}

              {numComplete && (
                <View style={{marginTop: 10}}>
                  <Input
                    label="Account Name"
                    defaultValue={
                      bankDetails?.receiverAccountFirstName !== '' &&
                      bankDetails?.receiverAccountLastName !== ''
                        ? `${bankDetails?.receiverAccountFirstName}  ${bankDetails?.receiverAccountLastName}`
                        : ''
                    }
                    disabled
                    isNeeded={true}
                  />
                  {bankDetails?.receiverAccountFirstName !== '' &&
                    bankDetails?.receiverAccountLastName !== '' && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: '#054B99', fontFamily: 'serif'}}>
                            Save Beneficiary
                          </Text>
                          <ToggleSwitch
                            isOn={bankDetails.saveBeneficiary}
                            onColor="#054B99"
                            offColor="#A0A3BD"
                            label=""
                            size="small"
                            onToggle={value =>
                              setBankDetails({
                                ...bankDetails,
                                saveBeneficiary: value,
                              })
                            }
                          />
                        </View>
                        <Input
                          onChangeText={text =>
                            setBankDetails({...bankDetails, amount: text})
                          }
                          iconName="cash"
                          label="Amount"
                          placeholder="Enter Amount"
                          keyboardType="numeric"
                          isNeeded={true}
                          isAirtime={true}
                          isBalance={
                            userWalletData &&
                            userWalletData?.availableBalance
                              ?.toString()
                              ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                          }
                        />

                        {bankDetails.amount > 0 && (
                          <>
                            <Input
                              onChangeText={text =>
                                setBankDetails({
                                  ...bankDetails,
                                  narration: text,
                                })
                              }
                              iconName="information"
                              label="Add Narration"
                              placeholder="Enter transaction narration"
                              defaultValue={bankDetails?.narration}
                              isNeeded={true}
                            />
                            {bankDetails?.narration.length >= 3 && (
                              <TouchableOpacity
                                style={{marginTop: 0}}
                                disabled={disableit}
                                onPress={() => {
                                  if (Number(bankDetails?.amount) <= 0) {
                                    Toast.show({
                                      type: 'error',
                                      position: 'top',
                                      topOffset: 50,
                                      text1: 'NIP Transfer',
                                      text2: 'Invalid amount entered!',
                                      visibilityTime: 5000,
                                      autoHide: true,
                                      onPress: () => Toast.hide(),
                                    });
                                    return;
                                  } else if (
                                    Number(bankDetails?.amount) >
                                    Number(userWalletData?.availableBalance)
                                  ) {
                                    Toast.show({
                                      type: 'error',
                                      position: 'top',
                                      topOffset: 50,
                                      text1: 'NIP Transfer',
                                      text2: 'Available balance exceeded!',
                                      visibilityTime: 5000,
                                      autoHide: true,
                                      onPress: () => Toast.hide(),
                                    });
                                    return;
                                  } else {
                                    navigation.navigate('Summary', {
                                      bankDetails: bankDetails,
                                    });
                                  }
                                }}>
                                <Buttons
                                  label={'Transfer'}
                                  disabled={disableit}
                                />
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </>
                    )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BankDeets;

const styles = StyleSheet.create({
  pick: {
    marginBottom: 10,
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    justifyContent: 'center',
  },
  innerContainer: {
    margin: 20,
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
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    borderColor: 'gray',
    height: 40,
    fontSize: 16,
  },
  droplabel: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.labelColor,
  },
  inputContainer: {
    height: 55,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaBlue,
    padding: 12,
    borderBottomWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
