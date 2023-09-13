import {createSlice} from '@reduxjs/toolkit';

export const networkSlice = createSlice({
  name: 'network',
  initialState: {
    network: null,
  },
  reducers: {
    setNetwork: (state, action) => {
      return {...state, network: action.payload};
    },
  },
});

export const {setNetwork} = networkSlice.actions;
export const networkReducer = networkSlice.reducer;
