import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Buttons from '../buttons/Buttons';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
// import {uploadProgress} from '../../stores/LoanStore';

const statusBarHeight = getStatusBarHeight();
const uploadProgress = 0;
const ProofofAdd = ({
  isCam,
  isProof,
  isSeal,
  isCac,
  isBank,
  isPass,
  isSign,
  deets,
}) => {
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const navigation = useNavigation();

  const docsDetails = deets?.params?.paramKey;

  const [userDocs, setUserDocs] = useState({
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
    cac: docsDetails?.cac === undefined ? '' : docsDetails?.cac,
    others: docsDetails?.others === undefined ? '' : docsDetails?.others,
  });

  const [docsName, setDocsName] = useState({
    utilityBill: '',
    bankStatement: '',
    passport: '',
    signature: '',
    seal: '',
    cac: '',
  });
  const [nextRoute, setNextRoute] = useState('');
  // const {loansStore} = useContext(StoreContext);
  // const {success, sucsMsg, uploadProgress, fileString} = loansStore;

  const [documentName, setDocumentName] = useState('');

  const launchCameraAsync1 = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibrary({
        allowsEditing: true,
        aspect: [4, 2],
        quality: 1,
      });

      handleImageSelection(result);
      setUserDocs({...userDocs, utilityBill: result});
      setFile({
        uri: result?.assets[0]?.uri,
        name: result?.assets[0]?.fileName,
        type: result?.assets[0]?.type,
      });
      setDocumentName('utilityBill');
      setNextRoute('BankStatement');
    } catch (error) {}
  };

  const launchCameraAsync2 = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCamera({
        allowsEditing: true,
        aspect: [4, 2],
        quality: 1,
      });

      handleImageSelection(result);
      setUserDocs({...userDocs, bankStatement: result});
      setFile({
        uri: result?.assets[0]?.uri,
        name: result?.assets[0]?.fileName,
        type: result?.assets[0]?.type,
      });
      setDocumentName('bankStatement');
      setNextRoute('Passport');
    } catch (error) {}
  };

  const launchCameraAsync3 = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 2],
        quality: 1,
      });

      handleImageSelection(result);
      setFile({
        uri: result?.assets[0]?.uri,
        name: result?.assets[0]?.fileName,
        type: result?.assets[0]?.type,
      });
      setDocumentName('passport');
      setNextRoute('Signature');
    } catch (error) {}
  };
  const launchCameraAsync4 = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 2],
        quality: 1,
      });

      handleImageSelection(result);
      setFile({
        uri: result?.assets[0]?.uri,
        name: result?.assets[0]?.fileName,
        type: result?.assets[0]?.type,
      });
      setDocumentName('seal');
      setNextRoute('CAC');
    } catch (error) {}
  };
  const launchCameraAsync5 = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 2],
        quality: 1,
      });

      handleImageSelection(result);
      setFile({
        uri: result?.assets[0]?.uri,
        name: result?.assets[0]?.fileName,
        type: result?.assets[0]?.type,
      });
      setDocumentName('cac');
      setNextRoute('Others');
    } catch (error) {}
  };

  const pickDocument1 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, utilityBill: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('utilityBill');
    setNextRoute('BankStatement');
  };
  const pickDocumentS = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, signature: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('signature');
    setNextRoute('CompanySeals');
  };

  const pickDocument2 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, bankStatement: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('bankStatement');
    setNextRoute('Passport');
  };

  const pickDocument3 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, passport: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('passport');
    setNextRoute('Signature');
  };

  const pickDocument4 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, signature: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('signature');
    setNextRoute('CompanySeals');
  };

  const pickDocument5 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, seal: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('seal');
    setNextRoute('CAC');
  };

  const pickDocument6 = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setDocsName({...docsName, cac: result});
    setFile({name: result?.name, type: result?.mimeType, uri: result?.uri});
    setDocumentName('cac');
    setNextRoute('Others');
  };

  const clearDocument = () => {
    setSelectedDocument(null);
    setImage(null);
  };

  const handleImageSelection = async result => {
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowConfirmModal(true);
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

  const [fileUri, setFile] = useState({
    name: '',
    type: '',
    uri: '',
  });

  const s3UploadFunction = () => {
    // loansStore.createUploadDocument(fileUri, documentName);
  };

  // useEffect(() => {
  //   if (success === 'upload successful') {
  //     setUserDocs(deetss => {
  //       return {
  //         ...deetss,
  //         [documentName]: `${fileString}`,
  //       };
  //     });
  //     setTimeout(() => {
  //       setDocumentName('');
  //     }, 200);
  //   }
  // }, [documentName, fileString, success]);

  // useEffect(() => {
  //   if (sucsMsg === 'success') {
  //     setTimeout(() => {
  //       navigation.navigate(`${nextRoute}`, {paramKey: userDocs});
  //     }, 1000);
  //     setTimeout(() => {
  //       setNextRoute('');
  //     }, 200);
  //   }
  // }, [navigation, nextRoute, sucsMsg, userDocs]);

  return (
    <ScrollView
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
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
            <View>
              <Text />
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
                  <View>
                    <Text style={{}}>{docsName.utilityBill.name}</Text>
                    {/* <Text style={{}}>{documentSize}</Text> */}
                  </View>
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {image ? (
                  <Image
                    source={{uri: image}}
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                  <View>
                    <Text style={{}}>{docsName.seal.name}</Text>
                    {/* <Text style={{}}>{documentSize}</Text> */}
                  </View>
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {image ? (
                  <Image
                    source={{uri: image}}
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {docsName.cac ? (
                  <View>
                    <Text style={{}}>{docsName.cac.name}</Text>
                    {/* <Text style={{}}>{documentSize}</Text> */}
                  </View>
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
                disabled={docsName.cac === ''}
                style={{marginTop: 10}}
                onPress={s3UploadFunction}>
                <Buttons label="Upload" disabled={docsName.cac === ''} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={docsName.cac === ''}
                style={{marginTop: 10}}
                onPress={pickDocument1}>
                <Buttons
                  label="Change Selection"
                  disabled={docsName.cac === ''}
                />
              </TouchableOpacity>
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {image ? (
                  <Image
                    source={{uri: image}}
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                  <View>
                    <Text style={{}}>{docsName.bankStatement.name}</Text>
                  </View>
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {image ? (
                  <Image
                    source={{uri: image}}
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                  <View>
                    <Text style={{}}>{docsName.passport.name}</Text>
                    {/* <Text style={{}}>{documentSize}</Text> */}
                  </View>
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                {image ? (
                  <Image
                    source={{uri: image}}
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
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
                  <View>
                    <Text style={{}}>{docsName.signature.name}</Text>
                  </View>
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
              {uploadProgress && uploadProgress > 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text>{uploadProgress && uploadProgress}% complete</Text>
                </View>
              )}
            </>
          ) : (
            <></>
          )}
        </View>
      </View>

      {image || selectedDocument ? (
        <View style={styles.remove}>
          <TouchableOpacity onPress={clearDocument}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
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
    fontFamily: 'MontBold',
    fontSize: 14,
    color: '#054B99',
    letterSpacing: 0.5,
  },
  textHead: {
    fontFamily: 'Montserat',
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
    fontFamily: 'MontBold',
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  takeText: {
    fontFamily: 'MontSBold',
    marginTop: 10,
    fontSize: 16,
  },
  takeText2: {
    fontFamily: 'Montserat',
    marginTop: 10,
    fontSize: 10,
  },
});
