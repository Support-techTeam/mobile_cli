import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

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
      <Header
        routeAction={() => navigation.goBack()}
        heading="NOTIFICATIONS"
        disable={false}
      />
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={COLORS.lendaGreen}
          animating
          style={{
            zIndex: 99999,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;

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
