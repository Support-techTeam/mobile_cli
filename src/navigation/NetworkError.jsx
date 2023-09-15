import {Text, View, Image, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import COLORS from '../constants/colors';

const NetworkScreen = ({text}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('../../assets/network.png')}
        style={{width: 200, height: 200}}
      />
      <Text
        style={{
          fontSize: 18,
          marginTop: 10,
          color: COLORS.Danger,
          fontWeight: '700',
        }}>
        No Internet Connection!
      </Text>

      <Text
        style={{
          fontSize: 15,
          marginTop: 10,
          color: COLORS.lendaBlue,
          fontWeight: '400',
          textAlign: 'center',
        }}>
        Application will automatically redirect when internet is available!
      </Text>
    </View>
  );
};

export default NetworkScreen;
