import { combineReducers } from "redux";

export class ReducerRegistry {

  constructor() {
    this._notifyChange = null;
    this._reducers = {};
  }

  getRootReducer = () => {
    return Object.keys(this._reducers).length === 0
      ? (state = {}) => state
      : combineReducers(this._reducers);
  }

  register = (name, reducer) => {
    this._reducers = {
      ...this._reducers,
      [name]: reducer
    };
    if (this._notifyChange) {
      this._notifyChange(this.getRootReducer());
    }
  }

  setChangeListener = (listener) => {
    this._notifyChange = listener;
  }
}

export const reducerRegistry = new ReducerRegistry();