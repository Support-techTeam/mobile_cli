import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import Buttons from '../../component/buttons/Buttons';
import Toast from 'react-native-toast-message';
import {createGuarantor} from '../../stores/GuarantorStore';
import CustomButton from '../../component/buttons/CustomButtons';
import {Header} from '../../component/header/Header';
import Loader from '../../component/loader/loader';

const titleData = [
  {value: '', label: 'Select Title'},
  {value: 'Mr', label: 'Mr'},
  {value: 'Mrs', label: 'Mrs'},
  {value: 'Miss', label: 'Miss'},
];

const AddGuarantors = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [guarantorsDetails, setGuarantorsDetails] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const disableit =
    !guarantorsDetails.title ||
    !guarantorsDetails.firstName ||
    !guarantorsDetails.lastName ||
    !guarantorsDetails.email ||
    !guarantorsDetails.phoneNumber;

  const handleCreateGuarantor = async () => {
    try {
      setIsLoading(true);
      const res = await createGuarantor(guarantorsDetails);
      // console.log('createGuarantor', res);
      if (res?.data?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.data?.title,
          text2: res?.data?.message,
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
          navigation.navigate('Guarantor');
        }, 2000);
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
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Loader visible={isLoading} loadingText={'Please wait...'} />
      <Header
        routeAction={() => navigation.goBack()}
        heading="ADD GUARANTOR"
        disable={false}
      />
      <ImageBackground
        source={require('../../../assets/signup.png')}
        resizeMode="stretch"
        style={styles.image}>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[styles.innercontainer, {marginVertical: 30}]}>
          <View style={styles.form}>
            <Text style={styles.header}>
              Fill the form below to add a new guarantor
            </Text>
            <Text style={styles.headerRed}>
              *Please enter a valid email address and phone number*
            </Text>
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
            <View style={{marginVertical: 10}}>
              <CustomDropdown
                label="Title"
                isNeeded={true}
                placeholder="Select Title"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={titleData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={guarantorsDetails.title}
                onChange={option => {
                  setGuarantorsDetails({
                    ...guarantorsDetails,
                    title: option.value,
                  });
                }}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{marginVertical: 10, paddingRight: 10, width: '50%'}}>
                <Input
                  onChangeText={text =>
                    setGuarantorsDetails({
                      ...guarantorsDetails,
                      firstName: text,
                    })
                  }
                  iconName="account-outline"
                  label="First Name"
                  placeholder="Enter first name"
                  value={guarantorsDetails.firstName}
                  isNeeded={true}
                />
              </View>
              <View style={{marginVertical: 10, paddingRight: 5, width: '50%'}}>
                <Input
                  onChangeText={text =>
                    setGuarantorsDetails({...guarantorsDetails, lastName: text})
                  }
                  iconName="account-outline"
                  placeholder="Enter last name"
                  label="Last name"
                  value={guarantorsDetails.lastName}
                  isNeeded={true}
                />
              </View>
            </View>

            <Input
              onChangeText={text =>
                setGuarantorsDetails({...guarantorsDetails, email: text})
              }
              iconName="email-outline"
              label="Email address"
              placeholder="Enter your email"
              value={guarantorsDetails.email}
              isNeeded={true}
              autoCapitalize="none"
            />

            <View style={{marginVertical: 10}}>
              <View>
                <InputPhone
                  label="Phone number"
                  layout="first"
                  isNeeded={true}
                  defaultCode="NG"
                  codeTextStyle={{color: '#6E7191'}}
                  defaultValue={guarantorsDetails?.phoneNumber}
                  onChangeFormattedText={text =>
                    setGuarantorsDetails({
                      ...guarantorsDetails,
                      phoneNumber: text,
                    })
                  }
                />
              </View>
            </View>

            <CustomButton
              onPress={() => {
                handleCreateGuarantor();
              }}
              title="Save & Continue"
              disabled={disableit}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddGuarantors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innercontainer: {
    paddingHorizontal: 16,
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
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
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  textFeild: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    padding: 10,
    justifyContent: 'center',
  },
  input: {
    height: 85,
  },
  header: {
    fontSize: 12,
    fontWeight: '400',
  },
  headerRed: {
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
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
});
