import {auth} from '../util/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {BASE_URL} from '../../app.json';

const userLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await AsyncStorage.setItem('hasUser', 'true');
    return {
      user: user,
      title: 'Account Login',
      error: false,
      message: 'Login Successful',
    };
  } catch (err) {
    return {
      user: null,
      title: 'Account Login',
      error: true,
      message: `${err.message}`,
    };
  }
};

const userLogOut = async () => {
  try {
    await signOut(auth);
    return {
      user: null,
      title: 'Account Logout',
      error: false,
      message: 'Logout Successful',
    };
  } catch (err) {
    return {
      user: null,
      title: 'Account Logout',
      error: true,
      message: 'Logout Failed',
    };
  }
};

const userSignUp = async details => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      details.email.trim(),
      details.password.trim(),
    );
    const newUser = userCredential.user;

    if (newUser) {
      await updateProfile(newUser, {
        displayName: details.firstname.trim() + ' ' + details.lastname.trim(),
      });
    }
    await sendEmailVerification(newUser);

    return {
      user: newUser,
      title: 'Account Signup',
      error: false,
      message: 'Signup Successful',
    };
  } catch (err) {
    return {
      user: null,
      title: 'Account Signup',
      error: true,
      message: `${err.message}`,
    };
  }
};

const resendVerificationEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    return {
      user: auth.currentUser,
      title: 'Resend Verification Email',
      error: false,
      message: 'Resend Verification Email Successful',
    };
  } catch (err) {
    return {
      user: auth.currentUser,
      title: 'Resend Verification Email',
      error: false,
      message: `${err.message}`,
    };
  }
};

const forgotPassword = async email => {
  try {
    const actionCodeSettings = {
      url: `${BASE_URL}/login/?email=${email}`,
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
    return {
      user: auth.currentUser,
      title: 'Password Reset',
      error: false,
      message: 'Password reset link sent to email.',
    };
  } catch (err) {
    return {
      user: auth.currentUser,
      title: 'Password Reset',
      error: false,
      message: `${err.message}`,
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
