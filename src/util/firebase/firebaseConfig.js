import firebase from 'react-native-firebase';
// import firebase from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
import firebase_config from '../../../app.json';

const firebaseConfig = {
  //   apiKey: firebase_config.apiKey,
  //   authDomain: firebase_config.authDomain,
  //   projectId: firebase_config.projectId,
  //   storageBucket: firebase_config.storageBucket,
  //   messagingSenderId: firebase_config.messagingSenderId,
  //   appId: firebase_config.appId,
  apiKey: 'AIzaSyCjf2yeQk6DkOLiPbigFK1oi1slcmmFJQo',
  authDomain: 'tradelenda-staging.firebaseapp.com',
  databaseURL:
    'https://tradelenda-staging-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'tradelenda-staging',
  storageBucket: 'tradelenda-staging.appspot.com',
  messagingSenderId: '1046946781296',
  appId: '1:1046946781296:web:2915787620c19ca662fcb5',
  measurementId: 'G-1JEE8QKLC7',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
