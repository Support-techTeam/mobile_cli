import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Modal, Center, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
      <Modal
        animationPreset="slide"
        isOpen={showLendaStatementModal}
        onClose={() => {
          setShowLendaStatementModal(false);
        }}
        closeOnOverlayClick={false}>
        <Modal.Content width={wp(90)} height={hp(50)}>
          <Modal.CloseButton />
          <Modal.Header>Generate Lenda E-Statement</Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
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
