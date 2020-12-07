import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TeachingBubbleContent, Coachmark, DirectionalHint, DefaultButton } from "@fluentui/react";
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
import * as commonUtils from "../../utils/CommonUtils";

const entityName = "experience";

const Experience = (props) => {
  
  const [state, setState] = React.useState({
    isConfirmDialogVisible: false,
    coachmarkTarget: undefined,
    isCoachmarkVisible: false,
    draggedItem: undefined
  });

  const experienceContext = React.useCallback({
    locale: props.locale,
    entity: props.experienceEntity,
    instanceId: props.selectedExperienceId,
    setSelectedInstance: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience
  }, [props.locale, props.experienceEntity, props.selectedExperienceId, props.setSelectedExperienceId, props.replaceExperience]);
  
  // Find all {Experiences} of the selected {cv}.
  const experiences = React.useCallback(
    props.experienceEntity && props.selectedCvId && Object.values(props.experienceEntity)
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => (l?.sortIndex || 0) - (r?.sortIndex || 0))
      || [],
    [props.experienceEntity, props.selectedCvId]);
  
  const showCoachmark = (event) =>
    setState(prevState => ({
      ...prevState,
      coachmarkTarget: event.target,
      isCoachmarkVisible: true
    }));
  const hideCoachmark = () =>
    setState(prevState => ({ ...prevState, isCoachmarkVisible: false }));

  const composePeriod = (experience) =>
    `${experience.periodBegin?.substr(0, 7) || ""} - ${experience.periodEnd?.substr(0, 7) || "heden"}`;

  const renderRole = (item) =>
    item.role && item.role[props.locale] || commonUtils.getPlaceholder(experiences, "role", item._id, props.locale);

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...experienceContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "period",
      fieldName: "sortIndex",
      name: "Periode",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 110,
      maxWidth: 110,
      data: "number",
      onColumnClick: showCoachmark
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      isResizable: true,
      minWidth: 90,
      maxWidth: 250
    },
    {
      key: "role",
      fieldName: `role.${props.locale}`,
      name: "Rol",
      onRender: renderRole,
      isResizable: true,
      minWidth: 90,
      maxWidth: 400
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 50,
      maxWidth: 50
    }
  ];

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        minWidth: 350,
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

  const selectedItemFields = () => {
    const selectedExperience = experiences.find(experience => experience._id === props.selectedExperienceId);
    return selectedExperience && {
      Periode: composePeriod(selectedExperience),
      Opdrachtgever: selectedExperience.client
    };
  };

  const isFilledExperience = (experience) =>
    experience.periodBegin || experience.client || commonUtils.isFilledLocaleField(experience.assignment, experience.activities, experience.results, experience.keywords);

  const onAddItem = () => {
    let newExperience = experiences.find(experience => !isFilledExperience(experience));
    if (!newExperience) {
      newExperience = {
        _id: createUuid(),
        cvId: props.selectedCvId,
        includeInCv: true
      };
      props.replaceExperience(newExperience._id, newExperience);
    }
    props.setSelectedExperienceId(newExperience._id);
  };

  const onDeleteItem = () => {
    if (props.selectedExperienceId) {
      setState(prevState => ({ ...prevState, isConfirmDialogVisible: true }));
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
    }
    setState(prevState => ({ ...prevState, isConfirmDialogVisible: false }));
  };
  const onDeleteCancelled = () =>
    setState(prevState => ({ ...prevState, isConfirmDialogVisible: false }));
  
  const dragDropEvents = {
    canDrop: () => true,
    canDrag: () => true,
    onDragStart: (item) => setState(prevState => ({ ...prevState, draggedItem: item })),
    onDragEnd: () => setState(prevState => ({ ...prevState, draggedItem: undefined })),
    onDragEnter: () => "", // return string is the css classes that will be added to the entering element.
    onDragLeave: () => {},
    onDrop: (targetItem) => {
      const draggedItemKey = state.draggedItem._id;
      if (state.draggedItem && targetItem._id !== draggedItemKey) {
        const insertIndex = experiences.indexOf(targetItem);
        const items = experiences.filter(item => item._id !== draggedItemKey);
        items.splice(insertIndex, 0, state.draggedItem);
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
                    selectedItemFields={selectedItemFields}
                    isVisible={state.isConfirmDialogVisible}
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
              {state.isCoachmarkVisible &&
                <Coachmark
                  target={state.coachmarkTarget}
                  positioningContainerProps={{
                    directionalHint: DirectionalHint.topCenter,
                    doNotLayer: false
                  }}>
                  <TeachingBubbleContent
                    target={state.coachmarkTarget}
                    headline="Sorteren met drag&amp;drop"
                    asSmallHeadline={true}
                    isWide={true}
                    hasCloseButton={true}
                    onDismiss={hideCoachmark}>
                    Bepaal handmatig de volgorde waarin werkervaringen in je cv komen te staan.
                  </TeachingBubbleContent>
                </Coachmark>
              }
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
                placeholder={commonUtils.getPlaceholder(experiences, "role", props.selectedExperienceId, props.locale)}
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

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  selectedCvId: store.ui.selectedId.cv,
  experienceEntity: store.safe.content[entityName],
  selectedExperienceId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  replaceExperiences: (instances) => dispatch(changeInstances(entityName, instances)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);