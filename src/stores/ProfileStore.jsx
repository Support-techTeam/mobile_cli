import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';
import {store} from '../util/redux/store';

//get login token
const reduxStore = store.getState().userAuth;

let token = null;
let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token = JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getState = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      const response = await axiosInstance.get('/address/get-state');
      return {
        error: false,
        data: response?.data,
        message: 'success',
      };
    } catch (error) {
      return {
        error: true,
        data: null,
        message: error,
      };
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getCity = async cityByState => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      const response = await axiosInstance.get(
        `/address/get-city/${cityByState}`,
      );
      return {
        error: false,
        data: response?.data,
        message: 'success',
      };
    } catch (error) {
      return {
        error: true,
        data: null,
        message: error,
      };
    }
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const getProfileDetails = async () => {
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
        const response = await axiosInstance.get(`/users/get-profile`, {
          headers,
        });
        await AsyncStorage.setItem('hasProfile', 'true');
        return {
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
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

const createUserProfile = async details => {
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
          `/users/create-profile`,
          details,
          {headers},
        );
        await AsyncStorage.setItem('hasProfile', 'true');
        return {
          title: 'Create Profile',
          error: false,
          data: response?.data,
          message: 'Profile created successfully',
        };
      } catch (error) {
        return {
          title: 'Create Profile',
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

const checkPin = async () => {
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
        const response = await axiosInstance.get(`/transaction-pin/check-pin`, {
          headers,
        });
        return {
          title: 'Check Pin ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Check Pin ',
          error: true,
          data: null,
          message: `Failed | ${error?.response?.data?.message}`,
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

const createTransactionPin = async details => {
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
          `/transaction-pin/create-pin`,
          details,
          {
            headers,
          },
        );
        // console.log(response?.data?.error);
        if (response?.data?.error) {
          return {
            title: 'Create Transaction Pin',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        return {
          title: 'Create Transaction Pin',
          error: false,
          data: null,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Create Transaction Pin',
          error: true,
          data: null,
          message: `Failed | ${error?.response?.data?.message}`,
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

const changePin = async details => {
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
          `/transaction-pin/reset-pin`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          return {
            title: 'Change Transaction Pin',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        return {
          title: 'Change Transaction Pin',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        return {
          title: 'Change Transaction Pin',
          error: true,
          data: null,
          message: `Failed | ${error?.response?.data?.message}`,
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
  getState,
  getCity,
  getProfileDetails,
  createUserProfile,
  checkPin,
  createTransactionPin,
  changePin,
};
