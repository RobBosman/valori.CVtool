import PropTypes from "prop-types";
import React from "react";
import { Stack, Text } from "@fluentui/react";
import { connect } from "react-redux";

const CvTitle = (props) => {
  
  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const account = props.accountEntity && props.accountEntity[cv?.accountId];
  const title = account?.name || "<NAAM>";
  const role = cv?.role && cv.role[props.locale] || "<ROL>";
  const dateOfBirth = account?.dateOfBirth || "<GEBOORTEDATUM>";
  const residence = account?.residence || "<WOONPLAATS>";

  return (
    <Stack styles={{ root: { textTransform: "uppercase", color: "#999999" } }}>
      <Text variant="xxLarge">{title}</Text>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <Text variant="large">{role}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{dateOfBirth}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{residence}</Text>
      </Stack>
    </Stack>
  );
};

CvTitle.propTypes = {
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  accountEntity: PropTypes.object
};

const select = (state) => ({
  locale: state.ui.locale,
  cvEntity: state.safe.cv,
  selectedCvId: state.ui.selectedId["cv"],
  accountEntity: state.safe.account
});

export default connect(select)(CvTitle);