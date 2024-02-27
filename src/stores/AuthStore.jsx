import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, BASE_API_URL} from '../../app.json';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {storeSensitiveData} from './SecurityStore';

const axiosInstance = axios.create({baseURL: BASE_API_URL});
let token = null;
let headers;
let confirm = null;

const userLogin = async (email, password) => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      await AsyncStorage.setItem('hasUser', 'true');
      await AsyncStorage.setItem('userEmail', email);
      DdLogs.info(`User | Login | ${email}`, {context: JSON.stringify(user)});
      // store email and password
      const username = email;
      await storeSensitiveData(username, password);
      return {
        user: user,
        title: 'Account Login',
        error: false,
        message: 'Login Successful',
      };
    } catch (err) {
      DdLogs.error(`User | Login | ${email}`, {
        errorMessage: JSON.stringify(err?.code),
      });
      const errorMsg =
        err.code === 'auth/user-not-found'
          ? 'User not found. Please check your email.'
          : err.code === 'auth/wrong-password'
          ? 'Incorrect password. Please try again.'
          : 'An error occurred. Please try again later.';
      return {
        user: null,
        title: 'Account Login',
        error: true,
        message: errorMsg,
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

const userLogOut = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    await auth()
      .signOut()
      .then(() => {
        return {
          user: null,
          title: 'Account Logout',
          error: false,
          message: 'Logout Successful',
        };
      })
      .catch(err => {
        return {
          user: null,
          title: 'Account Logout',
          error: true,
          message: err,
        };
      });
  } else {
    return {
      error: true,
      data: null,
      message: 'No Internet Connection',
    };
  }
};

const userSignUp = async details => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        details.email.trim(),
        details.password.trim(),
      );

      const newUser = userCredential.user;

      const formatPhoneNumber =
        details.countryCode + Number(details.phoneNumber).toString();

      if (newUser) {
        await updatePhoneNumber(formatPhoneNumber, newUser?.uid);
        await updateProfileData(details.firstname, details.lastname);
      }

      // store email and password
      const username = details.email.trim();
      const password = details.password.trim();
      await storeSensitiveData(username, password);

      await getFirebaseAuthToken();

      const payload = {
        email: details.email.trim(),
        firstName: details.firstname.trim(),
        phoneNumber: formatPhoneNumber,
        uuid: newUser.uid,
      };

      await sendVerificationEmail(payload);

      DdLogs.info(`User | Account Signup | ${details.email.trim()}`, {
        context: JSON.stringify(newUser),
      });
      return {
        user: newUser,
        title: 'Account Signup',
        error: false,
        message: 'Signup Successful',
      };
    } catch (err) {
      DdLogs.error(`User | Account Signup | ${details.email.trim()}`, {
        errorMessage: JSON.stringify(err),
      });
      return {
        user: null,
        title: 'Account Signup',
        error: true,
        message: `${err.message}`,
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

const resendVerificationEmail = async () => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      auth().currentUser.sendEmailVerification();
      DdLogs.info(`User | Resend Verification Email |`, {
        context: JSON.stringify(auth().currentUser),
      });
      return {
        user: auth().currentUser,
        title: 'Resend Verification Email',
        error: false,
        message: 'Resend Verification Email Successful',
      };
    } catch (err) {
      DdLogs.error(`User | Resend Verification Email |`, {
        errorMessage: JSON.stringify(err),
      });
      return {
        user: auth().currentUser,
        title: 'Resend Verification Email',
        error: false,
        message: `${err.message}`,
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

const sendVerificationEmail = async data => {
  if (token) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axiosInstance.post(`/users/send-otp`, data, {
        headers,
      });
      DdLogs.info(`User Verification | Send OTP | ${data.email}`, {
        context: JSON.stringify(response?.data),
      });
      return response;
    } catch (error) {
      DdLogs.error(`User Verification | Send OTP | ${data.email}`, {
        errorMessage: JSON.stringify(error),
      });
      return {
        error: true,
        data: null,
        message: 'User Verification failed!',
      };
    }
  }
};

const updateProfileData = async (firstname, lastname) => {
  const user = auth().currentUser;
  try {
    await auth().currentUser.updateProfile({
      displayName: firstname.trim() + ' ' + lastname.trim(),
    });
  } catch (error) {
    // console.error(error);
  }
};

const verifyOTP = async (otp, uuid) => {
  await getFirebaseAuthToken();
  if (token) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const payload = {
      otpCode: otp,
      uuid: uuid,
    };
    try {
      const response = await axiosInstance.post(`/users/verify-otp`, payload, {
        headers,
      });
      DdLogs.info(
        `User Verification | Verify OTP | ${auth().currentUser?.email}`,
        {
          context: JSON.stringify(response?.data),
        },
      );

      if (response?.data?.error) {
        return {
          error: true,
          data: null,
          message: response?.data?.message,
        };
      }
      return {
        error: false,
        data: response?.data,
        message: response?.data?.message,
      };
    } catch (error) {
      DdLogs.error(
        `User Verification | Verify OTP | ${auth()?.currentUser?.email}`,
        {
          errorMessage: JSON.stringify(error),
        },
      );
      return {
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const updatePhoneNumber = async (phoneNumber, uuid) => {
  await getFirebaseAuthToken();
  if (token) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const payload = {
      phoneNumber: phoneNumber,
      uuid: uuid,
    };
    try {
      const response = await axiosInstance.post(
        `/users/update-firebase-phone`,
        payload,
        {
          headers,
        },
      );
      DdLogs.info(
        `User Verification | Verify OTP | ${auth().currentUser?.email}`,
        {
          context: JSON.stringify(response?.data),
        },
      );
    } catch (error) {
      DdLogs.error(
        `User Verification | Verify OTP | ${auth()?.currentUser?.email}`,
        {
          errorMessage: JSON.stringify(error),
        },
      );
    }
  }
};

const resendOTP = async data => {
  await getFirebaseAuthToken();

  if (token) {
    headers = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      email: data.email,
      firstName: data.firstName,
      phoneNumber: data.phoneNumber,
      uuid: data.uuid,
    };

    try {
      const response = await axiosInstance.post(`/users/send-otp`, payload, {
        headers,
      });
      DdLogs.info(
        `User Verification | Verify OTP | ${auth().currentUser?.email}`,
        {
          context: JSON.stringify(response?.data),
        },
      );

      if (response?.data?.error) {
        return {
          error: true,
          data: null,
          message: response?.data?.message,
        };
      }
      return {
        error: false,
        data: response?.data,
        message: response?.data?.message,
      };
    } catch (error) {
      DdLogs.error(
        `User Verification | Verify OTP | ${auth()?.currentUser?.email}`,
        {
          errorMessage: JSON.stringify(error),
        },
      );
      return {
        error: true,
        data: null,
        message: error,
      };
    }
  }
};

const forgotPassword = async email => {
  if (
    store.getState().networkState &&
    store.getState().networkState.network.isConnected &&
    store.getState().networkState.network.isInternetReachable
  ) {
    try {
      const actionCodeSettings = {
        url: `${BASE_URL}/login/?email=${email}`,
        handleCodeInApp: true,
      };
      await auth().sendPasswordResetEmail(email.trim(), actionCodeSettings);
      DdLogs.info(`User | Password Reset | ${email}`, {
        context: JSON.stringify(auth().currentUser),
      });
      return {
        user: auth().currentUser,
        title: 'Password Reset',
        error: false,
        message: 'Password reset link sent to email.',
      };
    } catch (err) {
      DdLogs.error(`User | Password Reset | ${email}`, {
        errorMessage: JSON.stringify(err),
      });
      return {
        user: auth().currentUser,
        title: 'Password Reset',
        error: false,
        message: `${err.message}`,
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

const userChangePassword = async data => {
  try {
    //getuser credentials
    var user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      data.currentPassword.trim(),
    );
    // re-auth user
    const reauthResponse = await user.reauthenticateWithCredential(cred);
    // update password
    const updateResponse = await user.updatePassword(data.password.trim());

    // store email and password
    const username = user.email.trim();
    const password= data.password;
    await storeSensitiveData(username, password);

    return {
      title: 'Change Password',
      error: false,
      data: user,
      message: 'Password updated successfully!',
    };
  } catch (err) {
    const errorMsg =
      err.code === 'auth/user-not-found'
        ? 'User not found. Please check your email.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : 'An error occurred. Please try again later.';
    return {
      title: 'Change Password',
      error: true,
      data: null,
      message: errorMsg,
    };
  }
};

export {
  userLogin,
  userLogOut,
  userSignUp,
  resendVerificationEmail,
  forgotPassword,
  verifyOTP,
  resendOTP,
  userChangePassword,
};
