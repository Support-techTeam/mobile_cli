import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';

const Securindex = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Header
        routeAction={() => navigation.goBack()}
        heading={'SECURITY'}
        disable={false}
      />
      <ScrollView
        bounces={false}
        style={{paddingHorizontal: 16}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{
            marginVertical: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate('SetPin')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Transaction Pin
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN before every transaction
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate('SetLockPin')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="lock-plus"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Set Screen Lock Pin
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN when you open the app
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate('ResetPassword')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="lock-reset"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Change Password
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Set a more secure password
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate('SetLockPin')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="fingerprint"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Activate Biometrics
              </Text>
              <Text
                style={[
                  styles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Enable your fingerprint to open app
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Securindex;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  signUp: {
    marginTop: 10,
    backgroundColor: '#054B99',
    width: '95%',
    opacity: 0.5,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  desc: {
    color: '#4E4B66',

    fontWeight: '500',
    fontSize: 14,
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    // minHeight: 250,
    paddingHorizontal: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4E4B66',
    marginVertical: 15,
    textAlign: 'left',
  },
});
