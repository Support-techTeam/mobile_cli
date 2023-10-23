import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';
import {store} from '../util/redux/store';

//get login token
const reduxStore = store.getState().userAuth;
let uploadProgress = 0;

let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token =
    JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken != null ||
    JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken != undefined
      ? JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken
      : JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getAllLendaProduct = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loans/all-types/loans/mobile`,
          {
            headers,
          },
        );
        return {
          title: 'Get All Loans',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get All Loans',
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

const getAllArmProduct = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loans/all-types/loans/mobile`,
          {
            headers,
          },
        );
        return {
          title: 'Get All Loans',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get All Loans',
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

const getAllLendaInvestment = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/loans/all-types/loans/mobile`,
          {
            headers,
          },
        );
        return {
          title: 'Get All Loans',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get All Loans',
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
const getAllArmInvestment = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/loans/approved-loans/list`, {
          headers,
        });
        return {
          title: 'Get Approved Loans',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get Approved Loans',
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

const getLendaInvestmentById = async id => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/loans/get-loan/${id}`, {
          headers,
        });
        return {
          title: 'Get Single Loan ',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get Single Loan ',
          error: true,
          data: null,
          message: 'Failed to retrieve loan data!',
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

const getArmInvestmentById = async id => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/loans/get-loan/${id}`, {
          headers,
        });
        return {
          title: 'Get Single Loan ',
          error: false,
          data: response.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get Single Loan ',
          error: true,
          data: null,
          message: 'Failed to retrieve loan data!',
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

const createLendaInvestment = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/loans/create-loan`,
          details,
          {
            headers,
          },
        );
        return {
          title: 'Create Loan ',
          error: false,
          data: response.data,
          message: "Loan request successful. You'll be redirected shortly!,",
        };
      } catch (error) {
        return {
          title: 'Create Loan ',
          error: true,
          data: null,
          message: 'Loan request failed',
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

const createArmInvestment = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.post(
          `/loans/create-loan`,
          details,
          {
            headers,
          },
        );
        return {
          title: 'Create Loan ',
          error: false,
          data: response.data,
          message: "Loan request successful. You'll be redirected shortly!,",
        };
      } catch (error) {
        return {
          title: 'Create Loan ',
          error: true,
          data: null,
          message: 'Loan request failed',
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

export {
  getAllLendaProduct,
  getAllArmProduct,
  getAllLendaInvestment,
  getAllArmInvestment,
  getLendaInvestmentById,
  getArmInvestmentById,
  createLendaInvestment,
  createArmInvestment,
};
