import {
  StyleSheet,
  ScrollView,
  NativeModules,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useClipboard} from '@react-native-clipboard/clipboard';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../../constants/colors';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  setAccount,
  setWallet,
} from '../../util/redux/userProfile/user.profile.slice';
import PersonalDetails from '../ProfileOnboardings/PersonalDetails';
import Splashscreen from '../../navigation/Splashscreen';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {getLoanUserDetails, getLoansAmount} from '../../stores/LoanStore';
import {checkPin} from '../../stores/ProfileStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {getGuarantors} from '../../stores/GuarantorStore';
import {
  getAllArmInvestment,
  getAllLendaInvestment,
  getArmTransactionsStatement,
  getLendaTransactionsStatement,
  getSingleArmInvestment,
} from '../../stores/InvestStore';
import {
  getTransactionsStatement,
  getAccountWallet,
  getAccountTransactions,
} from '../../stores/WalletStore';
import {IntroSection} from '../../component/homescreen/Intro-Section';
import {SlideSection} from '../../component/homescreen/Slide-Section';
import {ItemsSection} from '../../component/homescreen/Items-Section';
import {SingleTransactionSection} from '../../component/homescreen/Single-Transaction-Section';
import {LendaStatementModal} from '../../component/modals/LendaStatementModal';
import {ArmStatementModal} from '../../component/modals/ArmStatementModal';
import {WalletStatementModal} from '../../component/modals/WalletStatementModal';
import {UpdateProfileBtn} from '../../component/homescreen/Update-Profile-Btn';
import {FundWalletSection} from '../../component/homescreen/FundWallet-Section';
import {MakeTransferSection} from '../../component/homescreen/MakeTransferSection';

const Homescreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isMakeTransferVisible, setIsMakeTransferVisible] = useState(false);
  const [isFundWalletVisible, setIsFundWalletVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [isLoadingLoanData, setIsLoadingLoanData] = useState(false);
  const [isLoadingLenda, setIsLoadingLenda] = useState(false);
  const [isLoadingArm, setIsLoadingArm] = useState(false);
  const [isLoadingLoanAmount, setIsLoadingLoanAmount] = useState(false);
  const [isLoadingPullDown, setIsLoadingPullDown] = useState(false);
  //Redux Calls
  const userProfileData = useSelector(state => state.userProfile.profile);
  const userWalletData = useSelector(state => state.userProfile.wallet);
  const [userTransactionsData, setUserTransactionsData] = useState([]);
  const [allUserTransactionsData, setAllUserTransactionsData] = useState([]);
  const [userTransactionsPages, setUserTransactionsPages] = useState([]);
  const [userTransactionsTotal, setUserTransactionsTotal] = useState([]);
  const [userLoanAmount, setUserLoanAmount] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setString] = useClipboard();
  const [timeOut, setTimeOut] = useState(false);
  const route = useRoute();
  const [loanUserDetails, setLoanUserDetails] = useState(undefined);
  const [userPin, setUserPin] = useState(true);
  const [guarantor, setGuarantor] = useState([]);
  const dispatch = useDispatch();
  const [allArmData, setAllArmData] = useState([]);
  const [allILendaData, setAllLendaData] = useState([]);
  const [portfolioDetail, setPortfolioDetail] = useState(0);
  // Modal Codes
  // Wallet
  const [showWalletStatementModal, setShowWalletStatementModal] =
    useState(false);
  const [showStartWallet, setShowStartWallet] = useState(false);
  const [showEndWallet, setShowEndWallet] = useState(false);
  const [walletStatementDetails, setWalletStatementDetails] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  // ARM
  const [showArmStatementModal, setShowArmStatementModal] = useState(false);
  const [showStartArm, setShowStartArm] = useState(false);
  const [showEndArm, setShowEndArm] = useState(false);
  const [armStatementDetails, setArmStatementDetails] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  // Lenda
  const [showLendaStatementModal, setShowLendaStatementModal] = useState(false);
  const [showStartLenda, setShowStartLenda] = useState(false);
  const [showEndLenda, setShowEndLenda] = useState(false);
  const [lendaStatementDetails, setLendaStatementDetails] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [hideBalance, setHideBalance] = useState(true);
  const toggleHideBalance = () => {
    setHideBalance(!hideBalance);
  };

  const toggleMakeTransfer = () => {
    setIsMakeTransferVisible(!isMakeTransferVisible);
  };

  const toggleFundWallet = () => {
    setIsFundWalletVisible(!isFundWalletVisible);
  };

  //total ARM Investment
  let totalArmAmount =
    allArmData &&
    allArmData?.reduce(
      (accumulator, currentValue) =>
        Number(accumulator) + Number(currentValue?.investmentAmount),
      0,
    );

  //total Lenda Investment
  let totalLendaAmount =
    allILendaData &&
    allILendaData
      ?.filter(item => item?.investmentStatus === 'ACTIVE')
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalReturn,
        0,
      );

  useEffect(() => {
    setTimeout(() => {
      setTimeOut(true);
    }, 3000);
  });

  useFocusEffect(
    useCallback(() => {
      unsubGetWallet();
      getGuarantorData();
      getAllLendaInvestments();
      getAllArmInvestments();
      unsubGetAllTransactions();
      unsubGetTransactions();
    }, []),
  );

  useEffect(() => {
    unsubCheckPin();
  }, [userPin]);

  // // Timed useEffect
  useEffect(() => {
    const interval = setInterval(async () => {
      getAccountWallet()
        .then(res => {
          if (res) {
            // Process the data
            if (res?.error == false) {
              dispatch(setWallet(res?.data?.data?.wallet));
              dispatch(setAccount(res?.data?.data?.accountDetails));
            }
          } else {
            // Handle the error case or display a message to the user
          }
        })
        .catch(error => {
          // Handle any unexpected errors
        });
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getAccountTransactions();
      if (res?.error == false) {
        if (
          res?.data?.transactions?.transaction !== undefined &&
          res?.data?.transactions?.transaction !== null
        ) {
          setUserTransactionsData(res?.data?.transactions.transaction);
          setAllUserTransactionsData(res?.data?.transactions.transaction);
        }
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getLoanUserData();
  }, []);

  const unsubGetWallet = async () => {
    setIsLoadingWallet(true);
    getAccountWallet()
      .then(res => {
        if (res) {
          if (!res?.error) {
            dispatch(setWallet(res?.data?.data?.wallet));
            dispatch(setAccount(res?.data?.data?.accountDetails));
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingWallet(false);
      });
  };

  const unsubGetAllTransactions = async () => {
    setIsLoading(true);
    getAccountTransactions(0, 10)
      .then(res => {
        if (res) {
          if (!res?.error) {
            setCurrentPage(0);
            if (
              res?.data?.transactions?.transaction !== undefined &&
              res?.data?.transactions?.transaction !== null
            ) {
              setUserTransactionsData(res?.data?.transactions?.transaction);
              setAllUserTransactionsData(res?.data?.transactions?.transaction);
              setUserTransactionsPages(res?.data?.transactions?.maxPages);
              setUserTransactionsTotal(res?.data?.transactions?.count);
            }
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const unsubGetTransactions = async () => {
    setIsLoadingTransaction(true);

    getAccountTransactions(0, 10)
      .then(res => {
        if (res) {
          if (!res?.error) {
            setCurrentPage(0);
            setUserTransactionsData(res?.data?.transactions?.transaction);
            setUserTransactionsPages(res?.data?.transactions?.maxPages);
            setUserTransactionsTotal(res?.data?.transactions?.count);
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingTransaction(false);
      });
  };

  const unsubGetTransactionsonPullDown = async () => {
    setIsLoadingPullDown(true);
    getAccountTransactions(0, 10)
      .then(res => {
        if (res) {
          if (!res?.error) {
            setCurrentPage(0);
            setUserTransactionsData(res?.data?.transactions?.transaction);
            setUserTransactionsPages(res?.data?.transactions?.maxPages);
            setUserTransactionsTotal(res?.data?.transactions?.count);
          }
        }
      })
      .catch(e => {})
      .finally(() => {});

    getAccountWallet()
      .then(res => {
        if (res) {
          if (!res?.error) {
            dispatch(setWallet(res?.data?.data?.wallet));
            dispatch(setAccount(res?.data?.data?.accountDetails));
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingPullDown(false);
      });
  };

  const unsubGetLoanAmount = async () => {
    setIsLoadingLoanAmount(true);
    getLoansAmount()
      .then(res => {
        if (res) {
          if (!res?.error) {
            setUserLoanAmount(res?.data);
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingLoanAmount(false);
      });
  };

  const unsubCheckPin = async () => {
    checkPin(1, 10)
      .then(res => {
        if (res) {
          if (!res?.error) {
            setUserPin(res?.data?.data?.hasPin);
          }
        }
      })
      .catch(e => {})
      .finally(() => {});
  };

  const getAllLendaInvestments = async () => {
    setIsLoadingLenda(true);
    getAllLendaInvestment()
      .then(res => {
        if (res) {
          if (!res?.error) {
            setAllLendaData(res?.data);
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingLenda(false);
      });
  };
  // get all ARM investments
  const getAllArmInvestments = async () => {
    setIsLoadingArm(true);
    getAllArmInvestment()
      .then(async res => {
        if (res) {
          if (!res?.error) {
            setAllArmData(res?.data?.data);
            getSingleArmInvestment(
              res?.data?.data[0]?.membershipId,
              res?.data?.data[0]?.productCode,
            ).then(res => {
              if (!res?.error) {
                if (res?.data?.length > 0) {
                  setPortfolioDetail(res?.data?.portfolio[0]?.accountBalance);
                }
              }
            });
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingArm(false);
      });
  };

  const getGuarantorData = async () => {
    getGuarantors()
      .then(res => {
        if (res) {
          if (!res?.error) {
            setGuarantor(res?.data);
          }
        }
      })
      .catch(e => {});
  };

  const handleLongPress = async evt => {
    try {
      setString(evt);
      Toast.show({
        type: 'info',
        position: 'top',
        topOffset: 50,
        text1: 'Copy Action',
        text2: 'Account number copied to clipboard',
        visibilityTime: 3000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      // console.error('Error copying to clipboard:', error);
    }
  };

  const getLoanUserData = async () => {
    setIsLoadingLoanData(true);
    getLoanUserDetails()
      .then(res => {
        if (res) {
          if (!res?.error) {
            if (
              res?.data === undefined ||
              res?.data == null ||
              res?.data?.length <= 0
            ) {
              setLoanUserDetails(undefined);
            } else {
              setLoanUserDetails(res?.data);
            }
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        setIsLoadingLoanData(false);
      });
  };

  // Wallet Statement Functions
  const showDatePickerStartWallet = () => {
    setShowStartWallet(true);
  };

  const hideDatePickerStartWallet = () => {
    setShowStartWallet(false);
  };

  const showDatePickerEndWallet = () => {
    setShowEndWallet(true);
  };

  const hideDatePickerEndWallet = () => {
    setShowEndWallet(false);
  };

  const handleWalletStatement = async () => {
    setIsSending(true);
    getTransactionsStatement(
      walletStatementDetails?.startDate,
      walletStatementDetails?.endDate,
    )
      .then(res => {
        if (res) {
          if (!res?.error) {
            Toast.show({
              type: 'success',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.message,
              visibilityTime: 3000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
            setWalletStatementDetails({
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
            });
          } else {
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
          }
        }
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Get Transactions Statement',
          text2: 'Error fetching statement',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsSending(false);
        }, 1000);
      });
  };

  // Arm Statement Functions
  const showDatePickerStartArm = () => {
    setShowStartArm(true);
  };

  const hideDatePickerStartArm = () => {
    setShowStartArm(false);
  };

  const showDatePickerEndArm = () => {
    setShowEndArm(true);
  };

  const hideDatePickerEndArm = () => {
    setShowEndArm(false);
  };

  const handleArmStatement = async () => {
    setIsSending(true);
    getArmTransactionsStatement(
      allArmData[0]?.membershipId,
      armStatementDetails?.startDate,
      armStatementDetails?.endDate,
    )
      .then(res => {
        if (res) {
          if (!res?.error) {
            Toast.show({
              type: 'success',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.message,
              visibilityTime: 3000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
            setArmStatementDetails({
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
            });
          } else {
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
          }
        }
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Get Transactions Statement',
          text2: 'Error fetching statement',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsSending(false);
        }, 1000);
      });
  };

  // Lenda Statement Functions
  const showDatePickerStartLenda = () => {
    setShowStartLenda(true);
  };

  const hideDatePickerStartLenda = () => {
    setShowStartLenda(false);
  };

  const showDatePickerEndLenda = () => {
    setShowEndLenda(true);
  };

  const hideDatePickerEndLenda = () => {
    setShowEndLenda(false);
  };

  const handleLendaStatement = async () => {
    setIsSending(true);
    getLendaTransactionsStatement(
      lendaStatementDetails?.startDate,
      lendaStatementDetails?.endDate,
    )
      .then(res => {
        if (res) {
          if (!res?.error) {
            Toast.show({
              type: 'success',
              position: 'top',
              topOffset: 50,
              text1: res?.title,
              text2: res?.message,
              visibilityTime: 3000,
              autoHide: true,
              onPress: () => Toast.hide(),
            });
            setLendaStatementDetails({
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
            });
          } else {
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
          }
        }
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          position: 'top',
          topOffset: 50,
          text1: 'Get Transactions Statement',
          text2: 'Error fetching statement',
          visibilityTime: 5000,
          autoHide: true,
          onPress: () => Toast.hide(),
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsSending(false);
        }, 1000);
      });
  };

  const buttonItems = [
    {
      buttonText: 'Fund Wallet',
      buttonImage: 'wallet-plus-outline',
      buttonImageColor: COLORS.lendaBlue,
      buttonAction: toggleFundWallet,
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaBlue,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
    {
      buttonText: 'Make Transfer',
      buttonImage: 'bank-transfer',
      buttonImageColor: COLORS.lendaOrange,
      buttonAction: toggleMakeTransfer,
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaOrange,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
    {
      buttonText: 'Bill Payment',
      buttonImage: 'cash-multiple',
      buttonImageColor: COLORS.lendaGreen,
      buttonAction: () => navigation.navigate('Paybills'),
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaGreen,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
    {
      buttonText: 'Save With ARM',
      buttonImage: require('../../../assets/images/arm.png'),
      buttonImageColor: COLORS.highwayRed,
      buttonAction: () => navigation.navigate('Invest'),
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.highwayRed,
      buttonBackground: COLORS.white,
      buttonIcon: false,
    },
    {
      buttonText: 'Earn With Us',
      buttonImage: require('../../../assets/images/lenda.png'),
      buttonImageColor: COLORS.lendaGreen,
      buttonAction: () => navigation.navigate('Invest'),
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaGreen,
      buttonBackground: COLORS.white,
      buttonIcon: false,
    },
    {
      buttonText: 'Get Loan',
      buttonImage: require('../../../assets/images/approvedLoan.png'),
      buttonImageColor: COLORS.lendaBlue,
      buttonAction: () => {
        if (guarantor && guarantor.length <= 0) {
          Toast.show({
            type: 'warning',
            position: 'top',
            topOffset: 50,
            text1: 'Guarantor Data',
            text2: 'Guarantor Data is not available',
            visibilityTime: 2000,
            autoHide: true,
            onPress: () => Toast.hide(),
          });
        }
        navigation.navigate(
          `${
            loanUserDetails === undefined ||
            loanUserDetails?.loanDocumentDetails?.validIdentification ===
              undefined
              ? 'OnboardingHome'
              : guarantor && guarantor.length > 0
              ? 'GetLoan'
              : 'AddGuarantors'
          }`,
        );
      },
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaBlue,
      buttonBackground: COLORS.white,
      buttonIcon: false,
    },
    {
      buttonText: 'ARM eStatement',
      buttonImage: 'file-document-outline',
      buttonImageColor: COLORS.highwayRed,
      buttonAction: () => {
        setShowArmStatementModal(true);
      },
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.highwayRed,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
    {
      buttonText: 'Earn With Us eStatement',
      buttonImage: 'file-document-outline',
      buttonImageColor: COLORS.lendaGreen,
      buttonAction: () => {
        setShowLendaStatementModal(true);
      },
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaGreen,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
    {
      buttonText: 'Wallet eStatement',
      buttonImage: 'file-document-outline',
      buttonImageColor: COLORS.lendaBlue,
      buttonAction: () => {
        setShowWalletStatementModal(true);
      },
      buttonTextColor: COLORS.lendaBlue,
      buttonColor: COLORS.lendaBlue,
      buttonBackground: COLORS.white,
      buttonIcon: true,
    },
  ];

  const renderOverLayComponents = () => {
    return (
      <>
        {/* Fund Wallet Section */}
        <FundWalletSection
          isFundWalletVisible={isFundWalletVisible}
          toggleFundWallet={toggleFundWallet}
          userProfileData={userProfileData}
          userWalletData={userWalletData}
          handleLongPress={handleLongPress}
        />

        {/* Make Transfer Section */}
        <MakeTransferSection
          isMakeTransferVisible={isMakeTransferVisible}
          toggleMakeTransfer={toggleMakeTransfer}
          setIsMakeTransferVisible={setIsMakeTransferVisible}
        />

        {/* E-Statements Modal */}
        {/* Wallet Statement Modal */}
        <WalletStatementModal
          showWalletStatementModal={showWalletStatementModal}
          setShowWalletStatementModal={setShowWalletStatementModal}
          showDatePickerStartWallet={showDatePickerStartWallet}
          walletStatementDetails={walletStatementDetails}
          setWalletStatementDetails={setWalletStatementDetails}
          hideDatePickerStartWallet={hideDatePickerStartWallet}
          showDatePickerEndWallet={showDatePickerEndWallet}
          hideDatePickerEndWallet={hideDatePickerEndWallet}
          handleWalletStatement={handleWalletStatement}
          showStartWallet={showStartWallet}
          showEndWallet={showEndWallet}
          setShowStartWallet={setShowStartWallet}
          setShowEndWallet={setShowEndWallet}
        />

        {/* ARM Statement Modal */}
        <ArmStatementModal
          allArmData={allArmData}
          showArmStatementModal={showArmStatementModal}
          setShowArmStatementModal={setShowArmStatementModal}
          showDatePickerStartArm={showDatePickerStartArm}
          armStatementDetails={armStatementDetails}
          setArmStatementDetails={setArmStatementDetails}
          hideDatePickerStartArm={hideDatePickerStartArm}
          showDatePickerEndArm={showDatePickerEndArm}
          hideDatePickerEndArm={hideDatePickerEndArm}
          handleArmStatement={handleArmStatement}
          showStartArm={showStartArm}
          showEndArm={showEndArm}
          setShowStartArm={setShowStartArm}
          setShowEndArm={setShowEndArm}
        />

        {/* Lenda Statement Modal */}
        <LendaStatementModal
          showLendaStatementModal={showLendaStatementModal}
          setShowLendaStatementModal={setShowLendaStatementModal}
          showDatePickerStartLenda={showDatePickerStartLenda}
          lendaStatementDetails={lendaStatementDetails}
          setLendaStatementDetails={setLendaStatementDetails}
          hideDatePickerStartLenda={hideDatePickerStartLenda}
          showDatePickerEndLenda={showDatePickerEndLenda}
          hideDatePickerEndLenda={hideDatePickerEndLenda}
          handleLendaStatement={handleLendaStatement}
          showStartLenda={showStartLenda}
          showEndLenda={showEndLenda}
          setShowStartLenda={setShowStartLenda}
          setShowEndLenda={setShowEndLenda}
        />
      </>
    );
  };

  const renderHeaderComponents = () => {
    return (
      <>
        {/* First Section */}
        <IntroSection
          userProfileData={userProfileData}
          loanUserDetails={loanUserDetails}
        />

        {/* Second Section */}
        <SlideSection
          portfolioDetail={portfolioDetail}
          userWalletData={userWalletData}
          totalLendaAmount={totalLendaAmount}
          userLoanAmount={userLoanAmount}
          guarantor={guarantor}
          totalArmAmount={totalArmAmount}
          hideBalance={hideBalance}
          toggleHideBalance={toggleHideBalance}
          handleLongPress={handleLongPress}
          toggleFundWallet={toggleFundWallet}
        />
      </>
    );
  };

  const renderOptionalComponents = () => {
    return (
      <>
        {/* Optional Section */}
        {!userPin && (
          <UpdateProfileBtn
            title="Attention Needed !!!"
            body="Click here to create your transaction pin"
            image={require('../../../assets/images/badge.png')}
            action={() => navigation.navigate('SetPin')}
          />
        )}

        {/* Optional Section */}
        {loanUserDetails === undefined ||
        loanUserDetails?.loanDocumentDetails === undefined ? (
          <UpdateProfileBtn
            title="Complete Account Setup !!!"
            body="Click here to update your profile details"
            image={require('../../../assets/images/badge.png')}
            action={() => navigation.navigate('OnboardingHome')}
          />
        ) : null}
      </>
    );
  };

  const renderScrollableComponents = () => {
    return (
      <>
        {/* Third Section Wallet and Bill*/}
        <ItemsSection buttonParameters={buttonItems} userPin={userPin} />

        {/* Sixth Section Single Transaction History*/}
        <SingleTransactionSection
          userTransactionsData={userTransactionsData}
          userWalletData={userWalletData}
          hideBalance={hideBalance}
        />
      </>
    );
  };

  const renderMainComponents = () => {
    return (
      <>
        {isLoading ||
        isLoadingWallet ||
        isLoadingTransaction ||
        isLoadingLoanData ||
        isLoadingLenda ||
        isLoadingArm ||
        isLoadingLoanAmount ? (
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
        ) : null}
        {isSending ? (
          <ActivityIndicator
            size="large"
            color="rgba(78, 75, 102, 0.7)"
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
        ) : null}
        {renderOverLayComponents()}
        {renderHeaderComponents()}

        <ScrollView
          bounces={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingPullDown}
              onRefresh={unsubGetTransactionsonPullDown}
            />
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent={true}
          style={[styles.scrollView, {marginBottom: 10, height: hp('100%')}]}
          contentContainerStyle={styles.contentContainer}
          alwaysBounceVertical={true}>
          {renderOptionalComponents()}
          {renderScrollableComponents()}
        </ScrollView>
      </>
    );
  };

  return !timeOut ? (
    <Splashscreen text="Getting Profile Details..." />
  ) : timeOut &&
    userProfileData &&
    userProfileData?.profileProgress === null ? (
    <PersonalDetails />
  ) : (
    timeOut &&
    userProfileData &&
    userProfileData?.profileProgress !== null && (
        <SafeAreaView
          style={{
            flex: 1,
            height: hp('100%'),
            width: wp('100%'),
            backgroundColor: COLORS.lendaLightGrey,
            paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
            paddingBottom: insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
            paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
            paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
          }}>
          {renderMainComponents()}
        </SafeAreaView>
    )
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    height: hp('100%'),
    width: wp('100%'),
  },
  contentContainer: {
    paddingBottom: 10,
  },

  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  cont: {
    position: 'relative',
    bottom: -50,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    paddingVertical: 10,
    borderTopRightRadius: 20,
  },

  transView: {
    marginHorizontal: 2,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  transButtons: {
    borderWidth: 1,
    width: wp('28%'),
    height: hp(28),
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'left',
    borderColor: '#D9DBE9',
    borderRadius: 12,
    padding: wp(1),
  },
  transText: {
    fontWeight: 400,
    paddingLeft: wp(1),
    fontSize: hp(1.4),
  },

  bellIcon: {
    paddingHorizontal: 3,
    justifyContent: 'center',
    marginRight: 16,
  },
  hello: {
    fontFamily: 'Montserrat',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    color: '#14142B',
  },
  netInfo: {
    fontFamily: 'Montserrat',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.Success,
  },
  toptabs: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#D9DBE9',
  },
  tabtexts: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  wallet: {
    color: '#054B99',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 10,
  },
  prices: {
    fontFamily: 'MontBold',
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
    marginTop: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },
  extrat: {
    fontFamily: 'MontSBold',
    color: '#054B99',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  demark: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  price: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    color: '#14142B',
  },
  desc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    paddingBottom: 15,
  },
  PanelHandle: {
    height: 6,
    width: 50,
    backgroundColor: '#666',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 6,
  },

  PanelButton: {
    padding: 14,
    // marginBottom: 50,
    width: 200,
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
  },
  PanelButtonText: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'center',
  },
  image: {
    width: wp('100%'),
    justifyContent: 'center',
  },
});
