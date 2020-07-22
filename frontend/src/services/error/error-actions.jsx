const { createAction, createReducer } = require("@reduxjs/toolkit");
const { reducerRegistry } = require("../../redux/reducerRegistry");

export const setLastError = createAction("SET_LAST_ERROR");

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