import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import COLORS from '../../constants/colors';
const Button = ({title, disabled, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 55,
        width: '100%',
        backgroundColor: disabled ? COLORS.grey : COLORS.lendaBlue,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
      }}>
      <Text style={{color: COLORS.white, fontWeight: 'bold', fontSize: 18}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
