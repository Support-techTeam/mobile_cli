/* eslint-disable no-undef */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';

import {useNavigation} from '@react-navigation/native';

import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {changePin} from '../../stores/ProfileStore';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
import OTPInput from 'react-native-otp-withpaste';

const {height, width} = Dimensions.get('window');
const ResetPin = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [resetDetails, setResetDetails] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: '',
  });
  const insets = useSafeAreaInsets();

  const handleResetPin = async () => {
    setIsLoading(true);
    const res = await changePin(resetDetails);

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
      setTimeout(() => {
        navigation.navigate('Security');
      }, 1000);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <Spinner
        textContent={'Resetting Pin...'}
        textStyle={{color: 'white'}}
        visible={isLoading}
        overlayColor="rgba(78, 75, 102, 0.7)"
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            <Text style={styles.TextHead}>Reset Pin</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30}}>
          <OTPInput
            title="Old Pin"
            type="outline"
            numberOfInputs={4}
            onChange={code => {
              setResetDetails({...resetDetails, oldPin: code});
            }}
            onFilledCode={true}
            secureTextEntry={true}
            onPasted={resetDetails.oldPin}
          />

          <OTPInput
            title="New Pin"
            type="outline"
            numberOfInputs={4}
            onChange={code => {
              setResetDetails({...resetDetails, newPin: code});
            }}
            onFilledCode={true}
            secureTextEntry={true}
            onPasted={resetDetails.newPin}
          />

          <OTPInput
            title="Confirm Pin"
            type="outline"
            numberOfInputs={4}
            onFilledCode={true}
            onChange={code => {
              setResetDetails({...resetDetails, confirmPin: code});
            }}
            secureTextEntry={true}
            onPasted={resetDetails.confirmPin}
          />
        </View>
        <TouchableOpacity style={{marginTop: 30}} onPress={handleResetPin}>
          <Buttons label={'Submit'} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  pinText: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#14142B',

    textAlign: 'left',
  },
  pinStyle: {
    borderWidth: 0.5,
    borderColor: COLORS.lendaBlue,
    marginLeft: 15,
    marginRight: 15,
    height: 50,
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
  amount: {
    fontFamily: 'serif',
    fontSize: 16,
  },
  blur: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  avoidingView: {
    borderRadius: 10,
    height: 150,
    marginTop: 50,
    width: width - 30,
  },
  containerCodePin: {
    borderRadius: 10,
  },
});
