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
  token =
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != null ||
    JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken != undefined
      ? JSON.parse(reduxStore.user).user?.stsTokenManager?.accessToken
      : JSON.parse(reduxStore.user)?.stsTokenManager?.accessToken;
  // headers = {
  //   accept: 'application/json',
  //   Authorization: `Bearer ${token}`,
  //   'Content-Type': 'application/json',
  // };
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
      console.log('response GET', reducSetStore);
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

export {getState, getCity, getProfileDetails};
