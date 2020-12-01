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
import { EducationResultTypes, getEnumData } from "./Enums";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "training";

const Training = (props) => {
  
  const [trainings, setTrainings] = React.useState([]);

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  const composePeriod = (training) =>
    `${training.year || "heden"}`;

  // Find all {Training} of the selected {cv}.
  React.useEffect(() => {
    if (props.trainingEntity && props.selectedCvId) {
      setTrainings(
        Object.values(props.trainingEntity)
          .filter(instance => instance.cvId === props.selectedCvId)
          .sort((l, r) => {
            let compare = compareStrings(composePeriod(r), composePeriod(l));
            if (compare === 0) {
              compare = compareStrings(l.name || "", r.name || "");
            }
            return compare;
          })
      );
    }
  }, [props.trainingEntity, props.selectedCvId]);

  const trainingContext = {
    entity: props.trainingEntity,
    instanceId: props.selectedTrainingId,
    setSelectedInstance: props.setSelectedTrainingId,
    replaceInstance: props.replaceTraining
  };
  
  const isValidYear = (value) =>
    isNaN(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

  const columns = [
    {
      key: "name",
      fieldName: `name.${props.locale}`,
      name: "Training",
      isResizable: true,
      minWidth: 180,
      data: "string"
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 220,
      data: "string"
    },
    {
      key: "period",
      name: "Periode",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 75,
      maxWidth: 75,
      data: "string"
    },
    {
      key: "result",
      fieldName: "result",
      name: "Resultaat",
      onRender: (item) => getEnumData(EducationResultTypes, item.result)?.text || "",
      isResizable: false,
      minWidth: 80,
      maxWidth: 80,
      data: "string"
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
  const selectedTraining = trainings.find(experience => experience._id === props.selectedTrainingId);
  const selectedItemFields = selectedTraining && {
    Opleiding: selectedTraining.name && selectedTraining.name[props.locale],
    Opleidingsinstituut: selectedTraining.institution
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceTraining(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedTrainingId(id);
  };

  const onDeleteItem = () => {
    if (props.selectedTrainingId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedTrainingId) {
      props.replaceTraining(props.selectedTrainingId, {});
      props.setSelectedTrainingId(undefined);
    }
    setConfirmDialogVisible(false);
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
                    itemFields={selectedItemFields}
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
                instanceContext={trainingContext} />
              <CvTextField
                label="Opleidingsinstituut"
                field="institution"
                instanceContext={trainingContext} />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
                <CvTextField
                  label="Jaar"
                  field="year"
                  instanceContext={trainingContext}
                  validateInput={isValidYear}
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

const select = (state) => ({
  locale: state.ui.userPrefs.locale,
  selectedCvId: state.ui.selectedId["cv"],
  trainingEntity: state.safe.content[entityName],
  selectedTrainingId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceTraining: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedTrainingId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Training);