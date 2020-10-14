import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Pivot, PivotItem, ActionButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvSpinButton } from "../widgets/CvSpinButton";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";

const entityName = "experience";

const Experience = (props) => {

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

  const showCheckbox = (item) =>
    <CvCheckbox field="includeInCv" instanceContext={{ ...experienceContext, entityId: item._id }} />;
  
  const columns = [
    {
      key: "period",
      fieldName: "period",
      name: "Periode",
      onRender: (item) => `${item.periodBegin?.substr(0, 7) || ""} - ${item.periodEnd?.substr(0, 7) || "heden"}`,
      isResizable: false,
      minWidth: 120,
      maxWidth: 120,
      data: "string"
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      isResizable: true,
      data: "string"
    },
    {
      key: "role",
      localeFieldName: "role",
      name: "Rol",
      isResizable: true,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: showCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40
    }
  ];

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
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td width="50%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Werkervaring</Text>
                <div>
                  <ActionButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    onClick={onAddItem}
                  />
                  <ActionButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedExperienceId}
                    onClick={onDeleteItem}
                  />
                </div>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={experiences}
                instanceContext={experienceContext}
                setKey={entityName}
                onExposeSelectionRef={onExposeSelectionRef}
              />
            </Stack>
          </td>

          <td width="50%" valign="top">
            <Pivot>
              <PivotItem headerText="Edit">
                <Stack styles={editStyles}>
                  <Stack horizontal
                    tokens={{ childrenGap: "l1" }}>
                    <CvDatePicker
                      label="Van"
                      field="periodBegin"
                      instanceContext={experienceContext}
                    />
                    <CvDatePicker
                      label="t/m"
                      field="periodEnd"
                      instanceContext={experienceContext}
                    />
                  </Stack>
                  <CvTextField
                    label="Opdrachtgever"
                    field="client"
                    instanceContext={experienceContext}
                  />
                  <CvTextField
                    label="Werkgever"
                    field="employer"
                    instanceContext={experienceContext}
                  />
                  <CvTextField
                    label="Rol"
                    localeField="role"
                    instanceContext={experienceContext}
                  />
                  <CvSpinButton
                    label="Sorteer index"
                    field="sortIndex"
                    instanceContext={experienceContext}
                    styles={{ root: { width: 100 } }}
                  />
                </Stack>
              </PivotItem>
              <PivotItem headerText="Details">
                <Stack styles={editStyles}>
                  <CvTextField
                    label="Opdracht"
                    localeField="assignment"
                    instanceContext={experienceContext}
                    multiline
                    autoAdjustHeight
                  />
                  <CvTextField
                    label="Activiteiten"
                    localeField="activities"
                    instanceContext={experienceContext}
                    multiline
                    autoAdjustHeight
                  />
                  <CvTextField
                    label="Resultaten"
                    localeField="results"
                    instanceContext={experienceContext}
                    multiline
                    autoAdjustHeight
                  />
                  <CvTextField
                    label="Keywords"
                    localeField="keywords"
                    instanceContext={experienceContext}
                    multiline
                    autoAdjustHeight
                  />
                </Stack>
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
  experienceEntity: state.safe.content[entityName],
  selectedExperienceId: state.ui.selectedId[entityName],
  replaceExperience: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(replaceInstance(entityName, id, instance)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);