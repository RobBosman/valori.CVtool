import PropTypes from "prop-types";
import React from "react";
import { Text, Stack } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import * as safeActions from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { AccountPrivileges } from "../cv/Enums";
import { CvCheckbox } from "../widgets/CvCheckbox";

const entityName = "account";

const Accounts = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  const addPrivilegesAsBooleanFields = (accountEntity) => {
    if (!accountEntity) {
      return undefined;
    }
    const convertedAccountEntity = {};
    Object.entries(accountEntity)
      .forEach(([accountId, account]) => {
        const {privileges, ...convertedAccount} = account;
        AccountPrivileges
          .map(privilegeEnum => privilegeEnum.key)
          .forEach(privilege => {
            convertedAccount[privilege] = privileges.includes(privilege);
          });
        convertedAccountEntity[accountId] = convertedAccount;
      });
    return convertedAccountEntity;
  };

  const convertedAccountEntity = addPrivilegesAsBooleanFields(props.accountEntity);

  const replaceAccountInstance = (accountId, convertedAccount) => {
    const privileges = [];
    AccountPrivileges
      .map(privilegeEnum => privilegeEnum.key)
      .forEach(privilege => {
        if (convertedAccount[privilege]) {
          privileges.push(privilege);
        }
        delete(convertedAccount[privilege]);
      });
    convertedAccount.privileges = privileges;
    props.replaceAccountInstance(accountId, convertedAccount);
  };

  // Sort {Account} records.
  const convertedAccounts = convertedAccountEntity
    && Object.values(convertedAccountEntity)
      .sort((l, r) => compareStrings(l.name, r.name))
    || [];

  const accountContext = {
    locale: props.locale,
    entity: convertedAccountEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: replaceAccountInstance
  };

  const renderCheckbox = (field, item) =>
    <CvCheckbox
      field={field}
      instanceContext={{ ...accountContext, instanceId: item._id }}
      disabled={item._id === props.accountInfo._id}
    />;

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    }
  ];
  AccountPrivileges
    .forEach(privilegeEnum => {
      columns.push({
        key: privilegeEnum.key,
        fieldName: privilegeEnum.key,
        name: privilegeEnum.text,
        onRender: (item) => renderCheckbox(privilegeEnum.key, item),
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
    minWidth: 500,
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
                items={convertedAccounts}
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
  accountInfo: PropTypes.object,
  accountEntity: PropTypes.object,
  replaceAccountInstance: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  fetchCvByAccountId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  accountInfo: state.authentication.accountInfo,
  accountEntity: state.safe.content[entityName],
  selectedAccountId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedAccountId: (id) => dispatch(setSelectedId(entityName, id)),
  replaceAccountInstance: (id, instance) => dispatch(safeActions.changeInstance(entityName, id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(safeActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);