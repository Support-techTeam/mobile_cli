import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

export const IntroSection = props => {
  const {userProfileData} = props;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 2,
        }}>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('More');
          }}
          style={styles.personIcon}>
          <Icon name="account-circle" size={36} color="#6E7191" />
        </TouchableOpacity>
        <Text style={styles.hello}>Hello {userProfileData?.firstName}!</Text>

        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            marginRight: 10,
          }}>
          <Image
            source={require('../../../assets/images/HeadLogo.png')}
            style={{width: 83, height: 32}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: wp('100%'),
    height: hp(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    marginVertical: 1,
  },
  personIcon: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 30,
    paddingHorizontal: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
});
