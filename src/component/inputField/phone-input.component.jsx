import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneInput from 'react-native-phone-number-input';
const InputPhone = ({
  label,
  iconName,
  error,
  isNeeded,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={style.label}>{label}</Text>
        {isNeeded && <Text style={{color: 'red', marginRight: 10}}>*</Text>}
      </View>
      <View>
        <PhoneInput
          textContainerStyle={style.inputContainer}
          containerStyle={[
            style.mainContainer,
            {
              borderColor: error
                ? COLORS.red
                : isFocused
                ? COLORS.darkBlue
                : COLORS.lightGray,
            },
          ]}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          isNeeded={true}
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
    fontFamily: 'Montserat',
  },
  inputContainer: {
    height: 53,
    backgroundColor: COLORS.light,
    paddingVertical: 15,
    width: '100%',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: COLORS.lendaBlue,
  },
  mainContainer: {
    height: 55,
    backgroundColor: COLORS.light,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaBlue,
  },
});

export default InputPhone;
