import React from "react";
import { Stack, Text, TextField } from "@fluentui/react";
import { connect } from "react-redux";
import { mapHelpers, replaceSafeInstance } from "../../redux/safe";

const Profile = (props) => {

  const { instance: cv, getValue, getValueLocale, onChange, onChangeLocale } = mapHelpers(props.cvEntity, props.cvId, props.onChange, props.locale);

  return (
    <Stack>
      <Text variant="xxLarge">Profiel</Text>
      <TextField
        label="Rol"
        value={getValueLocale('role')}
        disabled={!cv}
        onChange={onChangeLocale('role')} />
      <TextField
        label="Profielschets"
        multiline
        autoAdjustHeight
        value={getValueLocale('profile')}
        disabled={!cv}
        onChange={onChangeLocale('profile')} />
      <TextField
        label="Interesses"
        multiline
        autoAdjustHeight
        value={getValueLocale('interests')}
        disabled={!cv}
        onChange={onChangeLocale('interests')} />
      <TextField
        label="Werkervaring sinds"
        placeholder='yyyy'
        styles={{ fieldGroup: { width: 100 } }}
        value={getValue('workingSince')}
        disabled={!cv}
        onChange={onChange('workingSince')} />
      <TextField
        label="IT ervaring sinds"
        styles={{ fieldGroup: { width: 100 } }}
        placeholder='yyyy'
        value={getValue('inItSince')}
        disabled={!cv}
        onChange={onChange('inItSince')} />
    </Stack>
  )
};

const select = (state) => ({
  locale: state.ui.locale,
  cvEntity: state.safe.cv
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('cv', id, instance))
});

export default connect(select, mapDispatchToProps)(Profile)