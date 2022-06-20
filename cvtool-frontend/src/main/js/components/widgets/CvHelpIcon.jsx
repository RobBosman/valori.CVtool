import PropTypes from "prop-types";
import React from "react";
import { Callout, DirectionalHint, IconButton, Stack, Text } from "@fluentui/react";

export const createHelpIcon = (helpIconProps) =>
  <Stack horizontal>
    {helpIconProps.label}
    <CvHelpIcon title={helpIconProps.label} { ...helpIconProps }/>
  </Stack>;

export const CvHelpIcon = (props) => {

  const [calloutTarget, setCalloutTarget] = React.useState(undefined);
  const [isCalloutVisible, setCalloutVisible] = React.useState(false);

  const showCallout = (event) => {
    setCalloutTarget(event.target);
    setCalloutVisible(true);
  };
  const hideCallout = () =>
    setCalloutVisible(false);

  return (
    <div>
      <IconButton
        iconProps={{ iconName: "InfoSolid" }}
        disbled={props.disabled}
        style={{ height: "unset" }}
        onClick={isCalloutVisible ? hideCallout : showCallout}/>
      {isCalloutVisible
        && <Callout
          style={{ padding: 20 }}
          target={calloutTarget}
          directionalHint={DirectionalHint.topCenter}
          onDismiss={hideCallout}>
          <Stack tokens={{ childrenGap: "s2" }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="baseline">
              <Text variant="xLarge">{props.title}</Text>
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={hideCallout}/>
            </Stack>
            {props.content || props.renderContent()}
          </Stack>
        </Callout>
      }
    </div>
  );
};

CvHelpIcon.propTypes = {
  title: PropTypes.string,
  content: PropTypes.object,
  renderContent: PropTypes.func,
  disabled: PropTypes.bool
};