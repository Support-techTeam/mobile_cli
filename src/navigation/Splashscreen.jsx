import {
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Splashscreen = ({text}) => {
  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      style={[styles.overlay, {width: '100%', height: '100%'}]}>
      <View style={styles.loaderContainer}>
        
      <ActivityIndicator size="large" color="#00ff00" animating />
      {/* <Text style={{fontSize: 18, marginTop: 20}}>
          {text ? text : 'Checking authentication...'}
        </Text> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 75, 102, 0.7)',
  },
  loaderContainer: {
    padding: 20,
    // marginTop: hp(35),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});

export default Splashscreen;
