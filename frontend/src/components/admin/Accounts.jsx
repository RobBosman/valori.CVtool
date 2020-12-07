import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import * as safeActions from "../../services/safe/safe-actions";
import * as cvActions from "../../services/cv/cv-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvTextField } from "../widgets/CvTextField";
import { Authorizations, getEnumData } from "../cv/Enums";

const Accounts = (props) => {

  const combineEntities = (accountEntity, authorizationEntity, businessUnitEntity) => {
    const combined = {};
    if (accountEntity && authorizationEntity && businessUnitEntity) {
      Object.entries(accountEntity)
        .forEach(([accountId, account]) => {
          const authorization = Object.values(authorizationEntity)
            .find(authorizationInstance => authorizationInstance.accountId === accountId);

          const businessUnit = Object.values(businessUnitEntity)
            .find(businessUnit => businessUnit.accountIds?.includes(accountId));

          combined[accountId] = {
            ...account,
            authorization: authorization,
            businessUnit: businessUnit
          };
        });
    }
    return combined;
  };

  const replaceCombinedInstance = (authorizationEntity, replaceAuthorization) => (accountId, combinedInstance) => {
    const authorization = authorizationEntity && Object.values(authorizationEntity)
      .find(authorizationInstance => authorizationInstance.accountId === accountId);
    replaceAuthorization(authorization._id, {
      ...authorization,
      level: combinedInstance.authorization.level
    });
  };

  const memo = React.useMemo(() => {
    const combinedEntity = combineEntities(props.accountEntity, props.authorizationEntity, props.businessUnitEntity);
    return {
      combinedEntity: combinedEntity,
      combinedInstances: combinedEntity && Object.values(combinedEntity) || []
    };
  },
  [props.accountEntity, props.authorizationEntity, props.businessUnitEntity]);

  const combinedInstanceContext = React.useCallback({
    entity: memo.combinedEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: replaceCombinedInstance(props.authorizationEntity, props.replaceAuthorization)
  }, [memo.combinedEntity, props.replaceAuthorization, props.selectedAccountId]);

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

  const [state, setState] = React.useState({
    items: memo.combinedInstances,
    filterText: ""
  });

  React.useLayoutEffect(() => {
    let newItems = memo.combinedInstances;
    if (state.filterText) {
      const lowerCaseFilterText = state.filterText.toLowerCase();
      newItems = memo.combinedInstances.filter(instance => `${instance.name}\n${instance.businessUnit?.name || ""}`.toLowerCase().includes(lowerCaseFilterText));
    }
    setState(prevState => ({
      ...prevState,
      items: newItems
    }));
  },
  [memo.combinedInstances, state.filterText]);

  const onFilter = (_, filterText) =>
    setState(prevState => ({
      ...prevState,
      filterText: filterText
    }));

  const onEditCv = () => {
    if (["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel) && props.selectedAccountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  const { editPaneColor, viewPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        minWidth: 500,
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
                  tokens={{ childrenGap: "l1" }}l>
                  <TextField
                    label="Filter"
                    underlined
                    onChange={onFilter}
                  />
                  <Text variant="xSmall">{state.items.length} / {memo.combinedInstances.length}</Text>
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={state.items}
                instanceContext={combinedInstanceContext}
                setKey="accounts"
                onItemInvoked={onEditCv}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Naam"
                field="name"
                instanceContext={combinedInstanceContext}
                disabled={true}
              />
              <CvTextField
                label="Tribe"
                field="businessUnit.name"
                instanceContext={combinedInstanceContext}
                disabled={true}
              />
              <CvDropdown
                label="Autorisatie"
                field="authorization.level"
                instanceContext={combinedInstanceContext}
                disabled={props.authInfo.authorizationLevel !== "ADMIN" || props.authInfo.accountId === props.selectedAccountId}
                options={Authorizations}
                styles={{ dropdown: { width: 120 } }}
              />
            </Stack>
          </td>
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
  replaceAccount: PropTypes.func.isRequired,
  replaceAuthorization: PropTypes.func.isRequired,
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
  setSelectedAccountId: (id) => dispatch(setSelectedId("account", id)),
  replaceAccount: (id, instance) => dispatch(safeActions.changeInstance("account", id, instance)),
  replaceAuthorization: (id, instance) => dispatch(safeActions.changeInstance("authorization", id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);