import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeApp} from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import {firebase_config} from '../../../app.json';

const firebaseConfig = {
  apiKey: firebase_config.apiKey,
  authDomain: firebase_config.authDomain,
  projectId: firebase_config.projectId,
  storageBucket: firebase_config.storageBucket,
  messagingSenderId: firebase_config.messagingSenderId,
  appId: firebase_config.appId,
  measurementId: firebase_config.measurementId,
  databaseURL: firebase_config.databaseURL,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export {auth};
