import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomView from '../../component/accountsView/MoreViews';
import VerifyModal from '../../component/modals/verifyModal';
import {userLogOut} from '../../stores/AuthStore';
import Toast from 'react-native-toast-message';
import {resetStore} from '../../util/redux/store';
import {useSelector} from 'react-redux';
import {version as appVersion} from '../../../app.json';

const Morescreen = () => {
  const navigation = useNavigation();
  const [visibility, setVisibility] = useState(false);
  const profile = useSelector(state => state.userProfile.profile);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      const res = await userLogOut();
      if (res?.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message,
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      } else {
        await resetStore();
      }
    } catch (e) {}
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top !== 0 ? insets.top : 18,
          paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
          paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
          paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
        },
      ]}>
      <VerifyModal visible={visibility}>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../../../assets/images/signoutIcon.png')} />
          <Text
            style={[styles.signOutText, {fontSize: 24, fontFamily: 'serif'}]}>
            Sign Out
          </Text>
          <Text style={styles.question}>Are you sure you want to sign out</Text>

          <TouchableOpacity
            style={styles.signUpactivity}
            onPress={handleLogout}>
            <Text style={styles.confirmText}>Sign out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVisibility(false)}
            style={[
              styles.signUpactivity,
              {borderColor: '#054B99', backgroundColor: '#fff', borderWidth: 1},
            ]}>
            <Text style={[styles.confirmText, {color: '#054B99'}]}>No</Text>
          </TouchableOpacity>
        </View>
      </VerifyModal>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={[styles.profileHeadView2]}>
            <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
              <View style={styles.profileHeadView}>
                <Icon name="account-circle-outline" size={48} color="#6E7191" />
                <Text style={styles.ProfileText}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#054B99',
                  marginRight: 10,
                  fontSize: 18,
                }}>
                Referral Code:
              </Text>
              <Text
                selectable={true}
                selectionColor={'#CED4DA'}
                style={{fontSize: 18}}>
                {profile?.personalReferalCode}
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  marginTop: 8,
                }}>
                V {appVersion}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Security')}>
              <CustomView isSecurity={true} label="Security" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
              <CustomView isSettings={true} label="Profile" />
            </TouchableOpacity>
            {/* 
            <TouchableOpacity>
              <CustomView isSupport={true} label="Support" />
            </TouchableOpacity>

            <TouchableOpacity>
              <CustomView isRate={true} label="Rate us" />
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity
            style={styles.signOutView}
            onPress={() => setVisibility(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="location-exit"
                size={24}
                color="black"
                style={{transform: [{scaleX: -1}], color: '#ED2E7E'}}
              />
              <Text style={[styles.signOutText, {marginLeft: 5}]}>
                Sign out
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/images/HeadLogo.png')}
              style={{width: 83, height: 32}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Morescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  profileHeadView: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F7F7FC',
    borderRadius: 12,
  },
  profileHeadView2: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F7F7FC',
    borderRadius: 12,
  },
  ProfileText: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 36,
    color: '#14142B',
  },
  signOutView: {
    alignItems: 'center',
    marginVertical: 60,
  },
  signOutText: {
    color: '#ED2E7E',
    fontFamily: 'serif',
    fontSize: 16,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  signUpactivity: {
    backgroundColor: '#ED2E7E',
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});
