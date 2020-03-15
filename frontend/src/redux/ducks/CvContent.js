"use strict";

const SET_CV_CONTENT = "SET_CV_CONTENT";
const SET_CV_VOORNAAM = "SET_CV_VOORNAAM";
const SET_CV_ACHTERNAAM = "SET_CV_ACHTERNAAM";
const SET_CV_PROFIELSCHETS = "SET_CV_PROFIELSCHETS";
const SET_CV_PERSOONLIJKE_EIGENSCHAPPEN = "SET_CV_PERSOONLIJKE_EIGENSCHAPPEN";
const SET_CV_INTERESSES = "SET_CV_INTERESSES";

export const setCvContent = (value) => ({type: SET_CV_CONTENT, payload: value});
export const setCvVoornaam = (value) => ({type: SET_CV_VOORNAAM, payload: value});
export const setCvAchternaam = (value) => ({type: SET_CV_ACHTERNAAM, payload: value});
export const setCvProfielschets = (value) => ({type: SET_CV_PROFIELSCHETS, payload: value});
export const setCvPersoonlijkeEigenschappen = (value) => ({type: SET_CV_PERSOONLIJKE_EIGENSCHAPPEN, payload: value});
export const setCvInteresses = (value) => ({type: SET_CV_INTERESSES, payload: value});

const initialSubState = {
    voornaam: "",
    achternaam: "",
    profielschets: "",
    persoonlijkeEigenschappen: "",
    interesses: ""
};

const reducer = (subState = initialSubState, action) => {
    switch (action.type) {
        case SET_CV_CONTENT:
            return action.payload;
        case SET_CV_VOORNAAM:
            return {
                ...subState,
                voornaam: action.payload
            };
        case SET_CV_ACHTERNAAM:
            return {
                ...subState,
                achternaam: action.payload
            };
        case SET_CV_PROFIELSCHETS:
            return {
                ...subState,
                profielschets: action.payload
            };
        case SET_CV_PERSOONLIJKE_EIGENSCHAPPEN:
            return {
                ...subState,
                persoonlijkeEigenschappen: action.payload
            };
        case SET_CV_INTERESSES:
            return {
                ...subState,
                interesses: action.payload
            };
        default:
            return subState
    }
};
export default reducer