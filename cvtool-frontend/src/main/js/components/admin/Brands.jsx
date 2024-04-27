import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, DefaultButton, SelectionMode } from "@fluentui/react";
import { connect } from "react-redux";
import * as commonUtils from "../../utils/CommonUtils";
import * as safeActions from "../../services/safe/safe-actions";
import { setSelectedId } from "../../services/ui/ui-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import ConfirmDialog from "../ConfirmDialog";

const Brands = props => {

  const brandContext = {
    entity: props.brandEntity,
    instanceId: props.selectedBrandId,
    setSelectedInstanceId: props.setSelectedBrandId,
    replaceInstance: props.replaceBrand
  };

  const brands = React.useMemo(() =>
    Object.values(props.brandEntity || {}) || [],
  [props.brandEntity]);

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 60
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
    const selectedBrand = brands.find(brands => brands._id === props.selectedBrandId);
    return selectedBrand && {
      Naam: selectedBrand.name
    };
  }, [brands, props.selectedBrandId]);

  const isFilledBrand = brand =>
    brand.name;

  const onAddItem = () => {
    let newBrand = brands.find(brand => !isFilledBrand(brand));
    if (!newBrand) {
      newBrand = {
        _id: commonUtils.createUuid()
      };
      props.replaceBrand(newBrand._id, newBrand);
    }
    props.setSelectedBrandId(newBrand._id);
  };

  const onDeleteItem = () => {
    if (props.selectedBrandId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedBrandId) {
      props.deleteBrand(props.selectedBrandId);
      props.setSelectedBrandId(undefined);
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
                <Text variant="xxLarge">Brands</Text>
                { props.authInfo.authorizationLevel == "ADMIN"
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
                      disabled={!props.selectedBrandId}
                      onClick={onDeleteItem}
                    />
                    <ConfirmDialog
                      title="Brand definitief verwijderen?"
                      primaryButtonText="Verwijderen"
                      selectedItemFields={selectedItemFields}
                      isVisible={confirmDialogVisible}
                      onProceed={onDeleteConfirmed}
                      onCancel={onDeleteCancelled}
                    />
                  </Stack>
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={brands}
                instanceContext={brandContext}
                setKey="brands"
                selectionMode={props.authInfo.authorizationLevel == "ADMIN"
                  ? SelectionMode.single
                  : SelectionMode.none
                }
              />
            </Stack>
          </td>

          { props.authInfo.authorizationLevel == "ADMIN"
            && <td valign="top" style={tdStyle}>
              <Stack styles={editStyles}>
                <CvTextField
                  label="Naam"
                  field="name"
                  instanceContext={brandContext}
                  disabled={!props.selectedBrandId}
                />
              </Stack>
            </td>
          }
        </tr>
      </tbody>
    </table>
  );
};

Brands.propTypes = {
  authInfo: PropTypes.object,
  brandEntity: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  selectedBrandId: PropTypes.string,
  setSelectedBrandId: PropTypes.func.isRequired,
  deleteBrand: PropTypes.func.isRequired,
  replaceBrand: PropTypes.func.isRequired,
  replaceBusinessUnit: PropTypes.func.isRequired
};

const select = store => ({
  authInfo: store.auth.authInfo,
  brandEntity: store.safe.content.brand,
  businessUnitEntity: store.safe.content.businessUnit,
  selectedBrandId: store.ui.selectedId.brand
});

const mapDispatchToProps = dispatch => ({
  setSelectedBrandId: id => dispatch(setSelectedId("brand", id)),
  deleteBrand: id => dispatch(safeActions.deleteBrand(id)),
  replaceBrand: (id, instance) => dispatch(safeActions.changeInstance("brand", id, instance)),
  replaceBusinessUnit: (id, instance) => dispatch(safeActions.changeInstance("businessUnit", id, instance))
});

export default connect(select, mapDispatchToProps)(Brands);