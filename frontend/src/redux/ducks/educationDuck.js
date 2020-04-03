"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";

export const setEducationType = createAction("SET_EDUCATION_TYPE", (value, id) => ({payload: {value, id}}));
export const setInstitution = createAction("SET_INSTITUTION", (value, id) => ({payload: {value, id}}));
export const setEducationName = createAction("SET_EDUCATION_NAME", (value, id, locale) => ({
    payload: {value, id, locale}
}));
export const setSyllabus = createAction("SET_SYLLABUS", (value, id, locale) => ({payload: {value, id, locale}}));
export const setYearDiploma = createAction("SET_YEAR_DIPLOMA", (value, id) => ({payload: {value, id}}));
export const setDiploma = createAction("SET_DIPLOMA", (value, id) => ({payload: {value, id}}));

const educationReducer = createReducer({
        education: {}
    },
    {
        [setEducationType]: (state, action) => {
            state.education[action.payload.id].educationType = action.payload.value
        },
        [setInstitution]: (state, action) => {
            state.education[action.payload.id].institution = action.payload.value
        },
        [setEducationName]: (state, action) => {
            state.education[action.payload.id].educationName[action.payload.locale] = action.payload.value
        },
        [setSyllabus]: (state, action) => {
            state.education[action.payload.id].syllabus[action.payload.locale] = action.payload.value
        },
        [setYearDiploma]: (state, action) => {
            state.education[action.payload.id].yearDiploma = action.payload.value
        },
        [setDiploma]: (state, action) => {
            state.education[action.payload.id].Diploma = action.payload.value
        }
    });

export default educationReducer