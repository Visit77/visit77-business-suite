import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { createLogger } from "redux-logger";

const isProduction = import.meta.env.VITE_NODE_ENV === "production"; // or process.env.NODE_ENV in Webpack

const logger = createLogger({
  level: "log",
  collapsed: true,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      !isProduction ? logger : [],
    ),
  devTools: !isProduction,
});
