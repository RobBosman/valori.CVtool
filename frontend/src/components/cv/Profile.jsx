import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";

const Profile = (props) => {

  const cvContext = {
    locale: props.locale,
    entity: props.cvEntity,
    instanceId: props.selectedCvId,
    replaceInstance: props.onCvChange
  };
  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    instanceId: props.cvEntity && props.cvEntity[props.selectedCvId] && props.cvEntity[props.selectedCvId].accountId,
    replaceInstance: props.onAccountChange
  };
  const { editPaneColor } = useTheme();
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20,
        maxWidth: "calc(100vw - 200px)"
      }
    ]
  };

  return (
    <Stack styles={editStyles}>
      <Text variant="xxLarge">Profiel</Text>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <Stack
          styles={{ root: { width: "50%" } }}>
          <CvTextField
            label="Naam"
            field="name"
            instanceContext={accountContext}
          />
          <CvTextField
            label="Rol"
            localeField='role'
            instanceContext={cvContext}
          />
          <Stack horizontal
            tokens={{ childrenGap: "l1" }}>
            <CvDatePicker
              label="Geboortedatum"
              field="dateOfBirth"
              instanceContext={accountContext}
              styles={{ root: { width: 140 } }}
            />
            <CvTextField
              label="Woonplaats"
              field="residence"
              instanceContext={accountContext}
              styles={{ root: { width: "100%" } }}
            />
          </Stack>
          <CvTextField
            label="Interesses"
            localeField='interests'
            instanceContext={cvContext}
            multiline
            autoAdjustHeight
          />
        </Stack>
        <CvTextField
          label="Profielschets"
          localeField='profile'
          instanceContext={cvContext}
          multiline
          autoAdjustHeight
          styles={{ root: { width: "50%" } }}
        />
      </Stack>
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
  cvEntity: state.safe.content.cv,
  selectedCvId: state.ui.selectedId["cv"],
  accountEntity: state.safe.content.account
});

const mapDispatchToProps = (dispatch) => ({
  onCvChange: (id, instance) => dispatch(changeInstance("cv", id, instance)),
  onAccountChange: (id, instance) => dispatch(changeInstance("account", id, instance))
});

export default connect(select, mapDispatchToProps)(Profile);