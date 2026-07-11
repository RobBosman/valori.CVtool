import PropTypes from "prop-types";
import React from "react";
import {shallowEqual, useSelector} from "react-redux";
import nlFlagPng from "../../static/icon-flag-NL.png";
import ukFlagPng from "../../static/icon-flag-UK.png";

const LocaleFlag = prps => {

  const selectors = useSelector(
    state => ({
      locale: state.ui.userPrefs.locale
    }),
    {equalityFn: shallowEqual}
  );
  const props = {...prps, ...selectors};

  return <img
    src={props.locale === "uk_UK" ? ukFlagPng : nlFlagPng}
    alt={props.locale?.substring(3) || "NL"}
  />;
};

LocaleFlag.propTypes = {
  locale: PropTypes.string
};

export default LocaleFlag;