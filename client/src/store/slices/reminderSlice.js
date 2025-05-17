import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeReminder: null
};

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    showReminder: (state, { payload }) => {
      state.activeReminder = payload;
    },
    clearActiveReminder: (state) => {
      state.activeReminder = null;
    }
  }
});

export const { showReminder, clearActiveReminder } = reminderSlice.actions;
export default reminderSlice.reducer;