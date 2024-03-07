import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

export const SingleTransactionSection = props => {
  const {userTransactionsData, userWalletData, hideBalance} = props;
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        {
          height: hp(
            userTransactionsData && userTransactionsData.length > 0
              ? '16%'
              : '32%',
          ),
        },
      ]}>
      <View
        style={{
          marginVertical: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginVertical: 10,
          }}>
          <Text
            style={
              ([styles.history],
              {
                fontWeight: 700,
                fontSize: hp(2),
                color: COLORS.grey,
              })
            }>
            Recent Transactions
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row', justifyContent: 'center', borderBlockColor: COLORS.lendaComponentBorder, borderWidth: 0.1, paddingLeft: 25, paddingBottom: 5}}
            disabled={
              (userTransactionsData && userTransactionsData.length === 0) ||
              userTransactionsData == undefined
                ? true
                : false
            }
            // onPress={toggleAllTransaction}>
            onPress={() => navigation.navigate('TransactionHistory')}>
            <Text
              style={[
                styles.seeHistory,
                {
                  color:
                    (userTransactionsData &&
                      userTransactionsData.length === 0) ||
                    userTransactionsData == undefined
                      ? COLORS.grey
                      : COLORS.lendaBlue,
                },
              ]}>
              See all
            </Text>
            <Icon
              name="chevron-right"
              size={hp(2.5)}
              color={
                (userTransactionsData && userTransactionsData.length === 0) ||
                userTransactionsData == undefined
                  ? COLORS.grey
                  : COLORS.lendaBlue
              }
            />
          </TouchableOpacity>
        </View>

        {(userTransactionsData && userTransactionsData.length === 0) ||
        userTransactionsData == undefined ? (
          <View style={styles.transHistory}>
            <View style={styles.noTransPanel}>
              <Image
                source={require('../../../assets/images/Group.png')}
                style={styles.noTransImage}
              />
              <Text style={styles.noTrans}>No transaction data available!</Text>
            </View>
          </View>
        ) : (
          userTransactionsData &&
          userTransactionsData.slice(0, 1).map((item, i) => {
            const dateObj = new Date(item.createdAt);
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const seconds = dateObj.getSeconds();
            const date = item.createdAt.substring(0, 10);

            const amOrPm = hours >= 12 ? 'PM' : 'AM';

            const twelveHourFormat = hours > 12 ? hours - 12 : hours;

            const time = `${twelveHourFormat}:${minutes}:${seconds} ${amOrPm}`;
            let stringArray = item?.narration.split(' ')[0].trim();
            let imageResource = require('../../../assets/images/Transfer.png');
            if (stringArray == 'mtn') {
              imageResource = require('../../../assets/images/mtn.png');
            }
            if (stringArray == 'airtel') {
              imageResource = require('../../../assets/images/airtel.png');
            }
            if (stringArray == 'glo') {
              imageResource = require('../../../assets/images/glo.png');
            }
            if (stringArray == '9mobile') {
              imageResource = require('../../../assets/images/9mobile.png');
            }
            if (stringArray == 'spectranet') {
              imageResource = require('../../../assets/images/spectranet.png');
            }
            if (stringArray == 'smile') {
              imageResource = require('../../../assets/images/smile.png');
            }
            return (
              <TouchableOpacity
                key={i}
                // delayPressIn={500}
                onPress={() =>
                  navigation.navigate('Transaction', {
                    transaction: item,
                    wallet: userWalletData,
                    time: time,
                    day: date,
                  })
                }>
                <View style={styles.PanelItemContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{marginRight: 10}}>
                      {item.transactionType === 'NIP' &&
                        (item?.narration?.includes('airtime purchase') ||
                        item?.narration?.includes('data bundle purchase') ? (
                          <>
                            <Image
                              style={styles.PanelImage}
                              source={imageResource}
                            />
                          </>
                        ) : item.credit != null ||
                          item.credit > 0 ||
                          item.credit != undefined ? (
                          <>
                            <Image
                              style={[
                                styles.PanelImage,
                                {
                                  transform: [{rotate: '180deg'}],
                                },
                              ]}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ) : (
                          <>
                            <Image
                              style={styles.PanelImage}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ))}
                      {item.transactionType === 'Tradelenda Internal Wallet' &&
                        (item.credit != null ||
                        item.credit > 0 ||
                        item.credit != undefined ? (
                          <>
                            <Image
                              style={[
                                styles.PanelImage,
                                {
                                  transform: [{rotate: '180deg'}],
                                },
                              ]}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ) : (
                          <>
                            <Image
                              style={styles.PanelImage}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ))}
                      {item.transactionType === 'Reversal' &&
                        (item.credit != null ||
                        item.credit > 0 ||
                        item.credit != undefined ? (
                          <>
                            <Image
                              style={[
                                styles.PanelImage,
                                {
                                  transform: [{rotate: '180deg'}],
                                },
                              ]}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ) : (
                          <>
                            <Image
                              style={styles.PanelImage}
                              source={require('../../../assets/images/Transfer.png')}
                            />
                          </>
                        ))}
                      {item.title === 'Loan Application' && (
                        <>
                          <Image
                            style={styles.PanelImage}
                            source={require('../../../assets/images/LoanBox.png')}
                          />
                        </>
                      )}
                      {item.title === 'PayBills' && (
                        <>
                          <Image
                            style={styles.PanelImage}
                            source={require('../../../assets/images/paybilBox.png')}
                          />
                        </>
                      )}
                    </View>
                    <View>
                      <Text style={{fontSize: hp(1.8), color: COLORS.dark}}>
                        {item.transactionType === 'Tradelenda Internal Wallet'
                          ? // ? 'Internal Wallet'
                            'WALLET TRANSFER'
                          : item.transactionType === 'NIP'
                          ? item?.narration?.includes('airtime purchase') ||
                            item?.narration?.includes('data bundle purchase')
                            ? item?.narration.split(' ')[0].toUpperCase() +
                              ' ' +
                              item?.narration.split(' ')[1].toUpperCase()
                            : 'NIP TRANSFER'
                          : item.transactionType}
                      </Text>
                      <Text
                        style={[
                          styles.desc,
                          {
                            color: COLORS.dark,
                            opacity: 0.8,
                            marginTop: 1,
                          },
                        ]}>
                        {date} : {time}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {item.credit != null ||
                    item.credit > 0 ||
                    item.credit != undefined ||
                    item?.fromWalletAccountNumber !=
                      userWalletData?.walletIdAccountNumber ? (
                      <Icon name="plus" size={16} color={COLORS.googleGreen} />
                    ) : (
                      <Icon name="minus" size={16} color={COLORS.googleRed} />
                    )}
                    <Text
                      style={{
                        fontSize: hp(2),
                        color:
                          item.credit != null ||
                          item.credit > 0 ||
                          item.credit != undefined ||
                          item?.fromWalletAccountNumber !=
                            userWalletData?.walletIdAccountNumber
                            ? COLORS.googleGreen
                            : COLORS.googleRed,
                        alignSelf: 'flex-end',
                      }}>
                      {item.credit === null ? (
                        <>
                          ₦
                          {hideBalance
                            ? '******'
                            : new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(item.debit))}
                        </>
                      ) : (
                        <>
                          ₦
                          {hideBalance
                            ? '******'
                            : new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(item.credit))}
                        </>
                      )}
                    </Text>
                    <Icon
                      name="chevron-right"
                      size={16}
                      color={COLORS.lendaBlue}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: wp('5%'),
    width: wp('90%'),
    borderRadius: 5,
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: '#D9DBE9',
    marginHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  history: {
    fontFamily: 'MontSBold',
    color: '#14142B',
    fontSize: 16,
  },
  seeHistory: {
    color: '#054B99',
    fontFamily: 'MontSBold',
    fontSize: hp(2),
  },
  transHistory: {
    padding: 14,
  },
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  noTransPanel: {
    justifyContent: 'center',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  noTransImage: {
    height: 120,
    width: 120,
    resizeMode: 'cover',
  },
  PanelItemContainer: {
    borderWidth: 0.2,
    borderColor: COLORS.lendaComponentBorder,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 5,
    backgroundColor: COLORS.lendaLightGrey,
  },
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
  desc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
});
