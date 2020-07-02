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
        state.epic = action.payload;
      },
      [setWindowError]: (state, action) => {
        state.window = action.payload;
      }
    }
  )
);