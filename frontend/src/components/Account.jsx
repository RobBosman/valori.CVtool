import React from "react";
import { Stack, Text, TextField } from "@fluentui/react";
import { connect } from "react-redux";

const Account = (props) => {

  return (
    <Stack>
      <Text variant="xxLarge">Account</Text>
      <TextField
        label='Naam'
        value={props.account && props.account.name}
        readOnly={true}
        disabled={!props.account} />
    </Stack>
  )
};

const select = (state) => ({
  account: state.authentication.account
});

export default connect(select)(Account)