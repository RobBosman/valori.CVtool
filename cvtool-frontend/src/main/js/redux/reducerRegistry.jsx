import { combineReducers } from "@reduxjs/toolkit";

export class ReducerRegistry {

  #notifyChange = null;
  #reducers = {};

  getRootReducer = () =>
    combineReducers(this.#reducers);

  register = (name, reducer) => {
    this.#reducers = {
      ...this.#reducers,
      [name]: reducer
    };
    if (this.#notifyChange) {
      this.#notifyChange(this.getRootReducer());
    }
  };

  setChangeListener = (listener) => {
    this.#notifyChange = listener;
  };
}

export const reducerRegistry = new ReducerRegistry();