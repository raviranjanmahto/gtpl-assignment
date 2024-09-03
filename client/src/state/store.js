import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { userApi } from "./api/userApi";
import userReducer from "./slice/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(userApi.middleware),
});

setupListeners(store.dispatch); // Set up listeners for refetching data when the internet connection is restored

export default store;
