import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Skeleton} from '@rneui/base';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {getGuarantors} from '../../stores/GuarantorStore';
import {getLoanUserDetails} from '../../stores/LoanStore';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Guarantor = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [loanUserdetails, setLoanUserdetails] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'Guarantor') {
      const unsubscribe = navigation.addListener('focus', async () => {
        getGuarantorsData();
        getLoanuserData();
      });
      return unsubscribe;
    }
  }, [navigation]);

  const getGuarantorsData = async () => {
    setIsLoading(true);
    const res = await getGuarantors();
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      setGuarantors(res?.data);
    }
    setIsLoading(false);
  };

  const getLoanuserData = async () => {
    setIsLoading(true);
    const res = await getLoanUserDetails();
    if (res.error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        text1: res.title,
        text2: res.message,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } else {
      setLoanUserdetails(res?.data);
    }
    setIsLoading(false);
  };

  const loadingList = ['string', 'string', 'string', 'string'];

  return (
    <>
      {isLoading ? (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top !== 0 ? insets.top : 'auto',
            paddingBottom: insets.bottom !== 0 ? insets.bottom : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left : 'auto',
            paddingRight: insets.right !== 0 ? insets.right : 'auto',
          }}>
          <View style={styles.innerContainer}>
            <View style={{flexDirection: 'row', width: '45%'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 16}}>
                  <Skeleton animation="wave" width={70} height={20} />
                </View>

                <View>
                  <Skeleton animation="wave" width={70} height={20} />
                </View>
              </View>
            </View>
            <View style={styles.getLoanLoader}>
              <Skeleton animation="wave" width={80} height={25} />
            </View>
          </View>

          <View style={{paddingHorizontal: 20}}>
            <Skeleton animation="wave" width={250} height={50} />
            <View>
              <View>
                <View style={styles.display}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    <Skeleton animation="wave" width={80} height={20} />

                    {loadingList.map((guarator, index) => (
                      <View key={index}>
                        <View style={{}}>
                          <View style={styles.demark} />
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#D9DBE9',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginRight: 10,
                              }}>
                              <Skeleton
                                animation="wave"
                                width={30}
                                height={30}
                              />
                            </View>
                            <View style={{justifyContent: 'space-between'}}>
                              <Text style={{marginBottom: 5}}>
                                <Skeleton
                                  animation="wave"
                                  width={100}
                                  height={20}
                                />
                              </Text>
                              <Skeleton
                                animation="wave"
                                width={70}
                                height={20}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
            paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
            paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
            paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
          }}>
          <View style={styles.innerContainer}>
            <View style={{flexDirection: 'row', width: '45%'}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoanHome')}>
                  <View style={[styles.tobTab, {marginRight: 16}]}>
                    <Text style={styles.tabText}>Loans</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Guarantor')}>
                  <View style={styles.tobTab}>
                    <Text style={[styles.tabText, {color: '#054B99'}]}>
                      Guarantor
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  `${
                    loanUserdetails?.loanDocumentDetails
                      ?.validIdentification === undefined
                      ? 'OnboardingHome'
                      : 'GetLoan'
                  }`,
                )
              }>
              <View style={styles.getLoan}>
                <Text style={styles.getText}>Get Loan</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{paddingHorizontal: 20}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddGuarantors')}>
              <View style={styles.addButton}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.tresuser}>
                    <Image
                      source={require('../../../assets//images/3User.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.addText}>Add Guarantor</Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Text style={[styles.addDets, {marginRight: 30}]}>
                        Add guarantor to be eligible to take loan
                      </Text>
                      <AntDesign name="right" size={15} color="#14142B" />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <View>
                {guarantors.length > 0 ? (
                  <View style={styles.display}>
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}>
                      <Text style={styles.myGuarantors}>My Guarantors</Text>
                      {guarantors.map((guarator, index) => (
                        <View key={index}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('GuarantorDetails', {
                                paramKey: guarator._id,
                              })
                            }>
                            <View style={{}}>
                              <View style={styles.demark} />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: '#D9DBE9',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    marginRight: 10,
                                  }}>
                                  <Image
                                    source={require('../../../assets/images/guarantorProfile.png')}
                                  />
                                </View>
                                <View style={{justifyContent: 'space-between'}}>
                                  <Text style={styles.title}>
                                    {guarator?.title}{' '}
                                    {guarator?.firstName +
                                      ' ' +
                                      guarator?.lastName}
                                  </Text>
                                  <Text style={styles.price}>Guarantor</Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 20,
                      height: '80%',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 30,
                      }}>
                      <Image
                        source={require('../../../assets/images/Group.png')}
                      />
                      <Text style={styles.noTrans}>
                        Add a guarantor to get your loan!
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default Guarantor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  innerContainer: {
    marginHorizontal: 20,
  },
  tobTab: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tabText: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  getLoan: {
    backgroundColor: '#054B99',
    borderRadius: 12,
    width: '30%',
    left: '68%',
    bottom: 32,
    height: 35,
    justifyContent: 'center',
    //  paddingHorizontal:12,
  },
  getLoanLoader: {
    left: '78%',
    bottom: 28,
    height: 35,
    justifyContent: 'center',
  },
  getText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Montserat',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#EFF0F6',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9DBE9',
  },
  tresuser: {
    backgroundColor: '#D9DBE9',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderColor: '#D9DBE9',
    borderRadius: 10,
    marginRight: 9,
  },
  addText: {
    fontFamily: 'Montserat',
    fontSize: 14,
    fontWeight: '800',
    color: '#14142B',
  },
  addDets: {
    fontFamily: 'Montserat',
    fontSize: 10,
    color: '#4E4B66',
  },
  display: {
    marginTop: 20,
    padding: 10,
    paddingBottom: 500,
  },
  title: {
    fontFamily: 'Montserat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontFamily: 'Montserat',
    fontSize: 12,

    lineHeight: 24,
    color: '#4E4B66',
  },
  noTrans: {
    fontFamily: 'Montserat',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
    marginBottom: 10,
  },
  myGuarantors: {
    fontFamily: 'Montserat',
    color: '#054B99',
    fontSize: 16,
    fontWeight: '700',
  },
});
