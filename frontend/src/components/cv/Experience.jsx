import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Pivot, PivotItem, ActionButton, TeachingBubbleContent, Coachmark, DirectionalHint } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceInstance, replaceInstances } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";

const entityName = "experience";

const Experience = (props) => {

  const composePeriod = (experience) =>
    `${experience.periodBegin?.substr(0, 7) || ""} - ${experience.periodEnd?.substr(0, 7) || "heden"}`;

  // Find all {Experiences} of the selected {cv}.
  const experiences = props.experienceEntity
    && props.selectedCvId
    && Object.values(props.experienceEntity).filter((instance) => instance.cvId === props.selectedCvId)
      .sort((l, r) => l.sortIndex > 0 && r.sortIndex > 0 ? l.sortIndex - r.sortIndex : -1)
    || [];

  const experienceContext = {
    locale: props.locale,
    entity: props.experienceEntity,
    instanceId: props.selectedExperienceId,
    setSelectedInstance: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience
  };
  
  const [coachmarkTarget, setCoachmarkTarget] = React.useState(undefined);
  const hideCoachmark = () => setCoachmarkTarget(undefined);

  const renderCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...experienceContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "period",
      fieldName: "period",
      name: "Periode *",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 120,
      maxWidth: 120,
      data: "string",
      onColumnClick: (e) => setCoachmarkTarget(e.target),
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
      onRender: renderCheckbox,
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
      includeInCv: true,
      sortIndex: 0
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
  
  // Keep hold of the dragged item.
  const [draggedItem, setDraggedItem] = React.useState(undefined);
  
  const dragDropEvents = {
    canDrop: () => true,
    canDrag: () => true,
    onDragStart: (item) => { setDraggedItem(item); },
    onDragEnd: () => { setDraggedItem(undefined); },
    onDragEnter: () => "", // return string is the css classes that will be added to the entering element.
    onDragLeave: () => {},
    onDrop: (targetItem) => {
      const draggedItemKey = draggedItem._id;
      if (draggedItem && targetItem._id !== draggedItemKey) {
        const insertIndex = experiences.indexOf(targetItem);
        const items = experiences.filter(item => item._id !== draggedItemKey);
        items.splice(insertIndex, 0, draggedItem);
        updateSortIndexes(items);
      }
    }
  };

  const updateSortIndexes = (items) => {
    const reIndexedItems = [];
    items.forEach((item, index) => {
      const sortIndex = index + 1;
      if (item.sortIndex !== sortIndex) {
        reIndexedItems.push({ ...item, sortIndex: sortIndex });
      }
    });
    if (reIndexedItems.length > 0) {
      props.replaceExperiences(reIndexedItems);
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
                dragDropEvents={dragDropEvents}
              />
              {coachmarkTarget && (
                <Coachmark
                  target={coachmarkTarget}
                  positioningContainerProps={{
                    directionalHint: DirectionalHint.topCenter,
                    doNotLayer: false
                  }}>
                  <TeachingBubbleContent
                    target={coachmarkTarget}
                    headline="Sorteren met drag&amp;drop"
                    asSmallHeadline={true}
                    isWide={true}
                    hasCloseButton={true}
                    onDismiss={hideCoachmark}>
                    Bepaal handmatig de volgorde waarin Werkervaringen in je cv komen te staan.
                  </TeachingBubbleContent>
                </Coachmark>
              )}
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
                      label="tot"
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
                    label="Werkomgeving"
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
  replaceExperiences: PropTypes.func.isRequired,
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
  replaceExperiences: (instances) => dispatch(replaceInstances(entityName, instances)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);