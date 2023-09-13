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
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Buttons from '../buttons/Buttons';
import VerifyModal from '../modals/verifyModal';
import {useNavigation} from '@react-navigation/native';
import CustomInput from '../custominput/CustomInput';
const statusBarHeight = getStatusBarHeight();

const Voters = ({isCam}) => {
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successmodalVisible, setSuccessModalVisible] = useState(false);
  const navigation = useNavigation();
  const disableit = !image;

  const handleImageSelection = async result => {
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowConfirmModal(true);
    }
  };

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera roll is required.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibrary({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      handleImageSelection(result);
    } catch (error) {}
  };

  const launchCameraAsync = async () => {
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
        aspect: [4, 3],
        quality: 1,
      });

      handleImageSelection(result);
    } catch (error) {}
  };

  const retakePhoto = () => {
    setImage(null);
    setShowConfirmModal(false);
    launchCameraAsync();
  };

  const confirmPhoto = () => {
    setShowConfirmModal(false);
  };
  const noPhoto = () => {
    setImage(null);
    setShowConfirmModal(false);
  };

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
            <TouchableOpacity onPress={retakePhoto}>
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

      <VerifyModal visible={successmodalVisible}>
        <View>
          <View style={styles.checked}>
            <Image source={require('../../../assets/images/checked.png')} />
            <Text style={styles.checkedText}>Verification Successful</Text>
          </View>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => navigation.navigate('root')}>
            <Buttons label="Continue" />
          </TouchableOpacity>
        </View>
      </VerifyModal>

      <View style={styles.require}>
        <View>
          <Text style={styles.Head}>Document Requirements </Text>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.textHead}>
            Take a clear picture or upload an original copy of your govt issued
            ID; Passport, Driver's license, Voter's card or NIN slip.
          </Text>
        </View>
      </View>

      <View>
        <CustomInput
          label="ID Number"
          keyboardType="numeric"
          onChangeText={() => {}}
        />
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          borderWidth: 0.3,
          borderColor: '#D9D8E9',
          borderRadius: 12,
          marginTop: 10,
          height: 235,
          backgroundColor: '#F7F7FC',
        }}>
        <View style={{marginVertical: 10}}>
          {image ? (
            <Image
              source={{uri: image}}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          ) : (
            <Image
              source={require('../../../assets/images/Voters.png')}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          )}
        </View>
      </View>
      {image ? (
        <View style={styles.remove}>
          <TouchableOpacity onPress={() => setImage(null)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      {!image && (
        <>
          {isCam ? (
            <View style={{marginTop: 20, marginBottom: 20}}>
              <TouchableOpacity onPress={launchCameraAsync}>
                <View style={styles.opencam}>
                  <Feather name="camera" size={24} color="black" />
                  <Text>Take a new picture</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{marginTop: 20, marginBottom: 20}}>
              <TouchableOpacity onPress={openImagePickerAsync}>
                <View style={styles.opencam}>
                  <Entypo name="upload-to-cloud" size={24} color="#054B99" />
                  <Text>Pick from gallery</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      <TouchableOpacity
        disabled={disableit}
        style={{marginBottom: 150}}
        onPress={() => setSuccessModalVisible(true)}>
        <Buttons label="Submit" disabled={disableit} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Voters;

const styles = StyleSheet.create({
  require: {
    borderWidth: 0.3,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'grey',
    borderRadius: 12,
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
    marginVertical: 30,
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
});
