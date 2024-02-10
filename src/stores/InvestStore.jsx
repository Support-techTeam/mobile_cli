import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import auth from '@react-native-firebase/auth';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';

//get login token
let token = null;
let uploadProgress = 0;

let headers;

const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getAllLendaProduct = async () => {
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
          `/lenda-investment/lenda-investment-plans`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | Lenda Investment Plans | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Lenda Investment Plans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Lenda Investment Plans | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(`/investment/arm-products`, {
          headers,
        });
        DdLogs.info(
          `Investment | ARM Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'ARM Investment',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | ARM Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/investment/arm-product-yield?productCode=${productCode}`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | ARM Investment Yield | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'ARM Investment Yield',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | ARM Investment Yield | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/lenda-investment/All-lenda-investments`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | Get All Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get All Investment',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Get All Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        const response = await axiosInstance.get(
          `/investment/active-investments`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | Get All Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get All Investment',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Get All Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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

const getSingleArmInvestment = async (membershipId, productCode) => {
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
          `/investment/single-investment/?membershipId=${membershipId}&productCode=${productCode}`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | Get Single Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Single Investment ',
          error: false,
          data: response?.data?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Get Single Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Single Investment ',
          error: true,
          data: null,
          message: 'Failed to retrieve investment data!',
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
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
          DdLogs.error(
            `Investment | Create Lenda Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Create Lenda Investment ',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Create Lenda Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Lenda Investment',
          error: false,
          data: response?.data,
          message: 'Investment Created successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Create Lenda Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
    await getFirebaseAuthToken();
    if (token) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
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
          DdLogs.error(
            `Investment | Create ARM Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Create ARM Investment ',
            error: true,
            data: null,
            message: response?.data?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Create ARM Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create ARM Investment ',
          error: false,
          data: response?.data?.data,
          message:
            'Investment successful, you will be notified once it is active.',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Create ARM Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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

const topUpArmInvestment = async details => {
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
          `/investment/topup-arm-investment`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.data?.error) {
          DdLogs.error(
            `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Top-Up Investment',
            error: true,
            data: null,
            message: response?.data?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Top-Up Investment',
          error: false,
          data: response?.data,
          message: 'Investment Top-Up successful',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Top-Up Investment',
          error: true,
          data: null,
          message: 'Investment Top-Up Failed',
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

const topUpLendaInvestment = async details => {
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
          `/lenda-investment/topUp-lenda-investment`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.error(
            `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Top-Up Investment',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Top-Up Investment',
          error: false,
          data: response?.data,
          message: 'Investment Top-Up successful',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Top-Up Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Top-Up Investment',
          error: true,
          data: null,
          message: 'Investment Top-Up Failed',
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

const redeemArmInvestment = async details => {
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
          `/investment/redeem-arm-investment`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.error(
            `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Redeem Investment',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Redeem Investment',
          error: false,
          data: response?.data,
          message: 'Investment redeemption successful.',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Redeem Investment',
          error: true,
          data: null,
          message: 'Investment redeemption failed',
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

const getArmOTP = async membershipId => {
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
          `/investment/otp/?membershipId=${membershipId}`,
          {
            headers,
          },
        );
        DdLogs.info(
          `Investment | Get Investment OTP | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Investment OTP',
          error: false,
          data: response?.data,
          message: response?.data?.message,
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Get Investment OTP | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Investment OTP',
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

const redeemLendaInvestment = async details => {
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
          `/lenda-investment/complete-redemption`,
          details,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.error(
            `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Redeem Investment',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Redeem Investment',
          error: false,
          data: response?.data,
          message: 'Investment redeemption successful',
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Redeem Investment | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Redeem Investment',
          error: true,
          data: null,
          message: 'Investment redeemption failed',
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

const getLendaOTP = async data => {
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
          `/lenda-investment/initiate-redemption-to-get-otp`,
          data,
          {
            headers,
          },
        );
        if (response?.data?.error) {
          DdLogs.error(
            `Investment | Get Investment OTP | ${auth?.currentUser?.email}`,
            {
              errorMessage: JSON.stringify(response?.data),
            },
          );
          return {
            title: 'Get Investment OTP',
            error: true,
            data: null,
            message: response?.data?.message,
          };
        }
        DdLogs.info(
          `Investment | Get Investment OTP | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Investment OTP',
          error: false,
          data: response?.data,
          message: response?.data?.message,
        };
      } catch (error) {
        DdLogs.error(
          `Investment | Get Investment OTP | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Top-Up Investment',
          error: true,
          data: null,
          message: 'Get investment OTP failed',
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

const getArmTransactionsStatement = async (membershipId, startDate, endDate) => {
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
          `/investment/generate-transaction-statement?membershipId=${membershipId}&startDate=${startDate}&endDate=${endDate}`,
          {headers},
        );

        DdLogs.info(
          `Investment | Get Transactions Statement | ${auth?.currentUser?.email}`,
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
          `Investment | Get Transactions Statement | ${auth?.currentUser?.email}`,
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

const getLendaTransactionsStatement = async (startDate, endDate) => {
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
          `/lenda-investment/generate-transaction-statement?startDate=${startDate}&endDate=${endDate}`,
          {headers},
        );

        DdLogs.info(
          `Investment | Get Transactions Statement | ${auth?.currentUser?.email}`,
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
          `Investment | Get Transactions Statement | ${auth?.currentUser?.email}`,
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
  getAllLendaProduct,
  getAllArmProduct,
  getArmProductYield,
  getAllLendaInvestment,
  getAllArmInvestment,
  getSingleArmInvestment,
  createLendaInvestment,
  createArmInvestment,
  topUpLendaInvestment,
  topUpArmInvestment,
  redeemArmInvestment,
  redeemLendaInvestment,
  getArmOTP,
  getLendaOTP,
  getArmTransactionsStatement,
  getLendaTransactionsStatement,
};
