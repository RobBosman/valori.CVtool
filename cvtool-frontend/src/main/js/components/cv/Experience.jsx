import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, StackItem, Separator, PrimaryButton, ColumnActionsMode } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance, changeInstances } from "../../services/safe/safe-actions";
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

  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);
  const hasCharacteristics = commonUtils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
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

  // Find all {Experiences} of the selected {account} and sort them by their sortIndex.
  const experiences = React.useMemo(() =>
    props.selectedAccountId && Object.values(props.experienceEntity || {})
      .filter(instance => instance.accountId === props.selectedAccountId)
      .sort((l, r) => (l?.sortIndex || 0) - (r?.sortIndex || 0))
    || [],
  [props.experienceEntity, props.selectedAccountId]);

  const { viewPaneBackground, editPaneBackground, valoriBlue, valoriYellow } = useTheme();

  const renderRole = (item) =>
    item.role?.[props.locale] || commonUtils.getValueOrFallback(item, "role", props.locale);

  const renderClient = (item) =>
    item.client || item.employer;

  const setIncludeInCv = (experienceId, newExperience) => {
    props.replaceExperience(experienceId, { ...newExperience, includeInOverview: (newExperience.includeInCv ? false : newExperience.includeInOverview) });
  };

  const setIncludeInOverview = (experienceId, newExperience) => {
    props.replaceExperience(experienceId, { ...newExperience, includeInCv: (newExperience.includeInOverview ? false : newExperience.includeInCv) });
  };

  const renderInCvCheckbox = (item) =>
    <Stack horizontal horizontalAlign="space-around" verticalAlign="center">
      <CvCheckbox
        field="includeInCv"
        instanceContext={{ ...experienceContext, instanceId: item._id, replaceInstance: setIncludeInCv }}
      />
    </Stack>;

  const renderInOverviewCheckbox = (item) =>
    <Stack horizontal horizontalAlign="space-around" verticalAlign="center">
      <CvCheckbox
        field="includeInOverview"
        instanceContext={{ ...experienceContext, instanceId: item._id, replaceInstance: setIncludeInOverview }}
      />
    </Stack>;

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
      minWidth: 30,
      maxWidth: 30,
      data: "boolean",
      columnActionsMode: ColumnActionsMode.disabled
    },
    {
      key: "includeInOverview",
      fieldName: "includeInOverview",
      name: "Overzicht",
      onRender: renderInOverviewCheckbox,
      isResizable: false,
      minWidth: 65,
      maxWidth: 65,
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
        _id: commonUtils.createUuid(),
        accountId: props.selectedAccountId,
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
    for (const [index, item] of items.entries()) {
      const sortIndex = index + 1;
      if (item.sortIndex !== sortIndex) {
        reIndexedItems.push({ ...item, sortIndex: sortIndex });
      }
    }
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
          <th valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Werkervaring</Text>
                {isEditable
                  && <StackItem>
                    <Stack horizontal tokens={{ childrenGap: "l1" }}>
                      <DefaultButton
                        text="Toevoegen"
                        iconProps={{ iconName: "Add" }}
                        disabled={!hasCharacteristics}
                        onClick={onAddItem}
                      />
                      <DefaultButton
                        text="Verwijderen"
                        iconProps={{ iconName: "Delete" }}
                        disabled={!props.selectedExperienceId}
                        onClick={onDeleteItem}
                      />
                      <ConfirmDialog
                        title="Werkervaring definitief verwijderen?"
                        primaryButtonText="Verwijderen"
                        selectedItemFields={selectedItemFields}
                        isVisible={confirmDialogVisible}
                        onProceed={onDeleteConfirmed}
                        onCancel={onDeleteCancelled}
                      />
                    </Stack>
                  </StackItem>
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
          </th>

          <td valign="top" style={tdStyle}>
            {isEditable
              ? <Stack styles={editStyles}>
                <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: "l1" }}>
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
                    isVisible={previewVisible}
                    rootStyles={{
                      width: 614, // = 9213/1440 inch
                      height: "calc(100vh - 300px)"
                    }}
                    renderContent={renderPreview}
                    onDismiss={() => setPreviewVisible(false)}
                  />
                  <StackItem>
                    <PrimaryButton
                      text="Preview"
                      iconProps={{ iconName: "EntryView" }}
                      onClick={() => setPreviewVisible(!previewVisible)}
                      style={{ top: "28px" }}
                    />
                  </StackItem>
                </Stack>
                <CvTextField
                  label="Rol"
                  field={`role.${props.locale}`}
                  instanceContext={experienceContext}
                  placeholder={commonUtils.getPlaceholder(experiences, props.selectedExperienceId, "role", props.locale)}
                />
                <Stack horizontal tokens={{ childrenGap: "l1" }}>
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
  selectedAccountId: PropTypes.string,
  characteristicsEntity: PropTypes.object,
  experienceEntity: PropTypes.object,
  replaceExperience: PropTypes.func.isRequired,
  replaceExperiences: PropTypes.func.isRequired,
  selectedExperienceId: PropTypes.string,
  setSelectedExperienceId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  characteristicsEntity: store.safe.content.characteristics,
  experienceEntity: store.safe.content[entityName],
  selectedExperienceId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceExperience: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  replaceExperiences: (instances) => dispatch(changeInstances(entityName, instances)),
  setSelectedExperienceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Experience);