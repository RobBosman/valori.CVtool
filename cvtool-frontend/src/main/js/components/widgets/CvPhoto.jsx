import PropTypes from "prop-types";
import React from "react";
import { DefaultButton, Image, ImageFit, Label, Stack } from "@fluentui/react";

export const CvPhoto = (props) => {

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
    const selectedFile= e.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const instanceToBeSaved = {
          ...instance,
          [props.field]: fileReader.result
        };
        replaceInstance?.(instanceId, instanceToBeSaved);
        e.target.value = "";
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const onFetchPhoto = () => {

    console.log("authenticationResult", authenticationResult);
    const response = fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: { Authorization: `Bearer ${authenticationResult.accessToken}` },
      })
      .then(response => response.blob())
      .then(responseBlob => console.log("responseBlob", responseBlob));

    const instanceToBeSaved = {
      ...instance,
      [props.field]: null
    };
    replaceInstance?.(instanceId, instanceToBeSaved);
  };

  const onDeletePhoto = () => {
    const instanceToBeSaved = {
      ...instance,
      [props.field]: null
    };
    replaceInstance?.(instanceId, instanceToBeSaved);
  };

  return (
    <Stack horizontal>
      <Stack vertical verticalAlign="space-between">
        <Stack.Item align="end">
          <Label>{props.label}</Label>
        </Stack.Item>
        <input type="file" onChange={handleFileUpload}></input>
        <DefaultButton
          primary={true}
          text="Foto ophalen"
          iconProps={{ iconName: "Info" }}
          disabled={!photoB64}
          onClick={onFetchPhoto}
        />
        <DefaultButton
          text="Foto verwijderen"
          iconProps={{ iconName: "Delete" }}
          disabled={!photoB64}
          onClick={onDeletePhoto}
        />
      </Stack>
      <Image {...photoProps}></Image>
    </Stack>
  )
};

CvPhoto.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.any
};