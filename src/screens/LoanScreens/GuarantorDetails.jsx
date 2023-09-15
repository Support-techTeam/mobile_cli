import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getGuarantor} from '../../stores/GuarantorStore';

const GuarantorDetails = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [guarantor, setGuarantor] = useState([]);
  const guarantorId = route?.params?.paramKey;

  useEffect(() => {
    getGuarantorData();
  }, []);

  const getGuarantorData = async () => {
    setIsLoading(true);
    const res = await getGuarantor(guarantorId);
    if (res?.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res?.title,
        text2: res?.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      setGuarantor(res?.data);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      {isLoading && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{color: 'white'}}
          visible={true}
          overlayColor="rgba(16, 17, 17, 0.7)"
        />
      )}
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
            <AntDesign name="left" size={28} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>Guarantor Details</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', marginTop: 24}}>
          <View style={styles.titleView}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 25,
                marginRight: 8,
              }}>
              <Image
                source={require('../../../assets/images/Loanapplicon.png')}
              />
            </View>
            <Text style={styles.title}>Details</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Text style={{fontWeight: '400'}}>Added </Text>
            <Text style={{fontWeight: '600'}}>
              {' '}
              {guarantor?.createdAt?.substr(0, 10)}
            </Text>
            <Text style={{fontWeight: '400'}}> at</Text>
            <Text style={{fontWeight: '600'}}>
              {' '}
              {guarantor?.createdAt?.substr(11, 5)}
            </Text>
          </View>
        </View>
        <View>
          <View style={{marginTop: 40}}>
            <Text style={styles.infotext}>Title</Text>
            <Text style={styles.values}>{guarantor?.title}</Text>
          </View>
          <View style={styles.demark} />
          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>First name</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>{guarantor?.firstName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />
          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Last name</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>{guarantor?.lastName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />
          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Email</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>{guarantor?.email}</Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Phone Number</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>{guarantor?.phoneNumber}</Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Address</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.address === undefined
                    ? 'N/A'
                    : guarantor?.address}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>City</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.city === undefined ? 'N/A' : guarantor?.city}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>State</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.state === undefined ? 'N/A' : guarantor?.state}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Country</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.country === undefined
                    ? 'N/A'
                    : guarantor?.country}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Occupation</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.occupation === undefined
                    ? 'N/A'
                    : guarantor?.occupation}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          <View style={{marginTop: 15}}>
            <Text style={styles.infotext}>Role in company</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.values}>
                  {guarantor?.roleInCompany === undefined
                    ? 'N/A'
                    : guarantor?.roleInCompany}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.demark} />

          {guarantor?.address === undefined && (
            <View style={{marginTop: 30, marginBottom: 50, marginRight: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: '#D9DBE9',
                      borderRadius: 5,
                      marginRight: 8,
                      padding: 2,
                    }}>
                    <MaterialCommunityIcons
                      name="alert-octagon"
                      size={24}
                      color="#ED2E7E"
                    />
                  </View>
                </TouchableOpacity>
                <View>
                  <Text style={styles.report}>Action</Text>
                  <Text style={styles.reportdesc}>
                    Kindly notify your guarantor to check their mail and
                    complete their verification process.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuarantorDetails;

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
    padding: 20,
    borderRadius: 12,
    borderColor: '#D9DBE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 21,
    color: '#14142B',
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
