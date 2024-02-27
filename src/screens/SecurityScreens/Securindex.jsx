import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import COLORS from '../../constants/colors';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/auth';
import {
  deleteSensitiveData,
  hasSensitiveData,
} from '../../stores/SecurityStore';
import VerifyModal from '../../component/modals/verifyModal';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Input from '../../component/inputField/input.component';
import {Formik} from 'formik';
import Button from '../../component/buttons/Button';
import CustomButton from '../../component/buttons/CustomButtons';

const Securindex = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isFingerPrintAvailable, setIsFingerPrintAvailable] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => setShowModal(!showModal);
  //check availability

  useFocusEffect(
    useCallback(() => {
      FingerprintScanner.isSensorAvailable()
        .then(() => {
          setIsFingerPrintAvailable(true);
        })
        .catch(() => {
          setIsFingerPrintAvailable(false);
        })
        .finally(() => {
          FingerprintScanner.release();
        });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const unsub = async () => {
        const storedToggleValue = await retrieveToggleState();
        setIsEnabled(storedToggleValue);
      };

      unsub();
    }, []),
  );

  const toggleSwitch = async () => {
    FingerprintScanner.isSensorAvailable()
      .then(async () => {
        // handle notify user
        const hasService = await hasSensitiveData();
        if (!hasService) {
          Toast.show({
            type: 'success',
            position: 'top',
            topOffset: 50,
            text1: 'Biometric',
            text2: 'Fingerprint login will be enabled after the nest log-in',
            visibilityTime: 5000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
        }
        //  store state
        try {
          await AsyncStorage.setItem(
            'fingerprintState',
            JSON.stringify(!isEnabled),
          );
          setIsEnabled(prevState => !prevState);
        } catch (error) {}
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Biometric',
          text2: error?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      })
      .finally(() => {
        FingerprintScanner.release();
      });
  };

  const retrieveToggleState = async () => {
    try {
      const value = await AsyncStorage.getItem('fingerprintState');
      if (value !== null) {
        // console.log(value);
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      // console.log('Error retrieving toggle state:', error);
      return null;
    }
  };

  const passwordModal = () => {
    return (
      <VerifyModal visible={showModal} isLoading={isLoading}>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
            }}>
            <Text
              style={{paddingVertical: 20, color: '#000', textAlign: 'center'}}>
              Please{' '}
              <Text style={{fontWeight: 'bold', color: COLORS.lendaGreen}}>
                validate
              </Text>{' '}
              your access to {'\n'}
              enable biometric
            </Text>
            <Formik
              initialValues={{
                password: '',
              }}
              onSubmit={values => {
                values = {...values};
                if (values.password === '') {
                  setError('Fill all fields');
                } else {
                  setError('');
                }
              }}>
              {({handleChange, handleBlur}) => (
                <View>
                  <Input
                    onChangeText={setInputPassword}
                    iconName="lock-outline"
                    label="Password"
                    placeholder="Enter your password"
                    password
                    autoCorrect={false}
                    autoCapitalize="none"
                    isNeeded={true}
                  />
                </View>
              )}
            </Formik>
            {error === '' ? <></> : <Text>{error}</Text>}
            <CustomButton
              title={'Validate'}
              isLoading={isLoading}
              buttonStyle={{marginHorizontal: 0, marginBottom: 5}}
              onPress={toggleModal}
              // disabled={disableits}
            />
            <CustomButton
              title={'Cancle'}
              buttonStyle={{
                marginHorizontal: 0,
                backgroundColor: 'white',
                borderColor: COLORS.lendaBlue,
                borderWidth: 1,
              }}
              textStyle={{color: COLORS.lendaBlue}}
              onPress={toggleModal}
            />
          </View>
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
        heading={'SECURITY'}
        disable={false}
      />
      {/* {passwordModal()} */}
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
          onPress={() => navigation.navigate('SetPin')}>
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
                name="form-textbox-password"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Transaction Pin
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN before every transaction
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
          onPress={() => navigation.navigate('ResetPassword')}>
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
                name="lock-reset"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Change Password
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Set a more secure password
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        {isFingerPrintAvailable && (
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
            onPress={toggleSwitch}>
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
                  name="fingerprint"
                  size={24}
                  color="#054B99"
                />
              </View>
              <View>
                <Text
                  style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                  Activate Biometrics
                </Text>
                <Text
                  style={[
                    styles.desc,
                    {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                  ]}>
                  Enable your fingerprint to open app
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{false: '#767577', true: '#3e3e3e'}}
              thumbColor={isEnabled ? COLORS.lendaGreen : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Securindex;

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
  signUpactivity: {
    backgroundColor: COLORS.lendaBlue,
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
});
