import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Center, Pressable, Button} from 'native-base';
import Input from '../inputField/input.component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from './CustomModal';

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
      <CustomModal
        visible={showArmStatementModal}
        onClose={() => setShowArmStatementModal(false)}
        title={
          <>
            <Text style={styles.title}>Generate ARM E-Statement</Text>

            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => setShowArmStatementModal(false)}
              style={styles.closeButton}>
              <Icon name="close" size={24} color="black" />
            </Button>
          </>
        }
        body={
          <>
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
          </>
        }
        footer={
          <>
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
