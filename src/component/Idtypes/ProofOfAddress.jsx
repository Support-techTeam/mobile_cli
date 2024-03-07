import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  // Modal,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
// import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Buttons from '../buttons/Buttons';
import {useNavigation, useRoute} from '@react-navigation/native';
// you may also import just the functions or constants that you will use from this library
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {
  getLoanUserDetails,
  createUploadDocument,
  createDocumentsDetails,
  updateDocumentsDetails,
} from '../../stores/LoanStore';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {uploadProgress} from '../../stores/LoanStore';
import {DdLogs} from '@datadog/mobile-react-native';
import Loader from '../loader/loader';
import COLORS from '../../constants/colors';
import {Button, Modal} from 'native-base';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const statusBarHeight = getStatusBarHeight();

// let fileUrl = '';
// let fileName = '';
// let fileType = '';
// let setDocument('';
// let setNextScreen('';
// let newUrl = '';
const ProofofAdd = ({
  isCam,
  isProof,
  isSeal,
  isCac,
  isBank,
  isPass,
  isSign,
  isPer,
  isId,
  deets,
}) => {
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [document, setDocument] = useState('');
  const [fileType, setFileType] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [nextScreen, setNextScreen] = useState('');

  // const [filePath, setFilePath] = useState({});
  // const [documentName, setDocumentName] = useState('');
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
    identityCard: '',
    personalPhoto: '',
  });

  const [orgDetails, setOrgDetails] = useState([]);

  const [docsName, setDocsName] = useState({
    utilityBill: '',
    bankStatement: '',
    passport: '',
    signature: '',
    seal: '',
    cacCertificate: '',
    identityCard: '',
    personalPhoto: '',
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
      setFileUrl('');
      setFileName('');
      setFileType('');
      setDocument('');
      setNextScreen('');
    });
    return unsubscribe;
    // }
  }, [navigation]);

  useEffect(() => {
    unSubBusinessDetails();
    setFileUrl('');
    setFileName('');
    setFileType('');
    setDocument('');
    setNextScreen('');
  }, []);

  const unSubBusinessDetails = async () => {
    setIsUpdating(true);
    const res = await getLoanUserDetails();
    if (res?.error) {
      // TODO: handle error
    } else {
      setOrgDetails(res?.data?.loanDocumentDetails);
    }
    setIsUpdating(false);
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

  const requestStoragePermission = async () => {
    const status = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
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

  const launchCameraAsync1 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
      await launchCamera({
        mediaType: 'photo', // Specify 'photo' to capture images
        maxWidth: 800, // Maximum width for the captured image
        maxHeight: 600, // Maximum height for the captured image
        quality: 1,
        saveToPhotos: true,
      })
        .then(result => {
          if (result.didCancel) {
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
            setUserDocs({...userDocs, utilityBill: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('utilityBill');
            setNextScreen('PersonalPhoto');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files utilityBill|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync2 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setUserDocs({...userDocs, bankStatement: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('bankStatement');
            setNextScreen('Passport');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files bankStatement|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync3 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setUserDocs({...userDocs, passport: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('passport');
            setNextScreen('Signature');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files passport|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync4 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setUserDocs({...userDocs, seal: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('seal');
            setNextScreen('CAC');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files seal|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync5 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setUserDocs({...userDocs, cacCertificate: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('cacCertificate');
            setNextScreen('Others');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files cacCertificate|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync6 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setNextScreen('IdentityCard');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files personalPhoto|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const launchCameraAsync7 = async () => {
    const permissopnResult = await requestCameraPermission();
    const isStoragePermitted = await requestStoragePermission();
    if (permissopnResult && isStoragePermitted) {
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
            setUserDocs({...userDocs, identityCard: result});
            setFileUrl(result?.uri || result?.assets[0]?.uri);
            setFileName(result?.fileName || result?.assets[0]?.fileName);
            setFileType(result?.type || result?.assets[0]?.type);
            setDocument('identityCard');
            setNextScreen('BankStatement');
            handleImageSelection(result);
            DdLogs.info(`Loans | Document Upload Set Files identityCard|`, {
              context: {
                fileUrl,
                fileName,
                fileType,
                document,
              },
            });
          }
        })
        .catch(error => {});
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const pickDocument1 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, utilityBill: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('utilityBill');
        setNextScreen('PersonalPhoto');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument7 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, personalPhoto: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('personalPhoto');
        setNextScreen('IdentityCard');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument8 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, identityCard: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('identityCard');
        setNextScreen('BankStatement');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument2 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });

        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, bankStatement: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('bankStatement');
        setNextScreen('Passport');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument3 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, passport: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('passport');
        setNextScreen('Signature');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocumentS = async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, signature: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('signature');
        setNextScreen('CompanySeals');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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
  };

  const pickDocument4 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, signature: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('signature');
        setNextScreen('CompanySeals');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument5 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, seal: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('seal');
        setNextScreen('CAC');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const pickDocument6 = useCallback(async () => {
    const permissopnResult = await requestStoragePermission();
    if (permissopnResult) {
      try {
        const result = await launchImageLibrary({
          presentationStyle: 'fullScreen',
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setDocsName({...docsName, cacCertificate: result});
        setFileUrl(result?.uri || result?.assets[0]?.uri);
        setFileName(result?.fileName || result?.assets[0]?.fileName);
        setFileType(result?.type || result?.assets[0]?.type);
        setDocument('cacCertificate');
        setNextScreen('Others');
        handleImageSelection(result);
        DdLogs.info(`Loans | Document Picker Set Files utilityBill|`, {
          context: {
            fileUrl,
            fileName,
            fileType,
            document,
          },
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

  const clearDocument = () => {
    setSelectedDocument(null);
    setImage(null);
  };

  const handleImageSelection = async result => {
    if (!result.canceled) {
      if (result) {
        DdLogs.info(`Loans | Document Upload Handle Image Selection|`, {
          context: result,
        });
        setImage(result?.uri || result?.assets[0]?.uri);
        setShowConfirmModal(true);
      }
    }
  };

  const retakePhoto1 = () => {
    setImage(null);
    setShowConfirmModal(false);
    launchCameraAsync1();
  };

  const confirmPhoto = () => {
    setShowConfirmModal(false);
  };

  const noPhoto = () => {
    setImage(null);
    setShowConfirmModal(false);
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
        navigation.navigate(`${nextScreen}`, {
          paramKey: {
            ...paramKey,
            [document]: newUrl,
          },
        });
      }, 500);

      setTimeout(() => {
        setFileUrl('');
        setFileName('');
        setFileType('');
        setDocument('');
        setNextScreen('');
      }, 3000);
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
        navigation.navigate(`${nextScreen}`, {
          paramKey: {
            ...formDetails,
          },
        });
      }, 500);

      setTimeout(() => {
        setFileUrl('');
        setFileName('');
        setFileType('');
        setDocument('');
        setNextScreen('');
      }, 3000);
    }
    setIsUpdating(false);
  };

  const s3UploadFunction = async () => {
    setNewUrl('');
    setIsUpdating(true);
    DdLogs.info(`Loans | Document Upload s3Upload Init|`, {
      context: {
        fileUrl,
        fileType,
        fileName,
        document,
      },
    });
    try {
      if (
        fileUrl === '' ||
        fileType === '' ||
        fileName === '' ||
        document === ''
      ) {
        DdLogs.error(`Loans | Document Upload s3Upload |`, {
          context: {
            fileUrl,
            fileType,
            fileName,
            document,
          },
        });
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Check Files',
          text2: 'Empty file data',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        const param = {
          uri: fileUrl,
          name: fileName,
          type: fileType,
        };

        const res = await createUploadDocument(param, document);
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
          setIsUpdating(false);
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

          setNewUrl(res?.data?.data?.url);
          setUserDocs(deetss => {
            formDetails = {
              ...deetss,
              [document]: `${res?.data?.data?.url}`,
            };
            return {
              ...deetss,
              [document]: `${res?.data?.data?.url}`,
            };
          });

          userDocs?.validIdentificationType === undefined
            ? handleCreateDocs()
            : handleUpdateDocs();
        }
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: 'Uploading Documents',
        text2: err?.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });

      setIsUpdating(false);
    }
  };

  return (
    <View>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {isUpdating && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99999,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 70,
                backgroundColor: COLORS.white,
                marginHorizontal: 50,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <ActivityIndicator size="large" color={COLORS.blue} animating />
              <Text style={{marginLeft: 10, fontSize: 16}}>Please wait...</Text>
            </View>
          </View>
        )}
        {/* <Modal visible={showConfirmModal}> */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => showConfirmModal(false)}>
          <Modal.Content minWidth="90%" minHeight="70%">
            <Modal.CloseButton />
            <Modal.Header>CONFIRM IMAGE</Modal.Header>
            <Modal.Body minHeight="70%">
              <Text
                style={{
                  marginVertical: 7,
                  textAlign: 'center',
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#14142B',
                }}>
                Ensure that your image is clear and, not blurry
              </Text>
              <View
                style={{
                  backgroundColor: '#14142B',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#14142B',
                    height: 'auto',
                    width: '100%',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{uri: image}}
                    style={{
                      width: '100%',
                      height: heightPercentageToDP('50%'),
                      resizeMode: 'contain',
                      marginVertical: 10,
                    }}
                  />
                </View>
              </View>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    retakePhoto1();
                  }}>
                  Retake Photo
                </Button>
                <Button
                  onPress={() => {
                    confirmPhoto();
                  }}>
                  Confirm Image
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
          {/* <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
              <TouchableOpacity>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#D9DBE9',
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity onPress={() => noPhoto()}>
                    <AntDesign name="left" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={styles.HeadView}>
                <View style={styles.TopView}>
                  <Text style={styles.TextHead}>CONFIRM IMAGE</Text>
                </View>
              </View>
            </View>
            <View style={styles.demark} />
            <Text style={styles.extraText}>
              Ensure that your image is clear and, not blurry
            </Text>
            <View style={styles.imageContainer}>
              <Image source={{uri: image}} style={styles.modalImage} />
            </View>
            <View style={{paddingHorizontal: 22, marginVertical: 20}}>
              <TouchableOpacity onPress={confirmPhoto}>
                <Buttons label="Confirm Photo" />
              </TouchableOpacity>
            </View>

            <View style={{paddingHorizontal: 22, marginVertical: 20}}>
              <TouchableOpacity onPress={retakePhoto1}>
                <View style={styles.signUpactivity}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name="camera" size={25} color="#054B99" />
                    <Text style={styles.retake}>Retake Photo</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}
        </Modal>

        <View style={styles.require}>
          <View>
            <Text style={styles.Head}>Document Requirements </Text>
          </View>
          <View style={{marginBottom: 10}}>
            {isProof && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {docsName.utilityBill || userDocs.utilityBill ? (
                    <>
                      <View>
                        <Text>{docsName.utilityBill.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {fileUrl == '' && userDocs.utilityBill != '' && (
                        <Image
                          source={{uri: userDocs.utilityBill}}
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
                        onPress={pickDocument1}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.utilityBill === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument1}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.utilityBill === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isProof && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync1}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>

                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}

            {isSeal && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your company seal
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <View style={styles.reqField}>
                  {docsName.seal || userDocs.seal ? (
                    <>
                      <View>
                        <Text>{docsName.seal.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}

                      {userDocs.seal != '' && fileUrl == '' && (
                        <Image
                          source={{uri: userDocs.seal}}
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
                        onPress={pickDocument5}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  disabled={docsName.seal === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.seal === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument5}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.seal === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isSeal && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync4}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isCac && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your CAC
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <View style={styles.reqField}>
                  {docsName.cacCertificate || userDocs.cacCertificate ? (
                    <>
                      <View>
                        <Text>{docsName.cacCertificate.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}

                      {userDocs.cacCertificate != '' && fileUrl == '' && (
                        <Image
                          source={{uri: userDocs.cacCertificate}}
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
                        onPress={pickDocument6}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  disabled={docsName.cacCertificate === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    disabled={docsName.cacCertificate === '' || fileUrl === ''}
                    label="Upload"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument6}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.cacCertificate === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isCac && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync5}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isBank && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your a copy of your bank
                  statement{' '}
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <Text style={styles.textHead}>
                  Statement of the last 12 month of account
                </Text>
                <View style={styles.reqField}>
                  {docsName.bankStatement || userDocs.bankStatement ? (
                    <>
                      <View>
                        <Text>{docsName.bankStatement.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {userDocs.bankStatement != '' && fileUrl == '' && (
                        <Image
                          source={{uri: userDocs.bankStatement}}
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
                        onPress={pickDocument2}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  disabled={docsName.bankStatement === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    disabled={docsName.bankStatement === '' || fileUrl === ''}
                    label="Upload"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument2}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.bankStatement === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isBank && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync2}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isPass && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your Passport{' '}
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <Text style={styles.textHead}>
                  Passport size not more than 3MB
                </Text>
                <View style={styles.reqField}>
                  {docsName.passport || userDocs.passport ? (
                    <>
                      <View>
                        <Text>{docsName.passport.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {userDocs.passport != '' && fileUrl == '' && (
                        <Image
                          source={{uri: userDocs.passport}}
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
                        onPress={pickDocument3}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  disabled={docsName.passport === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.passport === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument3}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.passport === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isPass && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a proof of address (utility
                  bill) It must carry the address you entered. Date on utility
                  bill must not be more than 3month before registration
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync3}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isSign ? (
              <>
                <Text style={styles.textHead}>
                  Draw, take a clear picture or upload your signature{' '}
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <View style={styles.reqField}>
                  {docsName.signature || userDocs.signature ? (
                    <>
                      <View>
                        <Text>{docsName.signature.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {userDocs.signature != '' && fileUrl == '' && (
                        <Image
                          source={{uri: userDocs.signature}}
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
                        onPress={pickDocument4}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  disabled={docsName.signature === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.signature === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument4}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.signature === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            ) : null}
            {isPer && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your Personal Photo{' '}
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <Text style={styles.textHead}>
                  Personal Photo size not more than 3MB
                </Text>
                <View style={styles.reqField}>
                  {docsName.personalPhoto || userDocs.personalPhoto ? (
                    <>
                      <View>
                        <Text>{docsName.personalPhoto.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {fileUrl == '' && userDocs.personalPhoto != '' && (
                        <Image
                          source={{uri: userDocs.personalPhoto}}
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
                        onPress={pickDocument7}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  disabled={docsName.personalPhoto === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.personalPhoto === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument7}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.personalPhoto === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
            {isPer && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload a Personal Photo
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync6}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}

            {isId && !isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload your Id Card{' '}
                </Text>
                <Text style={[styles.textHead, {color: '#054B99'}]}>
                  See samples
                </Text>
                <Text style={styles.textHead}>
                  Id Card size not more than 3MB
                </Text>
                <View style={styles.reqField}>
                  {docsName.identityCard || userDocs.identityCard ? (
                    <>
                      <View>
                        <Text>{docsName.identityCard.name}</Text>
                      </View>
                      {fileUrl !== '' && (
                        <Image
                          source={{uri: fileUrl}}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      )}
                      {fileUrl == '' && userDocs.identityCard != '' && (
                        <Image
                          source={{uri: userDocs.identityCard}}
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
                        onPress={pickDocument8}>
                        <Entypo
                          name="upload-to-cloud"
                          size={30}
                          color="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Browse Files</Text>
                      <Text style={styles.takeText2}>
                        File format: JPG, JPEG, PNG,PDF | Max File Size 3mb
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  disabled={docsName.identityCard === '' || fileUrl === ''}
                  style={{marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons
                    label="Upload"
                    disabled={docsName.identityCard === '' || fileUrl === ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={pickDocument8}>
                  <Buttons
                    label="Change Selection"
                    // disabled={docsName.identityCard === ''}
                  />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}

            {isId && isCam && (
              <>
                <Text style={styles.textHead}>
                  Take a clear picture or upload an Id Card
                </Text>
                <View style={styles.reqField}>
                  {fileUrl !== '' ? (
                    <Image
                      source={{uri: fileUrl}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#24348B',
                          padding: 10,
                          borderRadius: 5,
                        }}
                        onPress={launchCameraAsync7}>
                        <FontAwesome name="camera" size={30} color="#FCFCFC" />
                      </TouchableOpacity>
                      <Text style={styles.takeText}>Tap to take a photo</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{opacity: 1, marginTop: 10}}
                  onPress={s3UploadFunction}>
                  <Buttons label="Upload" />
                </TouchableOpacity>
                {uploadProgress && uploadProgress > 0 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <Text>{uploadProgress && uploadProgress}% complete</Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>

        {image || selectedDocument ? (
          <View style={styles.remove}>
            <TouchableOpacity onPress={clearDocument}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ProofofAdd;

const styles = StyleSheet.create({
  require: {
    borderWidth: 0.3,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'grey',
    borderRadius: 12,
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
  Head: {
    fontFamily: 'serif',
    fontSize: 14,
    color: '#054B99',
    letterSpacing: 0.5,
  },
  textHead: {
    fontSize: 12,
    color: '#6E7191',
  },
  opencam: {
    borderWidth: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    paddingTop: statusBarHeight,
    paddingHorizontal: 0,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#14142B',
    height: '40%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 76,
  },
  modalButtonsContainer: {
    // alignItems: 'center',
    // width: '80%',
    backgroundColor: 'red',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  extraText: {
    marginTop: 24,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    color: '#14142B',
  },
  signUpactivity: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retake: {
    color: '#054B99',
    marginLeft: 5,
    fontSize: 16,
  },
  remove: {
    marginTop: 30,
    alignItems: 'center',
  },
  removeText: {
    fontSize: 18,
    color: '#ED2E7E',
  },
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    // borderWidth:.5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',

    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  takeText: {
    fontFamily: 'serif',
    marginTop: 10,
    fontSize: 16,
  },
  takeText2: {
    marginTop: 10,
    fontSize: 10,
  },
});
