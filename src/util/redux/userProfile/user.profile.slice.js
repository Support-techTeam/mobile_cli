import {createSlice} from '@reduxjs/toolkit';
import {PURGE} from 'redux-persist';

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    wallet: null,
    account: null,
    loanDetails: null,
    loans: null,
    transactions: null,
    multiWallet: null,
    balanceSB: '0.00',
    providusBanks: null,
    seerbitBanks: null,
  },
  reducers: {
    setProfile: (state, action) => {
      return {...state, profile: action.payload};
    },
    setWallet: (state, action) => {
      return {...state, wallet: action.payload};
    },
    setAccount: (state, action) => {
      return {...state, account: action.payload};
    },
    setLoanDetails: (state, action) => {
      return {...state, loanDetails: action.payload};
    },
    setLoans: (state, action) => {
      return {...state, loans: action.payload};
    },
    setTransactions: (state, action) => {
      return {...state, transactions: action.payload};
    },
    setMultipleWallets: (state, action) => {
      return {...state, multiWallet: action.payload};
    },
    setBalanceSB: (state, action) => {
      return {...state, balanceSB: action.payload};
    },
    setProvidusBanks: (state, action) => {
      return {...state, providusBanks: action.payload};
    },
    setSeerbitbanks: (state, action) => {
      return {...state, seerbitBanks: action.payload};
    },

    clearProfileReduxState: state => {
      // console.log('clearing profile');
      return {
        profile: null,
        wallet: null,
        account: null,
        loanDetails: null,
        loans: null,
        transactions: null,
        multiWallet: null,
        balanceSB: '0.00',   
        providusBanks: null,
        seerbitBanks: null,
      };
    },
  },
});

export const {
  setProfile,
  setWallet,
  setAccount,
  setLoanDetails,
  setLoans,
  setTransactions,
  clearProfileReduxState,
  setMultipleWallets,
  setBalanceSB,
  setProvidusBanks,
  setSeerbitbanks,
} = userProfileSlice.actions;
export const userProfileReducer = userProfileSlice.reducer;
