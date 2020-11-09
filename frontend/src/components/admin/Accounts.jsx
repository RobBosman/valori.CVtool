import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Checkbox, ActionButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceAccountInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import * as cvActions from "../../services/cv/cv-actions";

const entityName = "account";

const Accounts = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  // Sort {Account} records.
  const accounts = props.accountEntity
    && Object.values(props.accountEntity)
      .sort((l, r) => compareStrings(l.name, r.name))
    || [];

  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: props.replaceAccount
  };

  const renderAdminCheckbox = (item) => {
    return <Checkbox
      checked={item.privileges.includes("ADMIN")}
      onChange={ (event) => console.log("event", event) }
    />;
  };
    

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "privileges",
      fieldName: "privileges",
      name: "Is admin",
      isResizable: true,
      onRender: renderAdminCheckbox,
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
  const tdStyle = {
    minWidth: 250,
    width: "calc(50vw - 98px)"
  };

  const onGenerateCv = () => {
    if (props.selectedAccountId) {
      props.generateCv(props.selectedAccountId);
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
                items={accounts}
                instanceContext={accountContext}
                setKey={entityName}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Naam"
                field="name"
                instanceContext={accountContext}
              />
              <CvTextField
                label="Autorisaties"
                field="privileges"
                instanceContext={accountContext}
              />
              <ActionButton
                text="Download"
                iconProps={{ iconName: "DownloadDocument" }}
                disabled={!props.selectedAccountId}
                onClick={onGenerateCv}
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
  accountEntity: PropTypes.object,
  replaceAccount: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  generateCv: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  accountEntity: state.safe.accounts[entityName],
  selectedAccountId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceAccount: (id, instance) => dispatch(replaceAccountInstance(entityName, id, instance)),
  setSelectedAccountId: (id) => dispatch(setSelectedId(entityName, id)),
  generateCv: (accountId) => dispatch(cvActions.generateCv(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);