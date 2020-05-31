import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import CvDatePicker from "../widgets/CvDatePicker";
import CvTextField from "../widgets/CvTextField";
import { useTheme } from "../../services/ui/ui-services";

const Profile = (props) => {
  // Find the {profile} of the selected {account}.
  const accountId = props.account && props.account._id;
  const profile = accountId
    && props.profileEntity
    && Object.values(props.profileEntity).find((instance) => instance.accountId === accountId);

  const cvContext = {
    entity: props.cvEntity,
    entityId: props.cvId,
    locale: props.locale,
    replaceInstance: props.onCvChange
  };
  const profileContext = {
    entity: props.profileEntity,
    entityId: profile && profile._id,
    locale: props.locale,
    replaceInstance: props.onProfileChange
  };
  const { editPaneColor } = useTheme();
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
      }
    ]
  };

  return (
    <Stack styles={editStyles}>
      <Text variant="xxLarge">Profiel</Text>
      <CvTextField
        label="Naam"
        field="name"
        instanceContext={profileContext} />
      <CvTextField
        label="Rol"
        localeField='role'
        instanceContext={cvContext} />
      <CvDatePicker
        label="Geboortedatum"
        field="dateOfBirth"
        instanceContext={profileContext}
        styles={{ root: { width: 140 } }} />
      <CvTextField
        label="Woonplaats"
        field="residence"
        instanceContext={profileContext} />
      <CvTextField
        label="Profielschets"
        localeField='profile'
        instanceContext={cvContext}
        multiline
        autoAdjustHeight />
      <CvTextField
        label="Interesses"
        localeField='interests'
        instanceContext={cvContext}
        multiline
        autoAdjustHeight />
      <CvTextField
        label="Werkervaring sinds"
        field="workingSince"
        instanceContext={cvContext}
        placeholder='yyyy'
        styles={{ fieldGroup: { width: 80 } }} />
      <CvTextField
        label="IT ervaring sinds"
        field="inItSince"
        instanceContext={cvContext}
        styles={{ fieldGroup: { width: 80 } }}
        placeholder='yyyy' />
    </Stack>
  );
};

Profile.propTypes = {
  account: PropTypes.object,
  profileEntity: PropTypes.object,
  cvEntity: PropTypes.object,
  cvId: PropTypes.string,
  locale: PropTypes.string,
  onCvChange: PropTypes.func.isRequired,
  onProfileChange: PropTypes.func.isRequired
};

const select = (state) => ({
  account: state.authentication.account,
  profileEntity: state.safe.profile,
  cvEntity: state.safe.cv,
  cvId: state.ui.selected.cvId,
  locale: state.ui.locale
});

const mapDispatchToProps = (dispatch) => ({
  onCvChange: (id, instance) => dispatch(replaceSafeInstance("cv", id, instance)),
  onProfileChange: (id, instance) => dispatch(replaceSafeInstance("profile", id, instance))
});

export default connect(select, mapDispatchToProps)(Profile);