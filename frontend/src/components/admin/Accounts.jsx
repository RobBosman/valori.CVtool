import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Checkbox } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { fetchCvByAccountId, replaceAdminContentInstance, replaceCvContent } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";

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
    replaceInstance: props.replaceAccountInstance
  };

  const renderAdminCheckbox = (item) => (
    <Checkbox
      checked={item.privileges.includes("ADMIN")}
      onChange={() => {
        alert("TODO: update privileges!"); // TODO: update privileges!
        // const selectedAccount = props.accountEntity[props.selectedAccountId];
        // console.log("selectedAccount", selectedAccount);
        // if (selectedAccount) {
        //   console.log("selectedAccount.privileges", selectedAccount.privileges);
        //   const changedAccount = { ...selectedAccount };
        //   if (selectedAccount.privileges.includes("ADMIN")) {
        //     changedAccount.privileges = selectedAccount.privileges.filter(privilege => privilege === "ADMIN");
        //   } else {
        //     changedAccount.privileges.push("ADMIN");
        //   }
        //   props.replaceAccountInstance(props.selectedAccountId, changedAccount);
        // }
      }}
    />);

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
    minWidth: 250,
    width: "calc(50vw - 98px)"
  };
  
  const [currentAccountId, setCurrentAccountId] = React.useState(null);
  React.useEffect(() => {
    if (currentAccountId != props.selectedAccountId) {
      if (currentAccountId) {
        props.clearCvContent();
      }
      setCurrentAccountId(props.selectedAccountId);
    }
  });

  const onSelectCv = () => {
    if (props.selectedAccountId) {
      props.fetchCv(props.selectedAccountId);
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
  accountEntity: PropTypes.object,
  replaceAccountInstance: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  clearCvContent: PropTypes.func.isRequired,
  fetchCv: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  accountEntity: state.safe.adminContent[entityName],
  selectedAccountId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceAccountInstance: (id, instance) => dispatch(replaceAdminContentInstance(entityName, id, instance)),
  clearCvContent: () => dispatch(replaceCvContent(undefined)),
  setSelectedAccountId: (id) => dispatch(setSelectedId(entityName, id)),
  fetchCv: (accountId) => dispatch(fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);