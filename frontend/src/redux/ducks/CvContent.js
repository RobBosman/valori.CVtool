"use strict";

import RichTextEditor from "react-rte"

const SET_CV_CONTENT_HTML = "SET_CV_CONTENT_HTML";
const SET_CV_CONTENT_RTE = "SET_CV_CONTENT_RTE";

export const setCvContentHTML = (valueHTML) => ({type: SET_CV_CONTENT_HTML, valueHTML});
export const setCvContentRTE = (valueRTE) => ({type: SET_CV_CONTENT_RTE, valueRTE});

const initialSubState = {
    asHTML: "",
    asRTE: RichTextEditor.createEmptyValue()
};

const reducer = (subState = initialSubState, action) => {
    switch (action.type) {
        case SET_CV_CONTENT_HTML:
            return {
                ...subState,
                asHTML: action.valueHTML
            };
        case SET_CV_CONTENT_RTE:
            return {
                ...subState,
                asRTE: action.valueRTE
            };
        default:
            return subState;
    }
};
export default reducer