import React from 'react';
import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
// Encryption key (should be securely stored)

const service = 'com.tradelenda-alias';
const encryptionKey = 'tradelenda';

// Encrypt password
const encryptData = async data => {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

// Decrypt data
const decryptData = async encryptedData => {
  return CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(
    CryptoJS.enc.Utf8,
  );
};

//set keychain to service
const storeSensitiveData = async (username, unsecurePassword) => {

  const password = await encryptData(unsecurePassword);
  try {
    const dataStore = await Keychain.setInternetCredentials(
      service,
      username,
      password,
    );
    return dataStore;
  } catch (err) {
    return err?.message;
  }
};

const retrieveSenditiveData = async () => {
  try {
    const credentials = await Keychain.getInternetCredentials(service);
    return credentials;
  } catch (err) {
    return err?.message;
  }
};

const hasSensitiveData = async () => {
  try {
    const hasService = await Keychain.hasInternetCredentials(service);
    return hasService;
  } catch (err) {
    return err?.message;
  }
};

const deleteSensitiveData = async () => {
  try {
    const res = await Keychain.resetInternetCredentials(service);
    return res;
  } catch (err) {
    return err?.message;
  }
};

// // Usage example
// const password = 'userPassword123';
// const encryptedPassword = encryptPassword(password);
// console.log('Encrypted Password:', encryptedPassword);

// const decryptedPassword = decryptPassword(encryptedPassword);
// console.log('Decrypted Password:', decryptedPassword);
// // console.log('Decrypted Password:', decryptedPassword);

export {
  encryptData,
  decryptData,
  storeSensitiveData,
  retrieveSenditiveData,
  hasSensitiveData,
  deleteSensitiveData,
};
