import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { changeInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvDropdown } from "../widgets/CvDropdown";
import * as commonUtils from "../../utils/CommonUtils";
import { EducationResultTypes } from "./Enums";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "training";

const Training = (props) => {

  const trainingContext = {
    entity: props.trainingEntity,
    instanceId: props.selectedTrainingId,
    setSelectedInstanceId: props.setSelectedTrainingId,
    replaceInstance: props.replaceTraining
  };

  const composePeriod = (training) =>
    `${training.year || "heden"}`;
  
  // Find all {Training} of the selected {cv}.
  const trainings = React.useMemo(() =>
    props.selectedCvId && Object.values(props.trainingEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => {
        let compare = commonUtils.compareStrings(composePeriod(r), composePeriod(l));
        if (compare === 0) {
          compare = commonUtils.compareStrings(l.name || "", r.name || "");
        }
        return compare;
      })
      || [],
  [props.trainingEntity, props.selectedCvId]);

  const renderName = (item) =>
    item.name && item.name[props.locale] || commonUtils.getPlaceholder(trainings, item._id, "name", props.locale);
  
  const columns = [
    {
      key: "name",
      fieldName: `name.${props.locale}`,
      name: "Training",
      onRender: renderName,
      isResizable: true,
      minWidth: 140,
      maxWidth: 300
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 140,
      maxWidth: 300
    },
    {
      key: "year",
      fieldName: "year",
      name: "Jaar",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 60,
      maxWidth: 60,
      data: "number"
    }
  ];

  const {viewPaneBackground, editPaneBackground} = useTheme();
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

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Trainingen</Text>
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
              <CvTextField
                label="Training"
                field={`name.${props.locale}`}
                instanceContext={trainingContext}
                placeholder={commonUtils.getPlaceholder(trainings, props.selectedTrainingId, "name", props.locale)}
              />
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
                  options={EducationResultTypes}
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
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  trainingEntity: PropTypes.object,
  replaceTraining: PropTypes.func.isRequired,
  selectedTrainingId: PropTypes.string,
  setSelectedTrainingId: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  selectedCvId: store.ui.selectedId.cv,
  trainingEntity: store.safe.content[entityName],
  selectedTrainingId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceTraining: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedTrainingId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Training);