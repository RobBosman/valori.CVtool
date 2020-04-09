import React from "react";
import { TextField } from "office-ui-fabric-react";
import { connect } from "react-redux";

const Account = (props) => {

  return (
    <TextField
      label='Naam'
      value={props.account && props.account.name}
      readOnly={true}
      disabled={!props.account}
      styles={{ fieldGroup: { width: 400 } }} />
  )
};

const select = (state) => ({
  account: state.authentication.account
});

export default connect(select)(Account)