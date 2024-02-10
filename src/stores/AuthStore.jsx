import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../app.json';
import {store} from '../util/redux/store';
import {DdLogs} from '@datadog/mobile-react-native';
import auth from '@react-native-firebase/auth';

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
    // await signOut(auth);
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
      console.log(userCredential.user);
      if (newUser) {
        await updateProfileData(details.firstname, details.lastname);
      }
      await sendVerificationEmail();

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

const sendVerificationEmail = async () => {
  try {
    await auth().currentUser.sendEmailVerification();
    // console.log('Verification email sent');
  } catch (error) {
    // console.error(error);
  }
};

const updateProfileData = async (firstname, lastname) => {
  try {
    await auth().currentUser.updateProfile({
      displayName: firstname.trim() + ' ' + lastname.trim(),
    });
    // console.log('Update displayName');
  } catch (error) {
    // console.error(error);
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
export {
  userLogin,
  userLogOut,
  userSignUp,
  resendVerificationEmail,
  forgotPassword,
};
