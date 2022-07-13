import { createSlice } from '@reduxjs/toolkit';

export const initState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initState,
  reducers: {
    loadNotification(state, { payload }) {
      state.notifications = payload;
    },
    updateNotification(state, { payload }) {
      const { _id } = payload;
      const index = state.notifications.findIndex((item) => item._id === _id);

      state.notifications[index] = payload;
    },
  },
});

const { actions, reducer } = notificationSlice;

export const notificationActions = actions;
export default reducer;
