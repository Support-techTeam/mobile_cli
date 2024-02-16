import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Center, Pressable, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from './CustomModal';

export const LendaStatementModal = props => {
  const {
    showLendaStatementModal,
    setShowLendaStatementModal,
    showDatePickerStartLenda,
    lendaStatementDetails,
    setLendaStatementDetails,
    hideDatePickerStartLenda,
    showDatePickerEndLenda,
    hideDatePickerEndLenda,
    handleLendaStatement,
    showStartLenda,
    showEndLenda,
    setShowStartLenda,
    setShowEndLenda,
  } = props;
  return (
    <Center>
      <CustomModal
        visible={showLendaStatementModal}
        onClose={() => setShowLendaStatementModal(false)}
        title={
          <>
            <Text style={styles.title}>Generate Earn With Us E-Statement</Text>

            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => setShowLendaStatementModal(false)}
              style={styles.closeButton}>
              <Icon name="close" size={24} color="black" />
            </Button>
          </>
        }
        body={
          <>
            <Pressable onPress={showDatePickerStartLenda}>
              <Input
                label="Start Date"
                iconName="calendar-month-outline"
                placeholder="2000 - 01 - 01"
                defaultValue={lendaStatementDetails?.startDate}
                isDate={true}
                editable={false}
                showDatePicker={showDatePickerStartLenda}
                isNeeded={true}
              />
            </Pressable>

            <DateTimePickerModal
              isVisible={showStartLenda}
              testID="dateTimePicker"
              defaultValue={lendaStatementDetails?.startDate}
              mode="date"
              is24Hour={true}
              onConfirm={text => {
                const formattedDate = new Date(text)
                  .toISOString()
                  .split('T')[0];
                setLendaStatementDetails({
                  ...lendaStatementDetails,
                  startDate: formattedDate,
                });
                setShowStartLenda(false);
              }}
              onCancel={hideDatePickerStartLenda}
              textColor="#054B99"
            />

            <Pressable onPress={showDatePickerEndLenda}>
              <Input
                label="Stop Date"
                iconName="calendar-month-outline"
                placeholder="2000 - 01 - 01"
                defaultValue={lendaStatementDetails?.endDate}
                isDate={true}
                editable={false}
                showDatePicker={showDatePickerEndLenda}
                isNeeded={true}
              />
            </Pressable>

            <DateTimePickerModal
              isVisible={showEndLenda}
              testID="dateTimePicker"
              defaultValue={lendaStatementDetails?.endDate}
              mode="date"
              is24Hour={true}
              onConfirm={text => {
                const formattedDate = new Date(text)
                  .toISOString()
                  .split('T')[0];
                setLendaStatementDetails({
                  ...lendaStatementDetails,
                  endDate: formattedDate,
                });
                setShowEndLenda(false);
              }}
              onCancel={hideDatePickerEndLenda}
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
                  setShowLendaStatementModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleLendaStatement();
                  setShowLendaStatementModal(false);
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
