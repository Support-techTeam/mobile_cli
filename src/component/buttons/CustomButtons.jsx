import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../constants/colors';
import {SIZES} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomButton = ({onPress, title, buttonStyle, textStyle, disabled, isLoading=false}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        {
          opacity: disabled ? 0.7 : 1,
          flexDirection: 'row',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 10,
          alignItems: 'center',
        },
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {isLoading && <ActivityIndicator color={'white'} size={20} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.lendaBlue,
    padding: 10,
    alignItems: 'center',
    borderRadius: SIZES.base,
    textAlign: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
});

export default CustomButton;
