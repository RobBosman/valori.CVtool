"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit"

export const setFunction = createAction("SET_FUNCTION", (id, locale, value) => ({payload: {id, locale, value}}));
export const setPersonality = createAction("SET_PERSONALITY", (id, locale, value) => ({payload: {id, locale, value}}));
export const setInterests = createAction("SET_INTERESTS", (id, locale, value) => ({payload: {id, locale, value}}));

const initialSubState = {
    cv: {}
};

const reducer = createReducer(initialSubState, {
    [setFunction]: (state, action) => {
        state.cv[action.payload.id].function[action.payload.locale] = action.payload.value
    },
    [setPersonality]: (state, action) => {
        state.cv[action.payload.id].personality[action.payload.locale] = action.payload.value
    },
    [setInterests]: (state, action) => {
        state.cv[action.payload.id].interests[action.payload.locale] = action.payload.value
    }
});

export default reducer