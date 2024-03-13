// CustomNotification.js
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import COLORS from '../../constants/colors';

const CustomNotification = ({
  isVisible,
  title,
  body,
  imageUrl,
  onPress,
  redirectUrl,
  navigationRef,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        <View style={styles.header}>
          {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.buttonContainer}>
          {redirectUrl && (
            <TouchableOpacity
              onPress={() => {
                onPress();
                if (navigationRef.isReady()) {
                  try {
                    navigationRef.navigate(redirectUrl);
                  } catch (e) {}
                }
              }}
              style={styles.primaryButton}>
              <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onPress} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  bodyContainer: {
    flexDirection: 'column',
  },
  body: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    padding: 10,
    width: '95%',
    backgroundColor: COLORS.lendaBlue,
    borderRadius: 5,
    alignSelf: 'center',
    flex: 1,
    marginRight: 5,
    padding: 10,
    borderRadius: 5,
  },
  secondaryButton: {
    padding: 10,
    width: '95%',
    backgroundColor: COLORS.highwayRed,
    borderRadius: 5,
    alignSelf: 'center',
    flex: 1,
    marginLeft: 5,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});

export default CustomNotification;
