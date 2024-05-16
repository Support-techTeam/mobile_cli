import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncData = async ({storage_name: storageName}) => {
  try {
    const jsonValue = await AsyncStorage.getItem(storageName);
    const response = jsonValue != null ? JSON.parse(jsonValue) : null;

    return {
      error: false,
      message: 'Data Retrieval Successful!',
      data: response,
    };
  } catch (e) {
    return {
      error: true,
      message: e?.message || 'Something went wrong',
      data: null,
    };
  }
};

export const storeAsyncData = async ({
  storage_name: storageName,
  storage_value: storageValue,
}) => {
  try {
    const jsonValue = JSON.stringify(storageValue);
    const response = await AsyncStorage.setItem(storageName, jsonValue);
    return {
      error: false,
      message: 'Data Storage Successful!',
      data: response,
    };
  } catch (e) {
    return {
      error: true,
      message: e?.message || 'Something went wrong',
      data: null,
    };
  }
};

export const deleteAsyncData = async ({storage_name: storageName}) => {
  try {
    const response = await AsyncStorage.removeItem(storageName);
    return {
      error: false,
      message: 'Data Removal Successful!',
      data: response,
    };
  } catch (e) {
    return {
      error: true,
      message: e?.message || 'Something went wrong',
      data: null,
    };
  }
};
