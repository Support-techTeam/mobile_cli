import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { observer } from 'mobx-react-lite';
import { SafeAreaView } from 'react-native-safe-area-context';

import Buttons from '../../../component/buttons/Buttons';
import { StoreContext } from '../../../config/mobX stores/RootStore';

const ITEM_HEIGHT = 100;

const TobTabs = [
  { name: 'Valid Identity', key: 'ValidIndentity' },
  { name: 'Proof of Address', key: 'ProofOfAddress' },
  { name: 'Bank Statement', key: 'BankStatement' },
  { name: 'Passport', key: 'Passport' },
  { name: 'Signature', key: 'Signature' },
  { name: 'Company Seals', key: 'CompanySeals' },
  { name: 'CAC', key: 'CAC' },
  { name: 'Others', key: 'Others' },
  { name: 'Submit All', key: 'SubmitDocs' },
];

const FinalSubmit = ({ route }) => {
  const docsDetails = route?.params?.paramKey;

  const navigation = useNavigation();
  const activeTab = 'SubmitDocs';
  const renderItem = ({ item }) => {
    const isActive = item.key === activeTab;

    return (
      <View>
        <View style={[styles.tobTab, isActive && styles.activeTab]}>
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>{item.name}</Text>
        </View>
      </View>
    );
  };

  const { loansStore } = useContext(StoreContext);
  const { sending, success, docs } = loansStore;

  const formDetails = {
    validIdentificationType:
      docsDetails?.validIdentificationType === undefined
        ? ''
        : docsDetails?.validIdentificationType,
    validIdentification:
      docsDetails?.validIdentification === undefined ? '' : docsDetails?.validIdentification,
    utilityBill: docsDetails?.utilityBill === undefined ? '' : docsDetails?.utilityBill,
    bankStatement: docsDetails?.bankStatement === undefined ? '' : docsDetails?.bankStatement,
    passport: docsDetails?.passport === undefined ? '' : docsDetails?.passport,
    signature: docsDetails?.signature === undefined ? '' : docsDetails?.signature,
    seal: docsDetails?.seal === undefined ? '' : docsDetails?.seal,
    cacCertificate: docsDetails?.cac === undefined ? '' : docsDetails?.cac,
    othersName: docsDetails?.othersName === undefined ? '' : docsDetails?.othersName,
    others: docsDetails?.others === undefined ? '' : docsDetails?.others,
    cac7: '',
    cac2: '',
    lpoFile: '',
    proformaFile: '',
    MERMAT: '',
  };

  const handleCreateDocs = () => {
    loansStore.createDocumentsDetails(formDetails);
  };

  const handleUpdateDocs = () => {
    loansStore.updateDocumentsDetails(formDetails);
  };

  useEffect(() => {
    if (success === 'Document details updated successfully') {
      navigation.navigate('GetLoan');
    }
  }, [navigation, success]);

  useEffect(() => {
    if (docs === 'Document details updated successfully') {
      navigation.navigate('MyAccount');
    }
  }, [navigation, docs]);

  return (
    <SafeAreaView style={styles.container}>
      {sending && (
        <Spinner
          textContent={'Submitting ...'}
          textStyle={{ color: 'white' }}
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
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack('')}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}
          >
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
          keyExtractor={(item) => item.key}
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

      <View style={[styles.innercontainer, { marginBottom: 40, flex: 1 }]}>
        <View>
          <View style={styles.require}>
            <View>
              <Text style={styles.Head}>Document Submission </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.textHead}>
                Thank you for submitting your documents. Your documents will be processed after you
                click the submit button. Please allow up to 24 hours for processing. If you have any
                questions, please contact us.
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 40 }}>
            <TouchableOpacity
              onPress={
                docsDetails?.validIdentificationType === undefined
                  ? handleCreateDocs
                  : handleUpdateDocs
              }
            >
              <Buttons label={'Submit & Finish'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
// write a 30 word write up telling the user that submitted documents will be processed after they click submit
export default observer(FinalSubmit);

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
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabText2: {
    fontFamily: 'MontSBold',
    fontSize: 12,
    textAlign: 'center',
  },
  textHead: {
    fontFamily: 'Montserat',
    fontSize: 12,
    color: '#6E7191',
  },
  TextHead: {
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
  },
  camHead: {
    fontFamily: 'Montserat',
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
