import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Center, Pressable, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from './CustomModal';

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
      <CustomModal
        visible={showWalletStatementModal}
        onClose={() => setShowWalletStatementModal(false)}
        title={
          <>
            <Text style={styles.title}>Generate Wallet E-Statement</Text>

            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => setShowWalletStatementModal(false)}
              style={styles.closeButton}>
              <Icon name="close" size={24} color="black" />
            </Button>
          </>
        }
        body={
          <>
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
          </>
        }
        footer={
          <>
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
          </>
        }
      />
    </Center>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginVertical: 10,
  },
});
