import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Buttons from '../../../component/buttons/Buttons';
import {
  createDocumentsDetails,
  updateDocumentsDetails,
} from '../../../stores/LoanStore';
import Loader from '../../../component/loader/loader';
import {Header} from '../../../component/header/Header';
import VerifyModal from '../../../component/modals/verifyModal';
import COLORS from '../../../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getAsyncData} from '../../../context/AsyncContext';

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

let origin = '';
const FinalSubmit = ({route}) => {
  const docsDetails = route?.params?.paramKey;
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [origin, setOrigin] = useState('');
  const navigation = useNavigation();
  const activeTab = 'SubmitDocs';
  const previousRoute = navigation.getState()?.routes.slice(-2)[0]?.name;
  const [showConfirm, setShowConfirm] = useState(false);

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

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getAsyncData({storage_name: 'originRoute'});
    setOrigin(res.data);
  };

  function toggleConfirm() {
    setShowConfirm(!showConfirm);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isUpdating} loadingText={'Submitting ...'} />
      <Loader visible={isLoading} loadingText={'Submitting ...'} />
      <Header
        routeAction={() => navigation.goBack()}
        heading={'UPLOAD DOCUMENT'}
        disable={false}
      />
      <VerifyModal visible={showConfirm}>
        <View style={{alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="check-circle"
            size={45}
            color={COLORS.lendaGreen}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
          <Text
            style={[styles.resetPinText, {fontSize: 24, fontFamily: 'serif'}]}>
            What next!
          </Text>
          <Text style={styles.question}>
            Do you want to request for a loan ?
          </Text>

          <TouchableOpacity
            style={styles.signUpactivity}
            onPress={() => {
              toggleConfirm();
              navigation.navigate('BottomTabs', {screen: 'Loan'});
            }}>
            <Text style={styles.confirmText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleConfirm();
              navigation.popToTop('BottomTabs');
            }}
            style={[
              styles.signUpactivity,
              {
                borderColor: '#054B99',
                backgroundColor: '#fff',
                borderWidth: 1,
              },
            ]}>
            <Text style={[styles.confirmText, {color: '#054B99'}]}>No</Text>
          </TouchableOpacity>
        </View>
      </VerifyModal>

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
                if (origin !== 'MyAccount') {
                  if (docsDetails?.validIdentificationType !== undefined) {
                    toggleConfirm();
                  } else {
                    navigation.popToTop('BottomTabs');
                  }
                } else {
                  navigation.popToTop('BottomTabs', {
                    screen: 'More',
                    params: {
                      screen: 'MyAccount',
                    },
                  });
                }
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
  resetPinText: {
    color: '#ED2E7E',
    fontFamily: 'serif',
    fontSize: 16,
    paddingVertical: 10,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpactivity: {
    backgroundColor: COLORS.lendaBlue,
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signOutView: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
