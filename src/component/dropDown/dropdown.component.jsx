import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Input = ({
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
        <Dropdown
          style={[
            style.inputContainer,
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
          {...props}
          renderLeftIcon={() => (
            <Icon
              name={iconName}
              style={{color: COLORS.lendaBlue, fontSize: 22, marginRight: 10}}
            />
          )}
        />
      </View>
      {error && (
        <Text style={{marginTop: 7, color: COLORS.red, fontSize: 12}}>
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
    height: 55,
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaBlue,
    padding: 12,
    borderBottomWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default Input;
