import Realm from 'realm';
import CryptoJS from 'crypto-js';
import {DdLogs} from '@datadog/mobile-react-native';
const LockSchema = {
  name: 'AppLock',
  properties: {
    id: 'int',
    userId: 'string',
    hashedPin: 'string',
    mobileNumber: 'string',
    createdAt: 'string',
  },
};

const realm = new Realm({schema: [LockSchema]});

// Create a new task and insert it into the database
const createLockPin = async details => {
  try {
    const isPinExisting = realm.objects('AppLock');
    if (isPinExisting.length < 1) {
      const md5Hash = CryptoJS.MD5(details.pin).toString();
      const data = realm.write(() => {
        realm.create('AppLock', {
          id: 1,
          userId: details.userId,
          hashedPin: md5Hash,
          mobileNumber: details.mobileNumber,
          createdAt: new Date().toLocaleDateString(),
        });
      });
      DdLogs.info(`Security | Create Pin | ${details?.userId}`, {
        context: JSON.stringify(details),
      });
      return {
        error: false,
        title: 'Create Pin',
        data: data,
        message: 'Created Successfully',
      };
    } else {
      DdLogs.warn(`Security | Create Pin | ${details?.userId}`, {
        context: JSON.stringify(details),
      });
      return {
        error: true,
        title: 'Create Pin',
        data: null,
        message: `Error Pin already Exist`,
      };
    }
  } catch (e) {
    DdLogs.error(`Security | Create Pin | ${details?.userId}`, {
      context: JSON.stringify(details),
      errorMessage: JSON.stringify(e),
    });
    return {
      error: true,
      title: 'Create Pin',
      data: e,
      message: `Error validating PIN: ${e}`,
    };
  }
};

const getAllPin = async () => {
  try {
    const allData = realm.objects('AppLock');
    if (allData.length > 0) {
      DdLogs.info(`Security | Get All Pin |`, {
        context: JSON.stringify(allData),
      });
      return {
        error: false,
        title: 'Get All Pin',
        data: allData,
        message: 'Retrieved Successfully',
      };
    } else {
      DdLogs.warn(`Security | Check Pin |`, {
        context: JSON.stringify(allData),
      });
      return {
        error: true,
        title: 'Check Pin',
        data: null,
        message: `Error validating PIN`,
      };
    }
  } catch (e) {
    DdLogs.error(`Security | Check Pin |`, {
      errorMessage: JSON.stringify(e),
    });
    return {
      error: true,
      title: 'Check Pin',
      data: null,
      message: `Error validating PIN: ${e}`,
    };
  }
};

const validatePin = async pin => {
  try {
    const md5Hash = CryptoJS.MD5(pin).toString();
    const userData = realm
      .objects('AppLock')
      .filtered(`hashedPin == $0`, md5Hash);

    if (userData.length > 0) {
      DdLogs.info(`Security | Check Pin | ${md5Hash}`, {
        context: JSON.stringify(userData),
      });
      return {
        error: false,
        title: 'Check Pin',
        data: null,
        message: 'Verified Successfully',
      };
    } else {
      DdLogs.warn(`Security | Check Pin | ${md5Hash}`, {
        context: JSON.stringify(userData),
      });
      return {
        error: true,
        title: 'Check Pin',
        data: null,
        message: `Error validating PIN`,
      };
    }
  } catch (error) {
    DdLogs.error(`Security | Check Pin |`, {
      errorMessage: JSON.stringify(error),
    });
    return {
      error: true,
      title: 'Check Pin',
      data: null,
      message: `Error validating PIN: ${error}`,
    };
  }
};

const changeCurrentPin = async (userId, oldPin, newPin) => {
  const hashedNewPin = CryptoJS.MD5(newPin).toString();
  const hashedOldPin = CryptoJS.MD5(oldPin).toString();

  const dataUpdate = realm
    .objects('AppLock')
    .filtered(`userId == $0 && hashedPin == $1`, userId, hashedOldPin);
  if (dataUpdate.length > 0) {
    realm.write(() => {
      dataUpdate[0].hashedPin = hashedNewPin;
    });
    DdLogs.info(`Security | Update Pin | ${userId}`, {
      context: JSON.stringify(dataUpdate),
    });
    return {
      error: false,
      title: 'Update Pin',
      data: null,
      message: 'Updated Successfully',
    };
  } else {
    DdLogs.warn(`Security | Update Pin | ${userId}`, {
      context: JSON.stringify(dataUpdate),
    });
    return {
      error: true,
      title: 'Update Pin',
      data: null,
      message: `Wrong Old Pin`,
    };
  }
};

const resetPin = async mobileNumber => {
  try {
    realm.write(() => {
      const dataToDelete = realm
        .objects('AppLock')
        .filtered('mobileNumber == $0', mobileNumber);
      if (dataToDelete.length > 0) {
        realm.delete(dataToDelete);
      } else {
        DdLogs.warn(`Security | Reset Pin | ${mobileNumber}`, {
          errorMessage: JSON.stringify(dataToDelete),
        });
        return {
          error: true,
          title: 'Reset Pin',
          data: null,
          message: `No Data Available`,
        };
      }
    });
    DdLogs.info(`Security | Reset Pin | ${mobileNumber}`, {
      context: JSON.stringify(dataToDelete),
    });
    return {
      error: false,
      title: 'Reset Pin',
      data: null,
      message: 'Reset Successfully',
    };
  } catch (e) {
    DdLogs.info(`Security | Reset Pin | ${mobileNumber}`, {
      errorMessage: JSON.stringify(e),
    });
    return {
      error: true,
      title: 'Reset Pin',
      data: null,
      message: `Invalid mobile number: ${e}`,
    };
  }
};

export {createLockPin, validatePin, changeCurrentPin, resetPin, getAllPin};
