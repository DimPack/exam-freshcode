import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';

const MODERATOR_SLICE_NAME = 'moderator';


export const fetchAllOffers = createAsyncThunk(
  `${MODERATOR_SLICE_NAME}/fetchAllOffers`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await restController.getAllOffers(params);
      console.log(response.data.offers);

      return response.data.offers;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const moderatorSlice = createSlice({
  name: 'moderator',
  initialState: {
    offers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default moderatorSlice.reducer;
