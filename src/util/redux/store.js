import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {rootReducer} from './root-reducer';
import {clearProfileReduxState} from './userProfile/user.profile.slice';
import {clearAuthReduxState} from './userAuth/user.auth.slice';
import {clearLocationReduxState} from './locationData/location.data.slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['userAuth', 'locationData', 'userProfile'], //Things you want to persist
  // blacklist: ['userProfile'], //Things you don't want to persist
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export const resetStore = async () => {
  // clearProfileReduxState
  try {
    await persistor.purge();
    store.dispatch(clearProfileReduxState()); // Dispatch your reset action
    store.dispatch(clearAuthReduxState()); // Dispatch your reset action
    store.dispatch(clearLocationReduxState()); // Dispatch your reset action
    await persistor.flush();
  } catch (error) {
    console.error('Error resetting store:', error);
  }
};
