import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import Input from '../../../component/inputField/input.component';
import CustomInput from '../../../component/custominput/CustomInput';
import Buttons from '../../../component/buttons/Buttons';
import {createUploadDocument, uploadProgress} from '../../../stores/LoanStore';
import Toast from 'react-native-toast-message';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

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

const Others = () => {
  const route = useRoute();
  const {params} = route;
  const {paramKey} = params;

  const [userDocs, setUserDocs] = useState({
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

  useEffect(() => {
    setUserDocs({
      validIdentificationType:
        paramKey?.validIdentificationType === undefined
          ? ''
          : paramKey?.validIdentificationType,
      validIdentification:
        paramKey?.validIdentification === undefined
          ? ''
          : paramKey?.validIdentification,
      utilityBill:
        paramKey?.utilityBill === undefined ? '' : paramKey?.utilityBill,
      bankStatement:
        paramKey?.bankStatement === undefined ? '' : paramKey?.bankStatement,
      passport: paramKey?.passport === undefined ? '' : paramKey?.passport,
      signature: paramKey?.signature === undefined ? '' : paramKey?.signature,
      seal: paramKey?.seal === undefined ? '' : paramKey?.seal,
      cacCertificate:
        paramKey?.cacCertificate === undefined ? '' : paramKey?.cacCertificate,
      othersName:
        paramKey?.othersName === undefined ? '' : paramKey?.othersName,
      others: paramKey?.others === undefined ? '' : paramKey?.others,
    });
  }, [paramKey]);

  const activeTab = 'Others';
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [image, setImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fileUri, setFile] = useState({
    name: '',
    type: '',
    uri: '',
  });

  const disableit = !userDocs.othersName || !selectedDocument;

  const requestStoragePermission = async () => {
    const status = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    // console.log(status);
    if (status === 'granted') {
      return true;
    }
    if (status === 'blocked') {
      openSettings();
      return true;
    }
    if (status === 'denied') {
      openSettings();
      return false;
    }
    if (status === 'unavailable') {
      openSettings();
      return false;
    }
    if (status === 'blocked') {
      openSettings();
      return false;
    }
    if (status === 'limited') {
      return true;
    }
  };

  const pickDocument = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setSelectedDocument(result?.assets[0]);
        setImage(result.assets[0].uri);
        setFile({
          uri: result?.assets[0]?.uri,
          name: result?.assets[0]?.fileName,
          type: result?.assets[0]?.type,
        });
      } catch (err) {
        // console.warn(err);
      }
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access storage is required.',
      );
      return;
    }
  }, []);

  const s3UploadFunction = async () => {
    setIsUpdating(true);
    const res = await createUploadDocument(fileUri, 'signature');
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
      setUserDocs(deetss => {
        return {
          ...deetss,
          others: `${res?.data?.data?.url}`,
        };
      });

      setTimeout(() => {
        navigation.navigate('SubmitDocs', {
          paramKey: {...userDocs, others: `${res?.data?.data?.url}`},
        });
      }, 1000);
    }
    setIsUpdating(false);
  };

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
      {isUpdating && (
        <Spinner
          textContent={'Please wait...'}
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
        <Text style={styles.header}>Upload Other Details</Text>
      </View>
      <View style={styles.innercontainer}>
        <FlatList
          data={TobTabs}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={7}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>

      <ScrollView
        style={styles.innercontainer}
        showsVerticalScrollIndicator={false}>
        <Input
          label="Document Name"
          value={userDocs.othersName}
          onChangeText={text => setUserDocs({...userDocs, othersName: text})}
          autoCorrect={false}
        />

        <View style={styles.reqField}>
          {selectedDocument ? (
            <>
              <View>
                <Text style={{}}>{selectedDocument.fileName}</Text>
              </View>
              {image !== null && (
                <Image
                  source={{uri: image}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: '#24348B',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={pickDocument}>
                <Entypo name="upload-to-cloud" size={30} color="#FCFCFC" />
              </TouchableOpacity>
              <Text style={{}}>Browse Files</Text>
              <Text style={{}}>
                File format: JPG, JPEG, PNG | Max File Size 3mb
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={s3UploadFunction}
          disabled={disableit}
          style={{marginTop: 20}}>
          <Buttons label={'Submit'} disabled={disableit} />
        </TouchableOpacity>
        {uploadProgress > 0 && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text>{uploadProgress}% complete</Text>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 16,
          marginHorizontal: 16,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.tobTab, {backgroundColor: '#054B99'}]}>
            <Text style={[styles.tabText, {color: 'white'}]}>Prev.</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SubmitDocs', {paramKey: userDocs})
          }>
          <View style={[styles.tobTab, {backgroundColor: '#054B99'}]}>
            <Text style={[styles.tabText, {color: 'white'}]}>Skip</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Others;
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
  activeTabText: {
    color: 'white',
  },
  activeTab: {
    backgroundColor: '#054B99',
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
  reqField: {
    paddingHorizontal: 10,
    // borderWidth: 0.3,
    borderColor: '#D9D8E9',
    borderRadius: 12,
    marginTop: 10,
    height: 235,
    backgroundColor: '#F7F7FC',
    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
  },
});
