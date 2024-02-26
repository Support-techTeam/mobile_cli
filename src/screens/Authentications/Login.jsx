import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Formik} from 'formik';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import Input from '../../component/inputField/input.component';
import Loader from '../../component/loader/loader';
import Button from '../../component/buttons/Button';
import COLORS from '../../constants/colors';
import {userLogin} from '../../stores/AuthStore';
import {useDispatch, useSelector} from 'react-redux';
import {signInUser} from '../../util/redux/userAuth/user.auth.slice';
import Toast from 'react-native-toast-message';
import {getProfileDetails} from '../../stores/ProfileStore';
import {setProfile} from '../../util/redux/userProfile/user.profile.slice';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AuthHeader} from '../../component/header/AuthHeader';

const Login = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [userMail, setUserMail] = useState(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const getUSerStorage = async () => {
    const emaill = await AsyncStorage.getItem('userEmail');
    if (emaill !== null) {
      setUserMail(emaill);
    }
  };

  useEffect(() => {
    getUSerStorage();
    // getData();
  }, []);

  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('deviceInfo');
  //     if (value !== null) {
  //       console.log(value, 'deviceInfo');
  //     }
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  useEffect(() => {
    setUserDetails({
      email: userMail && userMail === null ? '' : userMail,
      password: '',
    });
  }, [userMail]);

  const disableit = !userDetails.email || !userDetails.password;

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const {email, password} = userDetails;
      const res = await userLogin(email, password);
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
        dispatch(signInUser(JSON.stringify(res?.user)));
        fetchProfileData();
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await getProfileDetails();
      if (res?.data !== undefined) {
        if (res?.error) {
        } else {
          dispatch(setProfile(res?.data));
        }
      }
    } catch (error) {}
  };

  const validate = async () => {
    let isValid = true;
    if (!userDetails.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!userDetails.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!userDetails.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (userDetails.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }
    if (isValid) {
      handleLogin();
    }
  };

  const handleOnchange = (text, input) => {
    setUserDetails(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
          paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
          paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
          paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
        },
      ]}>
      <Loader visible={isLoading} loadingText={'Logging in...'} />
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../assets/login.png')}
          resizeMode="stretch"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{paddingHorizontal: 16}}>
            <View style={{marginBottom: 40}}>
              <View>
                <AuthHeader
                  routeAction={() => navigation.goBack()}
                  heading={'Log In'}
                  intro={false}
                  disabled={false}
                  returnRoute={true}
                  back
                  renderImage={
                    Image.resolveAssetSource(
                      require('../../../assets/images/locked.png'),
                    ).uri
                  }
                />
              </View>
              <View
                style={{
                  height: hp('70%'),
                  justifyContent: 'center',
                }}>
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
                      email: '',
                      password: '',
                    }}
                    onSubmit={values => {
                      values = {...values};
                      if (values.email === '' || values.password === '') {
                        // setError('Fill all fields');
                      } else {
                      }
                    }}>
                    {({handleChange, handleBlur}) => (
                      <View>
                        <Input
                          onChangeText={text =>
                            handleOnchange(text.trim(), 'email')
                          }
                          onFocus={() => handleError(null, 'email')}
                          iconName="email-outline"
                          label="Email"
                          placeholder="Enter your email address"
                          error={errors.email}
                          autoCorrect={false}
                          autoCapitalize="none"
                          defaultValue={userMail}
                          isNeeded={true}
                        />
                        <Input
                          onChangeText={text =>
                            handleOnchange(text, 'password')
                          }
                          onFocus={() => handleError(null, 'password')}
                          iconName="lock-outline"
                          label="Password"
                          placeholder="Enter your password"
                          error={errors.password}
                          password
                          autoCorrect={false}
                          autoCapitalize="none"
                          isNeeded={true}
                        />
                      </View>
                    )}
                  </Formik>
                  {error === '' ? <></> : <Text>{error}</Text>}

                  <View style={styles.termsRow}>
                    <View style={{marginLeft: 15}}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('ForgotPassword')}>
                          <Text
                            style={{
                              color: COLORS.lendaBlue,
                              fontFamily: 'serif',
                              fontSize: 16,
                            }}>
                            Forgot password?
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <Button
                    title="Log In"
                    onPress={validate}
                    disabled={disableit}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 19,
                      }}>
                      <Text style={styles.checkText}>
                        Don't have an account?{' '}
                      </Text>
                      <Text
                        style={{
                          color: COLORS.lendaBlue,
                          fontFamily: 'serif',
                          fontSize: 16,
                        }}>
                        Sign up
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  signupText: {
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 3.5,
    fontFamily: 'serif',
    paddingTop: 22,
    lineHeight: 54,
  },
  DetailsText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'serif',
  },
  phonetextContainer: {
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 0,
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
    fontFamily: 'serif',
  },
  signUp: {
    backgroundColor: '#054B99',
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
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 22,
    marginTop: 10,
  },
  checkText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#14142B',
    lineHeight: 21,
    fontFamily: 'serif',
    marginLeft: 10,
  },
  signUpactivity: {
    backgroundColor: '#054B99',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
  },
});
