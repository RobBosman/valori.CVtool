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
import { compareStrings, isValidYear } from "../../utils/CommonUtils";
import { EducationResultTypes } from "./Enums";
import ConfirmDialog from "../ConfirmDialog";

const entityName = "education";

const Education = (props) => {
  
  const educationContext = {
    entity: props.educationEntity,
    instanceId: props.selectedEducationId,
    setSelectedInstance: props.setSelectedEducationId,
    replaceInstance: props.replaceEducation
  };

  const composePeriod = (education) => 
    `${education.yearFrom ? education.yearFrom + " - " : ""}${education.yearTo || "heden"}`;
  
  // Find all {Education} of the selected {cv}.
  const educations = React.useCallback(
    props.educationEntity && props.selectedCvId && Object.values(props.educationEntity)
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) => {
        let compare = compareStrings(composePeriod(r), composePeriod(l));
        if (compare === 0) {
          compare = compareStrings(l.name || "", r.name || "");
        }
        return compare;
      })
      || [],
    [props.educationEntity, props.selectedCvId]);

  const columns = [
    {
      key: "name",
      fieldName: `name.${props.locale}`,
      name: "Opleiding",
      isResizable: true,
      minWidth: 125,
      maxWidth: 300
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Onderwijsinstelling",
      isResizable: true,
      minWidth: 140,
      maxWidth: 300
    },
    {
      key: "period",
      fieldName: "yearTo",
      name: "Periode",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 75,
      maxWidth: 75
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

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedItemFields = () => {
    const selectedEducation = educations.find(education => education._id === props.selectedEducationId);
    return selectedEducation && {
      Opleiding: selectedEducation.name && selectedEducation.name[props.locale],
      Opleidingsinstituut: selectedEducation.institution
    };
  };

  const isFilledEducation = (education) =>
    education.name || education.institution;

  const onAddItem = () => {
    let newEducation = educations.find(education => !isFilledEducation(education));
    if (!newEducation) {
      newEducation = {
        _id: createUuid(),
        cvId: props.selectedCvId,
        includeInCv: true
      };
      props.replaceEducation(newEducation._id, newEducation);
    }
    props.setSelectedEducationId(newEducation._id);
  };

  const onDeleteItem = () => {
    if (props.selectedEducationId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedEducationId) {
      props.replaceEducation(props.selectedEducationId, {});
      props.setSelectedEducationId(undefined);
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
                <Text variant="xxLarge">Opleidingen</Text>
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
                    disabled={!props.selectedEducationId}
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
                items={educations}
                instanceContext={educationContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Opleiding"
                field={`name.${props.locale}`}
                instanceContext={educationContext}
              />
              <CvTextField
                label="Onderwijsinstelling"
                field="institution"
                instanceContext={educationContext}
              />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
                <CvTextField
                  label="Jaar van"
                  field="yearFrom"
                  instanceContext={educationContext}
                  validateInput={isValidYear}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvTextField
                  label="Jaar tot"
                  field="yearTo"
                  instanceContext={educationContext}
                  validateInput={isValidYear}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvDropdown
                  label='Resultaat'
                  field="result"
                  instanceContext={educationContext}
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

Education.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  educationEntity: PropTypes.object,
  replaceEducation: PropTypes.func.isRequired,
  selectedEducationId: PropTypes.string,
  setSelectedEducationId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.userPrefs.locale,
  selectedCvId: state.ui.selectedId.cv,
  educationEntity: state.safe.content[entityName],
  selectedEducationId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceEducation: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedEducationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Education);