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

const entityName = "education";

const Education = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  const composePeriod = (education) => 
    `${education.yearFrom ? education.yearFrom + " - " : ""}${education.yearTo || "heden"}`;

  // Find all {Education} of the selected {cv}.
  const educations = props.educationEntity
    && props.selectedCvId
    && Object.values(props.educationEntity)
      .filter(instance => instance.cvId === props.selectedCvId)
      .filter(instance => instance.type === "EDUCATION")
      .sort((l, r) => {
        let compare = compareStrings(composePeriod(r), composePeriod(l));
        if (compare === 0) {
          compare = compareStrings(l.name || "", r.name || "");
        }
        return compare;
      })
    || [];

  const educationContext = {
    locale: props.locale,
    entity: props.educationEntity,
    instanceId: props.selectedEducationId,
    setSelectedInstance: props.setSelectedEducationId,
    replaceInstance: props.replaceEducation
  };
  
  const isValidYear = (value) =>
    isNaN(value) ? "Voer een jaartal in" : value.length > 4 ? "Maximaal vier cijfers" : "";

  const columns = [
    {
      key: "name",
      localeFieldName: "name",
      name: "Opleiding",
      isResizable: true,
      minWidth: 180,
      data: "string"
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
      minWidth: 250,
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
  const selectedEducation = educations.find(education => education._id === props.selectedEducationId);
  const selectedItemFields = selectedEducation && {
    Opleiding: selectedEducation.name && selectedEducation.name[props.locale],
    Opleidingsinstituut: selectedEducation.institution
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceEducation(id, {
      _id: id,
      cvId: props.selectedCvId,
      type: "EDUCATION",
      includeInCv: true
    });
    props.setSelectedEducationId(id);
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
                    itemFields={selectedItemFields}
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
                localeField="name"
                instanceContext={educationContext} />
              <CvTextField
                label="Opleidingsinstituut"
                field="institution"
                instanceContext={educationContext} />
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
  selectedCvId: state.ui.selectedId["cv"],
  educationEntity: state.safe.content[entityName],
  selectedEducationId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceEducation: (id, instance) => dispatch(changeInstance(entityName, id, instance)),
  setSelectedEducationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Education);