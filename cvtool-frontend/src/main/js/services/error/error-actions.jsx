const { createAction, createReducer } = require("@reduxjs/toolkit");
const { reducerRegistry } = require("../../redux/reducerRegistry");

export const ErrorSources = {
  REDUX_MIDDLEWARE: "REDUX_MIDDLEWARE",
  WINDOW_ERROR_EVENT: "WINDOW_ERROR_EVENT",
  USER_ACTION: "USER_ACTION"
};

export const setLastError = createAction("SET_LAST_ERROR",
  (message, source, stacktrace) => ({ payload: {message, source, stacktrace} }));

reducerRegistry.register(
  "error",
  createReducer(
    {},
    builder => builder
      .addCase(setLastError, (state, action) => ({
        ...state,
        lastError: {
          message: action.payload.message.substring(0, 1000),
          source: action.payload.source,
          stacktrace: action.payload.stacktrace,
          timestamp: Date.now()
        }
      }))
  )
);