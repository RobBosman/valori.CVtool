import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const generateCv = createAction("GENERATE_CV");

reducerRegistry.register(
  "cv",
  createReducer(
    {},
    {
      [generateCv]: (state) => {
        state.generateCvTimestamp = new Date();
      }
    }
  )
);