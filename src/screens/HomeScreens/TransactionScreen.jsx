import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  ToastAndroid,
  Platform,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import {useClipboard} from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import SendIntentAndroid from 'react-native-send-intent';
import email from 'react-native-email';

const TransactionScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {transaction, time, day} = route.params;
  const [data, setString] = useClipboard();
  const viewShotRef = React.useRef(null);

  const openSendSms = Id => {
    const text = `Hello, I would like to report a transaction, with Transaction ID: ${Id}`;
    if (Platform.OS === 'android') {
      SendIntentAndroid.sendMail(
        'support@tradelenda.com',
        `Report Transaction`,
        `${text}`,
      );
    } else {
      email('support@tradelenda.com', {
        subject: 'Report Transaction',
        body: `${text}`,
        checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
      }).catch(console.error);
    }
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
      ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
    } catch (error) {
      // console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>TRANSACTION</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => shareToSocialMedia()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
              padding: 2,
            }}>
            <Icon name="share-variant-outline" size={30} color="#054B99" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.demark} />

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
            <View style={{alignItems: 'center', marginTop: 24}}>
              <View style={styles.titleView}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                  }}>
                  <Image
                    source={require('../../../assets/images/transfer_out.png')}
                  />
                </View>
                <Text style={styles.title}>{transaction.transactionType}</Text>
              </View>
              <Text
                style={{
                  fontWeight: '400',
                  marginTop: 8,
                }}>
                On<Text style={{fontWeight: 'bold'}}> {day}</Text> at{' '}
                <Text style={{fontWeight: 'bold'}}>{time}</Text>
              </Text>
            </View>
            <View style={{marginTop: 40}}>
              <Text style={styles.infotext}>Amount</Text>
              {transaction.credit === null ? (
                <Text style={styles.values}>₦{transaction.debit}.00</Text>
              ) : (
                <Text style={styles.values}>₦{transaction.credit}.00</Text>
              )}
            </View>
            <View style={styles.demark} />
            <View style={{marginTop: 15}}>
              <Text style={styles.infotext}>To</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={styles.values}>
                    {transaction.toWalletAccountNumber}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.demark} />
            <View style={{marginTop: 15}}>
              <Text style={styles.infotext}>Beneficiary Name</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={styles.values}>{transaction.toAccountName}</Text>
                </View>
              </View>
            </View>
            <View style={styles.demark} />
            <View style={{marginTop: 15}}>
              <Text style={styles.infotext}>Description</Text>
              <Text style={styles.values}>{transaction.narration}</Text>
            </View>
            <View style={styles.demark} />
            <View style={{marginTop: 15}}>
              <Text style={styles.infotext}>Status</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor:
                      transaction.transactionStatus === 'Failed'
                        ? '#ED2E7E'
                        : transaction.transactionStatus === 'Pending'
                        ? '#eb7c0e'
                        : '#44AB3B',
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <Text style={styles.values}>
                  {transaction.transactionStatus}
                </Text>
              </View>
            </View>
            <View style={styles.demark} />
            <TouchableWithoutFeedback
              onLongPress={() => handleLongPress(transaction.transactionRef)}>
              <View style={{marginTop: 15}}>
                <Text style={styles.infotext}>Transaction ID</Text>
                <Text style={styles.values}>{transaction.transactionRef}</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.demark} />

            <View style={{marginTop: 30}}>
              <Text style={styles.values}>More Action</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => openSendSms(transaction.transactionRef)}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#ffffff',
                      borderRadius: 5,
                      marginRight: 8,
                      padding: 2,
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        marginVertical: 5,
                      }}>
                      <Icon name="alert-octagon" size={24} color="#ED2E7E" />
                    </View>

                    <View>
                      <Text style={styles.report}>Report Transaction</Text>
                      <Text style={styles.reportdesc}>
                        Report an issue with this transaction
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderColor: '#D9DBE9',
    flexDirection: 'row',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    paddingLeft: 20,
    fontSize: 14,
    lineHeight: 21,
    color: '#14142B',
    paddingTop: 10,
  },
  infotext: {
    color: '#6E7191',
    marginBottom: 4,
  },
  values: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
  },
  report: {
    color: '#ED2E7E',
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
