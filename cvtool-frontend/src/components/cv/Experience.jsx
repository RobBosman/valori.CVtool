import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, StackItem, ScrollablePane, Separator, PrimaryButton, ColumnActionsMode } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance, changeInstances } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvFormattedText } from "../widgets/CvFormattedText";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import ConfirmDialog from "../ConfirmDialog";
import * as commonUtils from "../../utils/CommonUtils";
import Preview, * as preview from "./Preview";

const entityName = "experience";

const Experience = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [isPreviewVisible, setPreviewVisible] = React.useState(false);
  const [draggedItem, setDraggedItem] = React.useState(undefined);

  const experienceContext = React.useMemo(() => ({
    locale: props.locale,
    entity: props.experienceEntity,
    instanceId: props.selectedExperienceId,
    setSelectedInstanceId: props.setSelectedExperienceId,
    replaceInstance: props.replaceExperience,
    readOnly: !isEditable
  }),
  [props.locale, props.experienceEntity, props.selectedExperienceId, props.setSelectedExperienceId, props.replaceExperience]);

  // Find all {Experiences} of the selected {cv} and sort them by their sortIndex.
  const experiences = React.useMemo(() =>
    props.selectedCvId && Object.values(props.experienceEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => (l?.sortIndex || 0) - (r?.sortIndex || 0))
    || [],
  [props.experienceEntity, props.selectedCvId]);

  const { viewPaneBackground, editPaneBackground, valoriBlue, valoriYellow } = useTheme();

  const renderRole = (item) =>
    item.role && item.role[props.locale] || commonUtils.getValueOrFallback(item, "role", props.locale);

  const renderClient = (item) =>
    item.client || item.employer;

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...experienceContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "period",
      fieldName: "sortIndex",
      name: createHelpIcon({
        label: "Periode",
        title: "Sorteren",
        content:
          <Text>
            Bepaal handmatig met <em>drag&amp;drop</em> de volgorde
            <br/>waarin werkervaringen in je cv komen te staan.
          </Text>
      }),
      onRender: (item) => preview.composeExperiencePeriod(item, props.locale),
      isResizable: false,
      minWidth: 110,
      maxWidth: 110,
      data: "number",
      isSorted: true,
      isSortedDescending: false,
      columnActionsMode: ColumnActionsMode.disabled
    },
    {
      key: "client",
      fieldName: "client",
      name: "Opdrachtgever",
      onRender: renderClient,
      isResizable: true,
      minWidth: 90,
      maxWidth: 250,
      columnActionsMode: ColumnActionsMode.disabled
    },
    {
      key: "role",
      fieldName: `role.${props.locale}`,
      name: "Rol",
      onRender: renderRole,
      isResizable: true,
      minWidth: 90,
      maxWidth: 400,
      columnActionsMode: ColumnActionsMode.disabled
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "boolean",
      columnActionsMode: ColumnActionsMode.disabled
    }
  ];

  const selectedItemFields = React.useCallback(() => {
    const selectedExperience = experiences.find(experience => experience._id === props.selectedExperienceId);
    return selectedExperience && {
      Periode: preview.composeExperiencePeriod(selectedExperience, props.locale),
      Opdrachtgever: selectedExperience.client
    };
  },
  [experiences, props.selectedExperienceId]);

  const isFilledExperience = (experience) =>
    experience.periodBegin || experience.client
    || commonUtils.isFilledLocaleField(experience.assignment, experience.activities, experience.results, experience.keywords);

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
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedExperienceId) {
      props.replaceExperience(props.selectedExperienceId, {});
      props.setSelectedExperienceId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const dragDropEvents = {
    canDrop: () => isEditable,
    canDrag: () => isEditable,
    onDragStart: (item) => setDraggedItem(item),
    onDragEnd: () => setDraggedItem(undefined),
    onDragEnter: () => "", // return string is the css classes that will be added to the entering element.
    onDragLeave: () => { },
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
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const renderPreview = React.useCallback(() => {
    const experience = experiences
      .find(experience => experience._id === props.selectedExperienceId);
    const previewContext = {
      entity: {
        [props.selectedExperienceId]: {
          composedDescription: experience && preview.composeExperienceDescription(experience, props.locale)
        }
      },
      instanceId: props.selectedExperienceId
    };
    return experience
      ? <Stack horizontal
        styles={{
          root: {
            backgroundColor: "white",
            borderColor: valoriYellow,
            borderBottomWidth: 1,
            borderBottomStyle: "solid"
          }
        }}>
        <Stack
          styles={{
            root: {
              width: 131 // = 1972/1440 inch
            }
          }}>
          <Text style={{ ...preview.cvTextStyle, color: valoriBlue }}>
            {preview.composeExperiencePeriod(experience, props.locale)}
          </Text>
          <Text style={{ ...preview.cvTextStyle, color: valoriYellow }}>
            {commonUtils.getValueOrFallback(experience, "role", props.locale)}
          </Text>
          <Text style={{ ...preview.cvTextStyle, color: valoriYellow }}>
            {experience.client || experience.employer || ""}
          </Text>
        </Stack>
        <CvFormattedText
          field="composedDescription"
          instanceContext={previewContext}
          markDown={true}
          textComponentStyle={{
            backgroundColor: "white",
            color: valoriBlue,
            paddingTop: 0
          }}
          styles={{
            root: {
              borderColor: valoriYellow,
              borderWidth: 1,
              borderLeftStyle: "dashed",
              width: 483 // = 7241/1440 inch
            }
          }}
        />
      </Stack>
      : null;
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
                      isVisible={isConfirmDialogVisible}
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
                  <Preview
                    isVisible={isPreviewVisible}
                    rootStyles={{
                      width: 614, // = 9213/1440 inch
                      height: "calc(100vh - 300px)"
                    }}
                    renderContent={renderPreview}
                    onDismiss={() => setPreviewVisible(false)}
                  />
                  <PrimaryButton
                    text="Preview"
                    iconProps={{ iconName: "EntryView" }}
                    onClick={() => setPreviewVisible(!isPreviewVisible)}
                    style={{ top: "28px" }}
                  />
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
                      label={createHelpIcon({
                        label: "Opdracht",
                        content:
                          <Text>
                            Net als bij je profielschets beschrijf je hier waar nodig zaken in de derde persoon.
                            <br/>Vermijd dus woorden als <em>ik</em>, <em>mij</em> etc.
                            <br/>Geef een situatieschets waarin je de opdracht bij de klant omschrijft.
                            <br/>In veel gevallen kan je hierbij de tekst gebruiken uit je opdrachtmanagementformulier.
                          </Text>
                      })}
                      field={`assignment.${props.locale}`}
                      instanceContext={experienceContext}
                      multiline
                      autoAdjustHeight
                    />
                    <CvTextField
                      label={createHelpIcon({
                        label: "Taken/werkzaamheden",
                        content:
                          <Text>
                            Geef hier een duidelijke opsomming van alle werkzaamheden
                            <br/>die een bijdrage leveren aan het resultaat van je opdracht.
                          </Text>
                      })}
                      field={`activities.${props.locale}`}
                      instanceContext={experienceContext}
                      multiline
                      autoAdjustHeight
                    />
                    <CvTextField
                      label={createHelpIcon({
                        label: "Resultaat",
                        content:
                          <Text>
                            Een opsomming van de belangrijkste behaalde resultaten
                            <br/>(individueel en als team/project).
                          </Text>
                      })}
                      field={`results.${props.locale}`}
                      instanceContext={experienceContext}
                      multiline
                      autoAdjustHeight
                    />
                    <CvTextField
                      label={createHelpIcon({
                        label: "Werkomgeving",
                        content:
                          <Text>
                            Denk hierbij aan de toegepaste methode/werkwijze
                            <br/>en technische omgeving zoals bijvoorbeeld:
                            <ul>
                              <li>Agile Scrum</li>
                              <li>TMap</li>
                              <li>CI/CD</li>
                              <li>Java</li>
                              <li>Selenium</li>
                              <li>Tosca</li>
                              <li>JOSF</li>
                              <li>Microsoft stack</li>
                              <li>Oracle Cloud</li>
                            </ul>
                          </Text>
                      })}
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