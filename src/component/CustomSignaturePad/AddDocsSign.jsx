import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import SignatureScreen from 'react-native-signature-canvas';
// import * as FileSystem from 'expo-file-system';
// import * as FileSystem from 'react-native-fs';
// import * as MediaLibrary from 'expo-media-library';
// import * as MediaLibrary from 'react-native-media-meta';
// import MediaMeta from 'react-native-media-meta';
import RNFS from 'react-native-fs';
import Buttons from '../buttons/Buttons';
import {useNavigation} from '@react-navigation/native';
import {createUploadDocument, uploadProgress} from '../../stores/LoanStore';
// import CameraRoll from 'react-native-camera-roll';

const statusBarHeight = getStatusBarHeight();

const SignaturePad = ({deets}) => {
  const ref = useRef();
  const [signature, setSign] = useState(null);
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const { loansStore } = useContext(StoreContext);
  // const { success, sucsMsg, uploadProgress, fileString } = loansStore;
  const navigation = useNavigation();

  const [fileUri, setFile] = useState({
    name: '',
    type: '',
    uri: '',
  });

  const disableit = !signature;

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = sig => {
    setSign(sig);
  };

  const handleConfirm = () => {
    ref.current.readSignature();
    handleSave(signature);
    setShowConfirmModal(false);
    setImage(signature);
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    ref.current.clearSignature();
    setSign(null);
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  const handleSave = async sign => {
    try {
      // const dirs = FileSystem.documentDirectory;
      const dirs = RNFS.DocumentDirectoryPath;
      var image_data = sign?.split('data:image/png;base64,');
      const fileName = 'signature' + new Date().getMilliseconds() + '.png';
      const filePath = dirs + fileName;

      setFile({
        uri: filePath,
        name: fileName,
        type: 'image/png',
      });

      try {
        //create a file at filePath. Write the content data to it
        await RNFS.writeFile(filePath, image_data[1], 'base64');
        console.log('written to filePath', filePath);
        console.log('written to image_data[1]', image_data[1]);
        console.log('written to file');
      } catch (error) {
        //if the function throws an error, log it out.
        console.log(error);
      }

      // await CameraRoll.save(tag, {type, album});

      // try {
      //   const result = await CameraRoll.save(
      //     `${filePath}/${image_data[1]}`,
      //     'photo',
      //   );
      //   console.log('Image saved:', result);
      // } catch (error) {
      //   console.error('Error saving image:', error);
      // }

      // await FileSystem.writeAsStringAsync(filePath, image_data[1], {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      // console.log('written to file', file);
      // console.log('written to filePath', filePath);

      // const asset = await MediaLibrary.createAssetAsync(filePath);
      // await MediaLibrary.createAlbumAsync(
      //   'TradeLenda Signatures Captures',
      //   asset,
      //   false,
      // );
    } catch (error) {}
  };

  const noSign = () => {
    setSign(null);
    setShowConfirmModal(false);
    ref.current.clearSignature();
  };
  const retakePhoto = () => {
    ref.current.clearSignature();
    setSign(null);
    setShowConfirmModal(false);
  };
  const retakeImage = () => {
    setImage(null);
  };
  const style = `.m-signature-pad {box-shadow: none; border: none;} 
  .m-signature-pad--body {border: 1px solid #D9DBE9;border-radius:20px;overflow:hidden;background-color: #F7F7FC; }
  .m-signature-pad--footer {display: none;}
 `;

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
          signature: `${res?.data?.data?.url}`,
        };
      });
      setTimeout(() => {
        setDocumentName('');
      }, 200);

      setTimeout(() => {
        navigation.navigate('CompanySeals', {paramKey: userDocs});
      }, 1000);
      setTimeout(() => {
        setNextRoute('');
      }, 200);
    }
    setIsUpdating(false);
  };

  return (
    <View style={styles.container}>
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
                <TouchableOpacity onPress={() => noSign()}>
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
            <View
              style={{
                backgroundColor: '#F7F7FC',
                borderWidth: 1,
                borderColor: '#D9DBE9',
                width: '80%',
                aspectRatio: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Image source={{uri: signature}} style={styles.modalImage} />
            </View>
          </View>
          <View style={{paddingHorizontal: 22, marginVertical: 20}}>
            <TouchableOpacity onPress={handleConfirm}>
              <Buttons label="Confirm Photo" />
            </TouchableOpacity>
          </View>

          <View style={{paddingHorizontal: 22, marginVertical: 20}}>
            <TouchableOpacity onPress={retakePhoto}>
              <View style={styles.signUpactivity}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Feather name="camera" size={25} color="#054B99" />
                  <Text style={styles.retake}>
                    Retake Signature / or use camera
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {!image && <Text style={styles.textSign}>Draw signature below</Text>}
      {image && <Text style={styles.textSign}>Submit signature</Text>}

      {!image && (
        <SignatureScreen
          ref={ref}
          onOK={handleOK}
          onEnd={handleEnd}
          webStyle={style}
          // style={{ flex: 1 }}
          scrollable={true}
          bgHeight="100%"
        />
      )}

      {image && (
        <Image
          source={{uri: image}}
          style={{
            height: 300,
            resizeMode: 'contain',
            backgroundColor: '#F7F7FC',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#D9DBE9',
          }}
        />
      )}

      <View style={{marginTop: -190}}>
        {!image && (
          <View style={{}}>
            <View style={{top: 15}}>
              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={() => setShowConfirmModal(true)}
                disabled={disableit}>
                <Buttons label="Confirm" disabled={disableit} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginBottom: 5, marginTop: 10}}
                disabled={disableit}
                onPress={handleEmpty}>
                <Buttons label="Clear" disabled={disableit} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {image && (
          <>
            <TouchableOpacity
              style={{marginTop: 200}}
              disabled={disableit}
              onPress={s3UploadFunction}>
              <Buttons label="Upload signature" disabled={disableit} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginBottom: 5, marginTop: 10}}
              onPress={retakeImage}
              disabled={disableit}>
              <Buttons label="Retake" disabled={disableit} />
            </TouchableOpacity>
          </>
        )}
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
      </View>
    </View>
  );
};

export default SignaturePad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textSign: {
    color: '#4E4B66',
    fontFamily: 'serif',
    textAlign: 'center',
    paddingVertical: 5,
  },
  text: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  textInput: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  setButton: {
    backgroundColor: 'deepskyblue',
    textAlign: 'center',
    fontWeight: '900',
    color: '#fff',
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  saveButton: {
    marginVertical: 10,
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
    justifyContent: 'center',
    overflow: 'hidden',
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
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
});
