import { store } from "./store";

const { createAction, createReducer } = require("@reduxjs/toolkit");
const { reducerRegistry } = require("./reducerRegistry");

export const setEpicError = createAction("SET_EPIC_ERROR");
export const setWindowError = createAction("SET_WINDOW_ERROR");

reducerRegistry.register(
  "error",
  createReducer(
    {},
    {
      [setEpicError]: (state, action) => {
        state.epicError = action.payload;
      },
      [setWindowError]: (state, action) => {
        state.windowError = action.payload;
      }
    }
  )
);
  
window.addEventListener("unhandledrejection", (event) => {
  console.error(`Uncaught error in Promise - ${JSON.stringify(event)}`);
  store.dispatch(setWindowError(event));
});
  
window.addEventListener("error", (event) => {
  console.error(`Uncaught error - ${JSON.stringify(event)}`);
  store.dispatch(setWindowError(event));
});