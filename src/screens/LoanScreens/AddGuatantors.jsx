import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneInput from 'react-native-phone-number-input';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import Buttons from '../../component/buttons/Buttons';
import CustomInput from '../../component/custominput/CustomInput';

const AddGuatantors = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
      {sending && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(16, 17, 17, 0.7)"
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
          <Text
            style={{
              paddingBottom: 4,
              fontWeight: '400',
              fontSize: 16,
              lineHeight: 24,
              color: '#14142B',
              fontFamily: 'Montserat',
            }}>
            Title
          </Text>
          <View style={styles.pick}>
            <Picker
              selectedValue={guarantorsDetails.title}
              onValueChange={text =>
                setGuarantorsDetails({...guarantorsDetails, title: text})
              }>
              <Picker.Item label="Select title" value="" />
              <Picker.Item label="Mr" value="Mr" />
              <Picker.Item label="Mrs" value="Mrs" />
              <Picker.Item label="Miss" value="Miss" />
            </Picker>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{marginVertical: 10, paddingRight: 10, width: '50%'}}>
            <CustomInput
              label="First Name"
              value={guarantorsDetails.firstName}
              onChangeText={text =>
                setGuarantorsDetails({...guarantorsDetails, firstName: text})
              }
            />
          </View>
          <View style={{marginVertical: 10, paddingRight: 5, width: '50%'}}>
            <CustomInput
              label="Last name"
              value={guarantorsDetails.lastName}
              onChangeText={text =>
                setGuarantorsDetails({...guarantorsDetails, lastName: text})
              }
            />
          </View>
        </View>

        <CustomInput
          label="Email address"
          value={guarantorsDetails.email}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text =>
            setGuarantorsDetails({...guarantorsDetails, email: text})
          }
        />

        <View style={{marginVertical: 10}}>
          <View style={{marginBottom: -14}}>
            <Text style={styles.label}>Mobile number</Text>
          </View>
          <View>
            <PhoneInput
              defaultCode="NG"
              layout="first"
              textContainerStyle={styles.phonetextContainer}
              textInputStyle={styles.phonetext}
              containerStyle={styles.phoneContainer}
              codeTextStyle={{color: '#6E7191'}}
              onChangeFormattedText={text =>
                setGuarantorsDetails({...guarantorsDetails, phoneNumber: text})
              }
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleCreateGuarantor} disabled={disableit}>
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
