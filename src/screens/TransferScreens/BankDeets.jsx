import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SelectList} from 'react-native-dropdown-select-list';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../component/inputField/input.component';
import Buttons from '../../component/buttons/Buttons';
import {useSelector} from 'react-redux';
import {
  getAllBankDetails,
  getBeneficiaries,
  getSeerbitNipBanks,
  getSeerbitWalletBalance,
  verifyBeneficiaryInfo,
  verifyNIPAccountInfo,
  verifySeerbitNipAccount,
} from '../../stores/WalletStore';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {Header} from '../../component/header/Header';
import CustomSearchableDropdown from '../../component/inputField/CustomSearchableDropdown';
import Loader from '../../component/loader/loader';

const defaultData = [
  {value: 'Select Option', label: 'Select Option'},
  {value: 'N/A', label: 'N/A'},
];

const beneficiariesData = [
  {name: '...Select Option', label: '...Select Option', id: 0},
];

let bankerListData = [
  {value: '', label: 'Select Option'},
  {value: '', label: 'N/A'},
];

let selectedData = '';

const BankDeets = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const userMultiWalletData = useSelector(
    state => state.userProfile.multiWallet,
  );
  const prevRoute = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingSeerbitBanks, setIsFetchingSeerbitBanks] = useState(false);
  const [currentBanks, setCurrentBanks] = useState(undefined);
  const [seerbitBanks, setSeerbitBanks] = useState(undefined);
  const [numComplete, setNumComplete] = useState(false);
  const [seerbitBalance, setSeerbitBalance] = useState(0);
  const [bankDetails, setBankDetails] = useState({
    fromWalletIdAccountNumber: '',
    receiverAccountFirstName: '',
    receiverAccountLastName: '',
    receiverAccountNumber: '',
    receiverBankName: '',
    amount: 0,
    narration: '',
    saveBeneficiary: false,
    toWalletIdAccountNumber: '',
    beneficiaryAccountName: '',
    beneficiaryBankName: '', // to make dynamic
  });

  const disableit =
    bankDetails?.amount === 0 ||
    bankDetails?.amount === '' ||
    bankDetails?.narration === '';

  const [holdersName, setHoldersName] = useState('');

  useEffect(() => {
    if (prevRoute === 'Nip') {
      handleGetAllBanks();
    }
  }, []);

  useEffect(() => {
    if (route?.name === 'Transfer') {
      handleGetAllBeneficiaries();
      if (prevRoute === 'Nip') {
        handleGetAllBanks();
        handleGetAllSeerbitBanks();
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

  const handleGetAllSeerbitBanks = async () => {
    setIsFetchingSeerbitBanks(true);
    getSeerbitNipBanks()
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
            const bankData =
              res?.data &&
              res?.data?.length > 0 &&
              res?.data?.map((bank, i) => {
                return {
                  value: bank?.bankname,
                  label: bank?.bankname,
                  key: i,
                  NIPCode: bank?.bankcode,
                };
              });

            if (seerbitBanks == undefined || seerbitBanks == '') {
              setSeerbitBanks(bankData);
            }
          }
        }
      })
      .catch(error => {})
      .finally(() => {
        setIsFetchingSeerbitBanks(false);
      });
  };

  const handleGetAllBeneficiaries = async () => {
    beneficiariesData.splice(0);
    setIsFetching(true);
    getBeneficiaries()
      .then(res => {
        if (res) {
          if (res?.error) {
            Toast.show({
              type: 'error',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.data?.message || res?.message,
              visibilityTime: 5000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
          } else {
            if (res?.data && res?.data.length > 0) {
              if (prevRoute === 'Nip') {
                res?.data?.map((beneficiary, i) => {
                  if (beneficiary.beneficiaryType === 'NIP') {
                    const exists = beneficiariesData.some(
                      item =>
                        item.accountNumber ===
                          beneficiary.beneficiaryAccountNumber &&
                        item.bankName === beneficiary.beneficiaryBankName &&
                        item.accountName === beneficiary.beneficiaryAccountName,
                    );
                    if (!exists) {
                      beneficiariesData.push({
                        name: `${beneficiary?.beneficiaryAccountName?.toUpperCase()} - ${
                          beneficiary?.beneficiaryAccountNumber
                        } - ${beneficiary?.beneficiaryBankName?.toUpperCase()}`,
                        label: beneficiary?.beneficiaryAccountName,
                        accountName: beneficiary?.beneficiaryAccountName,
                        bankName: beneficiary.beneficiaryBankName,
                        type: beneficiary.beneficiaryType,
                        accountNumber: beneficiary.beneficiaryAccountNumber,
                        id: i + 1,
                      });
                    }
                  }
                });
              } else if (prevRoute === 'InternalTransfer') {
                res?.data?.map((beneficiary, i) => {
                  if (beneficiary.beneficiaryType === 'Internal') {
                    const exists = beneficiariesData.some(
                      item =>
                        item.accountNumber ===
                          beneficiary.beneficiaryAccountNumber &&
                        item.bankName === beneficiary.beneficiaryBankName &&
                        item.accountName === beneficiary.beneficiaryAccountName,
                    );
                    if (!exists) {
                      beneficiariesData.push({
                        name: `${beneficiary?.beneficiaryAccountName?.toUpperCase()} - ${
                          beneficiary?.beneficiaryAccountNumber
                        } - ${beneficiary?.beneficiaryBankName?.toUpperCase()}`,
                        label: beneficiary?.beneficiaryAccountName,
                        accountName: beneficiary?.beneficiaryAccountName,
                        bankName: beneficiary.beneficiaryBankName,
                        type: beneficiary.beneficiaryType,
                        accountNumber: beneficiary.beneficiaryAccountNumber,
                        id: i + 1,
                      });
                    }
                  }
                });
              }
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
    if (prevRoute === 'Nip') {
      handleGetAccountDetails();
    }
  }, [bankDetails?.receiverAccountNumber?.length === 10]);

  useEffect(() => {
    if (prevRoute === 'InternalTransfer') {
      handleGetWalletDetails();
    }
  }, [bankDetails?.toWalletIdAccountNumber?.length === 10]);

  const handleGetAccountDetails = () => {
    if (
      (bankDetails?.receiverAccountNumber?.length === 10 &&
        bankDetails?.receiverBankName !== '' &&
        bankDetails?.receiverBankName !== 'Select Option') ||
      (bankDetails?.receiverAccountNumber?.length === 10 &&
        bankDetails?.receiverBankName !== '' &&
        bankDetails?.receiverBankName !== 'N/A')
    ) {
      setBankDetails({
        ...bankDetails,
        receiverAccountFirstName: '',
        receiverAccountLastName: '',
      });
      setIsLoading(true);
      const unsubVerifyBeneficiaryInfo = async () => {
        if (bankDetails?.fromWalletIdAccountNumber[0] == '4') {
          try {
            const res = await verifySeerbitNipAccount(
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
        } else if (bankDetails?.fromWalletIdAccountNumber[0] == '9') {
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
        }
        setTimeout(() => {
          setIsLoading(false); // Check if mounted
        }, 1000);
      };
      unsubVerifyBeneficiaryInfo();

      return () => {
        isMounted = false;
      }; // Cleanup function to set isMounted to false when the component unmounts
    } else {
    }
  };

  const handleGetWalletDetails = () => {
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
        } catch (e) {
          // Handle error
        } finally {
          setIsLoading(false); // Update state only if mounted
        }
      };
      unsubVerifyBeneficiaryInfo();

      return () => {
        isMounted = false;
      }; // Cleanup function to set isMounted to false when the component unmounts
    }
  };

  const DATA = [
    {
      title: 'Main Display',
      data: ['main'],
    },
  ];

  // set bank list
  useEffect(() => {
    try {
      if (userMultiWalletData && userMultiWalletData?.length > 0) {
        bankerListData = [{value: 'Select Option', label: 'Select Option'}];
        userMultiWalletData?.map((walletData, index) => {
          bankerListData.push({
            label: walletData?.walletIdAccountNumber,
            value: `${walletData?.walletIdAccountNumber} - ${
              walletData?.banker === 'Providus'
                ? 'Providus Bank'
                : walletData?.banker
            }`,
            key: index,
          });
        });
      }
    } catch (e) {}
  }, [userMultiWalletData]);
  // Get seerbit balance
  const unsubGetSeerbitWalletBalance = async () => {
    if (userMultiWalletData && userMultiWalletData?.length > 0) {
      if (
        selectedData?.pocketId !== null &&
        selectedData?.pocketId !== undefined
      ) {
        getSeerbitWalletBalance(selectedData?.pocketId)
          .then(res => {
            if (res) {
              if (!res?.error) {
                setSeerbitBalance(res?.data);
              }
            }
          })
          .catch(e => {})
          .finally(() => {});
      }
    }
  };

  const renderData = () => {
    return (
      <View>
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
              <View style={{marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.droplabel}>Select Account</Text>
                  <Text style={{color: 'red', marginRight: 10}}>*</Text>
                </View>
                <SelectList
                  setSelected={val => {
                    try {
                      const splitData =
                        val && val?.length > 0 && val.split('-');
                      const selectedAccount = splitData[0].trim();
                      if (selectedAccount === 'Select Option') {
                        Toast.show({
                          type: 'warning',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Select Account',
                          text2: 'You need to select an account!',
                          visibilityTime: 3000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        setBankDetails({
                          fromWalletIdAccountNumber: '',
                          receiverAccountFirstName: '',
                          receiverAccountLastName: '',
                          receiverBankName: '',
                          receiverAccountNumber: '',
                          amount: 0,
                          narration: '',
                          saveBeneficiary: false,
                          toWalletIdAccountNumber: '',
                          beneficiaryAccountName: '',
                          beneficiaryBankName: '',
                        });
                      } else {
                        selectedData = userMultiWalletData?.find(
                          walletData =>
                            walletData?.walletIdAccountNumber ===
                            selectedAccount.toString(),
                        );
                        setBankDetails({
                          fromWalletIdAccountNumber: selectedAccount.toString(),
                          receiverAccountFirstName: '',
                          receiverAccountLastName: '',
                          receiverBankName: '',
                          receiverAccountNumber: '',
                          amount: 0,
                          narration: '',
                          saveBeneficiary: false,
                          toWalletIdAccountNumber: '',
                          beneficiaryAccountName: '',
                          beneficiaryBankName: '',
                        });
                        if (selectedAccount[0] == '4') {
                          unsubGetSeerbitWalletBalance();
                        }
                      }
                    } catch (e) {}
                  }}
                  data={bankerListData}
                  save="value"
                  searchPlaceholder="Search for account"
                  search={false}
                  boxStyles={styles.inputContainer}
                  closeicon={
                    <Icon name="times-circle" size={26} color="#000" />
                  }
                  dropdownStyles={{
                    paddingHorizontal: 10,
                    marginTop: 2,
                    backgroundColor: COLORS.lendaComponentBg,
                    borderColor: COLORS.lendaComponentBorder,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  dropdownItemStyles={{
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    backgroundColor: COLORS.lendaComponentBg,
                    borderColor: COLORS.lendaComponentBorder,
                    borderWidth: 1,
                    borderRadius: 5,
                    marginVertical: 3,
                  }}
                />
              </View>

              {bankDetails?.fromWalletIdAccountNumber !== '' && (
                <View style={{marginTop: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.label}>Wallet Number</Text>
                      <Text style={{color: 'red', marginRight: 10}}>*</Text>
                    </View>
                  </View>
                  <CustomSearchableDropdown
                    beneficiariesData={beneficiariesData}
                    setBankDetails={setBankDetails}
                    bankDetails={bankDetails}
                    handleAccountDetails={handleGetWalletDetails}
                    transferType={prevRoute}
                  />
                </View>
              )}
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
                                    userWalletData?.availableBalance ==
                                      undefined ||
                                    userWalletData?.availableBalance == null
                                  ) {
                                    Toast.show({
                                      type: 'error',
                                      position: 'top',
                                      topOffset: 50,
                                      text1: 'Wallet Internal Transfer',
                                      text2: 'Balance not available!',
                                      visibilityTime: 5000,
                                      autoHide: true,
                                      onPress: () => Toast.hide(),
                                    });
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
                  <Text style={styles.droplabel}>Select Account</Text>
                  <Text style={{color: 'red', marginRight: 10}}>*</Text>
                </View>
                <SelectList
                  setSelected={val => {
                    try {
                      const splitData =
                        val && val?.length > 0 && val.split('-');
                      const selectedAccount = splitData[0].trim();
                      if (selectedAccount === 'Select Option') {
                        Toast.show({
                          type: 'warning',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Select Account',
                          text2: 'You need to select an account!',
                          visibilityTime: 3000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        setBankDetails({
                          fromWalletIdAccountNumber: '',
                          receiverAccountFirstName: '',
                          receiverAccountLastName: '',
                          receiverBankName: '',
                          receiverAccountNumber: '',
                          amount: 0,
                          narration: '',
                          saveBeneficiary: false,
                          toWalletIdAccountNumber: '',
                          beneficiaryAccountName: '',
                          beneficiaryBankName: '',
                        });
                      } else {
                        selectedData = userMultiWalletData?.find(
                          walletData =>
                            walletData?.walletIdAccountNumber ===
                            selectedAccount.toString(),
                        );
                        setBankDetails({
                          fromWalletIdAccountNumber: selectedAccount.toString(),
                          receiverAccountFirstName: '',
                          receiverAccountLastName: '',
                          receiverBankName: '',
                          receiverAccountNumber: '',
                          amount: 0,
                          narration: '',
                          saveBeneficiary: false,
                          toWalletIdAccountNumber: '',
                          beneficiaryAccountName: '',
                          beneficiaryBankName: '',
                        });
                        if (selectedAccount[0] == '4') {
                          unsubGetSeerbitWalletBalance();
                        }
                      }
                    } catch (e) {}
                  }}
                  data={bankerListData}
                  save="value"
                  searchPlaceholder="Search for account"
                  search={false}
                  boxStyles={styles.inputContainer}
                  closeicon={
                    <Icon name="times-circle" size={26} color="#000" />
                  }
                  dropdownStyles={{
                    paddingHorizontal: 10,
                    marginTop: 2,
                    backgroundColor: COLORS.lendaComponentBg,
                    borderColor: COLORS.lendaComponentBorder,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  dropdownItemStyles={{
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    backgroundColor: COLORS.lendaComponentBg,
                    borderColor: COLORS.lendaComponentBorder,
                    borderWidth: 1,
                    borderRadius: 5,
                    marginVertical: 3,
                  }}
                />
              </View>

              {bankDetails?.fromWalletIdAccountNumber !== '' && (
                <View style={{marginTop: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.label}>Account Number</Text>
                      <Text style={{color: 'red', marginRight: 10}}>*</Text>
                    </View>
                  </View>
                  <CustomSearchableDropdown
                    beneficiariesData={beneficiariesData}
                    setBankDetails={setBankDetails}
                    bankDetails={bankDetails}
                    handleAccountDetails={handleGetAccountDetails}
                    transferType={prevRoute}
                  />
                </View>
              )}

              {bankDetails?.receiverAccountNumber?.length === 10 && (
                <View style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.droplabel}>Bank Name</Text>
                    <Text style={{color: 'red', marginRight: 10}}>*</Text>
                  </View>
                  <SelectList
                    key={
                      bankDetails.receiverBankName &&
                      bankDetails?.receiverBankName
                    }
                    setSelected={val => {
                      if (val === 'Select Option' || val === 'N/A') {
                        Toast.show({
                          type: 'warning',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Select Bank',
                          text2: 'You need to select a bank!',
                          visibilityTime: 3000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        if (seerbitBanks && seerbitBanks.length <= 0) {
                          handleGetAllSeerbitBanks();
                        }
                      } else {
                        setBankDetails({
                          ...bankDetails,
                          receiverBankName: val,
                        });
                      }
                    }}
                    data={
                      bankDetails?.fromWalletIdAccountNumber[0] == '4' &&
                      seerbitBanks
                        ? seerbitBanks
                        : bankDetails?.fromWalletIdAccountNumber[0] == '9' &&
                          currentBanks
                        ? currentBanks
                        : defaultData
                    }
                    save="value"
                    searchPlaceholder="Search for bank"
                    placeholder={
                      bankDetails?.receiverBankName
                        ? bankDetails?.receiverBankName
                        : 'Select Bank'
                    }
                    boxStyles={styles.inputContainer}
                    closeicon={
                      <Icon name="times-circle" size={26} color="#000" />
                    }
                    dropdownStyles={{
                      padding: 5,
                      marginTop: 2,
                      backgroundColor: COLORS.lendaComponentBg,
                      borderColor: COLORS.lendaComponentBorder,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    dropdownItemStyles={{
                      padding: 5,
                      marginTop: 2,
                      backgroundColor: COLORS.lendaComponentBg,
                      borderColor: COLORS.lendaComponentBorder,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  />
                </View>
              )}

              {bankDetails?.receiverAccountFirstName &&
                bankDetails?.receiverAccountLastName && (
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
                            <Text
                              style={{color: '#054B99', fontFamily: 'serif'}}>
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
                              userMultiWalletData &&
                              selectedData?.banker === 'Providus'
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(
                                    Number(selectedData?.availableBalance),
                                  )
                                : selectedData?.banker ===
                                  '9 Payment Service Bank'
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                    .format(Number(seerbitBalance))
                                    ?.toString()
                                    ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                                : '0.00'
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
                                      userMultiWalletData &&
                                      selectedData?.banker === 'Providus'
                                    ) {
                                      if (
                                        selectedData?.availableBalance ==
                                          undefined ||
                                        selectedData?.availableBalance == null
                                      ) {
                                        Toast.show({
                                          type: 'error',
                                          position: 'top',
                                          topOffset: 50,
                                          text1: 'Wallet Internal Transfer',
                                          text2: 'Balance not available!',
                                          visibilityTime: 5000,
                                          autoHide: true,
                                          onPress: () => Toast.hide(),
                                        });
                                        return;
                                      } else if (
                                        Number(bankDetails?.amount) >
                                        Number(selectedData?.availableBalance)
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
                                    } else if (
                                      userMultiWalletData &&
                                      selectedData?.banker ===
                                        '9 Payment Service Bank'
                                    ) {
                                      if (
                                        seerbitBalance == undefined ||
                                        seerbitBalance == null
                                      ) {
                                        Toast.show({
                                          type: 'error',
                                          position: 'top',
                                          topOffset: 50,
                                          text1: 'Wallet Internal Transfer',
                                          text2: 'Balance not available!',
                                          visibilityTime: 5000,
                                          autoHide: true,
                                          onPress: () => Toast.hide(),
                                        });
                                        return;
                                      } else if (
                                        Number(bankDetails?.amount) >
                                        Number(seerbitBalance)
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
      </View>
    );
  };

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
      <Loader visible={isLoading} loadingText={'Loading...'} />
      <Header
        routeAction={() => navigation.goBack()}
        heading={'FUNDS TRANSFER'}
        disable={false}
      />
      <SectionList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        sections={DATA}
        ListEmptyComponent={<></>}
        renderItem={({item}) => renderData()}
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16}}
      />
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
    borderColor: COLORS.lendaComponentBorder,
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
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.labelColor,
  },
  selectInputContainer: {
    height: 55,
    backgroundColor: COLORS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaComponentBorder,
    padding: 12,
    justifyContent: 'center',
  },
});
