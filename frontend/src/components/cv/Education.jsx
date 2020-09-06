import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvChoiceGroup } from "../widgets/CvChoiceGroup";
import { EducationTypes, EducationResultTypes } from "./Enums";

const entityName = "education";

const Education = (props) => {

  const columns = [
    {
      key: "type",
      fieldName: "type",
      name: "Soort opleiding",
      iconName: "PublishCourse",
      isIconOnly: true,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "string"
    },
    {
      key: "name",
      localeFieldName: "name",
      name: "Opleiding",
      isResizable: true,
      minWidth: 150,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 150,
      data: "string"
    },
    {
      key: "result",
      fieldName: "result",
      name: "Resultaat",
      isResizable: true,
      data: "string"
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      isResizable: true,
      minWidth: 40,
      maxWidth: 40,
      data: "number"
    }
  ];

  // Find all {Education} of the selected {cv}.
  const educations = props.educationEntity
    && props.selectedCvId
    && Object.values(props.educationEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const educationContext = {
    locale: props.locale,
    entity: props.educationEntity,
    entityId: props.selectedEducationId,
    setSelectedInstance: props.setSelectedEducationId,
    replaceInstance: props.replaceEducation
  };

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20
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

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onRenderItem = (item, number, column) => {
    switch (column.fieldName) {
    case "includeInCv":
      return <CvCheckbox
        field="includeInCv"
        instanceContext={{
          ...educationContext,
          entityId: item._id
        }} />;
    default:
      return item[column.fieldName];
    }
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceEducation(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedEducationId(id);

    setTimeout(() => { // TODO: fix this?
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 1);
  };

  const onDeleteItem = () => {
    if (props.selectedEducationId) {
      props.replaceEducation(props.selectedEducationId, {});
      props.setSelectedEducationId(undefined);
    }
  };

  return (
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td width="60%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal>
                <Text variant="xxLarge">Opleiding</Text>
                <IconButton
                  iconProps={{ iconName: "Add" }}
                  onClick={onAddItem} />
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  disabled={!props.selectedEducationId}
                  onClick={onDeleteItem} />
              </Stack>
              <CvDetailsList
                columns={columns}
                items={educations}
                instanceContext={educationContext}
                setKey={entityName}
                onRenderItemColumn={onRenderItem}
                onExposeSelectionRef={onExposeSelectionRef} />
            </Stack>
          </td>

          <td width="40%" valign="top">
            <Stack styles={editStyles}>
              <CvChoiceGroup
                label="Soort opleiding"
                field="type"
                instanceContext={educationContext}
                options={EducationTypes} />
              <CvTextField
                label="Opleiding"
                localeField="name"
                instanceContext={educationContext} />
              <CvTextField
                label="Opleidingsinstituut"
                field="institution"
                instanceContext={educationContext} />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
                <CvDropdown
                  label='Resultaat'
                  field="result"
                  instanceContext={educationContext}
                  options={EducationResultTypes}
                  styles={{ dropdown: { width: 120 } }} />
                <CvTextField
                  label="Jaar"
                  field="year"
                  instanceContext={educationContext}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 100 } }} />
              </Stack>
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Education.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  educationEntity: PropTypes.object,
  replaceEducation: PropTypes.func.isRequired,
  selectedEducationId: PropTypes.string,
  setSelectedEducationId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  educationEntity: state.safe[entityName],
  selectedEducationId: state.ui.selectedId[entityName],
  replaceEducation: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replaceEducation: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedEducationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Education);