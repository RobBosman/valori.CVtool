import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";
import * as commonUtils from "../../utils/CommonUtils";

const Profile = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const cvContext = {
    locale: props.locale,
    entity: props.cvEntity,
    instanceId: props.selectedCvId,
    replaceInstance: props.onCvChange,
    readOnly: !isEditable
  };
  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    instanceId: cv?.accountId,
    replaceInstance: props.onAccountChange,
    readOnly: !isEditable
  };
  const {editPaneBackground} = useTheme();
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      maxWidth: "calc(100vw - 200px)",
      height: "calc(100vh - 170px)"
    }
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
            field={`role.${props.locale}`}
            instanceContext={cvContext}
            placeholder={commonUtils.getValueOrFallback(cv, "role", props.locale)}
          />
          <Stack horizontal
            tokens={{ childrenGap: "l1" }}>
            <CvDatePicker
              label="Geboortedatum"
              field="dateOfBirth"
              instanceContext={accountContext}
              styles={{ root: { minWidth: 120 } }}
            />
            <CvTextField
              label="Woonplaats"
              field="residence"
              instanceContext={accountContext}
              styles={{ root: { width: "100%" } }}
            />
          </Stack>
        </Stack>
        <Stack
          styles={{ root: { width: "50%" } }}>
          <CvTextField
            label="Profielschets"
            field={`profile.${props.locale}`}
            instanceContext={cvContext}
            multiline
            autoAdjustHeight
          />
          <CvTextField
            label="Interesses"
            field={`interests.${props.locale}`}
            instanceContext={cvContext}
            multiline
            autoAdjustHeight
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

Profile.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  accountEntity: PropTypes.object,
  onCvChange: PropTypes.func.isRequired,
  onAccountChange: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  accountEntity: store.safe.content.account
});

const mapDispatchToProps = (dispatch) => ({
  onCvChange: (id, instance) => dispatch(changeInstance("cv", id, instance)),
  onAccountChange: (id, instance) => dispatch(changeInstance("account", id, instance))
});

export default connect(select, mapDispatchToProps)(Profile);