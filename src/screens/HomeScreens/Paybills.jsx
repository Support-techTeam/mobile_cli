import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Loader from '../../component/loader/loader';
import {Header} from '../../component/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from 'react-native-collapsible/Accordion';
import COLORS from '../../constants/colors';
import {
  getNetworkProvider,
  getDataProvider,
  getElectricityProviders,
} from '../../stores/BillStore';
import {AirtimeSection} from '../../component/bill/Airtime-Section';
import {ActivityIndicator} from 'react-native';
import {DataSection} from '../../component/bill/Data-Section';
import {ElectricSection} from '../../component/bill/Electric-Section';
import {CableSection} from '../../component/bill/Cable-Section';
const statusBarHeight = getStatusBarHeight();
const midth = Dimensions.get('window').width;

const Paybills = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAirtime, setIsLoadingAirtime] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingPower, setIsLoadingPower] = useState(false);
  const [isLoadingCable, setIsLoadingCable] = useState(false);
  const insets = useSafeAreaInsets();
  const [activeSections, setActiveSections] = useState([]);
  const [networkProviders, setNetworkProviders] = useState([]);
  const [dataNetworkProviders, setDataNetworkProviders] = useState([]);
  const [electricityProviders, setElectricityProviders] = useState([]);
  const [cableProviders, setCableProviders] = useState([
    {value: 'gotv', name: 'GOTV'},
    {value: 'dstv', name: 'DSTV'},
  ]);

  const sections = [
    {
      title: 'Airtime Purchase',
      image: require('../../../assets/images/airtime.png'),
      content: (
        <Fragment>
          {isLoadingAirtime ? (
            <ActivityIndicator size={'large'} color={COLORS.lendaBlue} />
          ) : (
            <AirtimeSection networkProviders={networkProviders} />
          )}
        </Fragment>
      ),
    },
    {
      title: 'Data Bundle Purchase',
      image: require('../../../assets/images/databuy.png'),
      content: (
        <Fragment>
          {isLoadingData ? (
            <ActivityIndicator size={'large'} color={COLORS.lendaBlue} />
          ) : (
            <DataSection networkProviders={dataNetworkProviders} />
          )}
        </Fragment>
      ),
    },
    {
      title: 'Pay Electric Bill',
      image: require('../../../assets/images/Electricity.png'),
      content: (
        <Fragment>
          {isLoadingPower ? (
            <ActivityIndicator size={'large'} color={COLORS.lendaBlue} />
          ) : (
            <ElectricSection networkProviders={electricityProviders} />
          )}
        </Fragment>
      ),
    },
    {
      title: 'Cable TV Subscription',
      image: require('../../../assets/images/cable.png'),
      content: (
        <Fragment>
          {isLoadingCable ? (
            <ActivityIndicator size={'large'} color={COLORS.lendaBlue} />
          ) : (
            <CableSection networkProviders={cableProviders} />
          )}
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    fetchingAllNetworkProvider();
  }, []);

  const fetchingAllNetworkProvider = async () => {
    try {
      setIsLoadingAirtime(true);
      const res = await getNetworkProvider();
      if (res?.error) {
      } else {
        setNetworkProviders(res?.data?.data?.data?.providers);
      }
      setIsLoadingAirtime(false);
    } catch (e) {
      setIsLoadingAirtime(false);
    }
  };

  useEffect(() => {
    fetchingAllDataNetworkProvider();
  }, []);

  const fetchingAllDataNetworkProvider = async () => {
    try {
      setIsLoadingData(true);
      const res = await getDataProvider();
      if (res?.error) {
        // TODO: handle error
      } else {
        setDataNetworkProviders(res?.data?.data?.data);
      }
      setIsLoadingData(false);
    } catch (e) {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchingAllElectricityProvider();
  }, []);

  const fetchingAllElectricityProvider = async () => {
    try {
      setIsLoadingPower(true);
      const res = await getElectricityProviders();
      if (res?.error) {
        // TODO: handle error
      } else {
        setElectricityProviders(res?.data?.data?.data);
      }
      setIsLoadingPower(false);
    } catch (e) {
      setIsLoadingPower(false);
    }
  };

  function renderHeader(section, _, isActive) {
    return (
      <View style={[styles.accordHeader, {paddingVertical: isActive ? 8 : 18}]}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={section.image} />
          <Text style={styles.accordTitle}>{section.title}</Text>
        </View>
        <Icon
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#bbb"
        />
      </View>
    );
  }

  function renderContent(section, _, isActive) {
    return <View style={styles.accordBody}>{section.content}</View>;
  }

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
      <Loader visible={isLoading} loadingText={'Please wait...'} />

      <Header
        routeAction={() => navigation.goBack()}
        heading="PAY BILLS"
        disable={false}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <Accordion
          easing="easeIn"
          duration={300}
          expandMultiple={false}
          align="top"
          sections={sections}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections(sections)}
          sectionContainerStyle={styles.accordContainer}
          touchableComponent={TouchableOpacity}
        />
      </ScrollView>

      {/* <View style={[styles.innercontainer]}>
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
          </View> */}
      {/* </View> */}
    </SafeAreaView>
  );
};

export default Paybills;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  accordHeader: {
    flexDirection: 'row',
    backgroundColor: '#e7e7e7',
    backgroundColor: COLORS.lendaLightBlue,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: COLORS.lendaComponentBorder,
    flex: 1,
  },
  accordTitle: {
    fontSize: 20,
    color: 'white',
  },
  accordBody: {
    padding: 12,
  },
  textSmall: {
    fontSize: 16,
  },
  seperator: {
    height: 12,
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
  PanelImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
});
