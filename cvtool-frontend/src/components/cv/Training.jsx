import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, StackItem, PrimaryButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvDropdown } from "../widgets/CvDropdown";
import * as commonUtils from "../../utils/CommonUtils";
import * as enums from "./Enums";
import ConfirmDialog from "../ConfirmDialog";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import Preview from "./Preview";

const entityName = "training";

const Training = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);

  const trainingContext = {
    entity: props.trainingEntity,
    instanceId: props.selectedTrainingId,
    setSelectedInstanceId: props.setSelectedTrainingId,
    replaceInstance: props.replaceTraining,
    readOnly: !isEditable
  };

  const composePeriod = (training) =>
    `${training.year || (props.locale === "uk_UK" ? "today" : "heden")}`;
  
  // Find all {Training} of the selected {cv}.
  const trainings = React.useMemo(() =>
    props.selectedCvId && Object.values(props.trainingEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => {
        let compare = commonUtils.comparePrimitives(composePeriod(r), composePeriod(l));
        if (compare === 0) {
          compare = commonUtils.comparePrimitives(l.name || "", r.name || "");
        }
        return compare;
      })
      || [],
  [props.trainingEntity, props.selectedCvId]);

  const renderName = (item) =>
    item.name && item.name[props.locale] || commonUtils.getValueOrFallback(item, "name", props.locale);

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...trainingContext, instanceId: item._id }}
    />;
  
  const columns = [
    {
      key: "name",
      fieldName: `name.${props.locale}`,
      name: "Training",
      onRender: renderName,
      isResizable: true,
      minWidth: 110,
      maxWidth: 280
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 120,
      maxWidth: 300
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 50,
      maxWidth: 50,
      data: "number"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "boolean"
    }
  ];

  const {viewPaneBackground, editPaneBackground, valoriYellow, valoriBlue} = useTheme();
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

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const [isPreviewVisible, setPreviewVisible] = React.useState(false);

  const selectedItemFields = React.useCallback(() => {
    const selectedTraining = trainings.find(training => training._id === props.selectedTrainingId);
    return selectedTraining && {
      Opleiding: commonUtils.getValueOrFallback(selectedTraining, "name", props.locale),
      Opleidingsinstituut: selectedTraining.institution
    };
  },
  [trainings, props.selectedTrainingId, props.locale]);

  const isFilledTraining = (training) =>
    training.name || training.institution;

  const onAddItem = () => {
    let newTraining = trainings.find(training => !isFilledTraining(training));
    if (!newTraining) {
      newTraining = {
        _id: createUuid(),
        cvId: props.selectedCvId,
        includeInCv: true
      };
      props.replaceTraining(newTraining._id, newTraining);
    }
    props.setSelectedTrainingId(newTraining._id);
  };

  const onDeleteItem = () => {
    if (props.selectedTrainingId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedTrainingId) {
      props.replaceTraining(props.selectedTrainingId, {});
      props.setSelectedTrainingId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const renderPreviewTraining = (training) => {
    return (
      <tr style={{ color: valoriBlue }}>
        <td>{commonUtils.getValueOrFallback(training, "name", props.locale)}</td>
        <td>{training.institution}</td>
        <td>
          {composePeriod(training)}
          <span style={{ color: valoriYellow }}>{" // "}</span>
          {enums.getText(enums.EducationResultTypes, training.result, props.locale)}
        </td>
      </tr>
    );
  };

  const renderPreview = React.useCallback(() => {
    const trainingsToDisplay = trainings
      .filter(isFilledTraining)
      .filter(training => training.includeInCv)
      .sort((l, r) =>
        commonUtils.comparePrimitives(r.year, l.year)
        || commonUtils.comparePrimitives(
          enums.getValue(enums.EducationResultTypes, l.result)?.sortIndex || 0,
          enums.getValue(enums.EducationResultTypes, r.result)?.sortIndex || 0)
        || commonUtils.comparePrimitives(
          commonUtils.getValueOrFallback(l, "name", props.locale),
          commonUtils.getValueOrFallback(r, "name", props.locale)));
    return trainingsToDisplay.length === 0
      ? null
      : <table>
        <tbody>
          <tr
            style={{
              color: valoriYellow,
              fontWeight: "bold"
            }}>
            <td style={{ width: 204 }}>Training</td>
            <td style={{ width: 208 }}>Opleidingsinstituut</td>
            <td>Certificaat</td>
          </tr>
          {
            trainingsToDisplay
              .map(renderPreviewTraining)
          }
        </tbody>
      </table>;
  },
  [trainings, props.locale]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Trainingen</Text>
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
                      disabled={!props.selectedTrainingId}
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
                items={trainings}
                instanceContext={trainingContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <StackItem grow>
                  <CvTextField
                    label={createHelpIcon({
                      label: "Training",
                      content:
                        <Text>
                          Het gaat hier om trainingen gericht op een specifiek expertisegebied binnen het vakgebied testen.
                          <br/>Andere trainingen die hieraan gerelateerd zijn kan je hier ook opnemen. 
                        </Text>
                    })}
                    field={`name.${props.locale}`}
                    instanceContext={trainingContext}
                    placeholder={commonUtils.getPlaceholder(trainings, props.selectedTrainingId, "name", props.locale)}
                  />
                </StackItem>
                <Preview
                  isVisible={isPreviewVisible}
                  rootStyles={{
                    width: 620,
                    height: 350
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
                label="Opleidingsinstituut"
                field="institution"
                instanceContext={trainingContext}
              />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
                <CvTextField
                  label="Jaar"
                  field="year"
                  instanceContext={trainingContext}
                  validateInput={commonUtils.isValidYear}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvDropdown
                  label='Resultaat'
                  field="result"
                  instanceContext={trainingContext}
                  options={enums.getOptions(enums.EducationResultTypes, props.locale)}
                  styles={{ dropdown: { width: 120 } }}
                />
              </Stack>
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Training.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  trainingEntity: PropTypes.object,
  replaceTraining: PropTypes.func.isRequired,
  selectedTrainingId: PropTypes.string,
  setSelectedTrainingId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  trainingEntity: store.safe.content[entityName],
  selectedTrainingId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceTraining: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedTrainingId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Training);