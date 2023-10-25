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
          `/lenda-investment/lenda-investment-plans`,
          {
            headers,
          },
        );
        return {
          title: 'Lenda Investment Plans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Lenda Investment Plans',
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
        const response = await axiosInstance.get(`/investment/arm-products`, {
          headers,
        });
        return {
          title: 'ARM Investment',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'ARM Investment',
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

const getArmProductYield = async productCode => {
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
          `/investment/arm-product-yield?productCode=${productCode}`,
          {
            headers,
          },
        );
        return {
          title: 'ARM Investment Yield',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'ARM Investment',
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
          `/lenda-investment/All-lenda-investments`,
          {
            headers,
          },
        );
        return {
          title: 'Get All Investment',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get All Investment',
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
        const response = await axiosInstance.get(
          `/investment/active-investments`,
          {
            headers,
          },
        );
        return {
          title: 'Get All Investment',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get All Investment',
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
          data: response?.data,
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
          data: response?.data,
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
          `/lenda-investment/create-user-lenda-investment`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          return {
            title: 'Create Lenda Investment ',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        return {
          title: 'Create Lenda Investment',
          error: false,
          data: response?.data,
          message: 'Investment Created successfully',
        };
      } catch (error) {
        return {
          title: 'Create Lenda Investment',
          error: true,
          data: null,
          message: 'Investment Creation Failed',
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
          `/investment/create-arm-investment`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.data?.error) {
          return {
            title: 'Create ARM Investment ',
            error: true,
            data: null,
            message: response?.data?.data?.message,
          };
        }
        return {
          title: 'Create ARM Investment ',
          error: false,
          data: response?.data?.data,
          message:
            'Investment successful, you will be notified once it is active.',
        };
      } catch (error) {
        return {
          title: 'Create ARM Investment ',
          error: true,
          data: null,
          message: 'Investment creation failed',
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
  getArmProductYield,
  getAllLendaInvestment,
  getAllArmInvestment,
  getLendaInvestmentById,
  getArmInvestmentById,
  createLendaInvestment,
  createArmInvestment,
};
