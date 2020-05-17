import React from "react";
import { Stack, Text, registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme } from "@fluentui/react";
import EducationList from "./EducationList";
import EducationEdit from "./EducationEdit";
import CvEditNavigator from "../widgets/CvEditNavigator";
import { connect } from "react-redux";
import { createId, replaceSafeInstance } from "../../redux/safe";

const select = (state) => ({
  cvId: state.ui.selected.cvId
});

const mapDispatchToProps = (dispatch) => ({
  createInstance: (id, instance) => dispatch(replaceSafeInstance('education', id, instance)),
  deleteInstance: (id, instance) => dispatch(replaceSafeInstance('education', id, {}))
});

const Education = (props) => {
  const [theme, setTheme] = React.useState(getTheme());

  React.useEffect(() => {
    registerOnThemeChangeCallback(setTheme);
    return () => removeOnThemeChangeCallback(setTheme);
  }, []);

  const listStyles = {
    root: [
      {
        background: theme.palette.neutralQuaternaryAlt,
        padding: 20,
        width: '40%'
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: theme.palette.neutralTertiaryAlt,
        padding: 20
      }
    ]
  };

  // Place holder (like a Future/Promise) for a function to obain the {selection}.
  let selectionFuture = null;
  const provideSelection = (selectionProvider) => { selectionFuture = selectionProvider };
  const getSelection = () => {
    return selectionFuture && selectionFuture()
  };

  const selectNext = (step) => {
    const selection = getSelection();
    const selectedIndex = selection && selection.getSelectedIndices()[0];
    if (selectedIndex !== false) {
      const nextIndex = Math.min(Math.max(0, selectedIndex + step), selection.getItems().length - 1);
      if (nextIndex !== selectedIndex) {
        selection.setIndexSelected(selectedIndex, false, false);
        selection.setIndexSelected(nextIndex, true, false);
      }
    }
  };

  const addEducation = () => {
    const id = createId();
    props.createInstance(id, {
      "_id": id,
      "cvId": props.cvId,
      "name": {}
    });
    setTimeout(() => selectNext(1000000), 100); // TODO - fix this
  };

  const deleteEducation = () => {
    const selection = getSelection();
    const selectedItem = selection && selection.getSelection()[0];
    if (selectedItem) {
      props.deleteInstance(selectedItem._id)
    }
  };

  return (
    <Stack horizontal theme={theme}>
      <Stack.Item grow={2} styles={listStyles}>
        <Text variant="xxLarge">Opleiding</Text>
        <EducationList
          provideSelection={provideSelection} />
      </Stack.Item>
      <Stack.Item grow={1} styles={editStyles}>
        <CvEditNavigator
          onPrevious={() => selectNext(-1)}
          onNext={() => selectNext(1)}
          onAdd={addEducation}
          onDelete={deleteEducation} />
        <Text variant="xxLarge">Edit</Text>
        <EducationEdit />
      </Stack.Item>
    </Stack>
  )
};

export default connect(select, mapDispatchToProps)(Education)