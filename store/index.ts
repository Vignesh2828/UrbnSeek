import { configureStore } from "@reduxjs/toolkit";
import auth from "./apps/auth";
import services from "./apps/services";
import reviews from "./apps/review";
import user from "./apps/users"

export const store = configureStore({
  reducer: {
    auth,
    services,
    reviews,
    user
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
