// clickSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

const BASE_URL = `${baseUrl}/api/clicks`;

// 🔹 Fetch Clicks Data
export const fetchClicks = createAsyncThunk('clicks/fetch', async (_, thunkAPI) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch clicks');
  }
});

const clickSlice = createSlice({
  name: 'clicks',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClicks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default clickSlice.reducer;
