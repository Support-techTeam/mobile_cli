import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import {store} from '../util/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';

//get login token
const reduxStore = store.getState().userAuth;

let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token =
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != null ||
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != undefined
      ? JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken
      : JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getAccountWallet = async () => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(`/loan-wallet/get-wallet`, {
        headers,
      });
      return {
        title: 'Get Account Wallet',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Account Wallet',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getAccountTransactions = async (page, limit) => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(
        `/loan-wallet/paginated-transactions?page=${page}&limit=${limit}`,
        {headers},
      );
      return {
        title: 'Get Wallet Transactions',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Wallet Transactions',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const verifyNIPAccountInfo = async (accountNumber, bankName) => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(
        `/loan-wallet/NIP-account-verification/{accountNumber}?accountNumber=${accountNumber}&bankName=${bankName}`,
        {headers},
      );
      return {
        title: 'Verify NIP Account Info',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Verify NIP Account Info',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const verifyBeneficiaryInfo = async accountNumber => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(
        `/loan-wallet/verify-wallet/{accountNumber}?accountNumber=${Number(
          accountNumber,
        )}`,
        {headers},
      );
      return {
        title: 'Verify Beneficiary Info',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Verify Beneficiary Info',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const createInternalTransfer = async details => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.post(
        `/loan-wallet/internal-transfer`,
        details,
        {headers},
      );
      if (response?.data?.error) {
        return {
          title: 'Internal Transfer',
          error: true,
          data: null,
          message: response?.data?.message,
        };
      } else {
        return {
          title: 'Internal Transfer',
          error: false,
          data: response.data,
          message: 'Transfer Successful!',
        };
      }
    } catch (error) {
      return {
        title: 'Internal Transfer',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const createNIPTransfer = async details => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.post(
        `/loan-wallet/NIP-transfer`,
        details,
        {headers},
      );
      if (response?.data?.error) {
        return {
          title: 'NIP Transfer',
          error: true,
          data: null,
          message: response?.data?.message,
        };
      } else {
        return {
          title: 'NIP Transfer',
          error: false,
          data: response.data,
          message: 'Transfer Successful!',
        };
      }
    } catch (error) {
      return {
        title: 'NIP Transfer',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getAllBankDetails = async () => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(
        `/loan-wallet/get-all-NIP-banks`,
        {headers},
      );
      return {
        title: 'Get All Banks',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get All Banks',
        error: true,
        data: null,
        message: error,
      };
    }
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
};
