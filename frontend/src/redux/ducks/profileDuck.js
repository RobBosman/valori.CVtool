"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";

export const setFunction = createAction("SET_FUNCTION", (value, id, locale) => ({payload: {value, id, locale}}));
export const setPersonality = createAction("SET_PERSONALITY", (value, id, locale) => ({payload: {value, id, locale}}));
export const setInterests = createAction("SET_INTERESTS", (value, id, locale) => ({payload: {value, id, locale}}));
export const setWorkingExperienceSince = createAction("SET_WORKING_EXPERIENCE_SINCE", (value, id) => ({
    payload: {
        value,
        id
    }
}));
export const setItExperienceSince = createAction("SET_IT_EXPERIENCE_SINCE", (value, id) => ({payload: {value, id}}));

const profileReducer = createReducer({
        cv: {}
    },
    {
        [setFunction]: (state, action) => {
            state.cv[action.payload.id].function[action.payload.locale] = action.payload.value
        },
        [setPersonality]: (state, action) => {
            state.cv[action.payload.id].personality[action.payload.locale] = action.payload.value
        },
        [setInterests]: (state, action) => {
            state.cv[action.payload.id].interests[action.payload.locale] = action.payload.value
        },
        [setWorkingExperienceSince]: (state, action) => {
            state.cv[action.payload.id].workingExperienceSince = action.payload.value
        },
        [setItExperienceSince]: (state, action) => {
            state.cv[action.payload.id].itExperienceSince = action.payload.value
        }
    });

export default profileReducer