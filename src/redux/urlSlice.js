import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;


const BASE_URL_URL = `${baseUrl}/api/url`;
const BASE_URL_CLICKS = `${baseUrl}/api/clicks`;

// 🔹 Create Short URL
export const createShortUrl = createAsyncThunk('url/create', async (data, thunkAPI) => {
  try {
    const authToken = localStorage.getItem('authToken');

    const response = await axios.post(`${BASE_URL_URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create short URL');
  }
});

// 🔹 Fetch All URLs with total clicks
export const fetchUrls = createAsyncThunk('url/fetchAll', async (_, thunkAPI) => {
  try {
    const [urlsResponse, clicksResponse] = await Promise.all([
      axios.get(`${BASE_URL_URL}/all`),
      axios.get(`${BASE_URL_CLICKS}`),
    ]);

    const urls = urlsResponse.data;
    const clicks = clicksResponse.data;

    const clickMap = clicks.reduce((acc, click) => {
      acc[click.urlId] = (acc[click.urlId] || 0) + 1;
      return acc;
    }, {});

    const enrichedUrls = urls
      .map((url) => ({
        ...url,
        clicks: clickMap[url._id] || 0,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 🔄 Sorted newest first

    return enrichedUrls;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch URLs');
  }
});


const urlSlice = createSlice({
  name: 'url',
  initialState: {
    urls: [],
    loading: false,
    error: null,
    createdUrl: null,
  },
  reducers: {
    resetCreatedUrl: (state) => {
      state.createdUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.createdUrl = action.payload;
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreatedUrl } = urlSlice.actions;
export default urlSlice.reducer;
