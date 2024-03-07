import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import FastImage from 'react-native-fast-image';

export const DataSection = props => {
  const {networkProviders} = props;
  const navigation = useNavigation();
  return (
    <View style={[styles.container, styles.transView]}>
      {networkProviders &&
        networkProviders?.map((details, index) => {
          let imageResource = require('../../../assets/images/airtime.png');
          if (details?.serviceType?.toLowerCase() == 'mtn') {
            imageResource = require('../../../assets/images/mtn.png');
          }
          if (details?.serviceType?.toLowerCase() == 'airtel') {
            imageResource = require('../../../assets/images/airtel.png');
          }
          if (details?.serviceType?.toLowerCase() == 'glo') {
            imageResource = require('../../../assets/images/glo.png');
          }
          if (details?.serviceType?.toLowerCase() == '9mobile') {
            imageResource = require('../../../assets/images/9mobile.png');
          }
          if (details?.serviceType?.toLowerCase() == 'spectranet') {
            imageResource = require('../../../assets/images/spectranet.png');
          }
          if (details?.serviceType?.toLowerCase() == 'smile') {
            imageResource = require('../../../assets/images/smile.png');
          }
          return (
            <Pressable
              key={index}
              onPress={() => {
                navigation.navigate('Overview', {
                  details: details,
                  billType: 'data',
                });
              }}
              style={({pressed}) => [
                {
                  backgroundColor: pressed
                    ? '#D9DBE9'
                    : details.buttonBackground,
                  padding: pressed ? 10 : 0,
                  transform: [
                    {
                      scale: pressed ? 0.9 : 1,
                    },
                  ],
                },
                styles.transButtons,
              ]}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  padding: 10,
                  position: 'relative',
                }}>
                <Image style={styles.PanelImage} source={imageResource} />
              </View>
              <View style={{alignSelf: 'center', marginTop: 5}}>
                <Text
                  style={[
                    styles.transText,
                    {
                      color: details.buttonTextColor,
                    },
                  ]}>
                  {details.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: COLORS.lendaComponentBorder,
    marginHorizontal: 20,
    width: wp(90),
    // height: hp(26),
    alignSelf: 'center',
  },
  transView: {
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  transButtons: {
    borderWidth: 0.6,
    width: wp(24),
    height: hp(30),
    aspectRatio: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: '#D9DBE9',
    borderRadius: 10,
    padding: wp(2),
    backgroundColor: '#FCFCFC',
    marginVertical: 8,
  },
  transText: {
    textAlign: 'center',
    fontWeight: 400,
    // paddingLeft: wp(1),
    fontSize: hp(1.6),
  },
  PanelImage: {
    width: 35,
    height: 35,
    borderRadius: 40,
  },
});
