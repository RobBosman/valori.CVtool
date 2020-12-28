import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import * as commonUtils from "../../utils/CommonUtils";

const CvTitle = (props) => {

  const formatDate = (dateText) => {
    try {
      const isoDate = new Date(dateText).toISOString();
      return `${isoDate.substr(8, 2)}-${isoDate.substr(5, 2)}-${isoDate.substr(0, 4)}`; // yyyy-mm-dd
    } catch (error) {
      return dateText;
    }
  };

  const memo = React.useMemo(() => {
    const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
    const account = props.accountEntity && props.accountEntity[cv?.accountId || props.selectedAccountId];
    return {
      name: account?.name || "<NAAM>",
      role: commonUtils.getValueOrFallback(cv, "role", props.locale) || "<ROL>",
      dateOfBirth: account?.dateOfBirth && formatDate(account.dateOfBirth) || "<GEBOORTEDATUM>",
      residence: account?.residence || "<WOONPLAATS>"
    };
  },
  [props.accountEntity, props.cvEntity, props.selectedAccountId, props.selectedCvId, props.locale]);

  return (
    <Stack styles={{ root: { textTransform: "uppercase", color: "#999999" } }}>
      <Text variant="xxLarge">{memo.name}</Text>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <Text variant="large">{memo.role}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{memo.dateOfBirth}</Text>
        <Text variant="large" style={{ color: "#f39900" }}>{"//"}</Text>
        <Text variant="large">{memo.residence}</Text>
      </Stack>
    </Stack>
  );
};

CvTitle.propTypes = {
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  selectedCvId: PropTypes.string,
  accountEntity: PropTypes.object
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedAccountId: store.ui.selectedId.account,
  selectedCvId: store.ui.selectedId.cv,
  accountEntity: store.safe.content.account
});

export default connect(select)(CvTitle);