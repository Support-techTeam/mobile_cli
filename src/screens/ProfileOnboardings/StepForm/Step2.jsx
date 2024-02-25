import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  TextInput,
  ImageBackground,
  Button,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import KeyboardAvoidingWrapper from '../../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../constants/colors';
import Input from '../../../component/inputField/input.component';
import {SIZES} from '../../../constants';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import CustomButton from '../../../component/buttons/CustomButtons';
import Toast from 'react-native-toast-message';
import {bvnValidation} from '../../../stores/ProfileStore';
import Spinner from 'react-native-loading-spinner-overlay';

const Step2 = props => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [totalSteps, setTotalSteps] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [text, setText] = useState('');
  const {next, saveState, back, retrieveState} = props;
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    next();
  };

  const goBack = () => {
    back();
  };

  useLayoutEffect(() => {
    setTotalSteps(props.getTotalSteps());
    setCurrentStep(props.getCurrentStep());
    if (retrieveState()?.bvn) {
      setText(retrieveState()?.bvn);
    }
  }, []);


  const validateBVN = async () => {
    try {
      setIsLoading(true);
      const res = await bvnValidation({bvn: text});
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
        saveState({
          accountType: retrieveState()?.accountType,
          firstName: res?.data?.firstName,
          lastname: res?.data?.lastName,
          middleName: res?.data?.middleName,
          bvn: text,
          gender: res?.data?.gender,
          dateOfBirth: res?.data?.dateOfBirth,
          phoneNumber: res?.data?.phoneNumber,
        });
        nextStep();
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
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Validating BVN...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <KeyboardAvoidingWrapper>
        <ImageBackground
          source={require('../../../../assets/signup.png')}
          resizeMode="cover"
          style={styles.image}>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
              marginBottom: tabBarHeight + 25,
            }}>
            <View style={styles.HeadView}>
              <View style={styles.TopView}>
                <Text style={styles.TextHead}>BVN VALIDATION</Text>
              </View>
              <Text style={[styles.extraText]}>
                Industry regulation requires us to collect this information to
                verify your identity.
              </Text>
            </View>
            <View style={styles.mainView}>
              <View style={{marginVertical: 10}}>
                <Input
                  onChangeText={text => setText(text)}
                  iconName="shield-lock-outline"
                  label="BVN"
                  placeholder="Enter your BVN"
                  keyboardType="numeric"
                  defaultValue={text ? text : ''}
                  isNeeded={true}
                />
              </View>
              <View style={styles.groupButton}>
                <View style={{width: wp(30)}}>
                  <CustomButton title={'Go Back'} onPress={() => goBack()} />
                </View>

                <View style={{width: wp(50)}}>
                  <CustomButton
                    disabled={
                      text === '' || text.length < 11 || text.length > 11
                        ? true
                        : false
                    }
                    title={'Validate'}
                    onPress={() => {
                      validateBVN();
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  TopView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: SIZES.h1,
    letterSpacing: 1,
  },
  extraText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    marginTop: SIZES.base,
    marginBottom: SIZES.radius,
    textAlign: 'center',
  },
  image: {
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
  },
  mainView: {
    paddingTop: 25,
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    opacity: 0.86,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 2,
    height: hp('60%'),
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: '700',
    fontSize: SIZES.body4,
  },
  groupButton: {
    marginBottom: 40,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
