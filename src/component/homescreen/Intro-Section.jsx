import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import COLORS from '../../constants/colors';

const SLIDE_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDE_WIDTH - 30;

export const IntroSection = props => {
  const {userProfileData, loanUserDetails} = props;
  const navigation = useNavigation();
  // console.log(Platform.OS, loanUserDetails?.loanDocumentDetails)
  return (
    <View style={styles.container}>
      <View style={styles.leftView}>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('More');
          }}
          style={styles.personIcon}>
          {/* <Icon name="account-circle" size={30} color={COLORS.lendaGrey} /> */}
          {loanUserDetails &&
          loanUserDetails?.loanDocumentDetails?.personalPhoto != 'undefined' &&
          loanUserDetails?.loanDocumentDetails?.personalPhoto ? (
            <FastImage
              style={{width: 36, height: 36, borderRadius: 20}}
              source={{
                uri: loanUserDetails?.loanDocumentDetails?.personalPhoto,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Icon name="account-circle" size={36} color={COLORS.lendaGrey} />
          )}
        </TouchableOpacity>
        <Text style={styles.hello}>Hi {userProfileData?.firstName}!</Text>
      </View>
      <View style={styles.rightView}>
        {/* <Image
          source={require('../../../assets/images/newLogo.png')}
          style={{width: 28, height: 28, resizeMode: 'contain'}}
        /> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SupportScreen')}
          style={{
            paddingLeft: 10,
            paddingVertical: 5,
          }}>
          <Icon name="headset" size={26} color={COLORS.lendaBlue} />
        </TouchableOpacity>
        <TouchableOpacity
         onPress={() => navigation.navigate('NotificationsScreen')}
        //  disabled={true}
          style={{
            paddingLeft: 10,
            paddingVertical: 5,
          }}>
          <Icon name="bell-outline" size={26} color={COLORS.lendaBlue} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={{
                paddingLeft: 10,
                paddingVertical: 5,
          }}>
          <Icon name="bell-badge-outline" size={28} color={COLORS.highwayRed} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lendaComponentBg,
    borderBlockColor: COLORS.lendaComponentBorder,
    borderWidth: 0,
    marginVertical: 1,
    borderRadius: 10,
  },
  personIcon: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 30,
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  hello: {
    fontFamily: 'Montserrat',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  rightView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
  leftView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
});
