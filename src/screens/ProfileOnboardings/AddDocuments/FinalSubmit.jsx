import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Buttons from '../../../component/buttons/Buttons';
import {
  createDocumentsDetails,
  updateDocumentsDetails,
} from '../../../stores/LoanStore';

const ITEM_HEIGHT = 100;

const TobTabs = [
  {name: 'Valid Identity', key: 'ValidIdentity'},
  {name: 'Proof of Address', key: 'ProofOfAddress'},
  {name: 'Personal Photo', key: 'PersonalPhoto'},
  {name: 'Identity Card (ARM)', key: 'IdentityCard'},
  {name: 'Bank Statement', key: 'BankStatement'},
  {name: 'Passport', key: 'Passport'},
  {name: 'Signature', key: 'Signature'},
  {name: 'Company Seals', key: 'CompanySeals'},
  {name: 'CAC', key: 'CAC'},
  {name: 'Others', key: 'Others'},
  {name: 'Submit All', key: 'SubmitDocs'},
];

const FinalSubmit = ({route}) => {
  const docsDetails = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();
  const activeTab = 'SubmitDocs';
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

  const formDetails = {
    validIdentificationType:
      docsDetails?.validIdentificationType === undefined
        ? ''
        : docsDetails?.validIdentificationType,
    validIdentification:
      docsDetails?.validIdentification === undefined
        ? ''
        : docsDetails?.validIdentification,
    utilityBill:
      docsDetails?.utilityBill === undefined ? '' : docsDetails?.utilityBill,
    bankStatement:
      docsDetails?.bankStatement === undefined
        ? ''
        : docsDetails?.bankStatement,
    passport: docsDetails?.passport === undefined ? '' : docsDetails?.passport,
    signature:
      docsDetails?.signature === undefined ? '' : docsDetails?.signature,
    seal: docsDetails?.seal === undefined ? '' : docsDetails?.seal,
    cacCertificate:
      docsDetails?.cacCertificate === undefined
        ? ''
        : docsDetails?.cacCertificate,
    othersName:
      docsDetails?.othersName === undefined ? '' : docsDetails?.othersName,
    others: docsDetails?.others === undefined ? '' : docsDetails?.others,
    identityCard:
      docsDetails?.identityCard === undefined ? '' : docsDetails?.identityCard,
    personalPhoto:
      docsDetails?.personalPhoto === undefined
        ? ''
        : docsDetails?.personalPhoto,
    cac7: '',
    cac2: '',
    lpoFile: '',
    proformaFile: '',
    MERMAT: '',
  };

  const handleCreateDocs = async () => {
    setIsUpdating(true);
    const res = await createDocumentsDetails(formDetails);
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
        navigation.navigate('GetLoan');
      }, 1000);
    }
    setIsUpdating(false);
  };

  const handleUpdateDocs = async () => {
    setIsUpdating(true);
    const res = await updateDocumentsDetails(formDetails);
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
        navigation.navigate('MyAccount');
      }, 1000);
    }
    setIsUpdating(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ||
        (isUpdating && (
          <Spinner
            textContent={'Submitting ...'}
            textStyle={{color: 'white'}}
            visible={true}
            overlayColor="rgba(78, 75, 102, 0.7)"
          />
        ))}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack('')}>
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
        <Text style={styles.header}>Submit All</Text>
      </View>
      <View style={styles.innercontainer}>
        <FlatList
          data={TobTabs}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={8}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>

      <View style={[styles.innercontainer, {marginBottom: 40, flex: 1}]}>
        <View>
          <View style={styles.require}>
            <View>
              <Text style={styles.Head}>Document Submission </Text>
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={styles.textHead}>
                Thank you for submitting your documents. Your documents will be
                processed after you click the submit button. Please allow up to
                24 hours for processing. If you have any questions, please
                contact us.
              </Text>
            </View>
          </View>

          <View style={{marginTop: 40}}>
            <TouchableOpacity
              onPress={() => {
                docsDetails?.validIdentificationType === undefined
                  ? navigation.navigate('GetLoan')
                  : navigation.navigate('MyAccount');
              }}>
              <Buttons label={'Submit & Finish'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FinalSubmit;

const styles = StyleSheet.create({
  innercontainer: {
    marginTop: 16,
    marginHorizontal: 19,
  },
  require: {
    borderWidth: 0.3,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'grey',
    borderRadius: 12,
    marginVertical: 30,
  },
  tobTab: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 2,
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
  textHead: {
    fontSize: 12,
    color: '#6E7191',
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
  activeTabText: {
    color: 'white',
  },
  activeTab: {
    backgroundColor: '#054B99',
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
