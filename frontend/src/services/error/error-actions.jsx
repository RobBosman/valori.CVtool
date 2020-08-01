const { createAction, createReducer } = require("@reduxjs/toolkit");
const { reducerRegistry } = require("../../redux/reducerRegistry");

export const ErrorSources = {
  REDUX_MIDDLEWARE: "REDUX_MIDDLEWARE",
  WINDOW_ERROR_EVENT: "WINDOW_ERROR_EVENT"
};

export const setLastError = createAction("SET_LAST_ERROR",
  (message, source) => ({ payload: {message, source} }));

reducerRegistry.register(
  "error",
  createReducer(
    {},
    {
      [setLastError]: (state, action) => {
        state.lastError = {
          ...action.payload,
          timestamp: Date.now()
        };
      }
    }
  )
);