import { configureStore } from '@reduxjs/toolkit';
import commonReducer from './common';
import cartReducer from './cart';
import searchReducer from './search';
import notificationsReducer from './notification';

export default configureStore({
  reducer: {
    common: commonReducer,
    cart: cartReducer,
    search: searchReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
