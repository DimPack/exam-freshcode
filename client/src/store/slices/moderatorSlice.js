import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';

const MODERATOR_SLICE_NAME = 'moderator';

// Отримати всі офери
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

// Відобразити офер замовнику (змінити статус на visible)
export const makeOfferVisible = createAsyncThunk(
  `${MODERATOR_SLICE_NAME}/makeOfferVisible`,
  async ({ offerId }, { rejectWithValue }) => {
    try {
      const response = await restController.makeOfferVisible({ offerId });
      return response.data.offer;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Видалити офер
export const deleteOffer = createAsyncThunk(
  `${MODERATOR_SLICE_NAME}/deleteOffer`,
  async ({ offerId }, { rejectWithValue }) => {
    try {
      await restController.deleteOffer({ offerId });
      return offerId;
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
      // Додаємо makeOfferVisible
      .addCase(makeOfferVisible.pending, (state) => {
        state.error = null;
      })
      .addCase(makeOfferVisible.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOffer = action.payload;
        const index = state.offers.findIndex((offer) => offer.id === updatedOffer.id);
        if (index !== -1) {
          state.offers[index] = updatedOffer;
        }
      })
      .addCase(makeOfferVisible.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Додаємо deleteOffer
      .addCase(deleteOffer.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.filter((offer) => offer.id !== action.payload);
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default moderatorSlice.reducer;