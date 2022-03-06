import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, Modal, ContextualMenu, IconButton, SelectionMode, TooltipHost } from "@fluentui/react";
import { connect } from "react-redux";
import { useTheme } from "../../services/ui/ui-services";
import * as uiActions from "../../services/ui/ui-actions";
import { CvDetailsList } from "../widgets/CvDetailsList";

const entityName = "audit_log";

export const entityNames = {
  "account": "Account",
  "authorization": "Authorizatie",
  "businessUnit": "Unit",
  "characteristics": "Profiel",
  "cv": "Profiel",
  "education": "Opleiding",
  "experience": "Werkervaring",
  "publication": "Publicatie",
  "reference": "Referentie",
  "skill": "Vaardigheid",
  "training": "Training"
};

const HistoryView = (props) => {

  const formatTimestampMillis = (timestampMillis, locale) => {
    const date = new Date(timestampMillis);
    return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale)}`;
  };

  const getAccountName = (accountId) => {
    const account = props.accountEntity && props.accountEntity[accountId] || {};
    return account?.name || "onbekend";
  };

  const summarizeAuditLog = (auditLog) =>
    `${entityNames[auditLog.entity]} ${auditLog.oldInstance ? auditLog.newInstance ? "gewijzigd" : "verwijderd" : "toegevoegd"}`;

  const auditLogContext = React.useMemo(() => ({
    locale: props.locale,
    entity: props.auditLogEntity,
    instanceId: null,
    setSelectedInstanceId: () => {}
  }),
  [props.locale, props.auditLogEntity]);

  // Find all {auditLogs} of the selected {account}.
  const enrichedAuditLogs = React.useMemo(() =>
    props.selectedAccountId && Object.values(props.auditLogEntity || {})
      .filter(instance => instance.cvAccountId === props.selectedAccountId)
      .map(instance => ({
        ...instance,
        timestampMillis: -Date.parse(instance.timestamp), // The minus sign enforces initial decsending sort order.
        who: getAccountName(instance.editorAccountId)
      }))
    || [],
  [props.auditLogEntity, props.accountEntity, props.selectedAccountId]);

  const { viewPaneBackground } = useTheme();

  const onRenderTimestampMillis = React.useCallback(item =>
    formatTimestampMillis(-item.timestampMillis, props.locale?.substr(0, 2)),
  [props.locale]);

  const onRenderWhat = (item) =>
    <TooltipHost
      content={JSON.stringify(item.newInstance || item.oldInstance, null, 2)}
      style={{ whiteSpace: "pre-wrap" }}>
      <Text>{summarizeAuditLog(item)}</Text>
    </TooltipHost>;

  const columns = [
    {
      key: "timestampMillis",
      fieldName: "timestampMillis",
      name: "Wanneer",
      onRender: onRenderTimestampMillis,
      isResizable: false,
      minWidth: 110,
      maxWidth: 110,
      data: "number"
    },
    {
      key: "who",
      fieldName: "who",
      name: "Wie",
      isResizable: true,
      minWidth: 80,
      maxWidth: 180
    },
    {
      key: "entity",
      fieldName: "entity",
      name: "Wat",
      onRender: onRenderWhat,
      isResizable: true,
      minWidth: 150,
      maxWidth: 250
    }
  ];

  const historyViewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      width: 560,
      height: "calc(100vh - 300px)"
    }
  };

  return (
    <Modal
      isOpen={props.isHistoryViewVisible}
      onDismiss={() => props.setHistoryViewVisible(false)}
      isModeless={true}
      dragOptions={{
        moveMenuItemText: "Move",
        closeMenuItemText: "Close",
        menu: ContextualMenu
      }}
      styles={{ root: { overflow: "hidden", margin: "-8px" } }}>
      <Stack styles={historyViewStyles}>
        <Stack horizontal horizontalAlign="space-between">
          <Text variant="xxLarge">Wijzigingshistorie</Text>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={() => props.setHistoryViewVisible(false)}
          />
        </Stack>
        <Text style={{ position: "absolute", top: "120px", left: "132px" }}><em>Nog geen wijzigingsgegevens beschikbaar.</em></Text>
        <CvDetailsList
          columns={columns}
          items={enrichedAuditLogs}
          instanceContext={auditLogContext}
          selectionMode={SelectionMode.none}
          setKey={entityName}
        />
      </Stack>
    </Modal>
  );
};

HistoryView.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  accountEntity: PropTypes.object,
  auditLogEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  isHistoryViewVisible: PropTypes.bool.isRequired,
  setHistoryViewVisible: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  accountEntity: store.safe.content.account,
  auditLogEntity: store.safe.content[entityName],
  selectedAccountId: store.ui.selectedId.account,
  isHistoryViewVisible: store.ui.isHistoryViewVisible
});

const mapDispatchToProps = (dispatch) => ({
  setHistoryViewVisible: (isVisible) => dispatch(uiActions.setHistoryViewVisible(isVisible))
});

export default connect(select, mapDispatchToProps)(HistoryView);