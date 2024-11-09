import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  estmateInfo:{},
  movings:[]
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEstimateInfo: (state, action) => {
      state.estmateInfo = action.payload;
    },
    setMovings: (state, action) => {
        state.movings= [...state.movings, action.payload]
    }

    // resetGeneralState: (state) => {
    //   state.dateSelected = null;
    //   state.loading = false;
    //   state.userInfo = {};
    // },
  },
});

export const { setLoading, setEstimateInfo, setMovings } = generalSlice.actions;

export default generalSlice.reducer;
