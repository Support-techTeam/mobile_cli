import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { toJS } from 'mobx';

import CustomInput from '../../component/custominput/CustomInput';
import Buttons from '../../component/buttons/Buttons';
import { StoreContext } from '../../config/mobX stores/RootStore';

const BusinessDetails = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const date = new Date(2000, 0, 1);
  const addressDate = new Date(2000, 0, 1);

  const { loansStore } = useContext(StoreContext);
  const { success, sending, loanUserdetails, loading } = loansStore;

  useEffect(() => {
    loansStore.getLoanUserDetails();
  }, [loansStore]);

  const orgDetails = loanUserdetails?.organizationDetails;

  const [businessDetails, setBusinessDetails] = useState({
    businessType: '',
    businessName: '',
    positionInOrg: '',
    shareInOrg: '',
    rcNum: '',
    establishmentDate: '',
    businessAddress: '',
    country: '',
    state: '',
    city: '',
    ownedOrRented: '',
    NoOfOutlets: 0,
    totalEmployees: 0,
    salesMethod: '',
    industry: '',
    monthlySales: '',
    monthlyExpenses: '',
    businessDuration: '',
    womenLed: false,
    shariaCom: false,
    tin: '',
    registered: false,
    MAMERT: '',
    whenDidYouMoveToThisBusinessLocation: '',
  });

  useEffect(() => {
    setBusinessDetails({
      businessType:
        orgDetails && orgDetails?.businessType === undefined ? '' : orgDetails?.businessType,
      businessName:
        orgDetails && orgDetails?.businessName === undefined ? '' : orgDetails?.businessName,
      positionInOrg:
        orgDetails && orgDetails?.positionInOrg === undefined ? '' : orgDetails?.positionInOrg,
      shareInOrg: orgDetails && orgDetails?.shareInOrg === undefined ? '' : orgDetails?.shareInOrg,
      rcNum: orgDetails && orgDetails?.rcNum === undefined ? '' : orgDetails?.rcNum,
      establishmentDate:
        orgDetails && orgDetails?.establishmentDate === undefined
          ? ''
          : orgDetails?.establishmentDate?.substr(0, 10),
      businessAddress:
        orgDetails && orgDetails?.businessAddress === undefined ? '' : orgDetails?.businessAddress,
      country: orgDetails && orgDetails?.country === undefined ? '' : orgDetails?.country,
      state: orgDetails && orgDetails?.state === undefined ? '' : orgDetails?.state,
      city: orgDetails && orgDetails?.city === undefined ? '' : orgDetails?.city,
      ownedOrRented:
        orgDetails && orgDetails?.ownedOrRented === undefined ? '' : orgDetails?.ownedOrRented,
      NoOfOutlets:
        orgDetails && orgDetails?.NoOfOutlets === undefined ? 0 : orgDetails?.NoOfOutlets,
      totalEmployees:
        orgDetails && orgDetails?.totalEmployees === undefined ? 0 : orgDetails?.totalEmployees,
      salesMethod:
        orgDetails && orgDetails?.salesMethod === undefined ? '' : orgDetails?.salesMethod,
      industry: orgDetails && orgDetails?.industry === undefined ? '' : orgDetails?.industry,
      monthlySales:
        orgDetails && orgDetails?.monthlySales === undefined ? '' : orgDetails?.monthlySales,
      monthlyExpenses:
        orgDetails && orgDetails?.monthlyExpenses === undefined ? '' : orgDetails?.monthlyExpenses,
      businessDuration:
        orgDetails && orgDetails?.businessDuration === undefined
          ? ''
          : orgDetails?.businessDuration,
      womenLed: orgDetails && orgDetails?.womenLed === undefined ? false : orgDetails?.womenLed,
      shariaCom: orgDetails && orgDetails?.shariaCom === undefined ? false : orgDetails?.shariaCom,
      tin: orgDetails && orgDetails?.tin === undefined ? '' : orgDetails?.tin,
      registered:
        orgDetails && orgDetails?.registered === undefined ? false : orgDetails?.registered,
      MAMERT: orgDetails && orgDetails?.MAMERT === undefined ? '' : orgDetails?.MAMERT,
      whenDidYouMoveToThisBusinessLocation:
        orgDetails && orgDetails?.whenDidYouMoveToThisBusinessLocation === undefined
          ? ''
          : orgDetails?.whenDidYouMoveToThisBusinessLocation?.substr(0, 10),
    });
  }, [orgDetails]);

  const disableit =
    !businessDetails.businessType ||
    !businessDetails.businessName ||
    !businessDetails.businessAddress ||
    // !businessDetails.city ||
    !businessDetails.state ||
    !businessDetails.positionInOrg ||
    !businessDetails.totalEmployees ||
    !businessDetails.industry ||
    !businessDetails.monthlyExpenses ||
    !businessDetails.monthlySales;

  const [state, setState] = useState([]);
  const [cityByState, setCitybyState] = useState([]);
  const [city, setCity] = useState([]);

  useEffect(() => {
    setState(toJS(loansStore.state));
    setCity(toJS(loansStore.city));
  }, [loansStore.state, loansStore.city]);

  useEffect(() => {
    if (businessDetails.state !== '') {
      setCitybyState(state?.filter((statee) => statee === businessDetails.state));
    }
  }, [businessDetails.state, state]);

  const stateCity = cityByState[0];

  useEffect(() => {
    loansStore.getState();
    loansStore.getCity(stateCity);
  }, [loansStore, stateCity]);

  const showDatePicker = () => {
    setShow(true);
  };

  const showAddressDatePicker = () => {
    setShowDate(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const hideAddressDatePicker = () => {
    setShowDate(false);
  };

  const handleConfirm = (selectedDate) => {
    const currentDate = selectedDate || date;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setBusinessDetails({ ...businessDetails, establishmentDate: formattedDate });
    setShow(false);
  };

  const handleConfirmAddressDate = (selectedDate) => {
    const currentDate = selectedDate || addressDate;
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    setBusinessDetails({ ...businessDetails, whenDidYouMoveToThisBusinessLocation: formattedDate });
    setShowDate(false);
  };

  const handleCreateBusinessDetails = () => {
    loansStore.createBusinessDetails(businessDetails);
  };

  const handleUpdateBusinessDetails = () => {
    loansStore.updateBusinessDetails(businessDetails);
  };

  const prevRoutes = route?.params?.paramKey;

  useEffect(() => {
    if (success === 'business successful') {
      if (prevRoutes !== 'myAccount') {
        navigation.navigate('NextOfKin');
      } else {
        navigation.navigate('MyAccount');
        loansStore.getLoanUserDetails();
      }
    }
  }, [loansStore, navigation, prevRoutes, success]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top / 2 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}
    >
      {sending && (
        <Spinner
          textContent={'Please wait...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      {loading && (
        <Spinner
          textContent={'Loading...'}
          textStyle={{ color: 'white' }}
          visible={true}
          overlayColor="rgba(16, 17, 16, 0.70)"
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}
          >
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View>
          <View>
            <Text style={styles.TextHead}>BUSINESS DETAILS</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[styles.innercontainer]}
      >
        <View style={styles.form}>
          <Text style={styles.header}>
            Trade Lenda requires this information to give you a better experience
          </Text>
        </View>

        <View>
          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Type of business
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.businessType}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, businessType: text })
                }
              >
                <Picker.Item label="Select type" value="" />
                <Picker.Item label="Sole Proprietorship" value="Sole Proprietorship" />
                <Picker.Item label="Private Limited Company" value="Private Limited Company" />
                <Picker.Item label="Public Limited Company" value="Public Limited Company" />
                <Picker.Item
                  label="Public Company Limited by Guarantee"
                  value="Public Company Limited by Guarantee"
                />
                <Picker.Item label="Private Unlimited Company" value="Private Unlimited Company" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Name of business"
            defaultValue={businessDetails?.businessName}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, businessName: text })}
            isNeeded={true}
          />

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Is your business registered?
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.registered}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, registered: text })
                }
              >
                <Picker.Item label="Select status" value={false} />
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Position in the company"
            defaultValue={businessDetails?.positionInOrg}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, positionInOrg: text })}
            isNeeded={true}
          />
          <CustomInput
            label="Shares in the company"
            defaultValue={businessDetails?.shareInOrg}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, shareInOrg: text })}
          />

          <Pressable onPress={showDatePicker}>
            <CustomInput
              label="Date of establishment"
              placeholder="2000 - 01 - 01"
              defaultValue={
                businessDetails.establishmentDate
                  ? businessDetails.establishmentDate?.substr(0, 10)
                  : ''
              }
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
              onChangeValue={(text) =>
                setBusinessDetails({ ...businessDetails, establishmentDate: text })
              }
              isNeeded={true}
            />
          </Pressable>

          <DateTimePickerModal
            isVisible={show}
            testID="dateTimePicker"
            defaultValue={businessDetails?.establishmentDate}
            mode="date"
            is24Hour={true}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            textColor="#054B99"
          />

          <CustomInput
            label="RC/BN Number"
            defaultValue={businessDetails?.rcNum}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, rcNum: text })}
            keyboardType="numeric"
          />

          <CustomInput
            label="Business address"
            defaultValue={businessDetails?.businessAddress}
            onChangeText={(text) =>
              setBusinessDetails({ ...businessDetails, businessAddress: text })
            }
            isNeeded={true}
          />

          <Pressable onPress={showAddressDatePicker}>
            <CustomInput
              label="When did you move to this address?"
              placeholder="2000 - 01 - 01"
              defaultValue={
                businessDetails.whenDidYouMoveToThisBusinessLocation
                  ? businessDetails.whenDidYouMoveToThisBusinessLocation?.substr(0, 10)
                  : ''
              }
              isDate={true}
              editable={false}
              showDatePicker={showAddressDatePicker}
              onChangeValue={(text) =>
                setBusinessDetails({
                  ...businessDetails,
                  whenDidYouMoveToThisBusinessLocation: text,
                })
              }
              isNeeded={true}
            />
          </Pressable>

          <DateTimePickerModal
            isVisible={showDate}
            testID="dateTimePicker"
            defaultValue={businessDetails?.whenDidYouMoveToThisBusinessLocation}
            mode="date"
            is24Hour={true}
            onConfirm={handleConfirmAddressDate}
            onCancel={hideAddressDatePicker}
            textColor="#054B99"
          />

          <CustomInput
            label="Country"
            defaultValue={businessDetails?.country}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, country: text })}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginVertical: 10, paddingRight: 5, width: '50%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    paddingBottom: 4,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 24,
                    color: '#14142B',
                    fontFamily: 'Montserat',
                  }}
                >
                  State
                </Text>
                <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
              </View>

              <View style={styles.pick}>
                <Picker
                  selectedValue={businessDetails?.state}
                  onValueChange={(text) => setBusinessDetails({ ...businessDetails, state: text })}
                >
                  <Picker.Item label="Select state" value="" />

                  {state?.map((stateee, i) => (
                    <Picker.Item label={stateee} value={stateee} key={i} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{ marginVertical: 10, paddingLeft: 5, width: '50%' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                LGA
              </Text>
              <View style={styles.pick}>
                {city && (
                  <Picker
                    selectedValue={businessDetails?.city}
                    onValueChange={(text) => setBusinessDetails({ ...businessDetails, city: text })}
                  >
                    {city.map((lg, i) => (
                      <Picker.Item label={lg} value={lg} key={i} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Is your business location owned or rented
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.ownedOrRented}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, ownedOrRented: text })
                }
              >
                <Picker.Item label="Select option" value="" />
                <Picker.Item label="Owned" value="Owned" />
                <Picker.Item label="Rented" value="Rented" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Number of employees"
            defaultValue={businessDetails?.totalEmployees?.toString()}
            onChangeText={(text) =>
              setBusinessDetails({ ...businessDetails, totalEmployees: parseInt(text, 10) })
            }
            keyboardType="numeric"
            isNeeded={true}
          />

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Is your business women led?
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.womenLed}
                onValueChange={(text) => setBusinessDetails({ ...businessDetails, womenLed: text })}
              >
                <Picker.Item label="Select option" value={false} />
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              Is your business sharia compliant?
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.shariaCom}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, shariaCom: text })
                }
              >
                <Picker.Item label="Select option" value={false} />
                <Picker.Item label="Yes" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="Number of outlets"
            defaultValue={businessDetails?.NoOfOutlets?.toString()}
            onChangeText={(text) =>
              setBusinessDetails({ ...businessDetails, NoOfOutlets: parseInt(text, 10) })
            }
            keyboardType="numeric"
          />

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              How do you sell
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.salesMethod}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, salesMethod: text })
                }
              >
                <Picker.Item label="Select option" value="" />
                <Picker.Item
                  label="I sell online (Jumia, Konga etc)"
                  value="I sell online (Jumia, Konga etc)"
                />
                <Picker.Item label="I distribute FMCG Goods" value="I distribute FMCG Goods" />
                <Picker.Item
                  label="I buy and sell Agro-Commodities"
                  value="I buy and sell Agro-Commodities"
                />
                <Picker.Item label="I have a physical shop" value="I have a physical shop" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Industry
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.industry}
                onValueChange={(text) => setBusinessDetails({ ...businessDetails, industry: text })}
              >
                <Picker.Item label="Select Industry" value="" />
                <Picker.Item label="Agriculture" value="Agriculture" />
                <Picker.Item label="Autos" value="Autos" />
                <Picker.Item label="Agency Banking" value="Agency Banking" />
                <Picker.Item label="Beauty products" value="Beauty products" />
                <Picker.Item label="Consulting Services" value="Consulting Services" />
                <Picker.Item label="Education" value="Education" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="Fashion" value="Fashion" />
                <Picker.Item label="Food and Beverages" value="Food and Beverages" />
                <Picker.Item label="Furniture and Fittings" value="Furniture and Fittings" />
                <Picker.Item
                  label="Health and Pharma Products"
                  value="Health and Pharma Products"
                />
                <Picker.Item label="Home Services" value="Home Services" />
                <Picker.Item label="Industrial goods" value="Industrial goods" />
                <Picker.Item label="Media and Entertainment" value="Media and Entertainment" />
                <Picker.Item label="Office supplies" value="Office supplies" />
                <Picker.Item label="Packaging and Plastics" value="Packaging and Plastics" />
                <Picker.Item label="Personal Care" value="Personal Care" />
                <Picker.Item label="Professional Services" value="Professional Services" />
                <Picker.Item label="Technology Services" value="Technology Services" />
                <Picker.Item label="Utility Services" value="Utility Services" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Average monthly sales
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>

            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.monthlySales}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, monthlySales: text })
                }
              >
                <Picker.Item label="Select option" value="" />
                <Picker.Item label="Less than 10 sales" value="Less than 10 sales" />
                <Picker.Item label="11 to 50 sales" value="11 to 50 sales" />
                <Picker.Item label="51 to 100 sales" value="51 to 100 sales" />
                <Picker.Item label="100 to 500 sales" value="100 to 500 sales" />
                <Picker.Item label="Above 500 sales" value="Above 500 sales" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  paddingBottom: 4,
                  fontWeight: '400',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#14142B',
                  fontFamily: 'Montserat',
                }}
              >
                Average monthly expenses
              </Text>
              <Text style={{ color: 'red', marginRight: 10 }}>*</Text>
            </View>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.monthlyExpenses}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, monthlyExpenses: text })
                }
              >
                <Picker.Item label="Select option" value="" />
                <Picker.Item label="Less than ₦10,000" value="Less than ₦10,000" />
                <Picker.Item label="₦10,000 to ₦100,000" value="₦10,000 to ₦100,000" />
                <Picker.Item label="₦100,000 to ₦500,000" value="₦100,000 to ₦500,000" />
                <Picker.Item label="₦500,000 to ₦1,000,000" value="₦500,000 to ₦1,000,000" />
                <Picker.Item label="Above ₦1,000,000" value="Above ₦1,000,000" />
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                paddingBottom: 4,
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: '#14142B',
                fontFamily: 'Montserat',
              }}
            >
              How long have you been in business?
            </Text>
            <View style={styles.pick}>
              <Picker
                selectedValue={businessDetails?.businessDuration}
                onValueChange={(text) =>
                  setBusinessDetails({ ...businessDetails, businessDuration: text })
                }
              >
                <Picker.Item label="Select option" value="" />
                <Picker.Item label="0-1 years" value="0-1 years" />
                <Picker.Item label="1-3 years" value="1-3 years" />
                <Picker.Item label="3-5 years" value="3-5 years" />
                <Picker.Item label="5-10 years" value="5-10 years" />
                <Picker.Item label="10+ years" value="10+ years" />
              </Picker>
            </View>
          </View>

          <CustomInput
            label="MAMERT"
            defaultValue={businessDetails?.MAMERT}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, MAMERT: text })}
            keyboardType="numeric"
          />
          <CustomInput
            label="TIN(Tax Identification Number"
            defaultValue={businessDetails?.tin}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, tin: text })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={
              orgDetails?.businessName === undefined
                ? handleCreateBusinessDetails
                : handleUpdateBusinessDetails
            }
            disabled={disableit}
          >
            <View style={{ marginBottom: 40, marginTop: 20 }}>
              <Buttons label={'Save & Continue'} disabled={disableit} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(BusinessDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innercontainer: {
    paddingHorizontal: 16,
    // opacity:bs.current.snapTo(1)?0.1:1
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  HeadView: {
    alignItems: 'center',
    marginTop: 34,
    // backgroundColor:'blue'
  },
  TopView: {
    // flexDirection: "row",
    justifyContent: 'space-between',
    // backgroundColor: "red",
  },
  TextHead: {
    fontFamily: 'Montserat',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  extraText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    color: '#14142B',
  },
  pick: {
    marginBottom: 10,
    backgroundColor: '#fffff',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#CED4DA',
    // padding:10,
    justifyContent: 'center',
  },
  checked: {
    alignItems: 'center',
    paddingVertical: 39,
    marginTops: 30,
    borderRadius: 50,
    // borderWidth:.5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  checkedText: {
    color: '#44AB3B',
    fontFamily: 'Montserat',
    fontSize: 24,
    lineHeight: 36,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  extraView: {
    alignItems: 'center',
    marginTop: 30,
  },
  extra: {
    fontFamily: 'Montserat',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
    fontWeight: '500',
  },
  continue: {
    marginVertical: 30,
    backgroundColor: '#054B99',
    width: '50%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
