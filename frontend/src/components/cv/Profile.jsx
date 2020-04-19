import React from "react";
import { Stack, Text, TextField } from "@fluentui/react";
import { connect } from "react-redux";
import { mapHelpers, replaceSafeInstance } from "../../redux/safe";

const Profile = (props) => {

  const { instance: cv, getValue: getCvValue, getValueLocale: getCvValueLocale, onChange: onCvChange, onChangeLocale: onCvChangeLocale }
    = mapHelpers(props.cvEntity, props.cvId, props.locale, props.onCvChange);
  // Find the {profile} of the selected {account}.
  const accountId = props.account && props.account._id;
  const profile = accountId && props.profileEntity && Object.values(props.profileEntity).find((instance) => instance.accountId === accountId);
  const profileId = profile && profile._id;
  const { getValue: getProfileValue, onChange: onProfileChange } = mapHelpers(props.profileEntity, profileId, props.locale, props.onProfileChange);

  return (
    <Stack>
      <Text variant="xxLarge">Profiel</Text>
      <TextField
        label="Naam"
        value={getProfileValue('name')}
        disabled={!profile}
        onChange={onProfileChange('name')} />
      <TextField
        label="Rol"
        value={getCvValueLocale('role')}
        disabled={!cv}
        onChange={onCvChangeLocale('role')} />
      <TextField
        label="Woonplaats"
        value={getProfileValue('residence')}
        disabled={!profile}
        onChange={onProfileChange('recidence')} />
      <TextField
        label="Geboortedatum"
        value={getProfileValue('dateOfBirth')}
        disabled={!profile}
        onChange={onProfileChange('dateOfBirth')} />
      <TextField
        label="Profielschets"
        multiline
        autoAdjustHeight
        value={getCvValueLocale('profile')}
        disabled={!cv}
        onChange={onCvChangeLocale('profile')} />
      <TextField
        label="Interesses"
        multiline
        autoAdjustHeight
        value={getCvValueLocale('interests')}
        disabled={!cv}
        onChange={onCvChangeLocale('interests')} />
      <TextField
        label="Werkervaring sinds"
        placeholder='yyyy'
        styles={{ fieldGroup: { width: 100 } }}
        value={getCvValue('workingSince')}
        disabled={!cv}
        onChange={onCvChange('workingSince')} />
      <TextField
        label="IT ervaring sinds"
        styles={{ fieldGroup: { width: 100 } }}
        placeholder='yyyy'
        value={getCvValue('inItSince')}
        disabled={!cv}
        onChange={onCvChange('inItSince')} />
    </Stack>
  )
};

const select = (state) => ({
  account: state.authentication.account,
  profileEntity: state.safe.profile,
  cvEntity: state.safe.cv,
  cvId: state.ui.selected.cvId,
  locale: state.ui.locale
});

const mapDispatchToProps = (dispatch) => ({
  onCvChange: (id, instance) => dispatch(replaceSafeInstance('cv', id, instance)),
  onProfileChange: (id, instance) => dispatch(replaceSafeInstance('profile', id, instance))
});

export default connect(select, mapDispatchToProps)(Profile)