import PropTypes from "prop-types";
import React from "react";
import { Callout, DirectionalHint, IconButton, Stack, Text } from "@fluentui/react";

export const createHelpIcon = (helpIconProps) =>
  <Stack horizontal>
    {helpIconProps.label}
    <CvHelpIcon title={helpIconProps.label} { ...helpIconProps }/>
  </Stack>;

export const CvHelpIcon = (props) => {

  const [state, setState] = React.useState({
    calloutTarget: undefined,
    isCalloutVisible: false
  });

  const showCallout = (event) =>
    setState(prevState => ({
      ...prevState,
      calloutTarget: event.target,
      isCalloutVisible: true
    }));
  const hideCallout = () =>
    setState(prevState => ({
      ...prevState,
      isCalloutVisible: false
    }));

  return (
    <div>
      <IconButton
        iconProps={{ iconName: "InfoSolid" }}
        disbled={props.disabled}
        style={{ height: "unset" }}
        onClick={state.isCalloutVisible ? hideCallout : showCallout}/>
      {state.isCalloutVisible
        && <Callout
          style={{ padding: 20 }}
          target={state.calloutTarget}
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