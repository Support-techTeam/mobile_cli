import {Text, View, Image, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';

const Splashscreen = ({text}) => {
  return (
    <View style={styles.overlay}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.imageBackground}
      />
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loaderText}>{text ? text : 'Checking authentication...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 75, 102, 0.6)',
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'stretch', // Adjust image resizing mode as needed÷
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default Splashscreen;
