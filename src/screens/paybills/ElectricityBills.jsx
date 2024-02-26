import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getElectricityProviders,
  getNetworkProvider,
  verifyMeter,
} from '../../stores/BillStore';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import Loader from '../../component/loader/loader';
const statusBarHeight = getStatusBarHeight();
const midth = Dimensions.get('window').width;

const networkData = [
  {value: '', label: 'Select Provider'},
  {value: '', label: 'N/A'},
];

const Electric = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [isLoading, setIsLoading] = useState(false);
  const [networkProviders, setNetworkProviders] = useState([]);
  const [networkOptions, setNetworkOptions] = useState([]);
  const [details, setDetails] = useState({
    name: '',
    address: '',
  });
  const [airtimeDetails, setAirtimeDetails] = useState({
    number: '',
    network: '',
    amount: '',
    meterNumber: '',
  });
  const disableit =
    !airtimeDetails.amount || !airtimeDetails.network || !airtimeDetails.amount;

  useEffect(() => {
    fetchingAllElectricityProvider();
  }, []);

  const fetchingAllElectricityProvider = async () => {
    try {
      setIsLoading(true);
      const res = await getElectricityProviders();
      if (res?.error) {
        // TODO: handle error
      } else {
        setNetworkProviders(res?.data?.data?.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const fetchingMeterValidation = async () => {
    try {
      setIsLoading(true);
      const data = {
        serviceType: airtimeDetails.network,
        meterNumber: airtimeDetails.meterNumber.toString(),
      };
      const res = await verifyMeter(data);

      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.data?.data?.message
            ? res?.data?.data?.message
            : res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setDetails({
          name: res?.data?.data?.data?.customerName,
          address: res?.data?.data?.data?.address,
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const newData =
      networkProviders &&
      networkProviders?.map((item, index) => {
        return {value: item.serviceType, label: item.name, key: index};
      });

    setNetworkOptions(newData);
  }, [networkProviders]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View style={styles.container}>
         <Loader visible={isLoading} loadingText={'Please wait...'} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#D9DBE9',
                borderRadius: 5,
              }}>
              <AntDesign name="left" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <View style={styles.HeadView}>
            <View style={styles.TopView}>
              <Text style={styles.TextHead}>ELECTRIC BILL</Text>
            </View>
          </View>
          <View>
            <Text> </Text>
          </View>
        </View>
        <View style={styles.demark} />
        <KeyboardAvoidingWrapper>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={[styles.innercontainer]}>
            <View style={{marginTop: 24}}>
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Provider"
                  isNeeded={true}
                  placeholder="Select Provider"
                  data={networkOptions ? networkOptions : networkData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={airtimeDetails.network}
                  onChange={option => {
                    setAirtimeDetails({
                      ...airtimeDetails,
                      network: option.value,
                    });
                  }}
                />
              </View>

              <Input
                label="Meter Number"
                placeholder="Enter meter number"
                defaultValue={airtimeDetails?.meterNumber}
                keyboardType="numeric"
                onChangeText={text =>
                  setAirtimeDetails({...airtimeDetails, meterNumber: text})
                }
                isNeeded={true}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    marginBottom: 10,
                    width: '50%',
                  }}
                  onPress={() => fetchingMeterValidation()}>
                  <Buttons label={'Validate Meter'} />
                </TouchableOpacity>
              </View>
              {details.name !== '' && (
                <Input
                  label="Meter Holder Name"
                  placeholder="Auto generated meter holder name"
                  isNeeded={true}
                  defaultValue={details?.name}
                  editable={false}
                />
              )}

              {details.address !== '' && (
                <Input
                  label="Meter Holder Address"
                  placeholder="Auto generated meter holder address"
                  isNeeded={true}
                  defaultValue={details?.address}
                  editable={false}
                />
              )}

              {details.address !== '' && details.name !== '' && (
                <View style={{marginVertical: 10}}>
                  <Input
                    label="Amount"
                    placeholder="Enter amount"
                    defaultValue={airtimeDetails?.amount}
                    isAirtime={true}
                    isBalance={
                      userWalletData &&
                      userWalletData?.availableBalance
                        ?.toString()
                        ?.replace(/\B(?=(\d{3})+\b)/g, ',')
                    }
                    keyboardType="numeric"
                    onChangeText={text =>
                      setAirtimeDetails({...airtimeDetails, amount: text})
                    }
                    isNeeded={true}
                  />

                  <View style={{marginTop: 10}}>
                    <InputPhone
                      label="Mobile number"
                      layout="first"
                      isNeeded={true}
                      defaultCode="NG"
                      codeTextStyle={{color: '#6E7191'}}
                      defaultValue={airtimeDetails?.number}
                      onChangeFormattedText={text =>
                        setAirtimeDetails({...airtimeDetails, number: text})
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={{marginTop: 10, marginBottom: 70}}
                    disabled={disableit}
                    onPress={() => {
                      if (Number(airtimeDetails?.amount) <= 0) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Invalid amount entered!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else if (
                        Number(airtimeDetails?.amount) >
                        Number(userWalletData?.availableBalance)
                      ) {
                        Toast.show({
                          type: 'error',
                          position: 'top',
                          topOffset: 50,
                          text1: 'Bill Bayment',
                          text2: 'Available balance exceeded!',
                          visibilityTime: 5000,
                          autoHide: true,
                          onPress: () => Toast.hide(),
                        });
                        return;
                      } else {
                        navigation.navigate('AirtimeConfirm', {
                          airtimeDetails: {
                            number: airtimeDetails?.number,
                            network: airtimeDetails?.network,
                            meter: airtimeDetails?.meterNumber,
                            amount: airtimeDetails?.amount,
                            service: 'electricity purchase',
                          },
                        });
                      }
                    }}>
                    <Buttons label={'Next'} disabled={disableit} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingWrapper>
      </View>
    </SafeAreaView>
  );
};

export default Electric;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notihead: {
    fontSize: 14,
    lineHeight: 24,
    color: '#6E7191',
    fontWeight: '600',
  },
  innercontainer: {
    marginTop: statusBarHeight,
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  btnActive: {
    color: '#054B99',
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
  personIcon: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 30,
    padding: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
  hello: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  toptabs: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#D9DBE9',
  },
  tabtexts: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  TextHead: {
    fontFamily: 'serif',

    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop:5,
    // paddingLeft:10
    // backgroundColor:'red'
  },
  gradient: {
    // padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: midth - 32,
    //  position: "relative"

    height: '85%',
  },
  wallet: {
    color: '#fff',

    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 10,
  },
  prices: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginTop: 20,
  },
  FundButton: {
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: 12,
    paddingVertical: 6,
    // paddingHorizontal:12,
    textAlign: 'center',
    color: '#054B99',

    fontWeight: '500',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },
  extrat: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  demark2: {
    width: '90%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
    marginLeft: 20,
  },

  title: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    color: '#14142B',
  },
  desc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  pick: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    padding: 15,
    justifyContent: 'center',
  },
});
