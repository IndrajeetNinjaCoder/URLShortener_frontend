import { configureStore } from '@reduxjs/toolkit';
import urlReducer from './urlSlice';
import clickReducer from './clickSlice'
import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    url: urlReducer,
    clicks: clickReducer,
    auth: authReducer,
  },
});
