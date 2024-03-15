import React from 'react';
import {View, Text,StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';
import PhoneInput from 'react-native-international-phone-number';
const CustomInputPhone = ({
  label,
  iconName,
  error,
  isNeeded,
  placeholder,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const phoneInput = React.useRef(null);
  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={style.label}>{label} </Text>
        <Text
          style={{
            color: 'red',
            marginVertical: 7,
            fontSize: 12,
            color: COLORS.lendaBlue,
          }}>
          (without country code)
        </Text>
        {isNeeded && <Text style={{color: 'red', marginRight: 10}}>*</Text>}
      </View>
      <View>
        <PhoneInput
          phoneInputStyles={{
            container: {
              height: 55,
              alignItems: 'center',
              backgroundColor: COLORS.light,
              width: '100%',
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: COLORS.lendaComponentBorder,
            },
            input: {
              alignItems: 'center',
              backgroundColor: COLORS.light,
              paddingHorizontal: 0,
              borderWidth: 0,
              borderColor: COLORS.lendaComponentBorder,
            },
            callingCode: {backgroundColor: COLORS.light,},
            flagContainer: {backgroundColor: COLORS.light},
          }}
          {...props}
        />
      </View>
      {error && (
        <Text style={{marginTop: 0, color: COLORS.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.labelColor,
  },

});

export default CustomInputPhone;
