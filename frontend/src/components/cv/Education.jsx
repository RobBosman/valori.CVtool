import React from "react";
import { connect } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import EducationList from "./EducationList";
import EducationEdit from "./EducationEdit";
import CvEditNavigator from "../widgets/CvEditNavigator";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createId } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";

const select = (state) => ({
  cvId: state.ui.selected.cvId
});

const mapDispatchToProps = (dispatch) => ({
  createEducation: (id, instance) => dispatch(replaceSafeInstance('education', id, instance)),
  deleteEducatione: (id) => dispatch(replaceSafeInstance('education', id, {}))
});

const Education = (props) => {

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        width: '40%'
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
      }
    ]
  };

  // The {selection} object of the DetailsList will be obtained when available.
  let selection = null;
  const passSelectionRef = (selectionRef) => {
    selection = selectionRef
  };

  const selectNext = (step) => {
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
    props.createEducation(id, {
      "_id": id,
      "cvId": props.cvId,
      "name": {}
    });
    setTimeout(() => selectNext(1000000), 100); // TODO - fix this
  };

  const deleteEducation = () => {
    const selectedItem = selection && selection.getSelection()[0];
    if (selectedItem) {
      props.deleteEducatione(selectedItem._id)
    }
  };

  return (
    <Stack horizontal>
      <Stack.Item grow={2} styles={viewStyles}>
        <Text variant="xxLarge">Opleiding</Text>
        <EducationList
          onPassSelectionRef={passSelectionRef} />
      </Stack.Item>
      <Stack.Item grow={1} styles={editStyles}>
        <Text variant="xxLarge">Edit</Text>
        <EducationEdit />
        <CvEditNavigator
          onPrevious={() => selectNext(-1)}
          onNext={() => selectNext(1)}
          onAdd={addEducation}
          onDelete={deleteEducation} />
      </Stack.Item>
    </Stack>
  )
};

export default connect(select, mapDispatchToProps)(Education)