import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TeachingBubbleContent, Coachmark, DirectionalHint, Separator, DefaultButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance, changeInstances } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "experience";

const Experience = (props) => {
  
  const [experiences, setExperiences] = React.useState([]);

  const composePeriod = (experience) =>
    `${experience.periodBegin?.substr(0, 7) || ""} - ${experience.periodEnd?.substr(0, 7) || "heden"}`;

  // Find all {Experiences} of the selected {cv}.
  React.useEffect(() => {
    if (props.experienceEntity && props.selectedCvId) {
      setExperiences(
        Object.values(props.experienceEntity)
          .filter(instance => instance.cvId === props.selectedCvId)
          .sort((l, r) => (l?.sortIndex || 0) - (r?.sortIndex || 0))
      );
    }
  }, [props.experienceEntity, props.selectedCvId]);

  const experienceContext = {
    locale: props.locale,
    entity: props.experienceEntity,
    instanceId: props.selectedExperienceId,
    setSelectedInstance: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience
  };
  
  const [coachmarkTarget, setCoachmarkTarget] = React.useState(undefined);
  const hideCoachmark = () => setCoachmarkTarget(undefined);

  const renderInCvCheckbox = (item) =>
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
      minWidth: 110,
      maxWidth: 110,
      data: "string",
      onColumnClick: (e) => setCoachmarkTarget(e.target),
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      isResizable: true,
      minWidth: 100,
      maxWidth: 250,
      data: "string"
    },
    {
      key: "role",
      fieldName: `role.${props.locale}`,
      name: "Rol",
      isResizable: true,
      minWidth: 100,
      maxWidth: 400,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
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
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedExperience = experiences.find(experience => experience._id === props.selectedExperienceId);
  const selectedItemFields = selectedExperience && {
    Periode: composePeriod(selectedExperience),
    Opdrachtgever: selectedExperience.client
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
  };

  const onDeleteItem = () => {
    if (props.selectedExperienceId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
    }
    setConfirmDialogVisible(false);
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);
  
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
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Werkervaring</Text>
                <Stack horizontal
                  tokens={{ childrenGap: "l1" }}>
                  <DefaultButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    disabled={!props.selectedCvId}
                    onClick={onAddItem}
                  />
                  <DefaultButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedExperienceId}
                    onClick={onDeleteItem}
                  />
                  <ConfirmDialog
                    title="Definitief verwijderen?"
                    primaryButtonText="Verwijderen"
                    itemFields={selectedItemFields}
                    isVisible={isConfirmDialogVisible}
                    onProceed={onDeleteConfirmed}
                    onCancel={onDeleteCancelled}
                  />
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={experiences}
                instanceContext={experienceContext}
                setKey={entityName}
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
                    Bepaal handmatig de volgorde waarin werkervaringen in je cv komen te staan.
                  </TeachingBubbleContent>
                </Coachmark>
              )}
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
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
                label="Rol"
                field={`role.${props.locale}`}
                instanceContext={experienceContext}
              />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
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
              </Stack>
              <Separator/>
              <CvTextField
                label="Opdracht"
                field={`assignment.${props.locale}`}
                instanceContext={experienceContext}
                multiline
                autoAdjustHeight
              />
              <CvTextField
                label="Activiteiten"
                field={`activities.${props.locale}`}
                instanceContext={experienceContext}
                multiline
                autoAdjustHeight
              />
              <CvTextField
                label="Resultaten"
                field={`results.${props.locale}`}
                instanceContext={experienceContext}
                multiline
                autoAdjustHeight
              />
              <CvTextField
                label="Werkomgeving"
                field={`keywords.${props.locale}`}
                instanceContext={experienceContext}
                multiline
                autoAdjustHeight
              />
            </Stack>
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
  locale: state.ui.userPrefs.locale,
  selectedCvId: state.ui.selectedId["cv"],
  experienceEntity: state.safe.content[entityName],
  selectedExperienceId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  replaceExperiences: (instances) => dispatch(changeInstances(entityName, instances)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);