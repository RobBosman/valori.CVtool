import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, SelectionMode, StackItem } from "@fluentui/react";
import { connect } from "react-redux";
import * as commonUtils from "../../utils/CommonUtils";
import * as safeActions from "../../services/safe/safe-actions";
import { setSelectedId } from "../../services/ui/ui-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvTextField } from "../widgets/CvTextField";
import ConfirmDialog from "../ConfirmDialog";
import * as enums from "../cv/Enums";

const BusinessUnits = props => {

  const combineEntities = (brandEntity, businessUnitEntity) => {
    const combined = {};
    Object.values(businessUnitEntity || {})
      .filter(businessUnit => businessUnit._id) // Don't show deleted businessUnits.
      .sort((l, r) => commonUtils.comparePrimitives(l.name, r.name))
      .forEach(businessUnit => {
        combined[businessUnit._id] = {
          ...businessUnit,
          brand: brandEntity?.[businessUnit.brandId]
        };
      });
    return combined;
  };

  const combinedEntities = React.useMemo(() =>
    combineEntities(props.brandEntity, props.businessUnitEntity),
  [props.brandEntity, props.businessUnitEntity]);

  const businessUnitContext = {
    entity: props.businessUnitEntity,
    instanceId: props.selectedBusinessUnitId,
    setSelectedInstanceId: props.setSelectedBusinessUnitId,
    replaceInstance: props.replaceBusinessUnit
  };

  const businessUnits = React.useMemo(() =>
    Object.values(combinedEntities) || [],
  [props.brandEntity, props.businessUnitEntity]);

  const BrandOptions = React.useMemo(() => {
    const options = Object.values(props.brandEntity || {})
      .filter(brand => brand._id) // Don't show deleted brands.
      .sort((l, r) => commonUtils.comparePrimitives(l.name, r.name))
      .map((brand, index) => ({
        key: brand._id,
        sortIndex: index + 1,
        text: {
          nl_NL: brand.name
        }
      }));
    return [
      {
        key: null,
        sortIndex: 0,
        text: {}
      },
      ...options
    ];
  },
  [props.brandEntity]);

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
      key: "brand",
      fieldName: "brand.name",
      name: "Brand",
      isResizable: true,
      minWidth: 60,
      maxWidth: 100
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

  const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedItemFields = React.useCallback(() => {
    const selectedBusinessUnit = businessUnits.find(businessUnit => businessUnit._id === props.selectedBusinessUnitId);
    return selectedBusinessUnit && {
      Naam: selectedBusinessUnit.name,
      Contactpersoon: selectedBusinessUnit.contactName,
      Members: selectedBusinessUnit.accountIds?.length || "0"
    };
  }, [businessUnits, props.selectedBusinessUnitId]);

  const isFilledBusinessUnit = businessUnit =>
    businessUnit.name || businessUnit.contactName;

  const onAddItem = () => {
    let newBusinessUnit = businessUnits.find(businessUnit => !isFilledBusinessUnit(businessUnit));
    if (!newBusinessUnit) {
      newBusinessUnit = {
        _id: commonUtils.createUuid(),
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

  const combinedContext = React.useCallback(replaceInstance => ({
    entity: combinedEntities,
    instanceId: props.selectedBusinessUnitId,
    setSelectedInstanceId: props.setSelectedBusinessUnitId,
    replaceInstance: replaceInstance,
    readOnly: props.authInfo.authorizationLevel != "ADMIN"
  }),
  [combinedEntities, props.selectedBusinessUnitId, props.setSelectedBusinessUnitId]);

  const changeBrandOfBusinessUnit = React.useCallback((businessUnitId, combinedInstance) => {
    props.replaceBusinessUnit(businessUnitId, {
      ...props.businessUnitEntity[businessUnitId],
      brandId: combinedInstance.brandId
    });
  },
  [props.businessUnitEntity, props.replaceBusinessUnit]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Units</Text>
                { ["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
                  && <StackItem>
                    <Stack horizontal tokens={{ childrenGap: "l1" }}>
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
                        title="Business Unit definitief verwijderen?"
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
                items={businessUnits}
                instanceContext={businessUnitContext}
                setKey="businessUnits"
                selectionMode={["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
                  ? SelectionMode.single
                  : SelectionMode.none
                }
              />
            </Stack>
          </th>

          { ["ADMIN", "UNIT_LEAD"].includes(props.authInfo.authorizationLevel)
            && <td valign="top" style={tdStyle}>
              <Stack styles={editStyles}>
                <CvDropdown
                  label="Brand"
                  field="brandId"
                  instanceContext={combinedContext(changeBrandOfBusinessUnit)}
                  options={enums.getOptions(BrandOptions, props.locale)}
                  styles={{ dropdown: { width: 230 } }}
                  disabled={!props.selectedBusinessUnitId}
                />
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
  locale: PropTypes.string.isRequired,
  brandEntity: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  selectedBusinessUnitId: PropTypes.string,
  setSelectedBusinessUnitId: PropTypes.func.isRequired,
  replaceBusinessUnit: PropTypes.func.isRequired
};

const select = store => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  brandEntity: store.safe.content.brand,
  businessUnitEntity: store.safe.content.businessUnit,
  selectedBusinessUnitId: store.ui.selectedId.businessUnit
});

const mapDispatchToProps = dispatch => ({
  setSelectedBusinessUnitId: id => dispatch(setSelectedId("businessUnit", id)),
  replaceBusinessUnit: (id, instance) => dispatch(safeActions.changeInstance("businessUnit", id, instance))
});

export default connect(select, mapDispatchToProps)(BusinessUnits);