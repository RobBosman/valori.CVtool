import React from "react";
import { Stack, Text } from "@fluentui/react";
import CvLogo from "./CvLogo";
import { connect } from "react-redux";

const select = (state) => ({
  account: state.authentication.account,
  profileEntity: state.safe.profile,
  cvEntity: state.safe.cv,
  locale: state.ui.locale
});

const CvTitleBar = (props) => {
  // Find the {profile} of the selected {account}.
  const accountId = props.account && props.account._id;
  const profile = accountId
    && props.profileEntity
    && Object.values(props.profileEntity).find((instance) => instance.accountId === accountId);
  const cv = accountId
    && props.cvEntity
    && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);

  return (
    <Stack horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 20 }}>
      <CvLogo />
      <Stack>
        <Text variant="xxLarge">{profile && profile.name}</Text>
        <Stack horizontal
          tokens={{ childrenGap: 10 }}>
          <Text variant="large">{cv && cv.role && cv.role[props.locale]}</Text>
          <Text variant="large">{profile && profile.dateOfBirth}</Text>
          <Text variant="large">{profile && profile.residence}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
};

export default connect(select)(CvTitleBar)