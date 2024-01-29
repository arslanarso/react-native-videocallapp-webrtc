import {createSlice} from '@reduxjs/toolkit';

/**
 * Initial state for the user slice of the Redux store.
 * @type {{ users: any[] }}
 */
const initialState = {
  users: [],
};

/**
 * Redux slice for managing user state.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Redux action to add a user to the state.
     * @param {Object} state - The current user state.
     * @param {Object} action - The action object containing the user to be added.
     */
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

// Export the addUser action and the reducer.
export const {addUser} = userSlice.actions;
export default userSlice.reducer;
