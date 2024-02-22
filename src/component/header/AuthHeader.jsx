import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import {SIZES} from '../../constants';

export const AuthHeader = props => {
  const {routeAction, heading, intro, disabled, renderImage, returnRoute} = props;

  return (
    <View>
      <View style={styles.container}>
        {!returnRoute && <View style={styles.leftView}>
          <TouchableOpacity onPress={routeAction}>
            <View style={styles.arrow}>
              <Icon name="chevron-left" size={26} color={COLORS.lendaGrey} />
            </View>
          </TouchableOpacity>
        </View>}

        <View style={styles.rightView}>
          <View style={styles.otherView}>
            <Image
              source={require('../../../assets/images/HeadLogo.png')}
              style={styles.mainImage}
            />
            <View style={styles.mainHeader}>
              {renderImage && disabled && (
                <View>
                  <Image source={{uri: renderImage}} style={styles.sideImage} />
                </View>
              )}
              <View>
                <Text style={styles.signupText}>{heading}</Text>
              </View>
            </View>
            {intro && (
              <View style={styles.signupDetails}>
                <Text style={[styles.DetailsText]}>{intro}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.base,
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'MontSBold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    flexShrink: 1,
    color: '#14142B',
  },
  arrow: {
    borderWidth: 0.2,
    borderColor: COLORS.lendaComponentBorder,
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rightView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  leftView: {
    zIndex: 1000,
    position: 'absolute',
    left: 0,
    top: 0,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  otherView: {
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontWeight: '800',
    fontSize: SIZES.h2,
    letterSpacing: 1,
  },
  DetailsText: {
    fontWeight: '400',
    fontSize: SIZES.h5,
    lineHeight: 21,
    marginBottom: SIZES.bottomSpace,
    textAlign:'center',
    paddingHorizontal: SIZES.highPadding,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.bottomSpace,
    gap: 10,
  },
  mainImage: {
    width: 83,
    height: 32,
    marginBottom: SIZES.bottomSpace,
  },
  sideImage: {
    width: 30,
    height: 42,
  },
});
