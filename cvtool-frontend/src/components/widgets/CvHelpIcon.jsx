import PropTypes from "prop-types";
import React from "react";
import { Callout, IconButton } from "@fluentui/react";

export const CvHelpIcon = (props) => {
  
  const [state, setState] = React.useState({
    calloutTarget: undefined,
    hideCalloutAfterMillis: 0,
    isCalloutVisible: false
  });

  React.useEffect(() => {
    if (state.hideCalloutAfterMillis > 0) {
      const hideTimeoutId = setTimeout(hideCallout, state.hideCalloutAfterMillis);
      return () => clearTimeout(hideTimeoutId);
    }
  }, [state.hideCalloutAfterMillis]);

  const showCallout = (event) =>
    setState(prevState => ({
      ...prevState,
      calloutTarget: event.target,
      isCalloutVisible: true,
      hideCalloutAfterMillis: props.hideAfterMillis || 5000
    }));
  const hideCallout = ()=>
    setState(prevState => ({
      ...prevState,
      hideCalloutAfterMillis: 0,
      isCalloutVisible: false
    }));

  return (
    <div>
      <IconButton
        iconProps={{ iconName: "InfoSolid" }}
        disbled={props.disabled}
        onMouseEnter={showCallout}/>
      {state.isCalloutVisible
        && <Callout
          style={{ padding: 20 }}
          target={state.calloutTarget}
          onDismiss={hideCallout}>
          {props.onRenderCallout()}
        </Callout>
      }
    </div>
  );
};

CvHelpIcon.propTypes = {
  onRenderCallout: PropTypes.func,
  hideAfterMillis: PropTypes.number,
  disabled: PropTypes.bool
};