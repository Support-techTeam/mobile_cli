import {combineReducers, AnyAction, Reducer} from '@reduxjs/toolkit';
import {userAuthReducer} from './userAuth/user.auth.slice';
import {locationReducer} from './locationData/location.data.slice';
import {userProfileReducer} from './userProfile/user.profile.slice';
import {networkReducer} from './networkState/network.slice';
export const rootReducer = combineReducers({
  userAuth: userAuthReducer,
  locationData: locationReducer,
  userProfile: userProfileReducer,
  networkState: networkReducer,
});
