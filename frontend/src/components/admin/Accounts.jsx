import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField, DefaultButton, TooltipHost, Separator } from "@fluentui/react";
import { connect } from "react-redux";
import * as safeActions from "../../services/safe/safe-actions";
import * as cvActions from "../../services/cv/cv-actions";
import * as uiActions from "../../services/ui/ui-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvTextField } from "../widgets/CvTextField";
import { Authorizations, getEnumData } from "../cv/Enums";
import ConfirmDialog from "../ConfirmDialog";

const Accounts = (props) => {

  const combineEntities = (accountEntity, authorizationEntity, businessUnitEntity) => {
    const combined = {};
    Object.values(accountEntity || {})
      .filter(account => account._id) // Don't show deleted accounts.
      .forEach(account => {
        const authorization = Object.values(authorizationEntity || {})
          .find(authorizationInstance => authorizationInstance.accountId === account._id);

        const businessUnit = Object.values(businessUnitEntity || {})
          .find(businessUnit => businessUnit.accountIds?.includes(account._id));

        combined[account._id] = {
          ...account,
          authorization: authorization,
          businessUnit: businessUnit
        };
      });
    return combined;
  };

  const switchBusinessUnitOfAccount = React.useCallback((accountId, combinedInstance) => {
    const fromBusinessUnit = Object.values(props.businessUnitEntity || {})
      .find(businessUnit => businessUnit.accountIds?.includes(accountId));
    const toBusinessUnit = Object.values(props.businessUnitEntity || {})
      .find(businessUnit => businessUnit._id === combinedInstance.businessUnit?._id);
    if (toBusinessUnit?._id !== fromBusinessUnit?._id) {
      toBusinessUnit && props.replaceBusinessUnit(toBusinessUnit._id, {
        ...toBusinessUnit,
        accountIds: [...toBusinessUnit.accountIds, accountId]
      });
      fromBusinessUnit && props.replaceBusinessUnit(fromBusinessUnit._id, {
        ...fromBusinessUnit,
        accountIds: fromBusinessUnit.accountIds.filter(memberAccountId => memberAccountId !== accountId)
      });
    }
  },
  [props.businessUnitEntity, props.replaceBusinessUnit]);

  const replaceAuthorizationInstance = React.useCallback((accountId, combinedInstance) => {
    const authorization = Object.values(props.authorizationEntity || {})
      .find(authorizationInstance => authorizationInstance.accountId === accountId);
    props.replaceAuthorization(authorization._id, {
      ...authorization,
      level: combinedInstance.authorization.level
    });
  },
  [props.authorizationEntity, props.replaceAuthorization]);

  const combined = React.useMemo(() => {
    const combinedEntity = combineEntities(props.accountEntity, props.authorizationEntity, props.businessUnitEntity);
    return {
      entity: combinedEntity,
      instances:Object.values(combinedEntity || {})
    };
  },
  [props.accountEntity, props.authorizationEntity, props.businessUnitEntity]);

  const combinedContext = React.useCallback((replaceInstance) => ({
    entity: combined.entity,
    instanceId: props.selectedAccountId,
    setSelectedInstanceId: props.setSelectedAccountId,
    replaceInstance: replaceInstance
  }),
  [combined.entity, props.selectedAccountId]);

  const BusinessUnitOptions = React.useMemo(() => {
    const buOptions = Object.values(props.businessUnitEntity || {})
      .filter(businessUnit => businessUnit._id) // Don't show deleted businessUnits.
      .map(businessUnit => ({ key: businessUnit._id, text: businessUnit?.name }));
    return [
      { key: null, text: "" },
      ...buOptions
    ];
  },
  [props.businessUnitEntity]);

  const onRenderAuthorization = (item) =>
    getEnumData(Authorizations, item.authorization?.level)?.text || "";

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
      key: "businessUnit.name",
      fieldName: "businessUnit.name",
      name: "Tribe",
      isResizable: true,
      minWidth: 120
    },
    {
      key: "authorization.level.",
      fieldName: "authorization.level.",
      onRender: onRenderAuthorization,
      name: "Autorisatie",
      isResizable: false,
      minWidth: 90,
      maxWidth: 90
    }
  ];

  const [filterText, setFilterText] = React.useState("");

  const items = React.useMemo(() => {
    let newItems = combined.instances;
    if (filterText) {
      const lowerCaseFilterText = filterText.toLowerCase();
      newItems = combined.instances.filter(instance => `${instance.name}\n${instance.businessUnit?.name || ""}`.toLowerCase().includes(lowerCaseFilterText));
    }
    return newItems;
  },
  [combined.instances, filterText]);

  const onFilter = (_, newFilterText) =>
    setFilterText(newFilterText);

  const onFetchCv = () => {
    if (["ADMIN", "EE_LEAD"].includes(props.authInfo.authorizationLevel)
    && props.selectedAccountId && props.selectedAccountId !== props.authInfo.accountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
  const selectedItemFields = React.useCallback(() => {
    const selectedAccount = combined.instances.find(businessUnit => businessUnit._id === props.selectedAccountId);
    return selectedAccount && {
      Naam: selectedAccount.name,
      Tribe: selectedAccount.businessUnit?.name
    };
  }, [combined.instances, props.selectedAccountId]);

  const onDeleteAccount = () => {
    if (["ADMIN"].includes(props.authInfo.authorizationLevel)
    && props.selectedAccountId && props.selectedAccountId !== props.authInfo.accountId) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedAccountId) {
      props.deleteAccount(props.selectedAccountId);
      props.setSelectedAccountId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const { editPaneColor, viewPaneColor, alertColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        minWidth: 550,
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

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Accounts</Text>
                <Stack horizontal
                  tokens={{ childrenGap: "s1" }}>
                  <TextField
                    label="Filter"
                    iconProps={{ iconName: "Filter" }}
                    underlined
                    onChange={onFilter}
                  />
                  <Text variant="xSmall">{items.length} / {combined.instances.length}</Text>
                  <ConfirmDialog
                    title="Account en cv-gegevens definitief verwijderen?"
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
                items={items}
                instanceContext={combinedContext()}
                setKey="accounts"
                onItemInvoked={onFetchCv}
              />
            </Stack>
          </td>

          { ["ADMIN", "EE_LEAD"].includes(props.authInfo.authorizationLevel)
            && <td valign="top" style={tdStyle}>
              <Stack styles={editStyles}>
                <CvTextField
                  label="Naam"
                  field="name"
                  instanceContext={combinedContext()}
                  disabled={true}
                />
                <CvDropdown
                  label="Tribe"
                  field="businessUnit._id"
                  instanceContext={combinedContext(switchBusinessUnitOfAccount)}
                  options={BusinessUnitOptions}
                  styles={{ dropdown: { width: 200 } }}
                />
                { ["ADMIN"].includes(props.authInfo.authorizationLevel)
                  && <CvDropdown
                    label="Autorisatie"
                    field="authorization.level"
                    instanceContext={combinedContext(replaceAuthorizationInstance)}
                    disabled={!props.selectedAccountId || props.selectedAccountId === props.authInfo.accountId}
                    options={Authorizations}
                    styles={{ dropdown: { width: 200 } }}
                  />
                }
                <Separator/>
                <Stack grow verticalAlign="space-between">
                  <TooltipHost content="Haal de gegevens op om het CV te bewerken">
                    <DefaultButton
                      text="CV bewerken"
                      iconProps={{ iconName: "CloudDownload" }}
                      disabled={!props.selectedAccountId}
                      onClick={onFetchCv}
                      styles={{ root: { width: 200 } }}
                    />
                  </TooltipHost>
                  { ["ADMIN"].includes(props.authInfo.authorizationLevel)
                    && <DefaultButton
                      text="Account verwijderen"
                      iconProps={{ iconName: "Delete" }}
                      disabled={!props.selectedAccountId || props.selectedAccountId === props.authInfo.accountId}
                      onClick={onDeleteAccount}
                      styles={{ root: { color: alertColor, width: 200 } }}
                    />
                  }
                </Stack>
              </Stack>
            </td>
          }
        </tr>
      </tbody>
    </table>
  );
};

Accounts.propTypes = {
  locale: PropTypes.string.isRequired,
  authInfo: PropTypes.object,
  accountEntity: PropTypes.object,
  authorizationEntity: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  deleteAccount: PropTypes.func.isRequired,
  replaceAuthorization: PropTypes.func.isRequired,
  replaceBusinessUnit: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  fetchCvByAccountId: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  accountEntity: store.safe.content.account,
  authorizationEntity: store.safe.content.authorization,
  businessUnitEntity: store.safe.content.businessUnit,
  selectedAccountId: store.ui.selectedId.account
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedAccountId: (id) => dispatch(uiActions.setSelectedId("account", id)),
  deleteAccount: (id) => dispatch(safeActions.deleteAccount(id)),
  replaceAuthorization: (id, instance) => dispatch(safeActions.changeInstance("authorization", id, instance)),
  replaceBusinessUnit: (id, instance) => dispatch(safeActions.changeInstance("businessUnit", id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);