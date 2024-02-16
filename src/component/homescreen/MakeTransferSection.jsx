import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheet} from 'react-native-btr';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const {width} = Dimensions.get('window');

export const MakeTransferSection = props => {
  const navigation = useNavigation();
  const {
    isMakeTransferVisible,
    toggleMakeTransfer,
    setIsMakeTransferVisible,
  } = props;
  return (
    <View style={styles.container}>
    <BottomSheet
      visible={isMakeTransferVisible}
      onBackButtonPress={toggleMakeTransfer}
      onBackdropPress={toggleMakeTransfer}>
      <View
        style={{
          backgroundColor: '#fff',
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginHorizontal: 15,
          }}>
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#D9DBE9',
                borderRadius: 5,
              }}>
              <TouchableOpacity onPress={toggleMakeTransfer}>
                <Icon name="chevron-left" size={36} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.HeadView,
              {
                flex: 1,
              },
            ]}>
            <View style={styles.TopView}>
              <Text style={styles.TextHead}>SELECT TRANSFER TYPE</Text>
            </View>
          </View>
          <TouchableOpacity>
            <View
              style={{
                padding: 2,
              }}>
              <Text>{'      '}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.demark} />
        <View
          style={{
            marginTop: 16,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              marginBottom: 5,
              flexDirection: 'row',
            }}
            onPress={() => {
              setIsMakeTransferVisible(false);
              navigation.navigate('Transfer', {
                paramKey: 'InternalTransfer',
              });
            }}>
            <View
              style={{
                backgroundColor: '#CDDBEB',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <EntypoIcon name="wallet" size={24} color="#054B99" />
            </View>
            <View>
              <Text
                style={[
                  styles.TextHead,
                  {
                    fontSize: 14,
                    color: '#4E4B66',
                    marginHorizontal: 12,
                  },
                ]}>
                Transfer to Trade Lenda wallet
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat',
                  color: '#4E4B66',
                  marginHorizontal: 12,
                }}>
                Make transfer to other trade Lenda wallets
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                flexGrow: 1,
              }}>
              <Icon name="chevron-right" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <View style={[styles.demark, {width: width * 0.90}]} />
          <TouchableOpacity
            style={{
              marginTop: 20,
              flexDirection: 'row',
            }}
            onPress={() => {
              setIsMakeTransferVisible(false);
              navigation.navigate('Transfer', {
                paramKey: 'Nip',
              });
            }}>
            <View
              style={{
                backgroundColor: '#CDDBEB',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <EntypoIcon name="wallet" size={24} color="#054B99" />
            </View>
            <View>
              <Text
                style={[
                  styles.TextHead,
                  {fontSize: 14, color: '#4E4B66'},
                ]}>
                Transfer to Bank
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat',
                  color: '#4E4B66',
                }}>
                Make transfer to other bank accounts{'         '}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                flexGrow: 1,
              }}>
              <Icon name="chevron-right" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  demark: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
    
  },
});
