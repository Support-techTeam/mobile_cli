import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import {faEye} from '@fortawesome/free-solid-svg-icons/faEye';
import {faCalendar} from '@fortawesome/free-solid-svg-icons/faCalendar';

const CustomInput = ({
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  showDatePicker,
  isDate,
  isAirtime,
  isBalance,
  isNeeded,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.label}>{label}</Text>
          {isNeeded && <Text style={{color: 'red', marginRight: 10}}>*</Text>}
        </View>

        {isAirtime && <Text>Wallet Balance: ₦{isBalance}</Text>}
      </View>

      <View
        // style={[styles.textFeild, { borderColor: isNeeded ? 'red' : '#CED4DA' }]}
        style={styles.textFeild}
        accessibilityLabel={`Enter ${label}`}>
        {!isDate && <TextInput {...props} style={styles.input} />}
        {isDate && (
          <TouchableOpacity onPress={showDatePicker}>
            <TextInput {...props} />
          </TouchableOpacity>
        )}
        {isDate && (
          <FontAwesome5
            style={styles.eyecon}
            size={25}
            color="#6E7191"
            icon={faCalendar}
          />
        )}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyecon}
            onPress={() => setHidePassword(!hidePassword)}
            accessibilityLabel="Show Password">
            <FontAwesomeIcon
              size={25}
              color="#212529"
              icon={hidePassword ? faEye : faEyeSlash}
              accessibilityLabel="Hide Password"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    paddingBottom: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#14142B',
    
  },
  textFeild: {
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CED4DA',
    padding: 12,
    justifyContent: 'center',
  },
  input: {
    fontSize: 17,
  },
  eyecon: {
    position: 'absolute',
    right: 15,

    zIndex: 1,
  },
});
