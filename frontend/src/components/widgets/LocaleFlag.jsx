import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import nlFlagPng from "../../static/icon-flag-NL.png";
import ukFlagPng from "../../static/icon-flag-UK.png";

const LocaleFlag = (props) => (
  <img
    src={props.locale === "uk_UK" ? ukFlagPng : nlFlagPng}
    alt={props.locale?.substr(3) || "NL"}
  />
);

LocaleFlag.propTypes = {
  locale: PropTypes.string.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale
});

export default connect(select)(LocaleFlag);