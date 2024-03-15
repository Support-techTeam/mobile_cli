import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Screens
import Verification from '../screens/Authentications/Verification';
import PersonalDetails from '../screens/ProfileOnboardings/PersonalDetails';
import Splashscreen from './Splashscreen';
import BottomTabs from './bottomTabs';
import TransactionScreen from '../screens/HomeScreens/TransactionScreen';
import TransactionHistory from '../screens/HomeScreens/TransactionHistory';
import BankDeets from '../screens/TransferScreens/BankDeets';
import Summary from '../screens/TransferScreens/Summary';
import Pin from '../screens/TransferScreens/Pin';
import Success from '../screens/TransferScreens/Success';
import LoanTransactions from '../screens/LoanScreens/LoanTransaction';
import GuarantorDetails from '../screens/LoanScreens/GuarantorDetails';
import {AddGuarantors, GetLoan} from '../screens/LoanScreens';
import {
  BankDetails,
  BusinessDetails,
  NextOfKin,
  OnboardingHome,
  ArmDetails,
} from '../screens/ProfileOnboardings';
import UpdatePersonalDetails from '../screens/ProfileOnboardings/UpdatePersonalDetails';
import MyAccount from '../screens/MyAccountsScreens/MyAccount';
import {
  BankStatement,
  CAC,
  CompanySeals,
  Others,
  Passport,
  Signature,
  ValidIdentity,
  ProofOfAddress,
  IdentityCard,
  PersonalPhoto,
} from '../screens/ProfileOnboardings/AddDocuments';
import FinalSubmit from '../screens/ProfileOnboardings/AddDocuments/FinalSubmit';
import Securindex from '../screens/SecurityScreens/Securindex';
import TransPin from '../screens/SecurityScreens/TransPin';
import {Paybills} from '../screens/HomeScreens';
import BillPin from '../screens/paybills/billPin';
import AirtimeConfirm from '../screens/paybills/AirtimeConfirm';
import StatusFailed from '../screens/paybills/StatusFailed';
import StatusPage from '../screens/paybills/StausPage';
import {
  InvestmentOption,
  InvestmentSummary,
  InvestmentTransaction,
  TransactionSummary,
  InvestmentDetails,
  InvestmentTopup,
  InvestmentRedemption,
} from '../screens/InvestScreens';
import SupportScreen from '../screens/MoreScreens/SupportScreen';
import NotificationsScreen from '../screens/MoreScreens/NotificationsScreen';
//Pending

// import BeneficiaryList from '../screens/TransferScreens/BeneficiaryList';
import auth from '@react-native-firebase/auth';
// import {auth} from '../util/firebase/firebaseConfig';
import {getProfileDetails} from '../stores/ProfileStore';
import {setProfile} from '../util/redux/userProfile/user.profile.slice';
import Step3 from '../screens/ProfileOnboardings/StepForm/Step3';
import Step2 from '../screens/ProfileOnboardings/StepForm/Step2';
import Step1 from '../screens/ProfileOnboardings/StepForm/Step1';
import ResetPassword from '../screens/Authentications/ResetPassword';
import WalletIndex from '../screens/WalletScreens/WalletIndex';
import Overview from '../screens/paybills/Overview';

const Stack = createNativeStackNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const AppStack = () => {
  const dispatch = useDispatch();
  const isVerified = auth().currentUser?.emailVerified;
  const userProfileData = useSelector(state => state.userProfile.profile);
  const [timeOut, setTimeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // fetch profile
  useEffect(() => {
    if (auth().currentUser !== null) {
      const fetchState = async () => {
        try {
          const res = await getProfileDetails();
          if (res?.data !== undefined) {
            if (res?.error) {
            } else {
              dispatch(setProfile(res?.data));
            }
          }
        } catch (error) {}
      };

      fetchState();
      return () => {
        fetchState();
      };
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTimeOut(true);
    }, 5000);
  });

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return isVerified === undefined && !timeOut ? (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Splashscreen"
        component={Splashscreen}
        options={{
          title: 'Splashscreen',
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isLoading && (
        <Stack.Screen
          name="Loading"
          component={Splashscreen}
          options={{headerShown: false}}
        />
      )}
      {auth().currentUser &&
      isVerified === false &&
      userProfileData?.profileProgress == null ? (
        <>
          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{
              title: 'Verification',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{
              title: 'BottomTabs',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{
              title: 'BottomTabs',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen name="Transaction" component={TransactionScreen} />
          <Stack.Screen
            name="TransactionHistory"
            component={TransactionHistory}
          />
          <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
          <Stack.Screen name="Step1" component={Step1} />
          <Stack.Screen name="Step2" component={Step2} />
          <Stack.Screen name="Step3" component={Step3} />
          {/* Transfer Screens */}
          <Stack.Screen name="Transfer" component={BankDeets} />
          <Stack.Screen name="Summary" component={Summary} />
          <Stack.Screen name="Pin" component={Pin} />
          <Stack.Screen name="Success" component={Success} />
          {/* Loan Screens */}
          <Stack.Screen name="LoanTransaction" component={LoanTransactions} />
          <Stack.Screen name="GuarantorDetails" component={GuarantorDetails} />
          <Stack.Screen name="AddGuarantors" component={AddGuarantors} />
          <Stack.Screen name="GetLoan" component={GetLoan} />
          {/* Profile Screens */}
          <Stack.Screen name="OnboardingHome" component={OnboardingHome} />
          <Stack.Screen
            name="UpdatePersonalDetails"
            component={UpdatePersonalDetails}
          />
          <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
          <Stack.Screen name="NextOfKin" component={NextOfKin} />
          <Stack.Screen name="BankDetails" component={BankDetails} />
          <Stack.Screen name="ArmDetails" component={ArmDetails} />
          {/* Settings */}
          <Stack.Screen name="MyAccount" component={MyAccount} />
          {/* Wallet Options */}
          <Stack.Screen name="WalletIndex" component={WalletIndex} />
          {/* Security */}
          <Stack.Screen name="Security" component={Securindex} />
          <Stack.Screen name="SetPin" component={TransPin} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          {/* Documents */}
          <Stack.Screen name="ValidIdentity" component={ValidIdentity} />
          <Stack.Screen name="ProofOfAddress" component={ProofOfAddress} />
          <Stack.Screen name="BankStatement" component={BankStatement} />
          <Stack.Screen name="CompanySeals" component={CompanySeals} />
          <Stack.Screen name="CAC" component={CAC} />
          <Stack.Screen name="Passport" component={Passport} />
          <Stack.Screen name="Signature" component={Signature} />
          <Stack.Screen name="PersonalPhoto" component={PersonalPhoto} />
          <Stack.Screen name="IdentityCard" component={IdentityCard} />
          <Stack.Screen name="SubmitDocs" component={FinalSubmit} />
          <Stack.Screen name="Others" component={Others} />
          {/* Bill payment */}
          <Stack.Screen name="Paybills" component={Paybills} />
          <Stack.Screen name="Overview" component={Overview} />
          <Stack.Screen name="AirtimeConfirm" component={AirtimeConfirm} />
          <Stack.Screen name="BillPin" component={BillPin} />
          <Stack.Screen name="StatusFailed" component={StatusFailed} />
          <Stack.Screen name="StatusSuc" component={StatusPage} />
          {/* Investment */}
          <Stack.Screen name="InvestmentOption" component={InvestmentOption} />
          <Stack.Screen
            name="InvestmentSummary"
            component={InvestmentSummary}
          />
          <Stack.Screen
            name="InvestmentTransaction"
            component={InvestmentTransaction}
          />
          <Stack.Screen
            name="TransactionSummary"
            component={TransactionSummary}
          />
          <Stack.Screen
            name="InvestmentDetails"
            component={InvestmentDetails}
          />
          <Stack.Screen name="InvestmentTopup" component={InvestmentTopup} />
          <Stack.Screen
            name="InvestmentRedemption"
            component={InvestmentRedemption}
          />
          <Stack.Screen name="SupportScreen" component={SupportScreen} />
          <Stack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
