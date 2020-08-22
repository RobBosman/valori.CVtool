import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";

const Profile = (props) => {

  const cvContext = {
    locale: props.locale,
    entity: props.cvEntity,
    entityId: props.selectedCvId,
    replaceInstance: props.onCvChange
  };
  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    entityId: props.cvEntity && props.cvEntity[props.selectedCvId] && props.cvEntity[props.selectedCvId].accountId,
    replaceInstance: props.onAccountChange
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
        instanceContext={accountContext} />
      <CvTextField
        label="Rol"
        localeField='role'
        instanceContext={cvContext} />
      <CvDatePicker
        label="Geboortedatum"
        field="dateOfBirth"
        instanceContext={accountContext}
        styles={{ root: { width: 140 } }} />
      <CvTextField
        label="Woonplaats"
        field="residence"
        instanceContext={accountContext} />
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
        placeholder='yyyy' 
        styles={{ fieldGroup: { width: 80 } }}/>
    </Stack>
  );
};

Profile.propTypes = {
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  accountEntity: PropTypes.object,
  onCvChange: PropTypes.func.isRequired,
  onAccountChange: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  cvEntity: state.safe.cv,
  selectedCvId: state.ui.selectedId["cv"],
  accountEntity: state.safe.account
});

const mapDispatchToProps = (dispatch) => ({
  onCvChange: (id, instance) => dispatch(replaceSafeInstance("cv", id, instance)),
  onAccountChange: (id, instance) => dispatch(replaceSafeInstance("account", id, instance))
});

export default connect(select, mapDispatchToProps)(Profile);