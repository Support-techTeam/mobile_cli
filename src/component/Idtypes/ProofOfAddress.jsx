import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
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
import {createUploadDocument} from '../../stores/LoanStore';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {uploadProgress} from '../../stores/LoanStore';
import {DdLogs} from '@datadog/mobile-react-native';

const statusBarHeight = getStatusBarHeight();
let fileUrl = '';
let fileName = '';
let fileType = '';
let document = '';
let nextScreen = '';
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
  const [fileUri, setFileUri] = useState({
    uri: '',
    name: '',
    type: '',
  });
  const [filePath, setFilePath] = useState({});
  const [documentName, setDocumentName] = useState('');
  const {params} = route;
  const {paramKey} = params;
  const {
    validIdentificationType,
    validIdentification,
    utilityBill,
    bankStatement,
    passport,
    signature,
    seal,
    cacCertificate,
    others,
    identityCard,
    personalPhoto,
  } = paramKey;

  const [userDocs, setUserDocs] = useState(
    {
      validIdentificationType:
        validIdentificationType === undefined ||
        validIdentificationType === null ||
        validIdentificationType === ''
          ? ''
          : validIdentificationType,
      validIdentification:
        validIdentification === undefined ||
        validIdentification === null ||
        validIdentification === ''
          ? ''
          : validIdentification,
      utilityBill:
        utilityBill === undefined || utilityBill === null || utilityBill === ''
          ? ''
          : utilityBill,
      bankStatement:
        bankStatement === undefined ||
        bankStatement === null ||
        bankStatement === ''
          ? ''
          : bankStatement,
      passport:
        passport === undefined || passport === null || passport === ''
          ? ''
          : passport,
      signature:
        signature === undefined || signature === null || signature === ''
          ? ''
          : signature,
      seal: seal === undefined || seal === null || seal === '' ? '' : seal,
      cacCertificate:
        cacCertificate === undefined ||
        cacCertificate === null ||
        cacCertificate === ''
          ? ''
          : cacCertificate,
      others:
        others === undefined || others === null || others === '' ? '' : others,
      identityCard:
        identityCard === undefined ||
        identityCard === null ||
        identityCard === ''
          ? ''
          : identityCard,
      personalPhoto:
        personalPhoto === undefined ||
        personalPhoto === null ||
        personalPhoto === ''
          ? ''
          : personalPhoto,
    },
    [navigation],
  );

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

  const [nextRoute, setNextRoute] = useState('');

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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'utilityBill';
            nextScreen = 'PersonalPhoto';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'bankStatement';
            nextScreen = 'Passport';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'passport';
            nextScreen = 'Signature';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'seal';
            nextScreen = 'CAC';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'cacCertificate';
            nextScreen = 'Others';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'personalPhoto';
            nextScreen = 'IdentityCard';
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
            fileUrl = result?.uri || result?.assets[0]?.uri;
            fileName = result?.fileName || result?.assets[0]?.fileName;
            fileType = result?.type || result?.assets[0]?.type;
            document = 'identityCard';
            nextScreen = 'BankStatement';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'utilityBill';
        nextScreen = 'PersonalPhoto';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'personalPhoto';
        nextScreen = 'IdentityCard';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'identityCard';
        nextScreen = 'BankStatement';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'bankStatement';
        nextScreen = 'Passport';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'passport';
        nextScreen = 'Signature';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'signature';
        nextScreen = 'CompanySeals';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'signature';
        nextScreen = 'CompanySeals';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'seal';
        nextScreen = 'CAC';
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
        fileUrl = result?.uri || result?.assets[0]?.uri;
        fileName = result?.fileName || result?.assets[0]?.fileName;
        fileType = result?.type || result?.assets[0]?.type;
        document = 'cacCertificate';
        nextScreen = 'Others';
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

  const s3UploadFunction = async () => {
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

          setUserDocs(deetss => {
            return {
              ...deetss,
              [documentName]: `${res?.data?.data?.url}`,
            };
          });

          setTimeout(() => {
            navigation.navigate(`${nextScreen}`, {
              paramKey: {
                ...paramKey,
                [documentName]: `${res?.data?.data?.url}`,
              },
            });
          }, 500);

          setTimeout(() => {
            fileUrl = '';
            fileName = '';
            fileType = '';
            document = '';
            nextScreen = '';
          }, 3000);

          setIsUpdating(false);
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
    <ScrollView
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {isUpdating && (
        <Spinner
          textContent={'Please wait...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <Modal visible={showConfirmModal}>
        <View style={styles.modalContainer}>
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
        </View>
      </Modal>

      <View style={styles.require}>
        <View>
          <Text style={styles.Head}>Document Requirements </Text>
        </View>
        <View style={{marginBottom: 10}}>
          {isProof && !isCam && (
            <>
              <Text style={styles.textHead}>
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
              </Text>
              <View style={styles.reqField}>
                {docsName.utilityBill ? (
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
                disabled={docsName.utilityBill === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons
                  label="Upload"
                  disabled={docsName.utilityBill === ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.utilityBill === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.utilityBill === ''}
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
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
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
                {docsName.seal ? (
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
                disabled={docsName.seal === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons label="Upload" disabled={docsName.seal === ''} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.seal === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.seal === ''}
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
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
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
                {docsName.cacCertificate ? (
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
                disabled={docsName.cacCertificate === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons
                  label="Upload"
                  disabled={docsName.cacCertificate === ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.cacCertificate === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.cacCertificate === ''}
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
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
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
                {docsName.bankStatement ? (
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
                disabled={docsName.bankStatement === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons
                  label="Upload"
                  disabled={docsName.bankStatement === ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.bankStatement === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.bankStatement === ''}
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
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
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
                {docsName.passport ? (
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
                disabled={docsName.passport === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons label="Upload" disabled={docsName.passport === ''} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.passport === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.passport === ''}
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
                Take a clear picture or upload a proof of address (utility bill)
                It must carry the address you entered. Date on utility bill must
                not be more than 3month before registration
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
                {docsName.signature ? (
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
                disabled={docsName.signature === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons label="Upload" disabled={docsName.signature === ''} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.signature === ''}
                style={{marginTop: 10}}
                onPress={pickDocumentS}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.signature === ''}
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
                {docsName.personalPhoto ? (
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
                disabled={docsName.personalPhoto === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons
                  label="Upload"
                  disabled={docsName.personalPhoto === ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.personalPhoto === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.personalPhoto === ''}
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
                {docsName.identityCard ? (
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
                disabled={docsName.identityCard === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons
                  label="Upload"
                  disabled={docsName.identityCard === ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.identityCard === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.identityCard === ''}
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
