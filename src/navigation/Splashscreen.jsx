import {
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React from 'react';

const Splashscreen = ({text}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff00" animating />
        <Text style={{fontSize: 18, marginTop: 20}}>
          {text ? text : 'Checking authentication...'}
        </Text>
      </View>
    </View>
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splashscreen;
