import React from "react";
import { Stack, Text } from "@fluentui/react";
import { connect } from "react-redux";

const select = (state) => ({
  account: state.authentication.account,
  profileEntity: state.safe.profile,
  cvEntity: state.safe.cv,
  locale: state.ui.locale
});

const CvTitle = (props) => {
  // Find the {profile} of the selected {account}.
  const accountId = props.account && props.account._id;
  const profile = accountId
    && props.profileEntity
    && Object.values(props.profileEntity).find((instance) => instance.accountId === accountId);
  const cv = accountId
    && props.cvEntity
    && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);

  if (profile && cv) {
    const title = profile.name || 'NAAM';
    const role = cv.role && cv.role[props.locale] || 'ROL';
    const dateOfBirth = profile.dateOfBirth || 'GEBOORTEDATUM';
    const residence = profile.residence || 'WOONPLAATS';

    return (
      <Stack styles={{ root: { textTransform: 'uppercase', color: '#999999' } }}>
        <Text variant="xxLarge">{title}</Text>
        <Stack horizontal
          tokens={{ childrenGap: 10 }}>
          <Text variant="large">{role}</Text>
          <Text variant="large" style={{ color: '#f39900' }}>{'//'}</Text>
          <Text variant="large">{dateOfBirth}</Text>
          <Text variant="large" style={{ color: '#f39900' }}>{'//'}</Text>
          <Text variant="large">{residence}</Text>
        </Stack>
      </Stack>
    )
  } else {
    return null;
  }
};

export default connect(select)(CvTitle)