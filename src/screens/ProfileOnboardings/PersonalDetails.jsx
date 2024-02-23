import {View, Text, StyleSheet, ImageBackground, Button} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
// import KeyboardAvoidingWrapper from '../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import MultiForm from './StepForm/MultiForm';

import Step1 from './StepForm/Step1';
import Step2 from './StepForm/Step2';
import Step3 from './StepForm/Step3';
import Step4 from './StepForm/Step4';

const allSteps = [
  {name: 'step 1', component: Step1},
  {name: 'step 2', component: Step2},
  {name: 'step 3', component: Step3},
  {name: 'step 4', component: Step4},
];

const PersonalDetails = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  const onNext = () => {
    // console.log('Next');
  };

  const onBack = () => {
    // console.log('Back');
  };

  const finish = state => {
    // console.log('TCL: App -> state', state);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <ImageBackground
        source={require('../../../assets/signup.png')}
        resizeMode="cover"
        style={styles.image}>
        <MultiForm
          steps={allSteps}
          onFinish={finish}
          animate={true}
          onBack={onBack}
          onNext={onNext}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
    marginTop: 34,
    // backgroundColor:'blue'
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 1,
  },
  extraText: {
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
    color: '#14142B',
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  signUpactivity: {
    backgroundColor: '#054B99',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedText: {
    color: '#44AB3B',

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
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  image: {
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    height: 48,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
