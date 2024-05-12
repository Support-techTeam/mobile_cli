import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import auth from '@react-native-firebase/auth';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';

//get login token
let token = null;
let headers;

const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getAccountWallet = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/loan-wallet/get-wallet`, {
          headers,
        });

        DdLogs.info(
          `Wallet | Get Account Wallet | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Account Wallet',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Account Wallet | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Account Wallet',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};
// get-all-beneficiaries

const getBeneficiaries = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/beneficiary/get-all-beneficiaries`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Beneficiary | Get Beneficiary | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Beneficiary',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Beneficiary | Get Beneficiary | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Beneficiary',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getAccountTransactions = async (page, limit) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          // `/loan-wallet/paginated-transactions?page=${page}&limit=${limit}`,
          `/loan-wallet/paginated-all-transactions?page=${page}&limit=${limit}`,
          {headers},
        );

        DdLogs.info(
          `Wallet | Get Wallet Transactions | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Wallet Transactions',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Wallet Transactions | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Wallet Transactions',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getAccountFilteredTransactions = async (page, limit, params) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          // `/loan-wallet/paginated-transactions?page=${page}&limit=${limit}`,
          // `/loan-wallet/paginated-all-transactions?page=${page}&limit=${limit}`,
          `/loan-wallet/paginated-transactions?page=${page}&limit=${limit}&params=${params}`,
          {headers},
        );

        DdLogs.info(
          `Wallet | Get Wallet Transactions | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Wallet Transactions',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Wallet Transactions | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Wallet Transactions',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const verifyNIPAccountInfo = async (accountNumber, bankName) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/NIP-account-verification/{accountNumber}?accountNumber=${accountNumber}&bankName=${bankName}`,
          {headers},
        );
        DdLogs.info(
          `Wallet | Verify NIP Account Info | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );

        if (response?.data?.error) {
          return {
            title: 'Verify NIP Account Info',
            error: true,
            data: response?.data,
            message: response?.data?.message,
          };
        }
        return {
          title: 'Verify NIP Account Info',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Verify NIP Account Info | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Verify NIP Account Info',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const verifyBeneficiaryInfo = async accountNumber => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/verify-wallet/{accountNumber}?accountNumber=${Number(
            accountNumber,
          )}`,
          {headers},
        );
        DdLogs.info(
          `Wallet | Verify Beneficiary Info | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Verify Beneficiary Info',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Verify Beneficiary Info | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Verify Beneficiary Info',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const createInternalTransfer = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/loan-wallet/internal-transfer`,
          details,
          {headers},
        );
        if (response?.data?.error) {
          DdLogs.warn(
            `Wallet | Internal Transfer | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Internal Transfer',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        } else {
          DdLogs.info(
            `Wallet | Internal Transfer | ${auth()?.currentUser?.email}`,
            {
              context: 'No internet Connection',
            },
          );
          return {
            title: 'Internal Transfer',
            error: false,
            data: response?.data,
            message: 'Transfer Successful!',
          };
        }
      } catch (error) {
        DdLogs.error(
          `Wallet | Internal Transfer | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Internal Transfer',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const createNIPTransfer = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/loan-wallet/NIP-transfer`,
          details,
          {headers},
        );
        if (response?.data?.error) {
          DdLogs.error(
            `Wallet | NIP Transfer | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'NIP Transfer',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        } else {
          DdLogs.info(`Wallet | NIP Transfer | ${auth()?.currentUser?.email}`, {
            context: JSON.stringify(response?.data),
          });
          return {
            title: 'NIP Transfer',
            error: false,
            data: response?.data,
            message: 'Transfer Successful!',
          };
        }
      } catch (error) {
        DdLogs.error(`Wallet | NIP Transfer | ${auth()?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'NIP Transfer',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getAllBankDetails = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/get-all-NIP-banks`,
          {headers},
        );
        DdLogs.info(`Wallet | Get All Banks | ${auth()?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get All Banks',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Wallet | Get All Banks | ${auth()?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Get All Banks',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getTransactionsStatement = async (startDate, endDate) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/generate-transaction-statement?startDate=${startDate}&endDate=${endDate}`,
          {headers},
        );

        DdLogs.info(
          `Wallet | Get Transactions Statement | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Transactions Statement',
          error: false,
          data: response?.data,
          message: 'E-Statement sent to email.',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Transactions Statement | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Transactions Statement',
          error: true,
          data: null,
          message: `Failed | ${error}`,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const requestLimitIncrease = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/users/user-limit-increase-request`,
          details,
          {headers},
        );
        if (response?.data?.error) {
          DdLogs.warn(
            `Wallet | Limit Increase | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Limit Increase',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        } else {
          DdLogs.info(
            `Wallet | Limit Increase | ${auth()?.currentUser?.email}`,
            {
              context: 'No internet Connection',
            },
          );
          return {
            title: 'Limit Increase',
            error: false,
            data: response?.data,
            message: response?.data?.message,
          };
        }
      } catch (error) {
        DdLogs.error(
          `Wallet | Limit Increase | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Limit Increase',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const upgradeWallet = async data => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/loan-wallet/upgrade-wallet`,
          data,
          {headers},
        );
        if (response?.data?.error) {
          DdLogs.warn(
            `Wallet | Wallet name|type update  | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Wallet Upgrade|Downgrade',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        } else {
          DdLogs.info(
            `Wallet | Wallet name|type update  | ${auth()?.currentUser?.email}`,
            {
              context: 'No internet Connection',
            },
          );
          return {
            title: 'Wallet Upgrade|Downgrade',
            error: false,
            data: response?.data,
            message: response?.data?.message,
          };
        }
      } catch (error) {
        DdLogs.error(
          `Wallet | Wallet name|type update  | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Wallet Upgrade|Downgrade',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

// Seerbit Implementation

const getAllWallet = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/get-user-wallets`,
          {
            headers,
          },
        );

        DdLogs.info(
          `Wallet | Get All Account Wallet | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Account Wallet',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Account Wallet | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Account Wallet',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getSeerbitWalletBalance = async data => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/seerbit-wallet-balance/{pocketId}?pocketId=${data}`,
          {
            headers,
          },
        );

        DdLogs.info(
          `Wallet | Get Seerbit Wallet balance | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        if (response?.data?.error) {
          return {
            title: 'Get Seerbit Wallet balance',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        return {
          title: 'Get Seerbit Wallet balance',
          error: false,
          data: response?.data?.data?.availableBalanceAmount,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Seerbit Wallet balance | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Seerbit Wallet balance',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getSeerbitNipBanks = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/get-seerbit-banks-list`,
          {
            headers,
          },
        );

        DdLogs.info(
          `Wallet | Get All Seerbit bank list| ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        if (response?.data?.name === 'Error') {
          return {
            title: 'Get All Seerbit bank list',
            error: true,
            data: null,
            message: error,
          };
        } else {
          const bankList = [];
          response.data.forEach(bank => {
            bankList.push({
              NIPCode: bank.bankcode,
              bankName: bank.bankname,
            });
          });
          return {
            title: 'Get All Seerbit bank list',
            error: false,
            data: bankList,
            message: 'success',
          };
        }
      } catch (error) {
        DdLogs.error(
          `Wallet | Get All Seerbit bank list | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get All Seerbit bank list',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const verifySeerbitNipAccount = async (accountNumber, bankName) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/NIP-account-verification-seerbit/${accountNumber}/?accountNumber=${accountNumber}&bankName=${bankName}`,
          {
            headers,
          },
        );

        DdLogs.info(
          `Wallet | Verify Seerbit Wallet | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        if (response?.data?.error) {
          return {
            error: true,
            data: null,
            message: res.data?.message || 'Unable to verify account',
          };
        }
        return {
          title: 'Verify Seerbit Wallet',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Wallet | Verify Seerbit Wallet | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Verify Seerbit Wallet',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getSecondWallet = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loan-wallet/get-second-wallet`,
          {
            headers,
          },
        );

        DdLogs.info(
          `Wallet | Get Second Wallet | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );

        if (response?.data?.error) {
          return {
            title: 'Get Second Wallet',
            error: true,
            data: null,
            message: response.data.message,
          };
        } else {
          return {
            title: 'Get Second Wallet',
            error: false,
            data: response?.data,
            message: response.data.message,
          };
        }
      } catch (error) {
        DdLogs.error(
          `Wallet | Get Second Wallet| ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Second Wallet',
          error: true,
          data: null,
          message: error,
        };
      }
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getFirebaseAuthToken = async () => {
  try {
    const user = auth().currentUser;
    if (user) {
      token = await user.getIdToken();
      return '';
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export {
  getAccountWallet,
  getAccountTransactions,
  verifyNIPAccountInfo,
  verifyBeneficiaryInfo,
  createInternalTransfer,
  createNIPTransfer,
  getAllBankDetails,
  getTransactionsStatement,
  getBeneficiaries,
  requestLimitIncrease,
  upgradeWallet,
  getAccountFilteredTransactions,
  getAllWallet,
  getSeerbitWalletBalance,
  getSeerbitNipBanks,
  verifySeerbitNipAccount,
  getSecondWallet,
};
