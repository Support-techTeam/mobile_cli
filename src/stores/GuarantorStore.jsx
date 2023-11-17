import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';
import {store} from '../util/redux/store';

//get login token
const reduxStore = store.getState().userAuth;

let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token =
    JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken != null ||
    JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken != undefined
      ? JSON.parse(reduxStore.user)?.user?.stsTokenManager?.accessToken
      : JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const createGuarantor = async data => {
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
        const response = await axiosInstance.post(`/sureties/create`, data, {
          headers,
        });
        return {
          title: 'Create Guarantor',
          error: false,
          data: response?.data,
          message:
            'Guarantor added successfully. Please notify your guarantor to check their mail!',
        };
      } catch (error) {
        return {
          title: 'Create Guarantor',
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

const getGuarantors = async () => {
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
        const response = await axiosInstance.get(`sureties`, {
          headers,
        });
        return {
          title: 'Get Guarantors',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get Guarantors',
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

const getGuarantor = async id => {
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
        const response = await axiosInstance.get(`/sureties/get/${id}`, {
          headers,
        });
        return {
          title: 'Get Guarantor',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Get Guarantor',
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

const sendOtp = async data => {
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
          `sureties/send-otp`,
          {},
          {
            headers,
          },
        );
        return {
          title: 'Send Otp',
          error: false,
          data: response?.data,
          message:
            'We have sent your guarantor a mail. You will be navigated shortly!',
        };
      } catch (error) {
        return {
          title: 'Send Otp',
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

export {createGuarantor, getGuarantors, getGuarantor, sendOtp};
