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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
    
        console.log(response.data, 'response')
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

const getAccountTransactions = async (page, limit) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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

const verifyNIPAccountInfo = async (accountNumber, bankName) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
          DdLogs.error(`Wallet | NIP Transfer | ${auth()?.currentUser?.email}`, {
            errorMessage: JSON.stringify(response?.data),
          });
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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
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
};
