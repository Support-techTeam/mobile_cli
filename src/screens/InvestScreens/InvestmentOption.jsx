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
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import {useClipboard} from '@react-native-clipboard/clipboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

const InvestmentOptionScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [data, setData] = useState([{name: 'MMF'}, {name: 'EB'}]);
  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: hp(100),
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View
        style={{
          width: wp(90),
          marginHorizontal: 10,
          flexDirection: 'row',
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
            <Text style={styles.TextHead}>SAVE WITH ARM</Text>
          </View>
        </View>
      </View>
      <View style={styles.demark} />

      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: '#fff',
              flexGrow: 1,
              height: hp(90),
              marginBottom: 20,
            },
          ]}>
          <View style={{alignItems: 'center', marginTop: 24}}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Recommended products</Text>
            </View>
          </View>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            onScroll={() => setIsScrolling(true)}
            onMomentumScrollEnd={() =>
              setTimeout(() => {
                setIsScrolling(false);
              }, 500)
            }
            centerContent={true}
            style={[styles.scrollView]}
            contentContainerStyle={styles.contentContainer}
            alwaysBounceVertical={false}>
            {(data && data.length == 0) || (data && data == undefined) ? (
              <View style={styles.transHistory}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 20,
                    marginVertical: hp('20%'),
                  }}>
                  <Image source={require('../../../assets/images/Group.png')} />
                  <Text style={styles.noTrans}>
                    No Investment data available!
                  </Text>
                </View>
              </View>
            ) : (
              data &&
              data.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{marginHorizontal: 15}}
                    onPress={
                      isScrolling
                        ? null
                        : () =>
                            navigation.navigate('Transaction', {
                              transaction: item,
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
                          <>
                            <Image
                              style={styles.PanelImage}
                              source={require('../../../assets/images/investGraph.png')}
                            />
                          </>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: hp('2%'),
                              color: COLORS.dark,
                            }}>
                            {/* {item?.transactionType} */}
                            Money Market Funds
                          </Text>
                          <Text
                            style={[
                              styles.desc,
                              {
                                color: COLORS.lendaGreen,
                                opacity: 0.8,
                                marginTop: 1,
                              },
                            ]}>
                            <Image
                              style={styles.InternalImage}
                              source={require('../../../assets/images/ArrowUp.png')}
                            />
                            17 % Annual
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: hp('2.2%'),
                            color: COLORS.dark,
                            alignSelf: 'flex-end',
                          }}>
                          <>
                            ₦ 10,000.00
                            {/* {item.debit
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                          </>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={styles.demark} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  HeadView: {
    flexDirection: 'row',
    width: wp(80),
    justifyContent: 'center',
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
    paddingTop: 2,
    paddingBottom: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    width: wp(90),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: hp(2.5),
    lineHeight: 21,
    color: '#14142B',
  },
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  transHistory: {
    padding: 14,
  },
  PanelItemContainer: {
    borderWidth: 0.4,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: COLORS.white,
  },
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  InternalImage: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginVertical: 0,
  },
});
