import {View, Image} from 'react-native';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Splashscreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Spinner
        textContent={'Loading Profile Details...'}
        textStyle={{color: 'white'}}
        visible={true}
        overlayColor="rgba(16, 17, 16, 0.70)"
      />
      <Image
        source={require('../../assets/icon.png')}
        style={{width: 120, height: 120}}
      />
    </View>
  );
};

export default Splashscreen;
