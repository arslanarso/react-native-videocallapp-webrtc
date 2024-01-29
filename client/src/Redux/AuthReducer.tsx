import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Initial state for the authentication slice of the Redux store.
 * @type {{ isAuthenticated: boolean, user: Object | null }}
 */
const initialState = {
  isAuthenticated: false,
  user: null,
};

/**
 * Redux slice for managing authentication state.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Redux action to log in a user.
     * @param {Object} state - The current authentication state.
     * @param {Object} action - The action object containing user data.
     */
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      // Save authentication data to AsyncStorage.
      saveAuthToAsyncStorage({isAuthenticated: true, user: action.payload});
    },
    /**
     * Redux action to log out a user.
     * @param {Object} state - The current authentication state.
     */
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;

      // Save authentication data to AsyncStorage.
      saveAuthToAsyncStorage({isAuthenticated: false, user: null});
    },
    // AsyncStorage'den oturum bilgilerini almak için bir eylem ekleyebilirsiniz
    // loadAuth: (state, action) => {
    //   state.isAuthenticated = action.payload.isAuthenticated;
    //   state.user = action.payload.user;
    // },
  },
});

/**
 * Function to save authentication data to AsyncStorage.
 * @param {Object} authData - The authentication data to be saved.
 */
const saveAuthToAsyncStorage = async authData => {
  try {
    await AsyncStorage.setItem('auth', JSON.stringify(authData));
  } catch (error) {
    console.error('AsyncStorage Error:', error);
  }
};

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
