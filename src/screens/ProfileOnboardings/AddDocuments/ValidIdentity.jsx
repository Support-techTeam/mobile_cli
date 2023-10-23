import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../../component/inputField/input.component';
import CustomDropdown from '../../../component/dropDown/dropdown.component';
import Buttons from '../../../component/buttons/Buttons';
import Spinner from 'react-native-loading-spinner-overlay';
import {getLoanUserDetails} from '../../../stores/LoanStore';

const idTypeData = [
  {value: '', label: 'Select ID Type'},
  {value: 'National ID', label: 'National ID'},
  {value: 'Drivers License', label: 'Drivers License'},
  {value: 'International Passport', label: 'International Passport'},
  {value: 'Voters Card', label: 'Voters Card'},
  {value: 'Birth Certificate', label: 'Birth Certificate'},
];

const ITEM_HEIGHT = 100;
const TobTabs = [
  {name: 'Valid Identity', key: 'ValidIndentity'},
  {name: 'Proof of Address', key: 'ProofOfAddress'},
  {name: 'Bank Statement', key: 'BankStatement'},
  {name: 'Passport', key: 'Passport'},
  {name: 'Signature', key: 'Signature'},
  {name: 'Company Seals', key: 'CompanySeals'},
  {name: 'CAC', key: 'CAC'},
  {name: 'Others', key: 'Others'},
  {name: 'Submit All', key: 'SubmitDocs'},
];

const ValidIdentity = () => {
  const [formDetails, setFormDetails] = useState({
    validIdentificationType: '',
    validIdentification: '',
    utilityBill: '',
    bankStatement: '',
    passport: '',
    signature: '',
    seal: '',
    cacCertificate: '',
    othersName: '',
    others: '',
  });

  const [orgDetails, setOrgDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'ValidIdentity') {
      const unsubscribe = navigation.addListener('focus', async () => {
        unSubBusinessDetails();
      });
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    unSubBusinessDetails();
  }, []);

  const unSubBusinessDetails = async () => {
    setIsLoading(true);
    const res = await getLoanUserDetails();
    if (res?.error) {
      // TODO: handle error
    } else {
      setOrgDetails(res?.data?.loanDocumentDetails);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFormDetails({
      validIdentificationType:
        orgDetails && orgDetails?.validIdentificationType === undefined
          ? ''
          : orgDetails?.validIdentificationType,
      validIdentification:
        orgDetails && orgDetails?.validIdentification === undefined
          ? ''
          : orgDetails?.validIdentification,
      utilityBill:
        orgDetails && orgDetails?.utilityBill === undefined
          ? ''
          : orgDetails?.utilityBill,
      bankStatement:
        orgDetails && orgDetails?.bankStatement === undefined
          ? ''
          : orgDetails?.bankStatement,
      passport:
        orgDetails && orgDetails?.passport === undefined
          ? ''
          : orgDetails?.passport,
      signature:
        orgDetails && orgDetails?.signature === undefined
          ? ''
          : orgDetails?.signature,
      seal:
        orgDetails && orgDetails?.seal === undefined ? '' : orgDetails?.seal,
      cacCertificate:
        orgDetails && orgDetails?.cacCertificate === undefined
          ? ''
          : orgDetails?.cacCertificate,
      othersName:
        orgDetails && orgDetails?.othersName === undefined
          ? ''
          : orgDetails?.othersName,
      others:
        orgDetails && orgDetails?.others === undefined
          ? ''
          : orgDetails?.others,
    });
  }, [orgDetails, navigation]);

  const disableit =
    !formDetails.validIdentification || !formDetails.validIdentificationType;

  const activeTab = 'ValidIndentity';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const renderItem = ({item}) => {
    const isActive = item.key === activeTab;

    return (
      <View>
        <View style={[styles.tobTab, isActive && styles.activeTab]}>
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Loading...'}
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
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>UPLOAD DOCUMENT</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.header}>Upload Valid Identity</Text>
      </View>

      <View style={styles.innercontainer}>
        <FlatList
          data={TobTabs}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>

      <View style={{padding: 20}}>
        <View style={{marginVertical: 10}}>
          <CustomDropdown
            label="ID Type"
            isNeeded={true}
            placeholder="Select ID Type"
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={idTypeData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={formDetails.validIdentificationType}
            onChange={option => {
              setFormDetails({
                ...formDetails,
                validIdentificationType: option.value,
              });
            }}
          />
        </View>

        <Input
          iconName="card-account-details-outline"
          placeholder="Enter id number"
          isNeeded={true}
          label="ID Number"
          value={formDetails.validIdentification}
          onChangeText={text =>
            setFormDetails({...formDetails, validIdentification: text})
          }
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View
        style={{
          marginVertical: 16,
          marginHorizontal: 16,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProofOfAddress', {paramKey: formDetails});
          }}
          disabled={disableit}>
          <Buttons label={'Save & Continue'} disabled={disableit} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ValidIdentity;

const styles = StyleSheet.create({
  innercontainer: {
    marginTop: 16,
    marginHorizontal: 19,
  },
  tobTab: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 2,
  },
  activeTabText: {
    color: 'white',
  },
  activeTab: {
    backgroundColor: '#054B99',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabText2: {
    fontFamily: 'serif',
    fontSize: 12,
    textAlign: 'center',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#14142B',
  },
  tabBar: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderWidth: 0,
  },
  indicator: {
    backgroundColor: '#054B99',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  camHead: {
    fontSize: 14,
    fontWeight: '400',
  },
});
