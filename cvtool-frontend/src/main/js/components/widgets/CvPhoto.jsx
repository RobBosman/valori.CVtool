import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { DefaultButton, Image, ImageFit, Label, Stack } from "@fluentui/react";
import * as authActions from "../../services/auth/auth-actions";

const CvPhoto = (props) => {

  const {entity, instanceId, replaceInstance} = props.instanceContext;
  const instance = entity?.[instanceId];

  const photoB64 = instance?.[props.field];

  const photoProps = {
    src: photoB64,
    alt: "Foto",
    imageFit: ImageFit.centerCover,
    styles: prps => ({ root: { border: '1px solid ' + prps.theme.palette.neutralSecondary } }),
    width: "10em",
    height: "10em"
  };

  const handleFileUpload = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const instanceToBeSaved = {
          ...instance,
          [props.field]: reader.result
        };
        replaceInstance?.(instanceId, instanceToBeSaved);
        e.target.value = "";
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onFetchProfilePhoto = () =>
    props.fetchProfilePhoto(instanceId);

  const onDeletePhoto = () => {
    const instanceToBeSaved = {
      ...instance,
      [props.field]: null
    };
    replaceInstance?.(instanceId, instanceToBeSaved);
  };

  return (
    <Stack horizontal tokens={{ childrenGap: "l1" }}>
      <Label>{props.label}</Label>
      <Image {...photoProps}></Image>
      <Stack vertical verticalAlign="space-between"
        tokens={{ childrenGap: "l1" }}>
        <Stack vertical tokens={{ childrenGap: "l1" }}>
          <input type="file" onChange={handleFileUpload}></input>
          <DefaultButton
            primary={true}
            text="Valori profielfoto ophalen"
            iconProps={{ iconName: "Info" }}
            disabled={props.authInfo.accountId != instanceId}
            onClick={onFetchProfilePhoto}
          />
        </Stack>
        <DefaultButton
          text="Foto verwijderen"
          iconProps={{ iconName: "Delete" }}
          disabled={!photoB64}
          onClick={onDeletePhoto}
        />
      </Stack>
    </Stack>
  )
};

CvPhoto.propTypes = {
  authInfo: PropTypes.object,
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.any,
  fetchProfilePhoto: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  selectedAccountId: store.ui.selectedId.account,
  accountEntity: store.safe.content.account
});

const mapDispatchToProps = (dispatch) => ({
  fetchProfilePhoto: id => dispatch(authActions.fetchProfilePhoto(id)),
  replaceAccount: (id, instance) => dispatch(changeInstance("account", id, instance))
});

export default connect(select, mapDispatchToProps)(CvPhoto);