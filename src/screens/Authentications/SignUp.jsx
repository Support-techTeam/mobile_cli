import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Formik} from 'formik';
import {CheckBox} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Input from '../../component/inputField/input.component';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Button from '../../component/buttons/Button';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {userSignUp} from '../../stores/AuthStore';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {signUpUser} from '../../util/redux/userAuth/user.auth.slice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SignUp = () => {
  const insets = useSafeAreaInsets();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [showPassLogs, setShowPassLogs] = useState(false);
  const [lowerValid, setLowerValid] = useState(false);
  const [upperValid, setUpperValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [specialValid, setSpecialValid] = useState(false);
  const [lengthValid, setLengthValid] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const disableit =
    !inputs.firstname ||
    !inputs.lastname ||
    !inputs.password ||
    !inputs.email ||
    !inputs.confirmpassword ||
    checked === false ||
    showPassLogs === true ||
    error !== '';

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const res = await userSignUp(inputs);
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
        dispatch(signUpUser(JSON.stringify(res?.user)));
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const validate = () => {
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.firstname) {
      handleError('Please input firstname', 'firstname');
      isValid = false;
    }

    if (!inputs.lastname) {
      handleError('Please input lastname', 'lastname');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }

    if (!inputs.confirmpassword) {
      handleError('Please input password', 'confirmpassword');
      isValid = false;
    } else if (inputs.confirmpassword.length < 5) {
      handleError('Min password length of 5', 'confirmpassword');
      isValid = false;
    } else if (inputs.confirmpassword != inputs.password) {
      handleError('Password not a match', 'confirmpassword');
      isValid = false;
    }

    if (isValid) {
      handleSignUp();
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

  useEffect(() => {
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
  }, [
    lowerValid,
    upperValid,
    numberValid,
    specialValid,
    lengthValid,
    inputs.password.length,
  ]);

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top !== 0 ? insets.top : 18,
          paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
          paddingLeft: insets.left !== 0 ? insets.left : 'auto',
          paddingRight: insets.right !== 0 ? insets.right : 'auto',
        },
      ]}>
      {isLoading && (
        <Spinner
          textContent={'Signing Up...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../assets/signup.png')}
          resizeMode="stretch"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 16,
              marginBottom: hp('2%'),
            }}>
            <View>
              <View>
                <View style={{paddingHorizontal: 12}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 15,
                    }}>
                    <View>
                      <TouchableOpacity
                        style={{
                          alignSelf: 'flex-start',
                          borderWidth: 0.5,
                          borderColor: '#D9DBE9',
                          borderRadius: 5,
                        }}
                        onPress={() => navigation.goBack()}>
                        <View>
                          <Icon name="chevron-left" size={30} color="black" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.signupView}>
                      <Image
                        source={require('../../../assets/images/HeadLogo.png')}
                        style={{width: 83, height: 32, marginBottom: 24}}
                      />
                      <Image
                        source={require('../../../assets/images/locked.png')}
                      />
                      <Text style={styles.signupText}>Sign Up</Text>
                      <View style={styles.signupDetails}>
                        <Text style={[styles.DetailsText, {marginBottom: 40}]}>
                          Create an account to get started
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  paddingTop: 25,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  opacity: 0.86,
                  borderColor: '#D9DBE9',
                  borderWidth: 2,
                }}>
                <Formik
                  initialValues={{
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmpassword: '',
                  }}
                  onSubmit={(values, {setSubmitting}) => {
                    values = {...values};
                    if (
                      values.firstname === '' ||
                      values.lastname === '' ||
                      values.email === '' ||
                      values.password === '' ||
                      values.dateOfBirth === '' ||
                      values.confirmpassword === ''
                    ) {
                      // handleMessage("Please fill all the fields");
                      setSubmitting(false);
                    } else if (!emailPattern.test(values.email)) {
                      setSubmitting(false);
                    } else if (values.password !== values.confirmpassword) {
                      setSubmitting(false);
                    } else if (!checked) {
                    } else {
                      // handleSignup(values, setSubmitting);
                      setSubmitting(true);
                    }
                  }}>
                  {({handleChange, handleBlur, values}) => (
                    <View style={{paddingTop: 25}}>
                      <View>
                        <Input
                          onChangeText={text =>
                            handleOnchange(text, 'firstname')
                          }
                          onFocus={() => handleError(null, 'firstname')}
                          iconName="account-outline"
                          label="First Name"
                          placeholder="Enter your first name"
                          error={errors.firstname}
                          isNeeded={true}
                        />

                        <Input
                          onChangeText={text =>
                            handleOnchange(text, 'lastname')
                          }
                          onFocus={() => handleError(null, 'lastname')}
                          iconName="account-outline"
                          label="Last Name"
                          placeholder="Enter your last name"
                          error={errors.lastname}
                          isNeeded={true}
                        />

                        <Input
                          onChangeText={text => handleOnchange(text, 'email')}
                          onFocus={() => handleError(null, 'email')}
                          iconName="email-outline"
                          label="Email"
                          placeholder="Enter your email address"
                          error={errors.email}
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
                          label="Password"
                          placeholder="Enter your password"
                          error={errors.password}
                          password
                          autoCapitalize="none"
                          autoCorrect={false}
                          isNeeded={true}
                        />
                        <Input
                          onChangeText={text => {
                            handleOnchange(text, 'confirmpassword');
                            handler(text, 'confirmpassword');
                          }}
                          onFocus={() => handleError(null, 'confirmpassword')}
                          iconName="lock-outline"
                          label="Confirm Password"
                          placeholder="Confirm your password"
                          error={errors.confirmpassword}
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
                                    name="checkcircle"
                                    size={20}
                                    color="#24348B"
                                  />
                                ) : (
                                  <Icon
                                    name="closecircle"
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
                                    name="checkcircle"
                                    size={20}
                                    color="#24348B"
                                  />
                                ) : (
                                  <Icon
                                    name="closecircle"
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
                                    name="checkcircle"
                                    size={20}
                                    color="#24348B"
                                  />
                                ) : (
                                  <Icon
                                    name="closecircle"
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
                                    name="checkcircle"
                                    size={20}
                                    color="#24348B"
                                  />
                                ) : (
                                  <Icon
                                    name="closecircle"
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
                                    name="checkcircle"
                                    size={20}
                                    color="#24348B"
                                  />
                                ) : (
                                  <Icon
                                    name="closecircle"
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
                      <View style={styles.termsRow}>
                        <CheckBox
                          checked={checked}
                          onPress={toggleCheckbox}
                          iconType="material-community"
                          checkedIcon="checkbox-outline"
                          uncheckedIcon={'checkbox-blank-outline'}
                          size={30}
                          containerStyle={{
                            paddingVertical: 0,
                            paddingHorizontal: 0,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }}
                        />

                        <View style={{marginLeft: 0}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.checkText}>
                              I agree with the{' '}
                            </Text>
                            <Text
                              onPress={() =>
                                Linking.openURL('https://tradelenda.com/T&C')
                              }
                              style={{
                                color: '#0566C3',
                              }}>
                              Terms and Conditions{' '}
                            </Text>
                          </View>
                          <Text style={styles.checkText}>of Trade Lenda </Text>
                        </View>
                      </View>

                      <Button
                        title="Sign Up"
                        onPress={validate}
                        disabled={disableit}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 6,
                        }}>
                        <Text style={styles.checkText}>
                          Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Login')}>
                          <Text
                            style={{
                              color: '#054B99',

                              textDecorationLine: 'underline',
                              textDecorationColor: '#054B99',
                            }}>
                            Log In
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: hp('100%'),
  },
  signupView: {
    alignItems: 'center',
    width: '93%',
  },
  signupText: {
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 1,
  },
  DetailsText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
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
  demark: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 8,
  },
  signUp: {
    backgroundColor: '#054B99',
    opacity: 0.5,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
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
  checkedText: {
    color: '#44AB3B',

    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
    textAlign: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    marginBottom: 22,
    marginTop: 10,
  },
  checkText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#14142B',
    lineHeight: 21,
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
  signUpactivity: {
    backgroundColor: '#054B99',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // height: hp('100'),
    width: wp('100%'),
    justifyContent: 'center',
  },
});
