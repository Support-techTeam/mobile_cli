import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';

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

const getAllLoans = async () => {
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
        DdLogs.info(`Loans | Get All Loans | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get All Loans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Loans | Get All Loans | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
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
const getApprovedLoans = async () => {
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
        DdLogs.info(
          `Loans | Get Approved Loans | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Approved Loans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Get Approved Loans | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
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
const getPaidLoans = async () => {
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
        const response = await axiosInstance.get(`/loans/paid-loans/list`, {
          headers,
        });
        DdLogs.info(`Loans | Get Paid Loans | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get Paid Loans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Loans | Get Paid Loans | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Get Paid Loans',
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
const getPendingLoans = async () => {
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
        const response = await axiosInstance.get(`/loans/pending-loans/list`, {
          headers,
        });
        DdLogs.info(`Loans | Get Pending Loans | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get Pending Loans',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Get Pending Loans | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Pending Loans',
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

const getLoansAmount = async () => {
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
          `/loans/loan-statistics/mobile`,
          {
            headers,
          },
        );
        DdLogs.info(`Loans | Get Loans Amount | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get Loans Amount',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Loans | Get Loans Amount | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Get Loans Amount',
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

const getDuration = async () => {
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
        const response = await axiosInstance.get(`/loans/mobile-loan-tenor`, {
          headers,
        });
        DdLogs.info(
          `Loans | Get Loans Duration | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get Loans Duration ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Get Loans Duration | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get Loans Duration ',
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

const getLoanUserDetails = async () => {
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
        const response = await axiosInstance.get(`/loan-details/loan-details`, {
          headers,
        });
        DdLogs.info(
          `Loans | Get User Loan Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Get User Loan Details ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Get User Loan Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Get User Loan Details ',
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

const getLoanById = async id => {
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
        DdLogs.info(`Loans | Get Single Loan | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get Single Loan ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Loans | Get Single Loan | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
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

const getLoanDetails = async (amount, tenor) => {
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
          `/loans/details?amount=${Number(amount)}&tenor=${tenor}`,
          {
            headers,
          },
        );
        DdLogs.info(`Loans | Get Loan Details | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Get Loan Details ',
          error: false,
          data: response?.data,
          message: 'success',
        };
      } catch (error) {
        DdLogs.error(`Loans | Get Loan Details | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Get Loan Details ',
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

const createLoan = async details => {
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
        DdLogs.info(`Loans | Create Loan | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Create Loan ',
          error: false,
          data: response?.data,
          message: "Loan request successful. You'll be redirected shortly!,",
        };
      } catch (error) {
        DdLogs.error(`Loans | Create Loan | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
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
          {
            headers,
          },
        );
        await AsyncStorage.setItem('hasStarted', '1');
        DdLogs.info(`Loans | Create Profile | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Create Profile ',
          error: false,
          data: response?.data,
          message: 'Profile data stored successfully',
        };
      } catch (error) {
        DdLogs.error(`Loans | Create Profile | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Create Profile ',
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
const createBusinessDetails = async details => {
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
          `/loan-details/create/organization`,
          details,
          {
            headers,
          },
        );
        await AsyncStorage.setItem('hasStarted', '2');
        DdLogs.info(
          `Loans | Create Business Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Business Details ',
          error: false,
          data: response?.data,
          message: 'Business details stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Create Business Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Business Details ',
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

const createNextOfKin = async details => {
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
          `/loan-details/create/next-of-kin`,
          details,
          {
            headers,
          },
        );
        await AsyncStorage.setItem('hasStarted', '3');
        DdLogs.info(
          `Loans | Create Next Of Kin | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Next Of Kin ',
          error: false,
          data: response?.data,
          message: 'Next Of Kin data stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Create Next Of Kin | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Next Of Kin ',
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

const createBankDetails = async details => {
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
          `/loan-details/create/bank-details`,
          details,
          {
            headers,
          },
        );
        await AsyncStorage.setItem('hasStarted', '4');
        DdLogs.info(
          `Loans | Create Bank Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Bank Details ',
          error: false,
          data: response?.data,
          message: 'Bank details stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Create Bank Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Bank Details ',
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

const createDocumentsDetails = async details => {
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
          `/loan-details/save-documents`,
          details,
          {
            headers,
          },
        );
        DdLogs.info(
          `Loans | Create Document Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create Document Details ',
          error: false,
          data: response?.data,
          message: 'Document details created successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Create Document Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create Document Details ',
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

const createUploadDocument = async (details, documentName) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    if (auth?.currentUser?.stsTokenManager?.accessToken) {
      headers = {
        accept: 'application/json',
        Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
        'Content-Type': 'multipart/form-data',
      };
      try {
        const formData = new FormData();
        formData.append('file', details);

        const response = await axiosInstance.post(
          `/loan-details/upload/${documentName}`,
          formData,
          {
            headers,
            onUploadProgress: progressEvent => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100,
                );
                uploadProgress = progress;
              }
            },
          },
        );
        uploadProgress = 0;
        DdLogs.info(`Loans | Document Upload | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });

        if(response?.data?.error){
          return {
            title: 'Document Upload ',
            error: true,
            data: null,
            message: `Failed | ${response?.data?.message}`,
          };
        }
        return {
          title: 'Document Upload ',
          error: false,
          data: response?.data,
          message: 'Upload successful',
        };
      } catch (error) {
        uploadPerroress = 0;
        DderrorMessagefo(`Loans | Document Upload |errorntUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Document Upload ',
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

const updatePersonalDetails = async details => {
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
        const response = await axiosInstance.put(`/users/update`, details, {
          headers,
        });
        const onBoardingState = (await AsyncStorage.getItem('hasStarted')) ?? 0;
        if (Number(onBoardingState) < 1) {
          await AsyncStorage.setItem('hasStarted', '1');
        }

        DdLogs.info(`Loans | Update Profile | ${auth?.currentUser?.email}`, {
          context: JSON.stringify(response?.data),
        });
        return {
          title: 'Update Profile ',
          error: false,
          data: response?.data,
          message: 'Profile data stored successfully',
        };
      } catch (error) {
        DdLogs.error(`Loans | Update Profile | ${auth?.currentUser?.email}`, {
          errorMessage: JSON.stringify(error),
        });
        return {
          title: 'Update Profile ',
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
const updateBusinessDetails = async details => {
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
        const response = await axiosInstance.put(
          `/loan-details/update/organization`,
          details,
          {
            headers,
          },
        );
        const onBoardingState = await AsyncStorage.getItem('hasStarted');
        if (Number(onBoardingState) < 2) {
          await AsyncStorage.setItem('hasStarted', '2');
        }
        DdLogs.info(
          `Loans | Update Business Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Update Business Details ',
          error: false,
          data: response?.data,
          message: 'Business details stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Update Business Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Update Business Details ',
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

const updateNokDetails = async details => {
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
        const response = await axiosInstance.put(
          `/loan-details/update/next-of-kin`,
          details,
          {
            headers,
          },
        );
        const onBoardingState = await AsyncStorage.getItem('hasStarted');
        if (Number(onBoardingState) < 3) {
          await AsyncStorage.setItem('hasStarted', '3');
        }
        DdLogs.info(
          `Loans | Update Next Of Kin | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Update Next Of Kin ',
          error: false,
          data: response?.data,
          message: 'Next Of Kin data stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Update Next Of Kin | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Update Next Of Kin ',
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

const updateBankDetails = async details => {
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
        const response = await axiosInstance.put(
          `/loan-details/update/bank-details`,
          details,
          {
            headers,
          },
        );
        const onBoardingState = await AsyncStorage.getItem('hasStarted');
        if (Number(onBoardingState) < 4) {
          await AsyncStorage.setItem('hasStarted', '4');
        }
        DdLogs.info(
          `Loans | Update Bank Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Update Bank Details ',
          error: false,
          data: response?.data,
          message: 'Bank details stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Update Bank Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Update Bank Details ',
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

const updateDocumentsDetails = async details => {
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
        const response = await axiosInstance.put(
          `/loan-details/update/arm-documents`,
          details,
          {
            headers,
          },
        );
        DdLogs.info(
          `Loans | Update Document Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Update Document Details ',
          error: false,
          data: response?.data,
          message: 'Document details updated successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Update Document Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Update Document Details ',
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

const createArmDetails = async details => {
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
        const response = await axiosInstance.put(
          `/loan-details/update/arm-details`,
          details,
          {
            headers,
          },
        );
        await AsyncStorage.setItem('hasStarted', '5');
        DdLogs.info(
          `Loans | Create ARM Details | ${auth?.currentUser?.email}`,
          {
            context: JSON.stringify(response?.data),
          },
        );
        return {
          title: 'Create ARM Details ',
          error: false,
          data: response?.data,
          message: 'ARM details stored successfully',
        };
      } catch (error) {
        DdLogs.error(
          `Loans | Create ARM Details | ${auth?.currentUser?.email}`,
          {
            errorMessage: JSON.stringify(error),
          },
        );
        return {
          title: 'Create ARM Details ',
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
  getAllLoans,
  getApprovedLoans,
  getPaidLoans,
  getPendingLoans,
  getLoansAmount,
  getDuration,
  getLoanUserDetails,
  getLoanById,
  getLoanDetails,
  createLoan,
  createNextOfKin,
  createUserProfile,
  createBusinessDetails,
  createBankDetails,
  createDocumentsDetails,
  createUploadDocument,
  uploadProgress,
  updatePersonalDetails,
  updateBusinessDetails,
  updateNokDetails,
  updateBankDetails,
  updateDocumentsDetails,
  createArmDetails,
};
