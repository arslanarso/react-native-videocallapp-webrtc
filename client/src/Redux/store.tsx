import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import authReducer from './AuthReducer';

// Configure the Redux store with reducers for different slices of state.
const store = configureStore({
  reducer: {
    user: UserReducer, // User slice of state
    auth: authReducer, // Authentication slice of state
  },
});

// Define types for RootState and AppDispatch based on the store configuration.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
