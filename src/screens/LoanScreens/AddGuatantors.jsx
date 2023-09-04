import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import Input from '../../component/inputField/input.component';
import CustomDropdown from '../../component/dropDown/dropdown.component';
import InputPhone from '../../component/inputField/phone-input.component';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import Buttons from '../../component/buttons/Buttons';
import Toast from 'react-native-toast-message';
import {createGuarantor} from '../../stores/GuarantorStore';

const titleData = [
  {value: '', label: 'Select Title'},
  {value: 'Mr', label: 'Mr'},
  {value: 'Mrs', label: 'Mrs'},
  {value: 'Miss', label: 'Miss'},
  {value: 'Dr', label: 'Dr'},
];

const AddGuatantors = () => {
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
    setIsLoading(true);
    const res = await createGuarantor(guarantorsDetails);
    console.log('createGuarantor', res);
    if (res.data.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.data.title,
        text2: res.data.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });

      setTimeout(() => {
        navigation.navigate('Guarantor');
      }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Creating profile...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
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
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>ADD GUARANTORS</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.innercontainer]}>
        <View style={styles.form}>
          <Text style={styles.header}>
            Fill the form below to add a new guarantor
          </Text>
          <Text style={styles.headerRed}>
            *Please enter a valid email address and phone number*
          </Text>
        </View>
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
              setGuarantorsDetails({...guarantorsDetails, title: option.value});
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{marginVertical: 10, paddingRight: 10, width: '50%'}}>
            <Input
              onChangeText={text =>
                setGuarantorsDetails({...guarantorsDetails, firstName: text})
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
                setGuarantorsDetails({...guarantorsDetails, phoneNumber: text})
              }
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleCreateGuarantor();
          }}
          disabled={disableit}>
          <View style={{marginBottom: 20}}>
            <Buttons label="Save & Continue" disabled={disableit} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddGuatantors;

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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
  },
  headerRed: {
    fontFamily: 'Montserat',
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
