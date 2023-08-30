import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  state: null,
  city: null,
};

export const locationSlice = createSlice({
  name: 'locationData',
  initialState,
  reducers: {
    setReduxState: (state, action) => {
      return {...state.state, state: action.payload};
    },
    setReduxCity: (state, action) => {
      return {...state.city, city: action.payload};
    },
  },
});

export const {setReduxState, setReduxCity} = locationSlice.actions;
export const locationReducer = locationSlice.reducer;
