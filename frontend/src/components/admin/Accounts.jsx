import PropTypes from "prop-types";
import React from "react";
import { Text, Stack } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import * as safeActions from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { AccountRoles } from "../cv/Enums";
import { CvCheckbox } from "../widgets/CvCheckbox";
import { createUuid } from "../../services/safe/safe-services";

const Accounts = (props) => {

  const enrichAccountEntity = (accountEntity, roleEntity, businessUnitEntity) => {
    if (!accountEntity) {
      return undefined;
    }
    const enrichedAccountEntity = {};
    Object.entries(accountEntity)
      .forEach(([accountId, account]) => {

        const roles = roleEntity && Object.values(roleEntity)
          .filter(role => role.accountId === accountId);
        const enrichedAccount = {...account, roles};
        AccountRoles
          .map(roleEnum => roleEnum.key)
          .forEach(roleName => {
            enrichedAccount[roleName] = roles?.find(role => role.name === roleName);
          });

        const businessUnit = businessUnitEntity && Object.values(businessUnitEntity)
          .find(businessUnit => businessUnit.accountIds.includes(accountId));
        enrichedAccount.businessUnit = businessUnit?.name;

        enrichedAccountEntity[accountId] = enrichedAccount;
      });
    return enrichedAccountEntity;
  };

  const replaceEnrichedAccount = (accountId, enrichedAccount) => {
    const {roles, ...account} = enrichedAccount;
    AccountRoles
      .map(roleEnum => roleEnum.key)
      .forEach(roleName => {
        const role = roles?.find(role => role.name === roleName);
        if (enrichedAccount[roleName]) {
          if (!role) {
            // Create new role.
            const id = createUuid();
            props.replaceRole(id, {
              _id: id,
              accountId: enrichedAccount._id,
              name: roleName
            });
          }
        } else if (role) {
          // Delete role.
          props.replaceRole(role._id, {});
        }
        delete(account[roleName]);
      });
    // props.replaceAccount(accountId, account); // TODO - not needed?
  };

  const enrichedAccountEntity = enrichAccountEntity(props.accountEntity, props.roleEntity, props.businessUnitEntity);

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  // Sort {Account} records.
  const enrichedAccounts = enrichedAccountEntity
    && Object.values(enrichedAccountEntity)
      .sort((l, r) => compareStrings(l.name, r.name))
    || [];

  const accountContext = {
    locale: props.locale,
    entity: enrichedAccountEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: replaceEnrichedAccount
  };

  const renderCheckbox = (field, item) =>
    <CvCheckbox
      field={field}
      instanceContext={{ ...accountContext,  instanceId: item._id }}
      disabled={field === "ADMIN" && item._id === props.authInfo.accountId}
    />;

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 120,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "businessUnit",
      fieldName: "businessUnit",
      name: "Tribe",
      isResizable: true,
      minWidth: 120,
      data: "string"
    }
  ];
  AccountRoles
    .forEach(roleEnum => {
      columns.push({
        key: roleEnum.key,
        fieldName: roleEnum.key,
        name: roleEnum.text,
        onRender: (item) => renderCheckbox(roleEnum.key, item),
        isResizable: false,
        minWidth: 50,
        maxWidth: 50,
        data: "boolean"
      });
    });

  const { viewPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
      }
    ]
  };
  const tdStyle = {
    minWidth: 600,
    width: "calc(50vw - 98px)"
  };

  const onSelectCv = () => {
    if (props.selectedAccountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Accounts</Text>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={enrichedAccounts}
                instanceContext={accountContext}
                setKey="accounts"
                onItemInvoked={onSelectCv}
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
  roleEntity: PropTypes.object,
  businessUnitEntity: PropTypes.object,
  replaceAccount: PropTypes.func.isRequired,
  replaceRole: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  fetchCvByAccountId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  authInfo: state.auth.authInfo,
  accountEntity: state.safe.content["account"],
  roleEntity: state.safe.content["role"],
  businessUnitEntity: state.safe.content["businessUnit"],
  selectedAccountId: state.ui.selectedId["account"]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedAccountId: (id) => dispatch(setSelectedId("account", id)),
  replaceAccount: (id, instance) => dispatch(safeActions.changeInstance("account", id, instance)),
  replaceRole: (id, instance) => dispatch(safeActions.changeInstance("role", id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(safeActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);