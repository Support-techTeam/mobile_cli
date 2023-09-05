import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import Personal from '../../component/MyAccountTabs/PersonalTab';
import Business from '../../component/MyAccountTabs/BusinessTab';
import Finance from '../../component/MyAccountTabs/FinanceTab';
import NextOfKin from '../../component/MyAccountTabs/NextOfKinTab';
import Document from '../../component/MyAccountTabs/DocumentTab';

const MyAccount = () => {
  const [image, setImage] = useState(null);
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const handleImageSelection = async result => {
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const launchCameraAsync = async () => {
    const permissionResult = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    if (
      permissionResult['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      permissionResult['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Grantd');
      await launchCamera(
        {
          mediaType: 'photo', // Specify 'photo' to capture images
          maxWidth: 800, // Maximum width for the captured image
          maxHeight: 600, // Maximum height for the captured image
          quality: 1,
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled the camera');
          } else if (response.error) {
            console.error('ImagePicker Error:', response.error);
          } else {
            handleImageSelection(response);
          }
        },
      );
    } else {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required.',
      );
      return;
    }
  };

  const navigation = useNavigation();

  const [routes] = useState([
    {key: 'personal', title: 'Personal'},
    {key: 'business', title: 'Business'},
    {key: 'finance', title: 'Finance'},
    {key: 'nextofkin', title: 'Next Of Kin'},
    {key: 'document', title: 'Document'},
  ]);

  const renderScene = SceneMap({
    personal: Personal,
    business: Business,
    finance: Finance,
    nextofkin: NextOfKin,
    document: Document,
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('More')}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View>
          <View>
            <Text style={styles.TextHead}>My Account</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <View style={[styles.innercontainer]}>
        <Pressable onPress={launchCameraAsync} style={styles.profileHeadView}>
          <View style={styles.imagesView}>
            {image ? (
              <Image source={{uri: image}} style={{width: 80, height: 80}} />
            ) : (
              <Image
                style={{width: 80, height: 80}}
                source={require('../../../assets/images/guarantorProfile.png')}
              />
            )}
          </View>
          <View style={styles.pencilView}>
            <FontAwesome5 name="pen" size={24} color="#fff" />
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
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
    fontFamily: 'Montserat',
  },
  tabText2: {
    fontFamily: 'MontSBold',
    fontSize: 12,
    textAlign: 'center',
  },
});
