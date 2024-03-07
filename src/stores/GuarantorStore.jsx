import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';

//get login token
const reduxStore = store.getState().userAuth;
let token = null;
let headers;

const axiosInstance = axios.create({baseURL: BASE_API_URL});

const createGuarantor = async data => {
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
        const response = await axiosInstance.post(`/sureties/create`, data, {
          headers,
        });
        DdLogs.info(
          `Guarantors | Create Guarantor | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Guarantor',
          error: false,
          data: response?.data,
          message:
            'Guarantor added successfully. Please notify your guarantor to check their mail!',
        };
      } catch (error) {
        DdLogs.error(
          `Guarantors | Create Guarantor | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`sureties`, {
          headers,
        });
        DdLogs.info(
          `Guarantors | Get Guarantors | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Guarantors',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Guarantors | Get Guarantors | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/sureties/get/${id}`, {
          headers,
        });
        DdLogs.info(
          `Guarantors | Get Guarantor | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Guarantor',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Guarantors | Get Guarantor | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
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
        DdLogs.info(`Guarantors | Send Otp | ${auth()?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Send Otp',
          error: false,
          data: response?.data,
          message:
            'We have sent your guarantor a mail. You will be navigated shortly!',
        };
      } catch (error) {
        DdLogs.error(`Guarantors | Send Otp | ${auth()?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
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
export {createGuarantor, getGuarantors, getGuarantor, sendOtp};
