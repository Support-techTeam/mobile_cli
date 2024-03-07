import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import Input from '../../component/inputField/input.component';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../component/buttons/Button';
import {AuthHeader} from '../../component/header/AuthHeader';
import {Header} from '../../component/header/Header';
import COLORS from '../../constants/colors';
import {userChangePassword} from '../../stores/AuthStore';
import Loader from '../../component/loader/loader';

const ResetPassword = () => {
  const insets = useSafeAreaInsets();
  const [showPassLogs, setShowPassLogs] = useState(false);
  const [lowerValid, setLowerValid] = useState(false);
  const [upperValid, setUpperValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [specialValid, setSpecialValid] = useState(false);
  const [lengthValid, setLengthValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [inputs, setInputs] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const disableit =
    !inputs.currentPassword ||
    !inputs.password ||
    !inputs.confirmPassword ||
    showPassLogs === true ||
    error !== '';

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      const res = await userChangePassword(inputs);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
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
        navigation.goBack();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const validate = () => {
    let isValid = true;

    if (!inputs.currentPassword) {
      handleError('Please input password', 'currentPassword');
      isValid = false;
    } else if (inputs.currentPassword.length < 5) {
      handleError('Min password length of 5', 'currentPassword');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }

    if (!inputs.confirmPassword) {
      handleError('Please input password', 'confirmPassword');
      isValid = false;
    } else if (inputs.confirmPassword.length < 5) {
      handleError('Min password length of 5', 'confirmPassword');
      isValid = false;
    } else if (inputs.confirmPassword != inputs.password) {
      handleError('Password not a match', 'confirmPassword');
      isValid = false;
    }

    if (isValid) {
      handleChangePassword();
    }
  };

  const handler = value => {
    const upper = new RegExp('(?=.*[A-Z])');
    const lower = new RegExp('(?=.*[a-z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[!@#$&%*])');
    const length = new RegExp('(?=.{8,})');

    if (lower.test(value)) {
      setLowerValid(true);
    } else {
      setLowerValid(false);
    }

    if (upper.test(value)) {
      setUpperValid(true);
    } else {
      setUpperValid(false);
    }

    if (number.test(value)) {
      setNumberValid(true);
    } else {
      setNumberValid(false);
    }

    if (special.test(value)) {
      setSpecialValid(true);
    } else {
      setSpecialValid(false);
    }

    if (length.test(value)) {
      setLengthValid(true);
    } else {
      setLengthValid(false);
    }
    if (
      specialValid &&
      upperValid &&
      lowerValid &&
      numberValid &&
      lengthValid
    ) {
      setShowPassLogs(false);
    }
  };

  useEffect(
    () => {
      if (
        !(
          lowerValid &&
          upperValid &&
          numberValid &&
          specialValid &&
          lengthValid
        ) &&
        inputs.password.length > 0
      ) {
        setShowPassLogs(true);
      } else {
        setShowPassLogs(false);
      }
    },
    [
      lowerValid,
      upperValid,
      numberValid,
      specialValid,
      lengthValid,
      inputs.password.length,
    ],
    [],
  );

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
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
        heading="CHANGE PASSWORD"
        disable={false}
      />
      <Loader visible={isLoading} loadingText={'Changing Password...'} />
      <KeyboardAvoidingWrapper>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: 16, marginTop: 20}}>
          <View
            style={{
              flex: 1,
              marginBottom: 40,
              flexDirection: 'column',
              justifyContent: 'center',
              height: hp('70%'),
            }}>
            <View></View>
            <View
              style={{
                paddingHorizontal: 15,
                marginTop: 60,
              }}>
              <Icon
                name="lock-check"
                size={40}
                color={COLORS.lendaGreen}
                style={{marginLeft: 'auto', marginRight: 'auto'}}
              />
              <Text
                style={{
                  textAlign: 'center',
                }}>
                Please{' '}
                <Text style={{fontWeight: 'bold', color: COLORS.lendaGreen}}>
                  change your password
                </Text>{' '}
                to {'\n'}
                log into your account
              </Text>
              <Formik
                initialValues={{
                  currentPassword: '',
                  password: '',
                  confirmPassword: '',
                }}
                onSubmit={(values, {setSubmitting}) => {
                  values = {...values};
                  if (
                    values.password === '' ||
                    values.currentPassword === '' ||
                    values.confirmPassword === ''
                  ) {
                    setSubmitting(false);
                  } else {
                    setSubmitting(true);
                  }
                }}>
                {({handleChange, handleBlur, values}) => (
                  <View style={{paddingTop: 25}}>
                    <View>
                      <Input
                        onChangeText={text => {
                          handleOnchange(text, 'currentPassword');
                          handler(text, 'currentPassword');
                        }}
                        onFocus={() => handleError(null, 'currentPassword')}
                        iconName="lock-outline"
                        label="Current Password"
                        placeholder="Enter your password"
                        error={errors.currentPassword}
                        password
                        autoCapitalize="none"
                        autoCorrect={false}
                        isNeeded={true}
                      />
                      <Input
                        onChangeText={text => {
                          handleOnchange(text, 'password');
                          handler(text, 'password');
                        }}
                        onFocus={() => handleError(null, 'password')}
                        iconName="lock-outline"
                        label="New Password"
                        placeholder="Enter your password"
                        error={errors.password}
                        password
                        autoCapitalize="none"
                        autoCorrect={false}
                        isNeeded={true}
                      />
                      <Input
                        onChangeText={text => {
                          handleOnchange(text, 'confirmPassword');
                          handler(text, 'confirmPassword');
                        }}
                        onFocus={() => handleError(null, 'confirmPassword')}
                        iconName="lock-outline"
                        label="Confirm New Password"
                        placeholder="Confirm your password"
                        error={errors.confirmPassword}
                        password
                        autoCapitalize="none"
                        autoCorrect={false}
                        isNeeded={true}
                      />
                      {showPassLogs && (
                        <View
                          style={{
                            marginTop: 16,
                            borderWidth: 2,
                            borderRadius: 14,
                            borderColor: '#D9DBE9',
                          }}>
                          <View style={styles.passLog}>
                            <Text style={styles.passReq}>
                              Password Requirement{' '}
                            </Text>
                            <Icon
                              name="close"
                              size={20}
                              color="black"
                              onPress={() => setShowPassLogs(false)}
                            />
                          </View>
                          <View style={styles.demark} />
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingTop: 10,
                              paddingBottom: 14,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 8,
                              }}>
                              {lengthValid ? (
                                <Icon
                                  name="check-circle-outline"
                                  size={20}
                                  color="#24348B"
                                />
                              ) : (
                                <Icon
                                  name="close-circle-outline"
                                  size={20}
                                  color="#ED2E7E"
                                />
                              )}

                              <Text style={styles.reqTest}>
                                MUST contain atleast 8 characters
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 8,
                              }}>
                              {lengthValid ? (
                                <Icon
                                  name="check-circle-outline"
                                  size={20}
                                  color="#24348B"
                                />
                              ) : (
                                <Icon
                                  name="close-circle-outline"
                                  size={20}
                                  color="#ED2E7E"
                                />
                              )}

                              <Text style={styles.reqTest}>
                                MUST contain atleast one lowercase
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 8,
                              }}>
                              {upperValid ? (
                                <Icon
                                  name="check-circle-outline"
                                  size={20}
                                  color="#24348B"
                                />
                              ) : (
                                <Icon
                                  name="close-circle-outline"
                                  size={20}
                                  color="#ED2E7E"
                                />
                              )}

                              <Text style={styles.reqTest}>
                                MUST contain atleast one uppercase
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 8,
                              }}>
                              {numberValid ? (
                                <Icon
                                  name="check-circle-outline"
                                  size={20}
                                  color="#24348B"
                                />
                              ) : (
                                <Icon
                                  name="close-circle-outline"
                                  size={20}
                                  color="#ED2E7E"
                                />
                              )}

                              <Text style={styles.reqTest}>
                                MUST contain atleast one number
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              {specialValid ? (
                                <Icon
                                  name="check-circle-outline"
                                  size={20}
                                  color="#24348B"
                                />
                              ) : (
                                <Icon
                                  name="close-circle-outline"
                                  size={20}
                                  color="#ED2E7E"
                                />
                              )}

                              <Text style={styles.reqTest}>
                                MUST contain atleast one special character
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                    {error === '' ? (
                      <Text />
                    ) : (
                      <Text
                        style={{
                          color: 'red',
                          fontWeight: '600',
                          fontSize: 14,
                        }}>
                        {error}
                      </Text>
                    )}
                    <Button
                      title="Save Changes"
                      onPress={validate}
                      disabled={disableit}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
        {/* </ImageBackground> */}
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: hp('100%'),
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  demark: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 8,
  },
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  passLog: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 10,
    alignItems: 'center',
  },
  passReq: {
    color: '#ED2E7E',

    fontWeight: '600',
    fontSize: 15,
    lineHeight: 21,
  },
  reqTest: {
    fontWeight: '400',
    marginLeft: 8,
    color: '#4E4B66',
    fontSize: 12,
  },
  image: {
    // height: hp('100'),
    width: wp('100%'),
    justifyContent: 'center',
  },
});
