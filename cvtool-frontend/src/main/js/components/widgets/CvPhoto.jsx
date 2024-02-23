import PropTypes from "prop-types";
import React from "react";
import { Image, ImageFit, Label, Stack } from "@fluentui/react";

export const CvPhoto = (props) => {

  const {entity, instanceId, replaceInstance} = props.instanceContext;
  const instance = entity?.[instanceId];

  const photoB64 = instance?.[props.field] || "";

  const photoProps = {
    alt: "Pasfoto",
    src: photoB64,
    imageFit: ImageFit.centerContain,
    styles: prps => ({
      root: {
        border: '1px solid ' + prps.theme.palette.neutralSecondary
      }
    }),
    width: "10em",
    height: "10em"
  };

  const fileUploadHandler = e => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const instanceToBeSaved = {
        ...instance,
        [props.field]: fileReader.result
      };
      replaceInstance?.(instanceId, instanceToBeSaved);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Stack horizontal>
      <Stack vertical verticalAlign="space-between">
        <Stack.Item align="end">
          <Label>{props.label}</Label>
        </Stack.Item>
        <input type="file" onChange={fileUploadHandler}></input>
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