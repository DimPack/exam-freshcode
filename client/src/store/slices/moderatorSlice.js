import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';

const MODERATOR_SLICE_NAME = 'moderator';

export const fetchAllOffers = createAsyncThunk(
  `${MODERATOR_SLICE_NAME}/fetchAllOffers`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await restController.getAllOffers(params);
      return response.data.offers;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOfferStatus = createAsyncThunk(
  `${MODERATOR_SLICE_NAME}/updateOfferStatus`,
  async ({ offerId, status }, { rejectWithValue }) => {
    try {
      const response = await restController.updateOfferStatus({ offerId, status });
      return response.data.offer;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const moderatorSlice = createSlice({
  name: MODERATOR_SLICE_NAME,
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
      })
      .addCase(updateOfferStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOfferStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOffer = action.payload;
        const index = state.offers.findIndex((offer) => offer.id === updatedOffer.id);
        if (index !== -1) {
          state.offers[index] = updatedOffer;
        }
      })
      .addCase(updateOfferStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default moderatorSlice.reducer;