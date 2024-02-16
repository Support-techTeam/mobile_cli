import React, {useRef, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

const CustomModal = ({visible, onClose, title, body, footer}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType={"none"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, {opacity, transform: [{translateY}]}]}>
          <View style={styles.header}>{title}</View>
          <View style={styles.body}>{body}</View>
          <View style={styles.footer}>{footer}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    minHeight: heightPercentageToDP('50%'),
    minWidth: widthPercentageToDP('90%'),
  },
  header: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.lendaComponentBorder,
  },
  body: {
    justifyContent: 'center',
    marginVertical: 15, 
    gap: 10,
    paddingHorizontal: 15,
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: COLORS.lendaComponentBorder,
  },
});

export default CustomModal;
