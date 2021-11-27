import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, SelectionMode } from "@fluentui/react";
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

  const businessUnitContext = {
    entity: props.businessUnitEntity,
    instanceId: props.selectedBusinessUnitId,
    setSelectedInstanceId: props.setSelectedBusinessUnitId,
    replaceInstance: props.replaceBusinessUnit
  };
  
  const businessUnits = React.useMemo(() =>
    Object.values(props.businessUnitEntity || {})
      .filter(businessUnit => businessUnit._id) // Don't show deleted businessUnits.
      || [],
  [props.businessUnitEntity]);

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 140,
      maxWidth: 250
    },
    {
      key: "contactName",
      fieldName: "contactName",
      name: "Contactpersoon",
      isResizable: true,
      minWidth: 120
    },
    {
      key: "accountIds.length",
      fieldName: "accountIds.length",
      name: "Members",
      isResizable: false,
      minWidth: 80,
      maxWidth: 80,
      data: "number"
    }
  ];

  const {editPaneBackground, viewPaneBackground} = useTheme();
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 500,
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
    const selectedBusinessUnit = businessUnits.find(businessUnit => businessUnit._id === props.selectedBusinessUnitId);
    return selectedBusinessUnit && {
      Naam: selectedBusinessUnit.name,
      Contactpersoon: selectedBusinessUnit.contactName,
      Members: selectedBusinessUnit.accountIds?.length || "0"
    };
  }, [businessUnits, props.selectedBusinessUnitId]);

  const isFilledBusinessUnit = (businessUnit) =>
    businessUnit.name || businessUnit.contactName;

  const onAddItem = () => {
    let newBusinessUnit = businessUnits.find(businessUnit => !isFilledBusinessUnit(businessUnit));
    if (!newBusinessUnit) {
      newBusinessUnit = {
        _id: createUuid(),
        accountIds: []
      };
      props.replaceBusinessUnit(newBusinessUnit._id, newBusinessUnit);
    }
    props.setSelectedBusinessUnitId(newBusinessUnit._id);
  };

  const onDeleteItem = () => {
    if (props.selectedBusinessUnitId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedBusinessUnitId) {
      props.replaceBusinessUnit(props.selectedBusinessUnitId, {});
      props.setSelectedBusinessUnitId(undefined);
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
                <Text variant="xxLarge">Units</Text>
                { ["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
                  &&  <Stack horizontal
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
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={businessUnits}
                instanceContext={businessUnitContext}
                setKey="businessUnits"
                selectionMode={["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
                  ? SelectionMode.single
                  : SelectionMode.none
                }
              />
            </Stack>
          </td>

          { ["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
            && <td valign="top" style={tdStyle}>
              <Stack styles={editStyles}>
                <CvTextField
                  label="Unit"
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
          }
        </tr>
      </tbody>
    </table>
  );
};

BusinessUnits.propTypes = {
  authInfo: PropTypes.object,
  accountEntity: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  selectedBusinessUnitId: PropTypes.string,
  setSelectedBusinessUnitId: PropTypes.func.isRequired,
  replaceBusinessUnit: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  accountEntity: store.safe.content.account,
  businessUnitEntity: store.safe.content[entityName],
  selectedBusinessUnitId: store.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedBusinessUnitId: (id) => dispatch(setSelectedId(entityName, id)),
  replaceBusinessUnit: (id, instance) => dispatch(safeActions.changeInstance(entityName, id, instance))
});

export default connect(select, mapDispatchToProps)(BusinessUnits);