import {View, Text, Modal, StyleSheet} from 'react-native';
import React from 'react';
import Loader from '../loader/loader';

const VerifyModal = ({visible, children, isLoading}) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={true}>
      <Loader visible={isLoading} />
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.checked}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // backgroundColor:'#CED0D9',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  modalContainer: {
    // height:'40%',
    backgroundColor: '#ffffff',
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
});
