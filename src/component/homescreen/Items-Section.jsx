import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image, View, Text, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

export const ItemsSection = props => {
  const {buttonParameters, userPin} = props;

  return (
    <View
      style={[
        styles.container,
        styles.transView,
        {marginTop: userPin ? hp(3) : hp(1)},
      ]}>
      {buttonParameters &&
        buttonParameters?.map((details, index) => (
          <Pressable
            key={index}
            onPress={details.buttonAction}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#D9DBE9' : details.buttonBackground,
                padding: pressed ? 10 : 0,
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
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
              <View
                style={{
                  zIndex: 99,
                  width: 50,
                  height: 50,
                  position: 'absolute',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  backgroundColor: details.buttonImageColor,
                  opacity: 0.2,
                  padding: 10,
                }}></View>
              <View
                style={{
                  zIndex: 100,
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#fff',
                  opacity: 1,
                  padding: 10,
                }}></View>
              {details.buttonIcon ? (
                <Icon
                style={{  zIndex: 101,}}
                  name={details.buttonImage}
                  size={29}
                  color={details.buttonImageColor}
                />
              ) : (
                <Image
                  style={{
                    zIndex: 101,
                    height: 32,
                    width: 32,
                    resizeMode: 'contain',
                    backgroundColor: COLORS.white,
                    borderRadius: 100,
                  }}
                  source={details.buttonImage}
                />
              )}
            </View>
            <View style={{alignSelf: 'center', marginTop: 5}}>
              <Text
                style={[
                  styles.transText,
                  {
                    color: details.buttonTextColor,
                  },
                ]}>
                {details.buttonText}
              </Text>
            </View>
          </Pressable>
        ))}
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
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: '#D9DBE9',
    marginHorizontal: 20,
    width: wp(90),
    alignSelf: 'center',
  },
  transView: {
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  transButtons: {
    borderWidth: 0,
    width: wp(24),
    height: hp(28),
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: '#D9DBE9',
    borderRadius: 12,
    padding: wp(1),
    backgroundColor: '#FCFCFC',
    marginVertical: 8,
  },
  transText: {
    textAlign: 'center',
    fontWeight: 400,
    paddingLeft: wp(1),
    fontSize: hp(1.6),
  },
});
