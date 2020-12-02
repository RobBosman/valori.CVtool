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
import { compareStrings } from "../../utils/CommonUtils";
import { Authorizations, getEnumData } from "../cv/Enums";

const Accounts = (props) => {

  const [combinedEntity, setCombinedEntity] = React.useState({});
  
  React.useEffect(() => {
    if (props.accountEntity && props.authorizationEntity && props.businessUnitEntity) {
      const combinedEntity = {};
      Object.entries(props.accountEntity)
        .forEach(([accountId, account]) => {
          const authorization = Object.values(props.authorizationEntity)
            .find(authorizationInstance => authorizationInstance.accountId === accountId);

          const businessUnit = Object.values(props.businessUnitEntity)
            .find(businessUnit => businessUnit.accountIds?.includes(accountId));

          combinedEntity[accountId] = {
            ...account,
            authorization: authorization,
            businessUnit: businessUnit
          };
        });
      setCombinedEntity(combinedEntity);
    }
  }, [props.accountEntity, props.authorizationEntity, props.businessUnitEntity]);

  const replaceCombinedInstance = (accountId, combinedInstance) => {
    const authorization = props.authorizationEntity && Object.values(props.authorizationEntity)
      .find(authorizationInstance => authorizationInstance.accountId === accountId);
    props.replaceAuthorization(authorization._id, {
      ...authorization,
      level: combinedInstance.authorization.level
    });
  };

  // Sort {CombinedInstance} records.
  const combinedInstances = combinedEntity && Object.values(combinedEntity)
    .sort((l, r) => compareStrings(l.name, r.name))
    || [];

  const combinedInstanceContext = {
    entity: combinedEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: replaceCombinedInstance
  };

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 130,
      maxWidth: 250,
      isSorted: false,
      isSortedDescending: false,
      data: "string"
    },
    {
      key: "businessUnit.name",
      fieldName: "businessUnit.name",
      name: "Tribe",
      isResizable: true,
      minWidth: 130,
      data: "string"
    },
    {
      key: "authorization.level",
      fieldName: "onRender",
      name: "Autorisatie",
      onRender: (item) => {
        const authorizationLevel = props.authorizationEntity && Object.values(props.authorizationEntity)
          .find(authorization => authorization.accountId === item._id)
          ?.level;
        return getEnumData(Authorizations, authorizationLevel)?.text || "";
      },
      isResizable: false,
      minWidth: 80,
      maxWidth: 80,
      data: "string"
    }
  ];

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

  const [listItems, setListItems] = React.useState(combinedInstances);
  const [filterText, setFilterText] = React.useState("");
  // Refresh the list if necessary.
  if (filterText === "" && listItems.length !== combinedInstances.length) {
    setListItems(combinedInstances);
  }

  const onFilter = (_, filterText) => {
    if (filterText) {
      setFilterText(filterText);
      const lowerCaseFilterText = filterText.toLowerCase();
      setListItems(combinedInstances.filter(instance => `${instance.name}\n${instance.businessUnit}`.toLowerCase().indexOf(lowerCaseFilterText) >= 0));
    } else {
      setListItems(combinedInstances);
    }
  };

  const onEditCv = () => {
    if (["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel) && props.selectedAccountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  const authorizationButton = props.authInfo.authorizationLevel === "ADMIN"
    ? <CvDropdown
      label="Autorisatie"
      field="authorization.level"
      instanceContext={combinedInstanceContext}
      disabled={props.authInfo.authorizationLevel !== "ADMIN" || props.authInfo.accountId === props.selectedAccountId}
      options={Authorizations}
      styles={{ dropdown: { width: 120 } }}
    />
    : null;

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
                  <Text variant="xSmall">{listItems.length} / {combinedInstances.length}</Text>
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={listItems}
                instanceContext={combinedInstanceContext}
                setKey="combinedInstances"
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
              {authorizationButton}
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

const select = (state) => ({
  locale: state.ui.userPrefs.locale,
  authInfo: state.auth.authInfo,
  accountEntity: state.safe.content["account"],
  authorizationEntity: state.safe.content["authorization"],
  businessUnitEntity: state.safe.content["businessUnit"],
  selectedAccountId: state.ui.selectedId["account"]
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedAccountId: (id) => dispatch(setSelectedId("account", id)),
  replaceAccount: (id, instance) => dispatch(safeActions.changeInstance("account", id, instance)),
  replaceAuthorization: (id, instance) => dispatch(safeActions.changeInstance("authorization", id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);