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

  const combineEntities = () => {
    const combined = {};
    if (props.accountEntity && props.authorizationEntity && props.businessUnitEntity) {
      Object.entries(props.accountEntity)
        .forEach(([accountId, account]) => {
          const authorization = Object.values(props.authorizationEntity)
            .find(authorizationInstance => authorizationInstance.accountId === accountId);

          const businessUnit = Object.values(props.businessUnitEntity)
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

  const replaceCombinedInstance = (accountId, combinedInstance) => {
    const authorization = props.authorizationEntity && Object.values(props.authorizationEntity)
      .find(authorizationInstance => authorizationInstance.accountId === accountId);
    props.replaceAuthorization(authorization._id, {
      ...authorization,
      level: combinedInstance.authorization.level
    });
  };

  const [sortingBy, setSortingBy] = React.useState({ key: "name", field: "name", isSortedDescending: false });

  const combinedEntity = React.useCallback(
    combineEntities(),
    [props.accountEntity, props.authorizationEntity, props.businessUnitEntity]);

  const combinedInstances = React.useCallback(
    combinedEntity && Object.values(combinedEntity) || [],
    [combinedEntity]);

  const combinedInstanceContext = React.useCallback({
    entity: combinedEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstance: props.setSelectedAccountId,
    replaceInstance: replaceCombinedInstance
  }, [combinedEntity, props.selectedAccountId]);

  const onRenderAuthorization = (item) =>
    getEnumData(Authorizations, item.authorization?.level)?.text || "";

  const onSort = (_event, column) =>
    setSortingBy({
      key: column.key,
      field: column.fieldName,
      isSortedDescending: column.isSorted && !column.isSortedDescending
    });

  const createColumn = (field) => ({
    key: field,
    fieldName: field,
    isSorted: sortingBy.key === field,
    isSortedDescending: sortingBy.key === field && sortingBy.isSortedDescending,
    onColumnClick: onSort,
    data: "string"
  });

  const columns = React.useCallback([
    {
      ...createColumn("name"),
      name: "Naam",
      isResizable: true,
      minWidth: 130,
      maxWidth: 250
    },
    {
      ...createColumn("businessUnit.name"),
      name: "Tribe",
      isResizable: true,
      minWidth: 120
    },
    {
      ...createColumn("authorization"),
      fieldName: "onRender",
      name: "Autorisatie",
      onRender: onRenderAuthorization,
      isResizable: false,
      minWidth: 90,
      maxWidth: 90
    }
  ],
  [sortingBy]);

  const [items, setItems] = React.useState(combinedInstances);

  const [filterText, setFilterText] = React.useState("");
  React.useEffect(() => {
    if (filterText) {
      const lowerCaseFilterText = filterText.toLowerCase();
      setItems(combinedInstances.filter(instance => `${instance.name}\n${instance.businessUnit}`.toLowerCase().indexOf(lowerCaseFilterText) >= 0));
    } else {
      setItems(combinedInstances);
    }
  },
  [combinedInstances, filterText]);

  const onFilter = (_, filterText) =>
    setFilterText(filterText);

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

  const compareItemsByField = (l, r, field) => {
    const fieldPath = field.split(".", 2);
    if (fieldPath.length > 1) {
      return compareItemsByField(l[fieldPath[0]], r[fieldPath[0]], fieldPath[1]);
    }
    return compareStrings(l && l[field] || "", r && r[field] || "");
  };

  const sortedItems = React.useCallback(
    items.slice(0).sort((l, r) => sortingBy.isSortedDescending
      ? compareItemsByField(r, l, sortingBy.field)
      : compareItemsByField(l, r, sortingBy.field)),
    [items, sortingBy]);

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
                  <Text variant="xSmall">{items.length} / {combinedInstances.length}</Text>
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={sortedItems}
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
  accountEntity: state.safe.content.account,
  authorizationEntity: state.safe.content.authorization,
  businessUnitEntity: state.safe.content.businessUnit,
  selectedAccountId: state.ui.selectedId.account
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedAccountId: (id) => dispatch(setSelectedId("account", id)),
  replaceAccount: (id, instance) => dispatch(safeActions.changeInstance("account", id, instance)),
  replaceAuthorization: (id, instance) => dispatch(safeActions.changeInstance("authorization", id, instance)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Accounts);