import PropTypes from "prop-types";
import React from "react";
import { Text } from "@fluentui/react";

const ErrorPage = (props) => (
  <Text variant="xxLarge" style={{ color: "#ff0000" }}>Error: {props.message}</Text>
);

ErrorPage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorPage;