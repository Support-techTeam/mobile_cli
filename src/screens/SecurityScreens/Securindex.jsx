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

const Securindex = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>Security</Text>
          </View>
        </View>

        <View style={{}}>
          <Text>{'       '}</Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity
          style={{
            marginVertical: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          //   onPress={() => setSave(!save)}
          onPress={comingSoon}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              }}
            >
              <Entypo name="fingerprint" size={24} color="#054B99" />
            </View>
            <View>
              <Text style={[styles.TextHead, { fontSize: 16, color: '#4E4B66' }]}>
                Activate Biometrics
              </Text>
            </View>
          </View>
          <ToggleSwitch
            isOn={save}
            onColor="#054B99"
            offColor="#A0A3BD"
            label={false}
            size="small"
            onToggle={() => setSave(!save)}
          />
        </TouchableOpacity> */}

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
          onPress={() => navigation.navigate('ResetPin')}>
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
                Reset Transaction Pin
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
              <MaterialCommunityIcons name="lock" size={24} color="#054B99" />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Set Screen Lock Pin
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
          onPress={() => navigation.navigate('ResetLockPin')}>
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
                name="lock-open-remove"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Reset Screen Lock Pin
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
          onPress={() => navigation.navigate('ChangeLockPin')}>
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
                Change Screen Lock Pin
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate('LockPin')}>
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
              <MaterialCommunityIcons name="lock" size={24} color="#054B99" />
            </View>
            <View>
              <Text style={[styles.TextHead, {fontSize: 16, color: '#4E4B66'}]}>
                Lock Pin
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity> */}
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
    // marginTop: 34,
    // backgroundColor:'blue'
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
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
  amount: {
    fontFamily: 'serif',
    fontSize: 16,
  },
});
