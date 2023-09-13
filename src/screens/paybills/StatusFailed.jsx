import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const statusBarHeight = getStatusBarHeight();

const StatusFailed = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Paybills');
      // navigation.navigate('Home');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F7F7FC',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
              <Text style={styles.TextHead}>{'      '}</Text>
            </View>
          </View>
          <View>
            <Text> </Text>
          </View>
        </View>

        <View style={[styles.innercontainer]}>
          <View
            style={{backgroundColor: '#fff', padding: 15, borderRadius: 50}}>
            <Image source={require('../../../assets/images/cross.png')} />
          </View>
          <Text
            style={{
              marginTop: 24,
              
              fontSize: 20,
              color: '#14142B',
            }}>
            Transaction Failed
          </Text>
          <Text
            style={{
              marginTop: 14,
              
              fontSize: 14,
              color: '#4E4B66',
            }}>
            You will be redirected shortly. Please try again later.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatusFailed;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  innercontainer: {
    marginTop: statusBarHeight,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
});
