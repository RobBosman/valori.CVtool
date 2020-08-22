import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, IconButton, Pivot, PivotItem } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvSpinButton } from "../widgets/CvSpinButton";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";

const entityName = "experience";

const Experience = (props) => {
  
  const columns = [
    {
      key: "period",
      fieldName: "period",
      name: "Periode",
      isResizable: false,
      minWidth: 100,
      data: "string"
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      isResizable: true,
      minWidth: 150,
      data: "string"
    },
    {
      key: "role",
      localeFieldName: "role",
      name: "Rol",
      isResizable: true,
      minWidth: 100,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      isResizable: false,
      minWidth: 40,
      data: "bool"
    }
  ];

  // Find all {Experiences} of the selected {cv}.
  const experiences = props.experienceEntity
    && props.selectedCvId
    && Object.values(props.experienceEntity).filter((instance) => instance.cvId === props.selectedCvId)
    || [];

  const experienceContext = {
    locale: props.locale,
    entity: props.experienceEntity,
    entityId: props.selectedExperienceId,
    setSelectedInstance: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience
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
    case "period":
      return `${item.periodBegin?.substr(0, 7) || ""} - ${item.periodEnd?.substr(0, 7) || "heden"}`;
    case "includeInCv":
      return <CvCheckbox
        field="includeInCv"
        instanceContext={{
          ...experienceContext,
          entityId: item._id
        }} />;
    default:
      return item[column.fieldName];
    }
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceExperience(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedExperienceId(id);

    setTimeout(() => { // TODO: fix this?
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 1);
  };

  const onDeleteItem = () => {
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
    }
  };

  return (
    <table width="100%">
      <tbody>
        <tr>
          <td width="40%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal>
                <Text variant="xxLarge">Werkervaring</Text>
                <IconButton
                  iconProps={{ iconName: "Add" }}
                  onClick={onAddItem} />
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  disabled={!props.selectedExperienceId}
                  onClick={onDeleteItem} />
              </Stack>
              <CvDetailsList
                columns={columns}
                items={experiences}
                instanceContext={experienceContext}
                setKey={entityName}
                onRenderItemColumn={onRenderItem}
                onExposeSelectionRef={onExposeSelectionRef} />
            </Stack>
          </td>

          <td width="60%" valign="top">
            <Pivot styles={editStyles}>
              <PivotItem headerText="Edit">
                <CvDatePicker
                  label="Van"
                  field="periodBegin"
                  instanceContext={experienceContext}
                  styles={{ root: { width: 140 } }} />
                <CvDatePicker
                  label="t/m"
                  field="periodEnd"
                  instanceContext={experienceContext}
                  styles={{ root: { width: 140 } }} />
                <CvTextField
                  label="Opdrachtgever"
                  field="client"
                  instanceContext={experienceContext} />
                <CvTextField
                  label="Werkgever"
                  field="employer"
                  instanceContext={experienceContext} />
                <CvTextField
                  label="Rol"
                  localeField="role"
                  instanceContext={experienceContext} />
                <CvSpinButton
                  label="Sorteer index"
                  field="sortIndex"
                  instanceContext={experienceContext}
                  styles={{ root: { width: 140 } }} />
              </PivotItem>
              <PivotItem headerText="Details">
                <CvTextField
                  label="Opdracht"
                  localeField="assignment"
                  instanceContext={experienceContext}
                  multiline
                  autoAdjustHeight />
                <CvTextField
                  label="Activiteiten"
                  localeField="activities"
                  instanceContext={experienceContext}
                  multiline
                  autoAdjustHeight/>
                <CvTextField
                  label="Resultaten"
                  localeField="results"
                  instanceContext={experienceContext}
                  multiline
                  autoAdjustHeight />
                <CvTextField
                  label="Keywords"
                  localeField="keywords"
                  instanceContext={experienceContext}
                  multiline
                  autoAdjustHeight />
              </PivotItem>
            </Pivot>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Experience.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  experienceEntity: PropTypes.object,
  replaceExperience: PropTypes.func.isRequired,
  selectedExperienceId: PropTypes.string,
  setSelectedExperienceId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  experienceEntity: state.safe[entityName],
  selectedExperienceId: state.ui.selectedId[entityName],
  replaceExperience: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);