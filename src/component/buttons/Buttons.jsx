import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Buttons = ({ label, disabled }) => {
  return (
    <View>
      <View style={{ ...styles.signUp, backgroundColor: !disabled ? '#054B99' : '#6993C2' }}>
        <Text
          style={{
            fontWeight: '700',
            color: '#fff',
            
            fontSize: 18,
            lineHeight: 24,
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

export default Buttons;
const styles = StyleSheet.create({
  signUp: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
