import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import * as safeActions from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import ConfirmDialog from "../ConfirmDialog";
import { createUuid } from "../../services/safe/safe-services";

const entityName = "businessUnit";

const BusinessUnits = (props) => {
  
  const businessUnitContext = React.useCallback({
    entity: props.businessUnitEntity,
    instanceId: props.selectedBusinessUnitId,
    setSelectedInstance: props.setSelectedBusinessUnitId,
    replaceInstance: props.replaceBusinessUnit
  }, [props.businessUnitEntity, props.selectedBusinessUnitId, props.setSelectedBusinessUnitId, props.replaceBusinessUnit]);
  
  const businessUnits = React.useCallback(
    props.businessUnitEntity && Object.values(props.businessUnitEntity) || [],
    [props.businessUnitEntity]);

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 130,
      maxWidth: 250
    },
    {
      key: "contactName",
      fieldName: "contactName",
      name: "Contactpersoon",
      isResizable: true,
      minWidth: 120
    }
  ];

  const { editPaneColor, viewPaneColor } = useTheme();
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
    const selectedBusinessUnit = businessUnits.find(businessUnit => businessUnit._id === props.selectedBusinessUnitId);
    return selectedBusinessUnit && {
      Naam: selectedBusinessUnit.name,
      Contactpersoon: selectedBusinessUnit.contactName
    };
  };

  const isFilledBusinessUnit = (businessUnit) =>
    businessUnit.name || businessUnit.contactName;

  const onAddItem = () => {
    let newEducation = businessUnits.find(education => !isFilledBusinessUnit(education));
    if (!newEducation) {
      newEducation = {
        _id: createUuid()
      };
      props.replaceBusinessUnit(newEducation._id, newEducation);
    }
    props.setSelectedBusinessUnitId(newEducation._id);
  };

  const onDeleteItem = () => {
    if (props.selectedBusinessUnitId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    if (props.selectedBusinessUnitId) {
      props.replaceBusinessUnit(props.selectedBusinessUnitId, {});
      props.setSelectedBusinessUnitId(undefined);
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
                <Text variant="xxLarge">Tribes</Text>
                <Stack horizontal
                  tokens={{ childrenGap: "l1" }}>
                  <DefaultButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    onClick={onAddItem}
                  />
                  <DefaultButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedBusinessUnitId}
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
                items={businessUnits}
                instanceContext={businessUnitContext}
                setKey="businessUnits"
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Tribe"
                field="name"
                instanceContext={businessUnitContext}
                disabled={!props.selectedBusinessUnitId}
              />
              <CvTextField
                label="Contactpersoon"
                field="contactName"
                instanceContext={businessUnitContext}
                disabled={!props.selectedBusinessUnitId}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

BusinessUnits.propTypes = {
  authInfo: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  selectedBusinessUnitId: PropTypes.string,
  setSelectedBusinessUnitId: PropTypes.func.isRequired,
  replaceBusinessUnit: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  businessUnitEntity: store.safe.content[entityName],
  selectedBusinessUnitId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedBusinessUnitId: (id) => dispatch(setSelectedId(entityName, id)),
  replaceBusinessUnit: (id, instance) => dispatch(safeActions.changeInstance(entityName, id, instance))
});

export default connect(select, mapDispatchToProps)(BusinessUnits);