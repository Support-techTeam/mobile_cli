import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomView from '../../component/profileOnboardSelects/CustomView';
import CustomView2 from '../../component/profileOnboardSelects/CustomView2';
import Buttons from '../../component/buttons/Buttons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getProfileDetails} from '../../stores/ProfileStore.jsx';
import {getLoanUserDetails} from '../../stores/LoanStore.jsx';
import {getAsyncData, storeAsyncData} from '../../context/AsyncContext';
import Loader from '../../component/loader/loader';

const OnboardingHome = () => {
  const [hasStarted, setHasStarted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDocumentCount, setHasDocumentCount] = useState(0);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    // timer to get status every 2 seconds
    useCallback(() => {
      const interval = setInterval(async () => {
        getStartedStatus();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }, []),
  );

  useFocusEffect(
    //loading timeout
    useCallback(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getProfileDetailsStatus();
      getStartedStatus();
      getLoanUserDetailsStatus();
    }, []),
  );

  useEffect(() => {
    getProfileDetailsStatus();
    getStartedStatus();
    getLoanUserDetailsStatus();
  }, []);

  const getStartedStatus = async () => {
    try {
      const started = await getAsyncData({storage_name: 'hasStarted'});
      setHasStarted(started.data);
    } catch (e) {}
  };

  const getProfileDetailsStatus = async () => {
    try {
      const getProfileResponse = await getProfileDetails();
      if (
        getProfileResponse?.data !== null ||
        getProfileResponse?.data !== undefined ||
        getProfileResponse?.data !== ''
      ) {
        await storeAsyncData({storage_name: 'hasStarted', storage_value: '1'});
        getLoanUserDetailsStatus();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const getLoanUserDetailsStatus = async () => {
    try {
      const getLoanUserDetailsResponse = await getLoanUserDetails();
      if (
        getLoanUserDetailsResponse?.data !== null &&
        getLoanUserDetailsResponse?.data !== undefined &&
        getLoanUserDetailsResponse?.data !== ''
      ) {
        if (
          getLoanUserDetailsResponse?.data?.organizationDetails !== '' &&
          getLoanUserDetailsResponse?.data?.organizationDetails !== null &&
          getLoanUserDetailsResponse?.data?.organizationDetails !== undefined
        ) {
          await storeAsyncData({
            storage_name: 'hasStarted',
            storage_value: '2',
          });
        }
        if (
          getLoanUserDetailsResponse?.data?.nextOfKinDetails !== '' &&
          getLoanUserDetailsResponse?.data?.nextOfKinDetails !== null &&
          getLoanUserDetailsResponse?.data?.nextOfKinDetails !== undefined
        ) {
          await storeAsyncData({
            storage_name: 'hasStarted',
            storage_value: '3',
          });
        }
        if (
          getLoanUserDetailsResponse?.data?.bankDetails !== '' &&
          getLoanUserDetailsResponse?.data?.bankDetails !== null &&
          getLoanUserDetailsResponse?.data?.bankDetails !== undefined
        ) {
          await storeAsyncData({
            storage_name: 'hasStarted',
            storage_value: '4',
          });
        }
        if (
          getLoanUserDetailsResponse?.data?.armUserBankDetails !== '' &&
          getLoanUserDetailsResponse?.data?.armUserBankDetails !== null &&
          getLoanUserDetailsResponse?.data?.armUserBankDetails !== undefined
        ) {
          await storeAsyncData({
            storage_name: 'hasStarted',
            storage_value: '5',
          });
        }
        if (
          getLoanUserDetailsResponse?.data?.loanDocumentDetails !== '' &&
          getLoanUserDetailsResponse?.data?.loanDocumentDetails !== null &&
          getLoanUserDetailsResponse?.data?.loanDocumentDetails !== undefined
        ) {
          let counter = 0;
          for (const data in getLoanUserDetailsResponse?.data
            ?.loanDocumentDetails) {
            if (
              data !== 'othersName' &&
              data !== 'validIdentificationType' &&
              data !== 'validIdentification'
            ) {
              if (
                getLoanUserDetailsResponse?.data?.loanDocumentDetails[data] !==
                  '' &&
                getLoanUserDetailsResponse?.data?.loanDocumentDetails[data] !==
                  null &&
                getLoanUserDetailsResponse?.data?.loanDocumentDetails[data] !==
                  undefined
              ) {
                counter += 1;
              }
            }
            setHasDocumentCount(counter);
            if (counter === 9) {
              await storeAsyncData({
                storage_name: 'hasStarted',
                storage_value: '6',
              });
            }
          }
        }
      } else {
        await storeAsyncData({storage_name: 'hasStarted', storage_value: '1'});
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const navigation = useNavigation();

  console.log(hasStarted);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: hp(100),
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <Loader visible={isLoading} loadingText={'Getting profile status...'} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
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
          <View style={styles.profileHeadView}>
            <Image source={require('../../../assets/images/profile.png')} />
          </View>
          <View>
            <Text />
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.ProfileText}>Complete Your Profile</Text>
          <Text style={styles.PDT}>
            The Securities and Exchange Commission requires that we collect and
            verify the details below
          </Text>
        </View>
        {!hasStarted && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView label="Personal Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView label="Business Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView label="Next Of Kin Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView label="ARM Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('ValidIdentity')}>
              <CustomView label="Add Documents" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
        {hasStarted === '1' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView label="Business Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity disabled={true}>
              <CustomView label="Next Of Kin Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView label="ARM Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity disabled={true}>
              <CustomView label="Add Documents" status="[0 / 9] Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
        {hasStarted === '2' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView2 label="Business Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView label="Next Of Kin Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView label="ARM Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity disabled={true}>
              <CustomView label="Add Documents" status="[0 / 9] Pending" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
        {hasStarted === '3' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView2 label="Business Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView2 label="Next Of Kin Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={true}
              onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView label="ARM Details" status="Pending" />
            </TouchableOpacity>

            <TouchableOpacity disabled={true}>
              <CustomView label="Add Documents" status="[0 / 9] Pending" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ArmDetails')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}

        {hasStarted === '4' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView2 label="Business Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView2 label="Next Of Kin Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView2 label="ARM Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <CustomView
                label="Add Documents"
                status={`[${hasDocumentCount} / 9] Filled`}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
        {hasStarted === '5' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView2 label="Business Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView2 label="Next Of Kin Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView2 label="ARM Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <CustomView2 label="Add Documents" status="[9 / 9] Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
        {hasStarted === '6' && (
          <View style={styles.selectView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePersonalDetails')}>
              <CustomView2 label="Personal Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BusinessDetails')}>
              <CustomView2 label="Business Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NextOfKin')}>
              <CustomView2 label="Next Of Kin Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ArmDetails')}>
              <CustomView2 label="ARM Details" status="Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <CustomView2 label="Add Documents" status="[9 / 9] Filled" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ValidIdentity')}>
              <Buttons label={'Complete Profile'} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: statusBarHeight,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  profileHeadView: {
    alignItems: 'center',
    // marginTop: 20,
  },
  ProfileText: {
    paddingTop: 0,

    fontWeight: '600',
    fontSize: 24,
    lineHeight: 36,
    color: '#14142B',
  },
  PDT: {
    textAlign: 'center',

    fontSize: 12,
    lineHeight: 18,
  },
  selectView: {
    // backgroundColor:'blue',
  },
});
