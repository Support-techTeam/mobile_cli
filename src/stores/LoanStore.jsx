import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
import {useSelector, useDispatch} from 'react-redux';
import {store} from '../util/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../util/firebase/firebaseConfig';

//get login token
const reduxStore = store.getState().userAuth;
let uploadProgress = 0;

let headers;
if (reduxStore !== null || reduxStore !== undefined) {
  token =
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != null ||
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != undefined
      ? JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken
      : JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
}
const axiosInstance = axios.create({baseURL: BASE_API_URL});

const getAllLoans = async () => {
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
};
const getApprovedLoans = async () => {
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
};
const getPaidLoans = async () => {
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
      return {
        title: 'Get Paid Loans',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Paid Loans',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};
const getPendingLoans = async () => {
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
      return {
        title: 'Get Pending Loans',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Pending Loans',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getLoansAmount = async () => {
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
      return {
        title: 'Get Loans Amount',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Loans Amount',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getDuration = async () => {
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
      return {
        title: 'Get Loans Duration ',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Loans Duration ',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getLoanUserDetails = async () => {
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
      return {
        title: 'Get User Loan Details ',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get User Loan Details ',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const getLoanById = async id => {
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
};

const getLoanDetails = async (amount, tenor) => {
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
      return {
        title: 'Get Loan Details ',
        error: false,
        data: response.data,
        message: 'success',
      };
    } catch (error) {
      return {
        title: 'Get Loan Details ',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const createLoan = async details => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.post(`/loans/create-loan`, details, {
        headers,
      });
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
        {
          headers,
        },
      );
      await AsyncStorage.setItem('hasStarted', '1');
      return {
        title: 'Create Profile ',
        error: false,
        data: response.data,
        message: 'Profile data stored successfully',
      };
    } catch (error) {
      return {
        title: 'Create Profile ',
        error: true,
        data: null,
        message: error,
      };
    }
  }
};
const createBusinessDetails = async details => {
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
      return {
        title: 'Create Business Details ',
        error: false,
        data: response.data,
        message: 'Business details stored successfully',
      };
    } catch (error) {
      return {
        title: 'Create Business Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const createNextOfKin = async details => {
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
      return {
        title: 'Create Next Of Kin ',
        error: false,
        data: response.data,
        message: 'Next Of Kin data stored successfully',
      };
    } catch (error) {
      return {
        title: 'Create Next Of Kin ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const createBankDetails = async details => {
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
      return {
        title: 'Create Bank Details ',
        error: false,
        data: response.data,
        message: 'Bank details stored successfully',
      };
    } catch (error) {
      return {
        title: 'Create Bank Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const createDocumentsDetails = async details => {
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
      return {
        title: 'Create Document Details ',
        error: false,
        data: response.data,
        message: 'Document details created successfully',
      };
    } catch (error) {
      return {
        title: 'Create Document Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const createUploadDocument = async (details, documentName) => {
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
      return {
        title: 'Document Upload ',
        error: false,
        data: response.data,
        message: 'Upload successful',
      };
    } catch (error) {
      uploadProgress = 0;
      return {
        title: 'Document Upload ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const updatePersonalDetails = async details => {
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
      await AsyncStorage.setItem('hasStarted', '1');
      return {
        title: 'Update Profile ',
        error: false,
        data: response.data,
        message: 'Profile data stored successfully',
      };
    } catch (error) {
      return {
        title: 'Update Profile ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};
const updateBusinessDetails = async details => {
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
      return {
        title: 'Update Business Details ',
        error: false,
        data: response.data,
        message: 'Business details stored successfully',
      };
    } catch (error) {
      return {
        title: 'Update Business Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const updateNokDetails = async details => {
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
      return {
        title: 'Update Next Of Kin ',
        error: false,
        data: response.data,
        message: 'Next Of Kin data stored successfully',
      };
    } catch (error) {
      return {
        title: 'Update Next Of Kin ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const updateBankDetails = async details => {
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
      return {
        title: 'Update Bank Details ',
        error: false,
        data: response.data,
        message: 'Bank details stored successfully',
      };
    } catch (error) {
      return {
        title: 'Update Bank Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
  }
};

const updateDocumentsDetails = async details => {
  if (auth?.currentUser?.stsTokenManager?.accessToken) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${auth.currentUser?.stsTokenManager?.accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.put(
        `/loan-details/update-documents`,
        details,
        {
          headers,
        },
      );
      return {
        title: 'Update Document Details ',
        error: false,
        data: response.data,
        message: 'Document details updated successfully',
      };
    } catch (error) {
      return {
        title: 'Update Document Details ',
        error: true,
        data: null,
        message: `Failed | ${error.response.data.message}`,
      };
    }
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
};
