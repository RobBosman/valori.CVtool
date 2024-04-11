import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { DefaultButton, Image, ImageFit, Label, Stack } from "@fluentui/react";
import * as authActions from "../../services/auth/auth-actions";
import * as safeActions from "../../services/safe/safe-actions";

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

  const onFetchProfilePhoto = () =>
    props.fetchProfilePhoto(instanceId);

  const onFileUpload = () =>
    props.selectPhotoToUpload(
      instanceId,
      {
        types: [ { description: "Images", accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] } } ],
        multiple: false,
        excludeAcceptAllOption: true
      });

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
      <Stack vertical verticalAlign="space-between" tokens={{ childrenGap: "l1" }}>
        <Stack vertical tokens={{ childrenGap: "l1" }}>
          <DefaultButton
            primary={true}
            text="Valori profielfoto"
            iconProps={{ iconName: "Download" }}
            disabled={props.authInfo.accountId != instanceId}
            onClick={onFetchProfilePhoto}
          />
          <DefaultButton
            text="Foto uploaden"
            iconProps={{ iconName: "Upload" }}
            disabled={props.authInfo.accountId != instanceId}
            onClick={onFileUpload}
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
  fetchProfilePhoto: PropTypes.func.isRequired,
  selectPhotoToUpload: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  selectedAccountId: store.ui.selectedId.account,
  accountEntity: store.safe.content.account
});

const mapDispatchToProps = (dispatch) => ({
  fetchProfilePhoto: id => dispatch(authActions.fetchProfilePhoto(id)),
  selectPhotoToUpload: (instanceId, fileHandleKey) => dispatch(safeActions.selectPhotoToUpload(instanceId, fileHandleKey))
});

export default connect(select, mapDispatchToProps)(CvPhoto);