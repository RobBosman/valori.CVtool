import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TeachingBubbleContent, Coachmark, DirectionalHint, DefaultButton, StackItem, ScrollablePane, Separator, PrimaryButton, Modal, ContextualMenu, IconButton } from "@fluentui/react";
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
import { CvFormattedText } from "../widgets/CvFormattedText";
import * as commonUtils from "../../utils/CommonUtils";
import * as preview from "./Preview";

const entityName = "experience";

const Experience = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const [state, setState] = React.useState({
    isConfirmDialogVisible: false,
    coachmarkTarget: undefined,
    isCoachmarkVisible: false,
    draggedItem: undefined
  });

  const experienceContext = React.useMemo(() => ({
    locale: props.locale,
    entity: props.experienceEntity,
    instanceId: props.selectedExperienceId,
    setSelectedInstanceId: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience,
    readOnly: !isEditable
  }),
  [props.locale, props.experienceEntity, props.selectedExperienceId, props.setSelectedExperienceId, props.replaceExperience]);

  // Find all {Experiences} of the selected {cv}.
  const experiences = React.useMemo(() =>
    props.selectedCvId && Object.values(props.experienceEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => (l?.sortIndex || 0) - (r?.sortIndex || 0))
    || [],
  [props.experienceEntity, props.selectedCvId]);

  const showCoachmark = (event) =>
    setState(prevState => ({
      ...prevState,
      coachmarkTarget: event.target,
      isCoachmarkVisible: isEditable
    }));
  const hideCoachmark = () =>
    setState(prevState => ({ ...prevState, isCoachmarkVisible: false }));

  const renderRole = (item) =>
    item.role && item.role[props.locale] || commonUtils.getPlaceholder(experiences, item._id, "role", props.locale);

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
      onRender: preview.composeExperiencePeriod,
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
      maxWidth: 50,
      data: "boolean"
    }
  ];

  const selectedItemFields = React.useCallback(() => {
    const selectedExperience = experiences.find(experience => experience._id === props.selectedExperienceId);
    return selectedExperience && {
      Periode: preview.composeExperiencePeriod(selectedExperience),
      Opdrachtgever: selectedExperience.client
    };
  },
  [experiences, props.selectedExperienceId]);

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
    setState(prevState => ({ ...prevState, isConfirmDialogVisible: false }));
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setState(prevState => ({ ...prevState, isConfirmDialogVisible: false }));

  const dragDropEvents = {
    canDrop: () => isEditable,
    canDrag: () => isEditable,
    onDragStart: (item) => setState(prevState => ({ ...prevState, draggedItem: item })),
    onDragEnd: () => setState(prevState => ({ ...prevState, draggedItem: undefined })),
    onDragEnter: () => "", // return string is the css classes that will be added to the entering element.
    onDragLeave: () => { },
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

  const [previewVisible, setPreviewVisible] = React.useState(false);

  const { viewPaneBackground, editPaneBackground, valoriBlue, valoriYellow } = useTheme();
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 350,
      height: "calc(100vh - 170px)"
    }
  };
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      height: "calc(100vh - 170px)"
    }
  };
  const previewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      height: "calc(100vh - 300px)"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const renderPreview = React.useCallback(() => {
    const experience = experiences
      .find(experience => experience._id === props.selectedExperienceId);
    const previewContext = {
      entity: {
        [props.selectedExperienceId]: experience && preview.composeExperiencePreview(experience, props.locale)
      },
      instanceId: props.selectedExperienceId
    };
    return <Stack horizontal
      styles={{
        root: {
          backgroundColor: "white",
          borderColor: valoriYellow,
          borderWidth: 1,
          borderStyle: "solid none solid none",
          overflow: "auto"
        }
      }}>
      <Stack
        styles={{
          root: {
            width: 140
          }
        }}>
        <CvFormattedText
          field="period"
          instanceContext={previewContext}
          markDown={false}
          textComponentStyle={{
            backgroundColor: "white",
            color: valoriBlue,
            padding: 0
          }}
        />
        <CvFormattedText
          field={`role.${props.locale}`}
          instanceContext={previewContext}
          markDown={false}
          textComponentStyle={{
            backgroundColor: "white",
            color: valoriYellow,
            padding: 0
          }}
        />
        <CvFormattedText
          field="clientOrEmployer"
          instanceContext={previewContext}
          markDown={false}
          textComponentStyle={{
            backgroundColor: "white",
            color: valoriYellow,
            padding: 0
          }}
        />
      </Stack>
      <CvFormattedText
        field={`description.${props.locale}`}
        instanceContext={previewContext}
        markDown={true}
        textComponentStyle={{
          backgroundColor: "white",
          color: "black",
          paddingTop: 0
        }}
        styles={{
          root: {
            borderColor: valoriYellow,
            borderWidth: 1,
            borderLeftStyle: "dashed",
            width: 492
          }
        }}
      />
    </Stack>;
  },
  [experiences, props.selectedExperienceId, props.locale]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Werkervaring</Text>
                {isEditable
                  && <Stack horizontal
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
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={experiences}
                instanceContext={experienceContext}
                setKey={entityName}
                dragDropEvents={dragDropEvents}
                onItemInvoked={() => setPreviewVisible(true)}
              />
              {state.isCoachmarkVisible
                && <Coachmark
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
                    Bepaal handmatig (drag&amp;drop) de volgorde waarin werkervaringen in je cv komen te staan.
                  </TeachingBubbleContent>
                </Coachmark>
              }
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            {isEditable
              ? <Stack styles={editStyles}>
                <Stack horizontal horizontalAlign="space-between"
                  tokens={{ childrenGap: "l1" }}>
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
                  <Modal
                    isOpen={previewVisible}
                    onDismiss={() => setPreviewVisible(false)}
                    isModeless={true}
                    dragOptions={{
                      moveMenuItemText: "Move",
                      closeMenuItemText: "Close",
                      menu: ContextualMenu
                    }}
                    styles={{ root: { overflow: "hidden", margin: "-8px" } }}>
                    <Stack styles={previewStyles}>
                      <Stack horizontal horizontalAlign="space-between">
                        <Text variant="xxLarge">Preview</Text>
                        <IconButton
                          iconProps={{ iconName: "Cancel" }}
                          onClick={() => setPreviewVisible(false)}
                        />
                      </Stack>
                      {renderPreview()}
                    </Stack>
                  </Modal>
                  <StackItem align="end">
                    <PrimaryButton
                      text="Preview"
                      iconProps={{ iconName: "EntryView" }}
                      onClick={() => setPreviewVisible(!previewVisible)}
                    />
                  </StackItem>
                </Stack>
                <CvTextField
                  label="Rol"
                  field={`role.${props.locale}`}
                  instanceContext={experienceContext}
                  placeholder={commonUtils.getPlaceholder(experiences, props.selectedExperienceId, "role", props.locale)}
                />
                <Stack horizontal
                  tokens={{ childrenGap: "l1" }}>
                  <StackItem grow>
                    <CvTextField
                      label="Opdrachtgever"
                      field="client"
                      instanceContext={experienceContext}
                    />
                  </StackItem>
                  <StackItem grow>
                    <CvTextField
                      label="Werkgever"
                      field="employer"
                      instanceContext={experienceContext}
                    />
                  </StackItem>
                </Stack>
                <Separator />
                <div style={{
                  position: "relative",
                  overflowY: "auto",
                  height: "inherit"
                }}>
                  <ScrollablePane>
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
                  </ScrollablePane>
                </div>
              </Stack>
              : <Stack styles={editStyles}>
                {renderPreview()}
              </Stack>
            }
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Experience.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  experienceEntity: PropTypes.object,
  replaceExperience: PropTypes.func.isRequired,
  replaceExperiences: PropTypes.func.isRequired,
  selectedExperienceId: PropTypes.string,
  setSelectedExperienceId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
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