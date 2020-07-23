const { createAction, createReducer } = require("@reduxjs/toolkit");
const { reducerRegistry } = require("../../redux/reducerRegistry");

export const ErrorSources = {
  reduxMiddleware: "REDUX_MIDDLEWARE",
  windowErrorEvent: "WINDOW_ERROR_EVENT"
};

export const setLastError = createAction("SET_LAST_ERROR",
  (message, source) => ({ payload: {message, source} }));

reducerRegistry.register(
  "error",
  createReducer(
    {},
    {
      [setLastError]: (state, action) => {
        state.lastError = action.payload;
      }
    }
  )
);