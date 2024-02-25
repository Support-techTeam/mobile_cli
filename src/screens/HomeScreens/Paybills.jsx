/* eslint-disable no-undef */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import CustomView from '../../component/paybillsview/CustomView';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const statusBarHeight = getStatusBarHeight();
const midth = Dimensions.get('window').width;

const billData = [
  {value: 'Airtime', label: 'Airtime', key: 'airtime'},
  {value: 'Data Bundle', label: 'Data Bundle', key: 'data_bundle'},
  {value: 'Electricity', label: 'Electricity', key: 'electricity'},
  {value: 'Cable TV', label: 'Cable TV', key: 'cable_tv'},
];

const Paybills = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

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
      {isLoading && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{color: 'white'}}
          visible={true} //check
          overlayColor="rgba(78, 75, 102, 0.7)"
        />
      )}
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#D9DBE9',
                borderRadius: 5,
              }}>
              <AntDesign name="left" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <View style={styles.HeadView}>
            <View style={styles.TopView}>
              <Text style={styles.TextHead}>PAYBILLS</Text>
            </View>
          </View>
          <View>
            <Text> </Text>
          </View>
        </View>
        <View style={styles.demark} />

        <View style={[styles.innercontainer]}>
          <View style={styles.selectView}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={billData}
              keyExtractor={item => item.value.toString()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate(item.key)}>
                    <CustomView
                      label={item.value}
                      iconName="../../../assets/images/transfer_out.png"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Paybills;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notihead: {
    fontSize: 14,
    lineHeight: 24,
    color: '#6E7191',
    fontWeight: '600',
  },
  innercontainer: {
    marginTop: statusBarHeight,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  btnActive: {
    color: '#054B99',
  },
  cont: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
  },
  personIcon: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 30,
    padding: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
  hello: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  toptabs: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#D9DBE9',
  },
  tabtexts: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop:5,
    // paddingLeft:10
    // backgroundColor:'red'
  },
  gradient: {
    // padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: midth - 32,
    //  position: "relative"

    height: '85%',
  },
  wallet: {
    color: '#fff',

    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 10,
  },
  prices: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginTop: 20,
  },
  FundButton: {
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: 12,
    paddingVertical: 6,
    // paddingHorizontal:12,
    textAlign: 'center',
    color: '#054B99',

    fontWeight: '500',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },
  extrat: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  demark: {
    width: '97%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    color: '#14142B',
  },
  desc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
});
