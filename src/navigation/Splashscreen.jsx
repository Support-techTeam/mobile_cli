import {View, Image} from 'react-native';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Splashscreen = ({text}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Spinner
        textContent={text ? text : 'Checking Authentication...'}
        textStyle={{color: 'white'}}
        visible={true}
        overlayColor="rgba(78, 75, 102, 0.7)"
      />
      <Image
        source={require('../../assets/icon.png')}
        style={{width: 120, height: 120}}
      />
    </View>
  );
};

export default Splashscreen;
