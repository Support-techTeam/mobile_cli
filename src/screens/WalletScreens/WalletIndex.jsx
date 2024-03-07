import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import CreditCardView from '../../component/cards/CreditCardView';
import {
  getAccountWallet,
  requestLimitIncrease,
  upgradeWallet,
} from '../../stores/WalletStore';
import {useClipboard} from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {Center, Pressable, Button} from 'native-base';
import CustomModal from '../../component/modals/CustomModal';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import VerifyModal from '../../component/modals/verifyModal';
import COLORS from '../../constants/colors';
import {getLoanUserDetails} from '../../stores/LoanStore';
import Loader from '../../component/loader/loader';

const limitData = [
  {value: 0, label: 'Select Limit'},
  {
    label: '10,000',
    value: 10000,
  },
  {
    label: '50,000',
    value: 50000,
  },
  {
    label: '100,000',
    value: 100000,
  },
  {
    label: '200,000',
    value: 200000,
  },
  {
    label: '500,000',
    value: 500000,
  },
  {
    label: '1,000,000',
    value: 1000000,
  },
  {
    label: '5,000,000',
    value: 5000000,
  },
  {
    label: '10,000,000',
    value: 10000000,
  },
];

const WalletIndex = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [data, setString] = useClipboard();
  const [isLoading, setIsLoading] = useState(false);
  const [inputLimit, setInputLimit] = useState({
    transactionLimit: 0,
    dailyTransactionLimit: 0,
  });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [walletData, setWalletData] = useState({
    walletAccount: '0000000000',
    accountName: '______ ______',
    accountStatus: false,
    type: '______ ______',
    singleLimit: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(0),
    dailyLimit: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(0),
    balance: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(0),
  });
  const [showPromptModal, setShowPromptModal] = useState(false);

  const limitModalToggle = () => {
    setShowLimitModal(!showLimitModal);
  };

  const toggleAccountUpgrade = () => {
    setShowPromptModal(!showPromptModal);
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await getUserWalletData();
      };
      fetchData();
    }, []),
  );

  const getUserWalletData = async () => {
    getAccountWallet()
    .then(res => {
      if (!res?.data?.error) {
        const wallet = res?.data?.data?.wallet;
        const accountDetails = res?.data?.data?.accountDetails;
        setWalletData({
          walletAccount: wallet?.walletIdAccountNumber,
          accountName: `${accountDetails?.firstName} ${accountDetails?.lastName}`,
          type: `${wallet?.type.toUpperCase()} ACCOUNT`,
          accountStatus:
            !wallet?.PNC &&
            !wallet?.PND &&
            wallet?.active &&
            !accountDetails?.blacklist
              ? true
              : false,
          singleLimit: wallet?.transactionLimit
            ? new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(Number(wallet?.transactionLimit))
            : '₦0.00',
          dailyLimit: wallet?.dailyTransactionLimit
            ? new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(Number(wallet?.dailyTransactionLimit))
            : '₦0.00',
          balance: wallet?.walletIdAccountNumber
            ? new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(Number(wallet?.walletIdAccountNumber))
            : '₦0.00',
        });
      } else {
        setWalletData({
          walletAccount: '0000000000',
          accountName: '______ ______',
          accountStatus: false,
          type: '______ ______',
          singleLimit: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(0),
          dailyLimit: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(0),
          balance: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(0),
        });
      }
    })
    .catch(error => {
      // console.log('WalletIndex', error);
    });
  }

  useFocusEffect(
    useCallback(() => {
      getLoanUserData();
    }, []),
  );

  const getLoanUserData = async () => {
    getLoanUserDetails()
      .then(res => {
        if (res) {
          if (!res?.error) {
            if (
              res?.data === undefined ||
              res?.data == null ||
              res?.data?.length <= 0
            ) {
              setLoanUserDetails(undefined);
            } else {
              setLoanUserDetails(res?.data);
            }
          }
        }
      })
      .catch(e => {})
      .finally(() => {});
  };

  const handleCopy = async evt => {
    try {
      setString(evt);
      Toast.show({
        type: 'info',
        position: 'top',
        topOffset: 50,
        text1: '',
        text2: `${data} copied to clipboard`,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      // console.error('Error copying to clipboard:', error);
    }
  };

  const handleLimitIncrease = async () => {
    try {
      setIsLoading(true);
      const res = await requestLimitIncrease(inputLimit);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message || 'Limit increase request failed',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message || 'Limit increase request successful!',
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setShowLimitModal(false);
        setInputLimit({
          transactionLimit: 0,
          dailyTransactionLimit: 0,
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setShowLimitModal(false);
      setInputLimit({
        transactionLimit: 0,
        dailyTransactionLimit: 0,
      });
    }
  };

  const handleAccountUpgrade = async () => {
    // Check if the account has business details
    if (walletData?.type === 'PERSONAL ACCOUNT') {
      const payload = {
        walletIdAccountNumber: walletData?.walletAccount,
        firstName: loanUserDetails?.organizationDetails?.businessName,
        lastName: '',
      };
      await handleUpgrade(payload);
    }

    if (walletData?.type === 'BUSINESS ACCOUNT') {
      const payload = {
        walletIdAccountNumber: walletData?.walletAccount,
        firstName: walletData?.accountName?.split(' ')[0],
        lastName: walletData?.accountName?.split(' ')[1],
      };
      await handleUpgrade(payload);
    }

    if (walletData?.type === 'MERCHANT ACCOUNT') {
      const payload = {
        walletIdAccountNumber: walletData?.walletAccount,
        firstName: walletData?.accountName?.split(' ')[0],
        lastName: walletData?.accountName?.split(' ')[1],
      };
      await handleUpgrade(payload);
    }
  };

  const handleUpgrade = async payload => {
    try {
      setIsLoading(true);
      const res = await upgradeWallet(payload);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: `${res?.message}` || 'Account change failed!',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: `${res?.message}` || 'Account change successful!',
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        await getUserWalletData();
      }
      setIsLoading(false);
      toggleAccountUpgrade();
    } catch (e) {
      setIsLoading(false);
      toggleAccountUpgrade();
    }
  };

  const disableIt =
    inputLimit.transactionLimit === 0 || inputLimit.dailyTransactionLimit === 0;

  const LimitModal = () => {
    return (
      <Center>
        <CustomModal
          visible={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          title={
            <>
              <Text style={styles.title}>Requaet Limit Increase</Text>

              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowLimitModal(false)}
                style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </Button>
            </>
          }
          body={
            <>
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Single Transaction Limit"
                  isNeeded={true}
                  placeholder="Select Limit"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={limitData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={inputLimit.transactionLimit}
                  onChange={option => {
                    setInputLimit({
                      ...inputLimit,
                      transactionLimit: option.value,
                    });
                  }}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Daily Transaction Limit"
                  isNeeded={true}
                  placeholder="Select Limit"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={limitData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={inputLimit.dailyTransactionLimit}
                  onChange={option => {
                    setInputLimit({
                      ...inputLimit,
                      dailyTransactionLimit: option.value,
                    });
                  }}
                />
              </View>
            </>
          }
          footer={
            <>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowLimitModal(false);
                  }}>
                  Cancel
                </Button>
                <Button
                  style={{opacity: disableIt ? 0.5 : 1}}
                  disabled={disableIt}
                  onPress={() => {
                    handleLimitIncrease();
                  }}>
                  Send Request
                </Button>
              </Button.Group>
            </>
          }
        />
      </Center>
    );
  };

  const upgradeModal = () => {
    return (
      <VerifyModal visible={showPromptModal} isLoading={isLoading}>
        <View style={{alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="lock-check"
            size={40}
            color={COLORS.lendaGreen}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
          <Text
            style={[styles.resetPinText, {fontSize: 24, fontFamily: 'serif'}]}>
            Change Account Type
          </Text>
          <Text style={styles.question}>
            Are you sure you want to change your account type ?
          </Text>

          <TouchableOpacity
            style={styles.signUpactivity}
            onPress={handleAccountUpgrade}>
            <Text style={styles.confirmText}>
              {walletData?.type === 'PERSONAL ACCOUNT'
                ? 'Upgrade'
                : 'Downgrade'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleAccountUpgrade}
            style={[
              styles.signUpactivity,
              {borderColor: '#054B99', backgroundColor: '#fff', borderWidth: 1},
            ]}>
            <Text style={[styles.confirmText, {color: '#054B99'}]}>No</Text>
          </TouchableOpacity>
        </View>
      </VerifyModal>
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
      <Header
        routeAction={() => navigation.goBack()}
        heading={'WALLET SETTINGS'}
        disable={false}
      />

      <Loader vissible={isLoading} loadingText={'Processing...'} />

      <CreditCardView
        accountNumber={walletData.walletAccount}
        accountHolder={walletData.accountName}
        accountType={walletData?.type}
        dailyLimit={walletData.dailyLimit}
        singleLimit={walletData.singleLimit}
        backgroundImage={require('../../../assets/images/world_map.jpg')}
        live={walletData.accountStatus}
        handleCopy={() => handleCopy(walletData.walletAccount)}
      />
      {LimitModal()}
      {upgradeModal()}

      <ScrollView
        bounces={false}
        style={{paddingHorizontal: 16}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{
            marginVertical: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={limitModalToggle}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons name="cash" size={24} color="#054B99" />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Limit Increase
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Request for transaction limit increase
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => {
            loanUserDetails === undefined ||
            loanUserDetails?.loanDocumentDetails === undefined
              ? navigation.navigate('OnboardingHome')
              : toggleAccountUpgrade();
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name={
                  walletData?.type === 'PERSONAL ACCOUNT'
                    ? 'upload-multiple'
                    : 'download-multiple'
                }
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                {walletData?.type === 'PERSONAL ACCOUNT'
                  ? 'Upgrade For Business'
                  : 'Downgrade To Personal'}
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Need to use account for business or personal use
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
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
  signUp: {
    marginTop: 10,
    backgroundColor: '#054B99',
    width: '95%',
    opacity: 0.5,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  sheetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    // minHeight: 250,
    paddingHorizontal: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4E4B66',
    marginVertical: 15,
    textAlign: 'left',
  },
  label: {
    color: 'black',
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  resetPinText: {
    color: '#ED2E7E',
    fontFamily: 'serif',
    fontSize: 16,
    paddingVertical: 10,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpactivity: {
    backgroundColor: COLORS.lendaBlue,
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
