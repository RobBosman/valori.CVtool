import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, ActionButton, FontIcon } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvChoiceGroup } from "../widgets/CvChoiceGroup";
import { EducationTypes, EducationResultTypes, getEnumData } from "./Enums";

const entityName = "education";

const Education = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  const composePeriod = (education) => 
    `${education.yearFrom ? education.yearFrom + " - " : ""}${education.yearTo || "heden"}`;

  // Find all {Education} of the selected {cv}.
  const educations = props.educationEntity
    && props.selectedCvId
    && Object.values(props.educationEntity).filter((instance) => instance.cvId === props.selectedCvId)
      .sort((l, r) => compareStrings(composePeriod(r), composePeriod(l)))
    || [];

  const educationContext = {
    locale: props.locale,
    entity: props.educationEntity,
    instanceId: props.selectedEducationId,
    setSelectedInstance: props.setSelectedEducationId,
    replaceInstance: props.replaceEducation
  };

  const showIcon = (iconProps) => <FontIcon iconName={iconProps.iconName} />;

  const columns = [
    {
      key: "type",
      fieldName: "type",
      name: "Soort opleiding",
      iconName: "Certificate",
      isIconOnly: true,
      onRender: (item) => showIcon(getEnumData(EducationTypes, item.type).iconProps),
      isResizable: false,
      minWidth: 20,
      maxWidth: 20
    },
    {
      key: "name",
      localeFieldName: "name",
      name: "Opleiding",
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Opleidingsinstituut",
      isResizable: true,
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
      onRender: (item) => getEnumData(EducationResultTypes, item.result).text,
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
        padding: 20
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
      }
    ]
  };

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceEducation(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedEducationId(id);

    setTimeout(() => { // TODO: fix this?
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 1);
  };

  const onDeleteItem = () => {
    if (props.selectedEducationId) {
      props.replaceEducation(props.selectedEducationId, {});
      props.setSelectedEducationId(undefined);
    }
  };

  return (
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td width="50%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Opleiding</Text>
                <div>
                  <ActionButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    onClick={onAddItem}
                  />
                  <ActionButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedEducationId}
                    onClick={onDeleteItem}
                  />
                </div>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={educations}
                instanceContext={educationContext}
                setKey={entityName}
                onExposeSelectionRef={onExposeSelectionRef}
              />
            </Stack>
          </td>

          <td width="50%" valign="top">
            <Stack styles={editStyles}>
              <CvChoiceGroup
                label="Soort opleiding"
                field="type"
                instanceContext={educationContext}
                options={EducationTypes} />
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
                  label="Periode van"
                  field="yearFrom"
                  instanceContext={educationContext}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvTextField
                  label="tot jaar"
                  field="yearTo"
                  instanceContext={educationContext}
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
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  educationEntity: state.safe.content[entityName],
  selectedEducationId: state.ui.selectedId[entityName],
  replaceEducation: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  replaceEducation: (id, instance) => dispatch(replaceInstance(entityName, id, instance)),
  setSelectedEducationId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Education);