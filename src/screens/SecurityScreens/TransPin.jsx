import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BottomSheet} from 'react-native-btr';
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from '../../../styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import COLORS from '../../constants/colors';
import CustomButton from '../../component/buttons/CustomButtons';
import VerifyModal from '../../component/modals/verifyModal';
import Toast from 'react-native-toast-message';
import {
  changePin,
  checkPin,
  createTransactionPin,
  resetPin,
} from '../../stores/ProfileStore';
import Loader from '../../component/loader/loader';

const CELL_COUNT = 4;
let message = 'Please wait...';
let errorMessage = '';
const TransPin = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [showResetPin, setShowResetPin] = useState(false);
  const [errorAvaileble, setErrorAvailable] = useState(false);

  const refNewPin = useBlurOnFulfill({value: newPin, cellCount: CELL_COUNT});
  const [newPinProps, getNewPinCellOnLayoutHandler] = useClearByFocusCell({
    value: newPin,
    setValue: setNewPin,
  });

  const refOldPin = useBlurOnFulfill({value: oldPin, cellCount: CELL_COUNT});
  const [oldPinProps, getOldPinCellOnLayoutHandler] = useClearByFocusCell({
    value: oldPin,
    setValue: setOldPin,
  });

  // Setup refs and hooks for confirm PIN
  const refConfirmPin = useBlurOnFulfill({
    value: confirmNewPin,
    cellCount: CELL_COUNT,
  });

  const [confirmPinProps, getConfirmPinCellOnLayoutHandler] =
    useClearByFocusCell({
      value: confirmNewPin,
      setValue: setConfirmNewPin,
    });

  function toggleCreatePin() {
    resetPinFields();
    setShowCreatePin(!showCreatePin);
  }

  function toggleChangePin() {
    resetPinFields();
    setShowChangePin(!showChangePin);
  }

  function toggleReserPin() {
    resetPinFields();
    setShowResetPin(!showResetPin);
  }

  function resetPinFields() {
    setNewPin('');
    setConfirmNewPin('');
    setOldPin('');
  }

  disableit = newPin.length < 4 || confirmNewPin.length < 4;
  disableits =
    newPin.length < 4 || confirmNewPin.length < 4 || oldPin.length < 4;

  async function handleCreatePin() {
    message = 'Creating Pin...';
    if (newPin !== confirmNewPin) {
      setErrorAvailable(true);
      errorMessage = 'Pins do not match!';
      setTimeout(() => {
        setErrorAvailable(false);
        errorMessage = '';
      }, 5000);
      return;
    }
    const payLoad = {
      newPin: newPin,
      confirmPin: confirmNewPin,
    };
    try {
      setIsLoading(true);
      const res = await createTransactionPin(payLoad);
      if (res?.error) {
        setErrorAvailable(true);
        errorMessage = res?.message || 'Error creating pin!';
        setTimeout(() => {
          setErrorAvailable(false);
          errorMessage = '';
        }, 5000);
      } else {
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message || 'Pin created successfully!',
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          toggleCreatePin();
          message = 'Please wait...';
        }, 500);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  async function handleChangePin() {
    message = 'Changing Pin...';
    if (newPin !== confirmNewPin) {
      setErrorAvailable(true);
      errorMessage = 'Pins do not match!';
      setTimeout(() => {
        setErrorAvailable(false);
        errorMessage = '';
      }, 5000);
      return;
    }
    const payLoad = {
      oldPin: oldPin,
      newPin: newPin,
      confirmPin: confirmNewPin,
    };
    try {
      setIsLoading(true);
      const res = await changePin(payLoad);
      if (res?.error) {
        setErrorAvailable(true);
        errorMessage = res?.message || 'Error changing pin!';
        setTimeout(() => {
          setErrorAvailable(false);
          errorMessage = '';
        }, 5000);
      } else {
        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: 50,
          text1: res?.title,
          text2: res?.message || 'Pin changed successfully!',
          visibilityTime: 3000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
        setTimeout(() => {
          toggleChangePin();
          message = 'Please wait...';
        }, 500);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  async function handleResetPin() {
    message = 'Resetting Pin...';

    try {
      setIsLoading(true);
      const checkRes = await checkPin();
      if (checkRes?.data?.data?.hasPin === true) {
        const res = await resetPin();
        if (res?.error) {
          setErrorAvailable(true);
          errorMessage = res?.message || 'Error resetting pin!';
          setTimeout(() => {
            setErrorAvailable(false);
            errorMessage = '';
          }, 5000);
        } else {
          Toast.show({
            type: 'success',
            position: 'top',
            topOffset: 50,
            text1: res?.title,
            text2: res?.message || 'Reset pin successfully!',
            visibilityTime: 3000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
          setTimeout(() => {
            toggleReserPin();
            message = 'Please wait...';
          }, 500);
        }
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Reset Pin',
          text2: "You don't have a pin on record!",
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }

  //open new pin creation modal
  const CreatePin = () => {
    return (
      <View style={[internalStyles.sheetContainer]}>
        <BottomSheet
          visible={showCreatePin}
          onBackButtonPress={toggleCreatePin}
          onBackdropPress={toggleCreatePin}>
          <View style={internalStyles.card}>
            <MaterialCommunityIcons
              name="lock-check"
              size={40}
              color={COLORS.lendaGreen}
              style={{marginLeft: 'auto', marginRight: 'auto'}}
            />
            <Text style={[styles.subTitle, {paddingTop: 10}]}>
              Please{' '}
              <Text style={{fontWeight: 'bold', color: COLORS.lendaGreen}}>
                create
              </Text>{' '}
              your transaction pin{'\n'}
              for autorizing all transfers
            </Text>
            {errorAvaileble && (
              <Text
                style={[
                  styles.subTitle,
                  {paddingTop: 10, fontWeight: 'bold', color: COLORS.red},
                ]}>
                {errorMessage}
              </Text>
            )}
            <Text
              style={[
                internalStyles.textLabel,
                {fontSize: 16, color: '#4E4B66'},
              ]}>
              New Pin
            </Text>
            <CodeField
              ref={refNewPin}
              {...newPinProps}
              value={newPin}
              onChangeText={setNewPin}
              cellCount={CELL_COUNT}
              rootStyle={[styles.codeFieldRoot, {marginTop: 0}]}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => {
                let textChild = null;

                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="✱"
                      isLastFilledCell={isLastFilledCell({index, newPin})}>
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getNewPinCellOnLayoutHandler(index)}>
                    {textChild}
                  </Text>
                );
              }}
            />
            <Text
              style={[
                internalStyles.textLabel,
                {fontSize: 16, color: '#4E4B66'},
              ]}>
              Confirm New Pin
            </Text>
            <CodeField
              ref={refConfirmPin}
              {...confirmPinProps}
              value={confirmNewPin}
              onChangeText={setConfirmNewPin}
              cellCount={CELL_COUNT}
              rootStyle={[styles.codeFieldRoot, {marginTop: 0}]}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => {
                let textChild = null;

                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="✱"
                      isLastFilledCell={isLastFilledCell({
                        index,
                        confirmNewPin,
                      })}>
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getConfirmPinCellOnLayoutHandler(index)}>
                    {textChild}
                  </Text>
                );
              }}
            />
            <View style={{marginVertical: 40}}>
              <CustomButton
                title={'Create New Pin'}
                disabled={disableit}
                isLoading={isLoading}
                buttonStyle={{marginHorizontal: 0}}
                onPress={() => handleCreatePin()}
              />
            </View>
          </View>
        </BottomSheet>
      </View>
    );
  };

  const ChangePin = () => {
    return (
      <View style={[internalStyles.sheetContainer]}>
        <BottomSheet
          visible={showChangePin}
          onBackButtonPress={toggleChangePin}
          onBackdropPress={toggleChangePin}>
          <View style={internalStyles.card}>
            <MaterialCommunityIcons
              name="lock-check"
              size={40}
              color={COLORS.lendaGreen}
              style={{marginLeft: 'auto', marginRight: 'auto'}}
            />
            <Text style={[styles.subTitle, {paddingTop: 10}]}>
              Please{' '}
              <Text style={{fontWeight: 'bold', color: COLORS.lendaGreen}}>
                change
              </Text>{' '}
              your transaction pin for {'\n'}
              improved transaction security
            </Text>
            {errorAvaileble && (
              <Text
                style={[
                  styles.subTitle,
                  {paddingTop: 10, fontWeight: 'bold', color: COLORS.red},
                ]}>
                {errorMessage}
              </Text>
            )}
            <Text
              style={[
                internalStyles.textLabel,
                {fontSize: 16, color: '#4E4B66'},
              ]}>
              Old Pin
            </Text>
            <CodeField
              ref={refOldPin}
              {...oldPinProps}
              value={oldPin}
              onChangeText={setOldPin}
              cellCount={CELL_COUNT}
              rootStyle={[styles.codeFieldRoot, {marginTop: 0}]}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => {
                let textChild = null;

                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="*"
                      isLastFilledCell={isLastFilledCell({index, oldPin})}>
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getOldPinCellOnLayoutHandler(index)}>
                    {textChild}
                  </Text>
                );
              }}
            />
            <Text
              style={[
                internalStyles.textLabel,
                {fontSize: 16, color: '#4E4B66'},
              ]}>
              New Pin
            </Text>
            <CodeField
              ref={refNewPin}
              {...newPinProps}
              value={newPin}
              onChangeText={setNewPin}
              cellCount={CELL_COUNT}
              rootStyle={[styles.codeFieldRoot, {marginTop: 0}]}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => {
                let textChild = null;

                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="*"
                      isLastFilledCell={isLastFilledCell({index, newPin})}>
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getNewPinCellOnLayoutHandler(index)}>
                    {textChild}
                  </Text>
                );
              }}
            />
            <Text
              style={[
                internalStyles.textLabel,
                {fontSize: 16, color: '#4E4B66'},
              ]}>
              Confirm New Pin
            </Text>
            <CodeField
              ref={refConfirmPin}
              {...confirmPinProps}
              value={confirmNewPin}
              onChangeText={setConfirmNewPin}
              cellCount={CELL_COUNT}
              rootStyle={[styles.codeFieldRoot, {marginTop: 0}]}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => {
                let textChild = null;

                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="*"
                      isLastFilledCell={isLastFilledCell({
                        index,
                        confirmNewPin,
                      })}>
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getConfirmPinCellOnLayoutHandler(index)}>
                    {textChild}
                  </Text>
                );
              }}
            />
            <View style={{marginVertical: 40}}>
              <CustomButton
                title={'Change Pin'}
                isLoading={isLoading}
                buttonStyle={{marginHorizontal: 0}}
                onPress={handleChangePin}
                disabled={disableits}
              />
            </View>
          </View>
        </BottomSheet>
      </View>
    );
  };

  const ResetPin = () => {
    return (
      <VerifyModal visible={showResetPin}>
        <View style={{alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="lock-check"
            size={40}
            color={COLORS.lendaGreen}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
          <Text
            style={[
              internalStyles.resetPinText,
              {fontSize: 24, fontFamily: 'serif'},
            ]}>
            Confirm Reset Pin
          </Text>
          <Text style={internalStyles.question}>
            Are you sure you want to reset your transaction pin ?
          </Text>

          <TouchableOpacity
            style={internalStyles.signUpactivity}
            onPress={handleResetPin}>
            <Text style={internalStyles.confirmText}>Reset Pin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleReserPin}
            style={[
              internalStyles.signUpactivity,
              {borderColor: '#054B99', backgroundColor: '#fff', borderWidth: 1},
            ]}>
            <Text style={[internalStyles.confirmText, {color: '#054B99'}]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </VerifyModal>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Header
        routeAction={() => navigation.goBack()}
        heading={'TRANSACTION PIN'}
        disable={false}
      />
      <Loader vissible={isLoading} loadingText={message} />

      <ScrollView
        bounces={false}
        style={{paddingHorizontal: 16, marginVertical: 30, flex: 1}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{
            marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={toggleCreatePin}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text
                style={[
                  internalStyles.TextHead,
                  {fontSize: 16, color: '#4E4B66'},
                ]}>
                Set Transaction Pin
              </Text>
              <Text
                style={[
                  internalStyles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN before every transaction
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={toggleChangePin}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text
                style={[
                  internalStyles.TextHead,
                  {fontSize: 16, color: '#4E4B66'},
                ]}>
                Change Transaction Pin
              </Text>
              <Text
                style={[
                  internalStyles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN before every transaction
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F7FC',
            padding: 18,
            borderRadius: 12,
          }}
          onPress={toggleReserPin}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#D9DBE9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#054B99"
              />
            </View>
            <View>
              <Text
                style={[
                  internalStyles.TextHead,
                  {fontSize: 16, color: '#4E4B66'},
                ]}>
                Reset Transaction Pin
              </Text>
              <Text
                style={[
                  internalStyles.desc,
                  {marginTop: 4, fontSize: 10, color: '#4E4B66'},
                ]}>
                Requires your PIN before every transaction
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
      {/* BottomSheets */}
      {CreatePin()}
      {ChangePin()}
      {ResetPin()}
    </SafeAreaView>
  );
};

export default TransPin;

const internalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  signUp: {
    marginTop: 10,
    backgroundColor: '#054B99',
    width: '95%',
    opacity: 0.5,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  desc: {
    color: '#4E4B66',

    fontWeight: '500',
    fontSize: 14,
  },
  sheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    minHeight: hp('50%'),
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4E4B66',
    marginVertical: 15,
    textAlign: 'left',
  },
  signUpactivity: {
    backgroundColor: COLORS.lendaBlue,
    height: 48,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signOutView: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resetPinText: {
    color: '#ED2E7E',
    fontFamily: 'serif',
    fontSize: 16,
    paddingVertical: 10,
  },
  question: {
    textAlign: 'center',
    color: '#4E4B66',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});
