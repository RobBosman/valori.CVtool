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

  const onFetchProfilePhoto = () => {
    props.fetchProfilePhoto()
      .then(photoBlob => {
        const reader = new FileReader();
        reader.readAsDataURL(photoBlob);
        reader.onloadend = () => {
          const instanceToBeSaved = {
            ...instance,
            [props.field]: reader.result
          };
          replaceInstance?.(instanceId, instanceToBeSaved);
        }
      });
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
          text="Valori profielfoto ophalen"
          iconProps={{ iconName: "Info" }}
          onClick={onFetchProfilePhoto}
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
  label: PropTypes.any,
  fetchProfilePhoto: PropTypes.func.isRequired
};