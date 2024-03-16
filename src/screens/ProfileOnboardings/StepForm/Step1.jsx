import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import KeyboardAvoidingWrapper from '../../../component/KeyBoardAvoiding/keyBoardAvoiding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../constants/colors';
import CustomDropdown from '../../../component/dropDown/dropdown.component';
import {SIZES} from '../../../constants';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import CustomButton from '../../../component/buttons/CustomButtons';



const accountType = [
  {value: '', label: 'Select Account Type'},
  {value: 'Personal', label: 'Personal'},
  {value: 'Business', label: 'Business'},
  {value: 'Merchant', label: 'Merchant'},
];


const Step1 = props => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [totalSteps, setTotalSteps] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [text, setText] = useState('');
  const {next, saveState, retrieveState, finish, cancel} = props;


  const nextStep = () => {
    saveState({accountType: text});
    next();
  };


  // const onCancel = () => {
  //   saveState(null);
  //   cancel();
  // }

  useLayoutEffect(() => {
    setTotalSteps(props.getTotalSteps());
    setCurrentStep(props.getCurrentStep());
    if(retrieveState()?.accountType){
      setText(retrieveState()?.accountType);
    }
   }, [])
 
// console.log(insets.bottom)
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
                <Text style={styles.TextHead}>ACCOUNT TYPE</Text>
              </View>
              <Text style={[styles.extraText]}>
                Industry regulation requires us to collect this information to
                determine information needed.
              </Text>
            </View>
            <View style={styles.mainView}>
              {text === 'Personal' && (
                <Text style={[styles.extraText]}>
                  <Text style={styles.boldText}>Personal Account</Text> gives
                  you access to a wallet with normal day to day transaction
                  between other wallets and interswitch transaction to other
                  banks with zero charges for all this transaction.
                </Text>
              )}
              {text === 'Business' && (
                <Text style={[styles.extraText]}>
                  <Text style={styles.boldText}>Business Account</Text> gives
                  you access to a wallet with normal day to day transaction
                  between other wallets and interswitch transaction to other
                  banks with zero charges for all this transaction and access to
                  flexible loans.
                </Text>
              )}
              {text === 'Merchant' && (
                <Text style={[styles.extraText]}>
                  <Text style={styles.boldText}>Merchant Account</Text> gives
                  you access to a wallet with normal day to day transaction
                  between other wallets and interswitch transaction to other
                  banks with zero charges for all this transaction and access to
                  goods and services supply for other clients.
                </Text>
              )}
              <View style={{marginVertical: 10}}>
                <CustomDropdown
                  label="Account Type"
                  isNeeded={true}
                  placeholder="Select Account Type"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={accountType}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={text}
                  onChange={option => setText(option.value)}
                />

              </View>
              <View style={styles.groupButton}>
                <View style={{width: wp(80)}}>
                  <CustomButton
                    disabled={text === '' ? true : false}
                    title={'Save & Continue'}
                    onPress={() => nextStep()}
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

export default Step1;

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
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.labelColor,
  },

});
