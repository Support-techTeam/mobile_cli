import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import {store} from '../util/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';

//get login token
const reduxStore = store.getState().userAuth;

const reducSetStore = store.getState().userProfile;

let token = null;
let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token = JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getState = async () => {
  try {
    const response = await axiosInstance.get('/address/get-state');
    return {
      error: false,
      data: response.data,
      message: 'success',
    };
  } catch (error) {
    return {
      error: true,
      data: null,
      message: error,
    };
  }
};

const getCity = async cityByState => {
  try {
    const response = await axiosInstance.get(
      `/address/get-city/${cityByState}`,
    );
    return {
      error: false,
      data: response.data,
      message: 'success',
    };
  } catch (error) {
    return {
      error: true,
      data: null,
      message: error,
    };
  }
};

const getProfileDetails = async () => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.get(`/users/get-profile`, {headers});
      await AsyncStorage.setItem('hasProfile', 'true');
      return {
        error: false,
        data: response.data,
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
};

const createUserProfile = async details => {
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
        data: response.data,
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
};

const checkPin = async () => {
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
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Check Pin ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const createTransactionPin = async details => {
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
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const changePin = async details => {
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
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Change Transaction Pin',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
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
