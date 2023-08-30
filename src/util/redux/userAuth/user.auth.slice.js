import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
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
  },
});

export const {signInUser, signOutUser, signUpUser} = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
