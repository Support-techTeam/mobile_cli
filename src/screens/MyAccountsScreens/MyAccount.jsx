import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Personal from '../../component/MyAccountTabs/PersonalTab';
import Business from '../../component/MyAccountTabs/BusinessTab';
import Finance from '../../component/MyAccountTabs/FinanceTab';
import ARM from '../../component/MyAccountTabs/ARMTab';
import NextOfKin from '../../component/MyAccountTabs/NextOfKinTab';
import Document from '../../component/MyAccountTabs/DocumentTab';
import {
  getLoanUserDetails,
  createDocumentsDetails,
  updateDocumentsDetails,
  createUploadDocument,
} from '../../stores/LoanStore';
import FastImage from 'react-native-fast-image';
import {Header} from '../../component/header/Header';

const MyAccount = () => {
  const [image, setImage] = useState(null);
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [document, setDocument] = useState('');
  const [fileType, setFileType] = useState('');
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
    identityCard: '',
    personalPhoto: '',
  });

  const handleImageSelection = async result => {
    if (!result.canceled) {
      setImage(result?.assets[0]?.uri);
    }
  };

  const requestCameraPermission = async () => {
    const status = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );

    if (status === 'granted') {
      return true;
    }
    if (status === 'blocked') {
      openSettings();
      return false;
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

  const launchCameraAsync = async () => {
    const permissopnResult = await requestCameraPermission();
    if (permissopnResult) {
      await launchCamera({
        mediaType: 'photo', // Specify 'photo' to capture images
        maxWidth: 800, // Maximum width for the captured image
        maxHeight: 600, // Maximum height for the captured image
        quality: 1,
      })
        .then(result => {
          if (result.didCancel) {
          } else if (result.error) {
          } else if (result?.errorCode) {
            Toast.show({
              type: 'error',
              position: 'top',
              topOffset: 50,
              text1: 'Camera Access',
              text2: result?.errorCode.replace('_', ' '),
              visibilityTime: 5000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
          } else {
            setUserDocs({...userDocs, personalPhoto: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('personalPhoto');
            handleImageSelection(result);
          }
        })
        .catch(error => {});
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: 'Permission Required',
        text2: 'Permission to access camera is required.',
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
      return;
    }
  };

  //Instant Update

  let formDetails = {
    validIdentificationType:
      userDocs?.validIdentificationType === undefined
        ? ''
        : userDocs?.validIdentificationType,
    validIdentification:
      userDocs?.validIdentification === undefined
        ? ''
        : userDocs?.validIdentification,
    utilityBill:
      userDocs?.utilityBill === undefined ? '' : userDocs?.utilityBill,
    bankStatement:
      userDocs?.bankStatement === undefined ? '' : userDocs?.bankStatement,
    passport: userDocs?.passport === undefined ? '' : userDocs?.passport,
    signature: userDocs?.signature === undefined ? '' : userDocs?.signature,
    seal: userDocs?.seal === undefined ? '' : userDocs?.seal,
    cacCertificate:
      userDocs?.cacCertificate === undefined ? '' : userDocs?.cacCertificate,
    othersName: userDocs?.othersName === undefined ? '' : userDocs?.othersName,
    others: userDocs?.others === undefined ? '' : userDocs?.others,
    identityCard:
      userDocs?.identityCard === undefined ? '' : userDocs?.identityCard,
    personalPhoto:
      userDocs?.personalPhoto === undefined ? '' : userDocs?.personalPhoto,
    cac7: '',
    cac2: '',
    lpoFile: '',
    proformaFile: '',
    MERMAT: '',
  };

  const handleCreateDocs = async () => {
    try {
      const res = await createDocumentsDetails(formDetails);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Profile Picture',
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        setTimeout(() => {
          setFileUrl('');
          setFileName('');
          setFileType('');
          setDocument('');
          setImage(null);
        }, 500);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (image !== null) {
      s3UploadFunction();
    }
  }, [image]);

  const handleUpdateDocs = async () => {
    try {
      const res = await updateDocumentsDetails(formDetails);
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Profile Picture',
          text2: res?.message,
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        unSubBusinessDetails();
        setTimeout(() => {
          setFileUrl('');
          setFileName('');
          setFileType('');
          setDocument('');
          setImage(null);
        }, 500);
      }
    } catch (e) {}
  };

  const s3UploadFunction = async () => {
    try {
      if (setImage === '') {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Profile Picture',
          text2: 'Empty file data',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        const param = {
          uri: image,
          name: fileName,
          type: fileType,
        };

        const res = await createUploadDocument(param, 'personalPhoto');
        if (res?.error) {
          Toast.show({
            type: 'error',
            position: 'top',
            topOffset: 50,
            text1: 'Profile Picture',
            text2: res?.message,
            visibilityTime: 5000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
        } else {
          setUserDocs(deetss => {
            formDetails = {
              ...deetss,
              personalPhoto: `${res?.data?.data?.url}`,
            };
            return {
              ...deetss,
              personalPhoto: `${res?.data?.data?.url}`,
            };
          });

          userDocs?.validIdentificationType === undefined
            ? handleCreateDocs()
            : handleUpdateDocs();
        }
      }
    } catch (err) {}
  };

  const navigation = useNavigation();
  const [orgDetails, setOrgDetails] = useState([]);

  const [routes] = useState([
    {key: 'personal', title: 'Personal'},
    {key: 'business', title: 'Business'},
    // {key: 'finance', title: 'Finance'},
    {key: 'arm', title: 'ARM'},
    {key: 'nextofkin', title: 'Next Of Kin'},
    {key: 'document', title: 'Document'},
  ]);

  const renderScene = SceneMap({
    personal: Personal,
    business: Business,
    // finance: Finance,
    arm: ARM,
    nextofkin: NextOfKin,
    document: Document,
  });

  useEffect(() => {
    setUserDocs({
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
      identityCard:
        orgDetails && orgDetails?.identityCard === undefined
          ? ''
          : orgDetails?.identityCard,
      personalPhoto:
        orgDetails && orgDetails?.personalPhoto === undefined
          ? ''
          : orgDetails?.personalPhoto,
    });
  }, [orgDetails, navigation]);


  useEffect(() => {
    // if (route.name !== '') {
    const unsubscribe = navigation.addListener('focus', async () => {
      unSubBusinessDetails();
    });
    return unsubscribe;
    // }
  }, [navigation]);

  useEffect(() => {
    unSubBusinessDetails();
  }, []);

  const unSubBusinessDetails = async () => {
    try {
      const res = await getLoanUserDetails();
      if (res?.error) {
      } else {
        setOrgDetails(res?.data?.loanDocumentDetails);
      }
    } catch (e) {}
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
      <Header
        routeAction={() => navigation.goBack()}
        heading="PROFILE SETTINGS"
        disable={false}
      />
      <View style={[styles.innercontainer]}>
        <Pressable onPress={launchCameraAsync} style={styles.profileHeadView} disabled={orgDetails === null || orgDetails === undefined ? true : false}>
          <View style={styles.imagesView}>
            {orgDetails?.personalPhoto ? (
              <FastImage
                style={{width: 80, height: 80}}
                source={{
                  uri: orgDetails?.personalPhoto,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <FastImage
                style={{width: 80, height: 80}}
                source={{
                  uri: Image.resolveAssetSource(
                    require('../../../assets/images/guarantorProfile.png'),
                  ).uri,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>
          <View style={styles.pencilView}>
            <FontAwesome5 name="pen" size={16} color="#fff" />
          </View>
        </Pressable>
      </View>
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        tabBarPosition="top"
        renderTabBar={props => (
          <TabBar
            {...props}
            // tabStyle={styles.tabBar}
            scrollEnabled={true}
            labelStyle={styles.label}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            renderLabel={({route, focused}) => (
              <Text style={[styles.tabText2, focused && {color: '#054B99'}]}>
                {route.title}
              </Text>
            )}
            // contentContainerStyle={styles.tabBar}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MyAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  innercontainer: {
    paddingHorizontal: 16,
  },
  profileHeadView: {
    alignItems: 'center',
    marginTop: 34,
    padding: 20,
    backgroundColor: '#F7F7FC',
    borderRadius: 12,
  },
  ProfileText: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 36,
    color: '#14142B',
  },
  imagesView: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  pencilView: {
    backgroundColor: '#054B99',
    padding: 5,
    borderRadius: 50,
    // position: 'absolute',
    // bottom: 8,
    // right: 122,
    marginTop: -30,
    marginLeft: 50,
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
  tabText2: {
    fontFamily: 'serif',
    fontSize: 12,
    textAlign: 'center',
  },
});
