import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, PrimaryButton, StackItem } from "@fluentui/react";
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

const entityName = "education";

const Education = (props) => {

  const cv = props.cvEntity && props.cvEntity[props.selectedCvId];
  const isEditable = commonUtils.isAccountEditable(cv?.accountId, props.authInfo);
  
  const educationContext = {
    entity: props.educationEntity,
    instanceId: props.selectedEducationId,
    setSelectedInstanceId: props.setSelectedEducationId,
    replaceInstance: props.replaceEducation,
    readOnly: !isEditable
  };

  const composePeriod = (education) => 
    `${education.yearFrom ? education.yearFrom + " - " : ""}${education.yearTo || (props.locale === "uk_UK" ? "today" : "heden")}`;
  
  // Find all {Education} of the selected {cv}.
  const educations = React.useMemo(() =>
    props.selectedCvId && Object.values(props.educationEntity || {})
      .filter(instance => instance.cvId === props.selectedCvId)
      .sort((l, r) =>
        commonUtils.comparePrimitives(composePeriod(r), composePeriod(l))
        || commonUtils.comparePrimitives(
          commonUtils.getValueOrFallback(l, "name", props.locale),
          commonUtils.getValueOrFallback(r, "name", props.locale)))
      || [],
  [props.educationEntity, props.selectedCvId]);

  const renderName = (item) =>
    item.name && item.name[props.locale] || commonUtils.getValueOrFallback(item, "name", props.locale);

  const renderInCvCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...educationContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "name",
      fieldName: `name.${props.locale}`,
      name: "Opleiding",
      onRender: renderName,
      isResizable: true,
      minWidth: 95,
      maxWidth: 250
    },
    {
      key: "institution",
      fieldName: "institution",
      name: "Onderwijsinstelling",
      isResizable: true,
      minWidth: 120,
      maxWidth: 300
    },
    {
      key: "period",
      fieldName: "yearTo",
      name: "Periode",
      onRender: composePeriod,
      isResizable: false,
      minWidth: 75,
      maxWidth: 75,
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
    const selectedEducation = educations.find(education => education._id === props.selectedEducationId);
    return selectedEducation && {
      Opleiding: commonUtils.getValueOrFallback(selectedEducation, "name", props.locale),
      Opleidingsinstituut: selectedEducation.institution
    };
  },
  [educations, props.selectedEducationId, props.locale]);

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
    setConfirmDialogVisible(false);
    if (props.selectedEducationId) {
      props.replaceEducation(props.selectedEducationId, {});
      props.setSelectedEducationId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const renderPreviewEducation = (education) => {
    return (
      <tr style={{ color: valoriBlue }}>
        <td>{commonUtils.getValueOrFallback(education, "name", props.locale)}</td>
        <td>{education.institution}</td>
        <td>
          {composePeriod(education)}
          <span style={{ color: valoriYellow }}>{" // "}</span>
          {enums.getText(enums.EducationResultTypes, education.result, props.locale)}
        </td>
      </tr>
    );
  };

  const renderPreview = React.useCallback(() => {
    const educationsToDisplay = educations
      .filter(isFilledEducation)
      .filter(education => education.includeInCv)
      .sort((l, r) =>
        commonUtils.comparePrimitives(r.yearTo, l.yearTo)
        || commonUtils.comparePrimitives(
          enums.getValue(enums.EducationResultTypes, l.result)?.sortIndex || 0,
          enums.getValue(enums.EducationResultTypes, r.result)?.sortIndex || 0)
        || commonUtils.comparePrimitives(
          commonUtils.getValueOrFallback(l, "name", props.locale),
          commonUtils.getValueOrFallback(r, "name", props.locale)));
    return educationsToDisplay.length === 0
      ? null
      : <table>
        <tbody>
          <tr
            style={{
              color: valoriYellow,
              fontWeight: "bold"
            }}>
            <td style={{ width: 204 }}>Opleiding</td>
            <td style={{ width: 208 }}>Onderwijsinstelling</td>
            <td>Diploma</td>
          </tr>
          {
            educationsToDisplay
              .map(renderPreviewEducation)
          }
        </tbody>
      </table>;
  },
  [educations, props.locale]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Opleidingen</Text>
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
                }
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
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <StackItem grow>
                  <CvTextField
                    label={createHelpIcon({
                      label: "Opleiding",
                      content:
                        <Text>
                          Je vermeldt hier eventueel je opleiding in het voortgezet onderwijs
                          <br/>en daarnaast HBO en/of WO studies.
                          <br/>Indien je hier andere vak-/beroepsgerichte opleidingen wilt vermelden,
                          <br/>stem dit dan eerst even af met je leidinggevende.
                        </Text>
                    })}
                    field={`name.${props.locale}`}
                    instanceContext={educationContext}
                    placeholder={commonUtils.getPlaceholder(educations, props.selectedEducationId, "name", props.locale)}
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
                label="Onderwijsinstelling"
                field="institution"
                instanceContext={educationContext}
              />
              <Stack horizontal
                tokens={{ childrenGap: "l1" }}>
                <CvTextField
                  label="Van jaar"
                  field="yearFrom"
                  instanceContext={educationContext}
                  validateInput={commonUtils.isValidYear}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvTextField
                  label="Tot jaar"
                  field="yearTo"
                  instanceContext={educationContext}
                  validateInput={commonUtils.isValidYear}
                  placeholder='yyyy'
                  styles={{ fieldGroup: { width: 80 } }}
                />
                <CvDropdown
                  label='Resultaat'
                  field="result"
                  instanceContext={educationContext}
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

Education.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  cvEntity: PropTypes.object,
  selectedCvId: PropTypes.string,
  educationEntity: PropTypes.object,
  replaceEducation: PropTypes.func.isRequired,
  selectedEducationId: PropTypes.string,
  setSelectedEducationId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  cvEntity: store.safe.content.cv,
  selectedCvId: store.ui.selectedId.cv,
  educationEntity: store.safe.content[entityName],
  selectedEducationId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedEducationId: (id) => dispatch(setSelectedId(entityName, id)),
  replaceEducation: (id, instance) => dispatch(changeInstance(entityName, id, instance))
});

export default connect(select, mapDispatchToProps)(Education);