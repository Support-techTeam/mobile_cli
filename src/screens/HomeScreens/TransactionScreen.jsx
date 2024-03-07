import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import {useClipboard} from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import email from 'react-native-email';
import {Header} from '../../component/header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

const TransactionScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {transaction, wallet, time, day} = route.params;
  const [data, setString] = useClipboard();
  const viewShotRef = React.useRef(null);

  const openSendSms = Id => {
    const text = `Hello, I would like to report a transaction, with Transaction ID: ${Id}`;
    const to = ['support@tradelenda.com'];
    email(to, {
      subject: `Report transaction issue from ${Platform.OS}`,
      body: `${text}`,
      checkCanOpen: false,
    }).catch(console.error);
  };

  const shareToSocialMedia = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const shareOptions = {
        title: 'Share via',
        url: `file://${uri}`,
        type: 'image/jpeg',
      };

      await Share.open(shareOptions);
    } catch (error) {
      // console.error('Error sharing:', error);
    }
  };

  const handleLongPress = async evt => {
    try {
      setString(evt);
      Toast.show({
        type: 'info',
        position: 'top',
        topOffset: 50,
        text1: 'Copy Action',
        text2: 'Transaction number copied to clipboard',
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      // console.error('Error copying to clipboard:', error);
    }
  };

  const renderTopIntro = () => {
    return (
      <View style={styles.intro}>
        <View style={[styles.titleView]}>
          <Text style={styles.title}>
            {transaction.credit === null ? (
              <>
                {transaction.credit != null ||
                transaction.credit > 0 ||
                transaction.credit != undefined ||
                transaction?.fromWalletAccountNumber !=
                  wallet?.walletIdAccountNumber ? (
                  <Icon name="plus" size={20} color={COLORS.black} />
                ) : (
                  <Icon name="minus" size={20} color={COLORS.black} />
                )}
                ₦
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(transaction.debit))}
              </>
            ) : (
              <>
                {transaction.credit != null ||
                transaction.credit > 0 ||
                transaction.credit != undefined ||
                transaction?.fromWalletAccountNumber !=
                  wallet?.walletIdAccountNumber ? (
                  <Icon name="plus" size={20} color={COLORS.black} />
                ) : (
                  <Icon name="minus" size={20} color={COLORS.black} />
                )}
                ₦
                {new Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(transaction.credit))}
              </>
            )}
          </Text>
          <View style={styles.statusView}>
            <View style={styles.status} />
            {transaction.transactionStatus === 'Failed' ? (
              <Icon name="close-circle" size={20} color={COLORS.highwayRed} />
            ) : transaction.transactionStatus === 'Pending' ? (
              <Icon name="help-circle" size={20} color={COLORS.lendaOrange} />
            ) : (
              <Icon name="check-circle" size={20} color={COLORS.lendaGreen} />
            )}
            <Text
              style={[
                styles.values,
                {
                  color:
                    transaction.transactionStatus === 'Failed'
                      ? COLORS.highwayRed
                      : transaction.transactionStatus === 'Pending'
                      ? COLORS.lendaOrange
                      : COLORS.lendaGreen,
                },
              ]}>
              {transaction.transactionStatus}
            </Text>
          </View>
          <View style={styles.body}>
            <View style={[styles.leftView]}>
              <Text style={styles.infotext}>Amount</Text>
            </View>
            <View style={[styles.rightView]}>
              <Text style={styles.values}>
                {transaction.credit === null ? (
                  <>
                    ₦
                    {new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(transaction.debit))}
                  </>
                ) : (
                  <>
                    ₦
                    {new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(transaction.credit))}
                  </>
                )}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={[styles.leftView]}>
              <Text style={styles.infotext}>Fee</Text>
            </View>
            <View style={[styles.rightView]}>
              <Text style={styles.values}>₦0.00</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionDetails = () => {
    return (
      <View style={styles.details}>
        <View style={styles.detailsView}>
          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Transaction Type</Text>
            </View>
            <View style={styles.rightView}>
              <Text style={styles.values}>{transaction.transactionType}</Text>
            </View>
          </View>

          {wallet?.walletIdAccountNumber ==
            transaction.fromWalletAccountNumber && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Beneficiary Name</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{transaction.toAccountName}</Text>
              </View>
            </View>
          )}

          {wallet?.walletIdAccountNumber ==
            transaction.fromWalletAccountNumber && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Beneficiary Bank</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{transaction.toBankName}</Text>
              </View>
            </View>
          )}

          {wallet?.walletIdAccountNumber ==
            transaction.toWalletAccountNumber && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Sender Name</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{transaction.fromAccountName}</Text>
              </View>
            </View>
          )}

          {wallet?.walletIdAccountNumber ==
            transaction.toWalletAccountNumber && (
            <View style={styles.body}>
              <View style={styles.leftView}>
                <Text style={styles.infotext}>Sender Bank</Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.values}>{transaction.fromBankName}</Text>
              </View>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Remark</Text>
            </View>
            <View style={styles.rightView}>
              <Text style={styles.values}>{transaction.narration}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Transaction Date</Text>
            </View>
            <View style={styles.rightView}>
              <Text style={styles.values}>
                <Text style={{fontWeight: 'bold'}}> {day}</Text>{' '}
                <Text style={{fontWeight: 'bold'}}>{time}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.leftView}>
              <Text style={styles.infotext}>Transaction Number</Text>
            </View>
            <View style={styles.rightView}>
              <TouchableWithoutFeedback
                onPress={() => handleLongPress(transaction.transactionRef)}>
                <Text style={styles.values}>{transaction.transactionRef}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Icon
                  size={17}
                  color={COLORS.lendaBlue}
                  name="content-copy"
                  style={{marginLeft: 4}}
                  onPress={() => handleLongPress(transaction.transactionRef)}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <View style={styles.footerView}>
          <View style={styles.footerBody}>
            <Text style={[styles.values, {textAlign: 'left'}]}>
              More Actions
            </Text>

            <View
              style={[
                styles.body,
                {
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  gap: 10,
                  paddingTop: 10,
                },
              ]}>
              <View>
                <TouchableOpacity onPress={() => shareToSocialMedia()}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: COLORS.lendaBlue,
                      backgroundColor: COLORS.lendaBlue,
                      borderRadius: 5,
                      marginRight: 8,
                      padding: 2,
                      flexDirection: 'row',
                      width: wp('40%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                      }}>
                      <Icon name="share" size={24} color="#fff" />
                    </View>

                    <View>
                      <Text style={[styles.report, {color: '#fff'}]}>
                        Share Receipt
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => openSendSms(transaction.transactionRef)}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: COLORS.lendaBlue,
                      backgroundColor: COLORS.white,
                      borderRadius: 5,
                      marginRight: 8,
                      padding: 2,
                      flexDirection: 'row',
                      width: wp('40%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                      }}>
                      <Icon
                        name="alert-octagon"
                        size={24}
                        color={COLORS.highwayRed}
                      />
                    </View>

                    <View>
                      <Text style={styles.report}>Report an issue</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Header routeAction={() => navigation.goBack()} heading="TRANSACTION" disable={false}/>

      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'png',
            quality: 1,
          }}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: '#fff',
                flexGrow: 1,
                height: '100%',
                marginBottom: 20,
              },
            ]}>
            {renderTopIntro()}
            {renderTransactionDetails()}
            {renderFooter()}
          </View>
        </ViewShot>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  intro: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // width: wp('90%'),
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
    height: hp('22%'),
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: wp('90%'),
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
    height: 'auto',
    paddingVertical: 10,
  },
  footerBody: {
    paddingHorizontal: 10,
    width: wp('90%'),
    marginVertical: 4,
  },
  footerView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
  },
  details: {
    paddingVertical: 10,
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 10,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 0.3,
  },
  detailsView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
    gap: 15,
  },
  body: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rightView: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  leftView: {
    flexGrow: 1,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    height: 12,
    width: 12,
    borderRadius: 20,
    marginRight: 10,
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
  demark: {
    width: '100%',
    height: 1,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  titleView: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9DBE9',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    color: '#14142B',
  },
  infotext: {
    color: '#6E7191',
    marginBottom: 4,
    fontSize: hp('1.8%'),
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  },
  values: {
    fontSize: hp('1.8%'),
    color: '#000',
    fontWeight: '600',
    textAlign: 'right',
    justifyContent: 'center',
    alignItems: 'center',
  },
  report: {
    color: COLORS.lendaBlue,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  reportdesc: {
    color: '#6E7191',
    fontSize: 12,
    lineHeight: 18,
  },
});
