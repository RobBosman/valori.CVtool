import { combineReducers } from "@reduxjs/toolkit";

export class ReducerRegistry {

  constructor() {
    this._notifyChange = null;
    this._reducers = {};
  }

  getRootReducer = () =>
    combineReducers(this._reducers);

  register = (name, reducer) => {
    this._reducers = {
      ...this._reducers,
      [name]: reducer
    };
    if (this._notifyChange) {
      this._notifyChange(this.getRootReducer());
    }
  };

  setChangeListener = (listener) => {
    this._notifyChange = listener;
  };
}

export const reducerRegistry = new ReducerRegistry();