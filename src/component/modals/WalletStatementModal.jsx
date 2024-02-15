import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Modal, Center, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const WalletStatementModal = props => {
  const {
    showWalletStatementModal,
    setShowWalletStatementModal,
    showDatePickerStartWallet,
    walletStatementDetails,
    setWalletStatementDetails,
    hideDatePickerStartWallet,
    showDatePickerEndWallet,
    hideDatePickerEndWallet,
    handleWalletStatement,
    showStartWallet,
    showEndWallet,
    setShowStartWallet,
    setShowEndWallet,
  } = props;
  return (
    <Center>
      <Modal
        animationPreset="slide"
        isOpen={showWalletStatementModal}
        onClose={() => {
          setShowWalletStatementModal(false);
        }}
        closeOnOverlayClick={false}>
        <Modal.Content width={wp(90)} height={hp(50)}>
          <Modal.CloseButton />
          <Modal.Header>Generate Wallet E-Statement</Modal.Header>
          <Modal.Body>
            <Pressable onPress={showDatePickerStartWallet}>
              <Input
                label="Start Date"
                iconName="calendar-month-outline"
                placeholder="2000 - 01 - 01"
                defaultValue={walletStatementDetails?.startDate}
                isDate={true}
                editable={false}
                showDatePicker={showDatePickerStartWallet}
                isNeeded={true}
              />
            </Pressable>

            <DateTimePickerModal
              isVisible={showStartWallet}
              testID="dateTimePicker"
              defaultValue={walletStatementDetails?.startDate}
              mode="date"
              is24Hour={true}
              onConfirm={text => {
                const formattedDate = new Date(text)
                  .toISOString()
                  .split('T')[0];
                setWalletStatementDetails({
                  ...walletStatementDetails,
                  startDate: formattedDate,
                });
                setShowStartWallet(false);
              }}
              onCancel={hideDatePickerStartWallet}
              textColor="#054B99"
            />

            <Pressable onPress={showDatePickerEndWallet}>
              <Input
                label="Stop Date"
                iconName="calendar-month-outline"
                placeholder="2000 - 01 - 01"
                defaultValue={walletStatementDetails?.endDate}
                isDate={true}
                editable={false}
                showDatePicker={showDatePickerEndWallet}
                isNeeded={true}
              />
            </Pressable>

            <DateTimePickerModal
              isVisible={showEndWallet}
              testID="dateTimePicker"
              defaultValue={walletStatementDetails?.endDate}
              mode="date"
              is24Hour={true}
              onConfirm={text => {
                const formattedDate = new Date(text)
                  .toISOString()
                  .split('T')[0];
                setWalletStatementDetails({
                  ...walletStatementDetails,
                  endDate: formattedDate,
                });
                setShowEndWallet(false);
              }}
              onCancel={hideDatePickerEndWallet}
              textColor="#054B99"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowWalletStatementModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleWalletStatement();
                  setShowWalletStatementModal(false);
                }}>
                Send Statement
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: wp('100%'),
    height: hp(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    marginVertical: 1,
  },
});
