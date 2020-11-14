import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";

const CvTitle = (props) => {
  
  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const account = props.accountEntity && props.accountEntity[cv?.accountId];
  const titleFields = {
    name: account?.name || "<NAAM>",
    role: cv?.role && cv.role[props.locale] || "<ROL>",
    dateOfBirth: account?.dateOfBirth && new Date(account.dateOfBirth).toLocaleDateString(props.locale.substr(0, 2)) || "<GEBOORTEDATUM>",
    residence: account?.residence || "<WOONPLAATS>"
  };

  return (
    <Stack styles={{ root: { textTransform: "uppercase", color: "#999999" } }}>
      <Text variant="xxLarge">{titleFields.name}</Text>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <Text variant="large">{titleFields.role}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{titleFields.dateOfBirth}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{titleFields.residence}</Text>
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
  cvEntity: state.safe.content.cv,
  selectedCvId: state.ui.selectedId["cv"],
  accountEntity: state.safe.content.account
});

export default connect(select)(CvTitle);