import React from 'react';
import axios from 'axios';
import {BASE_API_URL} from '../../app.json';
// import {useSelector, useDispatch} from 'react-redux';

// const ProfileStore = () => {
//   return <div>ProfileStore</div>;
// };

// const user = useSelector(state => state.userAuth.user);
// // export default ProfileStore;
// console.log(JSON.stringify(user).user);
// const headers = {
//   accept: 'application/json',
//   Authorization: `Bearer ${this.token}`,
//   'Content-Type': 'application/json',
// };
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

export {getState, getCity};
