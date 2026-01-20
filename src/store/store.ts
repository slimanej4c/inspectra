import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import unitsReducer from "./slices/unitsSlice";
import workshopsReducer from "./slices/workshopsSlice";
import extinguishersReducer from "./slices/extinguishersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    units: unitsReducer,
    workshops: workshopsReducer,
    extinguishers: extinguishersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
