import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';
import auth from '@react-native-firebase/auth';

//get login token
const reduxStore = store.getState().userAuth;

let token = null;
let headers;
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getState = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    try {
      const response = await axiosInstance.get('/address/get-state');
      DdLogs.info(`Profile | Get State | ${auth()?.currentUser?.email}`, {
        context: JSON.stringify(response?.data),
      });
      return {
        error: false,
        data: response?.data,
        message: 'success',
      };
    } catch (error) {
      DdLogs.error(`Profile | Get State | ${auth()?.currentUser?.email}`, {
        errorMessage: JSON.stringify(error),
      });
      return {
        error: true,
        data: null,
        message: error?.message,
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
    store.getState().networkState.network?.isConnected &&
    store.getState().networkState.network?.isInternetReachable
  ) {
    try {
      const response = await axiosInstance.get(
        `/address/get-city/${cityByState}`,
      );
      DdLogs.info(`Profile | Get City | ${auth()?.currentUser?.email}`, {
        context: JSON.stringify(response?.data),
      });
      return {
        error: false,
        data: response?.data,
        message: 'success',
      };
    } catch (error) {
      DdLogs.error(`Profile | Get City | ${auth()?.currentUser?.email}`, {
        errorMessage: JSON.stringify(error),
      });
      return {
        error: true,
        data: null,
        message: error?.message,
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
        const response = await axiosInstance.get(`/users/get-profile`, {
          headers,
        });
        await AsyncStorage.setItem('hasProfile', 'true');
        DdLogs.info(
          `Profile | Get Profile Detail | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Profile | Get Profile Detail | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          error: true,
          data: null,
          message: error?.message,
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

const createUserProfile = async (details, customNumber) => {
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
      details.phoneNumber = customNumber;
      try {
        const response = await axiosInstance.post(
          `/users/create-profile-web`,
          details,
          {headers},
        );

        if (response?.data?.error) {
          DdLogs.error(
            `Profile | Create Profile | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            error: true,
            data: null,
            message: response?.data?.message || 'Profile creation failed!',
          };
        }
        await AsyncStorage.setItem('hasProfile', 'true');
        DdLogs.info(
          `Profile | Create user Profile | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Profile',
          error: false,
          data: response?.data,
          message: 'Profile created successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Profile | Create user Profile | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Profile',
          error: true,
          data: null,
          message: error?.message,
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
        const response = await axiosInstance.get(`/transaction-pin/check-pin`, {
          headers,
        });
        DdLogs.info(`Profile | Check Pin | ${auth()?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Check Pin ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Profile | Check Pin | ${auth()?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Check Pin ',
          error: true,
          data: null,
          message: `Failed | ${error?.message}`,
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
          `/transaction-pin/create-pin`,
          details,
          {
            headers,
          },
        );

        if (response?.data?.error) {
          DdLogs.info(
            `Profile | Create Transaction Pin | ${auth()?.currentUser?.email}`,
            {
              context: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Create Transaction Pin',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        DdLogs.info(
          `Profile | Create Transaction Pin | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Transaction Pin',
          error: false,
          data: null,
          message: response?.data?.message,
        };
      } catch (error) {
        DdLogs.error(
          `Profile | Create Transaction Pin | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Transaction Pin',
          error: true,
          data: null,
          message: `Failed | ${error?.message}`,
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
          `/transaction-pin/reset-pin`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.info(
            `Profile | Change Transaction Pin | ${auth()?.currentUser?.email}`,
            {
              context: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Change Transaction Pin',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        DdLogs.info(
          `Profile | Change Transaction Pin | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Change Transaction Pin',
          error: false,
          data: null,
          message: response?.data?.message,
        };
      } catch (error) {
        DdLogs.error(
          `Profile | Change Transaction Pin | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Change Transaction Pin',
          error: true,
          data: null,
          message: `Failed | ${error?.message}`,
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

const resetPin = async () => {
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
          `/transaction-pin/factory-reset-pin`,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.info(`Profile | Reset Pin | ${auth()?.currentUser?.email}`, {
            context: JSON.stringify(response?.data),
          });
          return {
            title: 'Reset Pin',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        DdLogs.info(`Profile | Reset Pin | ${auth()?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Reset Pin',
          error: false,
          data: null,
          message: response?.data?.message,
        };
      } catch (error) {
        DdLogs.error(`Profile | Reset Pin | ${auth()?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Reset Pin',
          error: true,
          data: null,
          message: `Failed | ${error?.message}`,
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

const bvnValidation = async data => {
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
        const response = await axiosInstance.post(`/users/validate-bvn`, data, {
          headers,
        });

        DdLogs.info(`Profile | BVN Validation| ${auth()?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        if (response?.data?.error) {
          return {
            title: 'BVN Validation',
            error: true,
            data: response?.data ? response?.data : null,
            message: response?.data?.message
              ? response?.data?.message
              : 'Failed to validate BVN',
          };
        }
        return {
          title: 'BVN Validation',
          error: false,
          data: response?.data?.validateBvnResult,
          message: response?.data?.message || 'BVN validated successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Profile | BVN Validation | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'BVN Validation',
          error: true,
          data: null,
          message: error?.message ? error?.message : 'Failed to validate BVN',
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

const getAllAdverts = async () => {
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
        const response = await axiosInstance.get(`/advert/get-open-advert`, {
          headers,
        });
        if (response?.data?.error) {
          DdLogs.error(
            `Adverts | Get Open Adverts | ${auth()?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Get Open Adverts',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.error}`,
          };
        }
        DdLogs.info(
          `Adverts | Get Open Adverts | ${auth()?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Open Adverts',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Adverts | Get Open Adverts | ${auth()?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Open Adverts',
          error: true,
          data: null,
          message: `Failed | ${error?.message}`,
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
  getState,
  getCity,
  getProfileDetails,
  createUserProfile,
  checkPin,
  createTransactionPin,
  changePin,
  bvnValidation,
  resetPin,
  getAllAdverts,
};
