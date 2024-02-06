import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {auth} from '../util/firebase/firebaseConfig';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';

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

const getNetworkProvider = async () => {
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
          `/cydene-bill-payment/get-airtime-provider`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get Network Provider | ${auth?.currentUser?.email}`,
          {context: JSON.stringify(response?.data)},
        );
        return {
          title: 'Get Network Provider',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get Network Provider | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Network Provider',
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

const purchaseAirtime = async data => {
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
          `/cydene-bill-payment/purchase-airtime`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Purchase Airtime | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Purchase Airtime',
          error: false,
          data: response?.data,
          message: 'Bill Purchase successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Purchase Airtime | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Purchase Airtime',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const getDataProvider = async () => {
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
          `/cydene-bill-payment/get-data-provider`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get Network Provider | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Network Provider',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get Network Provider | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Network Provider',
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

const getDataPlanByProvider = async provider => {
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
          `/cydene-bill-payment/get-data-bundles/{provider}?provider=${provider}`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get Data Plan | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Data Plan',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get Data Plan | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Data Plan',
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

const purchaseDataPlan = async data => {
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
          `/cydene-bill-payment/purchase-data`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Purchase Data | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Purchase Data',
          error: false,
          data: response?.data,
          message: 'Bill Purchase successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Purchase Data | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Purchase Data',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const getElectricityProviders = async () => {
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
          `/cydene-bill-payment/get-electricity-provider`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get Electricity Provider | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Electricity Provider',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get Electricity Provider | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Electricity Provider',
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

const verifyMeter = async data => {
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
          `/cydene-bill-payment/validate-meter`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Verify Meter | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Verify Meter',
          error: false,
          data: response?.data,
          message: 'successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Verify Meter | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Verify Meter',
          error: true,
          data: null,
          message: 'Meter Verification failed!',
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

const purchaseElectricity = async data => {
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
          `/cydene-bill-payment/purchase-power`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Purchase Power | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Purchase Power',
          error: false,
          data: response?.data,
          message: 'Bill Purchase successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Purchase Power | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Purchase Power',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const getCableTvProvider = async provider => {
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
          `/cydene-bill-payment/get-bouquets/{provider}?provider=${provider}`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get CableTv Provider | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get CableTv Provider',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get CableTv Provider | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get CableTv Provider',
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

const verifyIUC = async data => {
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
          `/cydene-bill-payment/validate-iuc`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(`Bill Payment | Verify IUC | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Verify IUC',
          error: false,
          data: response?.data,
          message: 'successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Verify IUC | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Verify IUC',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const renewSubscription = async data => {
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
          `/cydene-bill-payment/subscription-renewal`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Renew Subscription | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Renew Subscription',
          error: false,
          data: response?.data,
          message: 'Bill Purchase successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Renew Subscription | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Renew Subscription',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const updateSubscription = async data => {
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
          `/cydene-bill-payment/subscriptions-update`,
          data,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Update Subscription | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Update Subscription',
          error: false,
          data: response?.data,
          message: 'Bill Purchase successful!',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Update Subscription | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Update Subscription',
          error: true,
          data: null,
          message: 'Bill Purchase failed!',
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

const getAllTransaction = async () => {
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
          `/cydene-bill-payment/all-transactions`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Bill Payment | Get All Transaction | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get All Transaction',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Bill Payment | Get All Transaction | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get All Transaction',
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

export {
  getNetworkProvider,
  getDataProvider,
  getElectricityProviders,
  getCableTvProvider,
  getAllTransaction,
  purchaseAirtime,
  getDataPlanByProvider,
  verifyMeter,
  purchaseDataPlan,
  purchaseElectricity,
  verifyIUC,
  renewSubscription,
  updateSubscription,
};
