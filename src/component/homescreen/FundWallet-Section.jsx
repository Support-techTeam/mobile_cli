import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheet} from 'react-native-btr';
import COLORS from '../../constants/colors';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import OctaIcon from 'react-native-vector-icons/Octicons';

export const FundWalletSection = props => {
  const {
    isFundWalletVisible,
    toggleFundWallet,
    userProfileData,
    userWalletData,
    handleLongPress,
    multipleWalletsData,
  } = props;
  return (
    <View style={styles.container}>
      <BottomSheet
        visible={isFundWalletVisible}
        onBackButtonPress={toggleFundWallet}
        onBackdropPress={toggleFundWallet}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 15,
            }}>
            <TouchableOpacity>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: '#D9DBE9',
                  borderRadius: 5,
                }}>
                <TouchableOpacity onPress={toggleFundWallet}>
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
                <Text style={styles.TextHead}>Fund Wallet</Text>
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
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'MontSBold',
              color: '#4E4B66',
              textAlign: 'center',
              margin: 4,
            }}>
            Transfer Money to the account details below to fund your account
          </Text>
          <View style={[styles.demark]} />
          {multipleWalletsData.length > 0
            ? multipleWalletsData.map((walletData, index) => (
                <View key={index}>
                  <View style={{marginTop: 16, marginHorizontal: 16}}>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#CDDBEB',
                          width: 40,
                          height: 40,
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FontIcon name="bank" size={24} color="#054B99" />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'space-between',
                          width: '90%',
                        }}>
                        <View>
                          <Text
                            style={[
                              styles.TextHead,
                              {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                            ]}>
                            Bank Name:
                          </Text>
                        </View>
                        <Text style={styles.TextHead}>
                          {walletData?.banker === 'Providus'
                            ? `${walletData?.banker} Bank`
                            : walletData?.banker}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* <View style={[styles.demark]} /> */}
                  <View style={{marginTop: 16, marginHorizontal: 16}}>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#CDDBEB',
                          width: 40,
                          height: 40,
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          name="account-box-outline"
                          size={24}
                          color="#054B99"
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'space-between',
                          width: '90%',
                        }}>
                        <View>
                          <Text
                            style={[
                              styles.TextHead,
                              {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                            ]}>
                            Account Name:
                          </Text>
                        </View>
                        <Text
                          style={
                            (styles.TextHead,
                            {
                              fontSize: 14,
                              textAlign: 'right',
                              fontFamily: 'MontSBold',
                              lineHeight: 20,
                              letterSpacing: 0.5,
                              flexShrink: 1,
                            })
                          }>
                          {userProfileData?.firstName}{' '}
                          {userProfileData?.lastName}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* <View style={[styles.demark]} /> */}
                  <View
                    style={[
                      {
                        marginTop: 16,
                        marginHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#D9DBE9',
                        paddingVertical: 4,
                      },
                    ]}>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#CDDBEB',
                          width: 40,
                          height: 40,
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <OctaIcon name="number" size={24} color="#054B99" />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'space-between',
                          width: '90%',
                        }}>
                        <View>
                          <Text
                            style={[
                              styles.TextHead,
                              {fontSize: 14, color: '#4E4B66', marginLeft: 5},
                            ]}>
                            Account Number:
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <TouchableWithoutFeedback
                            onPress={() =>
                              handleLongPress(walletData?.walletIdAccountNumber)
                            }>
                            <Text
                              selectable={true}
                              selectionColor={'#CED4DA'}
                              style={styles.TextHead}>
                              {walletData && walletData?.walletIdAccountNumber
                                ? walletData?.walletIdAccountNumber
                                : 'N/A'}
                            </Text>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback>
                            <Icon
                              size={17}
                              color={COLORS.lendaBlue}
                              name="content-copy"
                              style={{marginLeft: 4}}
                              onPress={() =>
                                handleLongPress(
                                  walletData?.walletIdAccountNumber,
                                )
                              }
                            />
                          </TouchableWithoutFeedback>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            : null}
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
