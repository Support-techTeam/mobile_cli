import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  wallet: null,
  account: null,
  loanDetails: null,
  loans: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      return {...state.profile, profile: action.payload};
    },
    setWallet: (state, action) => {
      return {...state.wallet, wallet: action.payload};
    },
    setAccount: (state, action) => {
      return {...state.account, account: action.payload};
    },
    setLoanDetails: (state, action) => {
      return {...state.loanDetails, loanDetails: action.payload};
    },
    setLoans: (state, action) => {
      return {...state.loans, loans: action.payload};
    },
  },
});

export const {setProfile, setWallet, setAccount, setLoanDetails, setLoans} =
  userProfileSlice.actions;
export const userProfileReducer = userProfileSlice.reducer;
