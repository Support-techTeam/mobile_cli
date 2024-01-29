import {createSlice} from '@reduxjs/toolkit';

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    user: null,
  },
  reducers: {
    signInUser: (state, action) => {
      return {...state, user: action.payload};
    },

    signOutUser: (state, action) => {
      return {...state, user: action.payload};
    },
    signUpUser: (state, action) => {
      return {...state, user: action.payload};
    },
    clearAuthReduxState: state => {
      return {user: null};
    },
  },
});

export const {signInUser, signOutUser, signUpUser, clearAuthReduxState} =
  userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
