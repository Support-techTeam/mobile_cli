import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Modal, Center, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const ArmStatementModal = props => {
  const {
    allArmData,
    showArmStatementModal,
    setShowArmStatementModal,
    showDatePickerStartArm,
    armStatementDetails,
    setArmStatementDetails,
    hideDatePickerStartArm,
    showDatePickerEndArm,
    hideDatePickerEndArm,
    handleArmStatement,
    showStartArm,
    showEndArm,
    setShowStartArm, 
    setShowEndArm,
  } = props;
  return (
    <Center>
    <Modal
      animationPreset="slide"
      isOpen={showArmStatementModal}
      onClose={() => {
        setShowArmStatementModal(false);
      }}
      closeOnOverlayClick={false}>
      <Modal.Content width={wp(90)} height={hp(50)}>
        <Modal.CloseButton />
        <Modal.Header>Generate ARM E-Statement</Modal.Header>
        <Modal.Body>
          <Pressable onPress={showDatePickerStartArm}>
            <Input
              label="Start Date"
              iconName="calendar-month-outline"
              placeholder="2000 - 01 - 01"
              defaultValue={armStatementDetails?.startDate}
              isDate={true}
              editable={false}
              showDatePicker={showDatePickerStartArm}
              isNeeded={true}
            />
          </Pressable>

          <DateTimePickerModal
            isVisible={showStartArm}
            testID="dateTimePicker"
            defaultValue={armStatementDetails?.startDate}
            mode="date"
            is24Hour={true}
            onConfirm={text => {
              const formattedDate = new Date(text)
                .toISOString()
                .split('T')[0];
              setArmStatementDetails({
                ...armStatementDetails,
                startDate: formattedDate,
              });
              setShowStartArm(false);
            }}
            onCancel={hideDatePickerStartArm}
            textColor="#054B99"
          />

          <Pressable onPress={showDatePickerEndArm}>
            <Input
              label="Stop Date"
              iconName="calendar-month-outline"
              placeholder="2000 - 01 - 01"
              defaultValue={armStatementDetails?.endDate}
              isDate={true}
              editable={false}
              showDatePicker={showDatePickerEndArm}
              isNeeded={true}
            />
          </Pressable>

          <DateTimePickerModal
            isVisible={showEndArm}
            testID="dateTimePicker"
            defaultValue={armStatementDetails?.endDate}
            mode="date"
            is24Hour={true}
            onConfirm={text => {
              const formattedDate = new Date(text)
                .toISOString()
                .split('T')[0];
              setArmStatementDetails({
                ...armStatementDetails,
                endDate: formattedDate,
              });
              setShowEndArm(false);
            }}
            onCancel={hideDatePickerEndArm}
            textColor="#054B99"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowArmStatementModal(false);
              }}>
              Cancel
            </Button>
            <Button
              disabled={!allArmData[0]?.membershipId}
              onPress={() => {
                handleArmStatement();
                setShowArmStatementModal(false);
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
