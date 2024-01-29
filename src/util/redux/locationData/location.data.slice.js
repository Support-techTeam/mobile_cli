import {createSlice} from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: 'locationData',
  initialState: {
    state: null,
    city: null,
  },
  reducers: {
    setReduxState: (state, action) => {
      return {...state, state: action.payload};
    },
    setReduxCity: (state, action) => {
      return {...state, city: action.payload};
    },
    clearLocationReduxState: state => {
      return {
        state: null,
        city: null,
      };
    },
  },
});

export const {setReduxState, setReduxCity, clearLocationReduxState} =
  locationSlice.actions;
export const locationReducer = locationSlice.reducer;
