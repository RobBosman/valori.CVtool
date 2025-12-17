import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { PrimaryButton, Nav, Separator, Stack, TooltipHost, IconButton, CompoundButton, Text } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import CvTitle from "./widgets/CvTitle";
import Info from "./Info";
import Education from "./cv/Education";
import Experience from "./cv/Experience";
import Profile from "./cv/Profile";
import Publication from "./cv/Publication";
import Reference from "./cv/Reference";
import Skill from "./cv/Skill";
import CvTopBar from "./widgets/CvTopBar";
import CvLogo from "./widgets/CvLogo";
import Training from "./cv/Training";
import HistoryView from "./cv/HistoryView";
import Accounts from "./admin/Accounts";
import Brands from "./admin/Brands";
import BusinessUnits from "./admin/BusinessUnits";
import Search from "./admin/Search";
import LocaleFlag from "./widgets/LocaleFlag";
import * as enums from "./cv/Enums";
import * as cvActions from "../services/cv/cv-actions";
import * as uiActions from "../services/ui/ui-actions";
import * as utils from "../utils/CommonUtils";

const ContentPage = (props) => {

  const locationHash = props.locationHash.split("=").shift();

  const hasCharacteristics = utils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const onFetchCvHistory = () => {
    props.fetchCvHistory(props.selectedAccountId);
    props.setHistoryViewVisible(true);
  };

  const onItemClick = (_, selectedDocxTemplate) =>
    props.overrideDocxTeplate(selectedDocxTemplate);

  const onGenerateCv = () =>
    props.generateCv(props.selectedAccountId || props.authInfo.accountId, props.locale);

  const onRenderGroupHeader = (group) =>
    <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
      <h3>{group.name}</h3>
      <IconButton
        iconProps={{ iconName: "FullHistory" }}
        title="Wijzigingshistorie"
        checked={false}
        disabled={!hasCharacteristics}
        onClick={onFetchCvHistory}
      />
    </Stack>;

  const docxTemplateMenuProps = {
    items: enums.getOptions(enums.DocxTemplates, props.locale),
    onItemClick: onItemClick
  };

  const navGroups = React.useMemo(() =>
    [
      {
        links: [
          {
            key: "#",
            url: "#",
            name: "Info",
            icon: "BullseyeTarget",
            content: <Info />
          },
          ["ADMIN", "UNIT_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#accounts",
            url: "#accounts",
            name: "Accounts",
            icon: "AccountManagement",
            content: <Accounts />
          },
          ["ADMIN", "UNIT_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#brands",
            url: "#brands",
            name: "Labels",
            icon: "BullseyeTarget",
            content: <Brands />
          },
          ["ADMIN", "UNIT_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#businessUnits",
            url: "#businessUnits",
            name: "Units",
            icon: "WorkforceManagement",
            content: <BusinessUnits />
          },
          ["ADMIN", "UNIT_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#search",
            url: "#search",
            name: "Zoeken",
            icon: "DocumentSearch",
            content: <Search />
          }
        ].filter(Boolean)
      },
      {
        name: "CV",
        url: "#cv",
        icon: "FullHistory",
        links: [
          {
            key: "#profile",
            url: "#profile",
            name: "Profiel",
            icon: "ContactInfo",
            disabled: !hasCharacteristics,
            content: <Profile />
          },
          {
            key: "#education",
            url: "#education",
            name: "Opleidingen",
            icon: "Education",
            disabled: !hasCharacteristics,
            content: <Education />
          },
          {
            key: "#training",
            url: "#training",
            name: "Trainingen",
            icon: "UserEvent",
            disabled: !hasCharacteristics,
            content: <Training />
          },
          {
            key: "#skills",
            url: "#skills",
            name: "Vaardigheden",
            icon: "Backlog",
            disabled: !hasCharacteristics,
            content: <Skill />
          },
          {
            key: "#publications",
            url: "#publications",
            name: "Publicaties",
            icon: "ReadingMode",
            disabled: !hasCharacteristics,
            content: <Publication />
          },
          {
            key: "#references",
            url: "#references",
            name: "Referenties",
            icon: "ReminderGroup",
            disabled: !hasCharacteristics,
            content: <Reference />
          },
          {
            key: "#experience",
            url: "#experience",
            name: "Werkervaring",
            icon: "TaskLogo",
            disabled: !hasCharacteristics,
            content: <Experience />
          }
        ]
      }
    ],
  [props.authInfo.authorizationLevel, props.characteristicsEntity, props.selectedAccountId]);

  let renderContent = null;
  if (locationHash === "" || locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = navGroups
      .flatMap(navGroup => navGroup.links)
      .find(item => item.url === locationHash);
    renderContent = item?.content || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  const selectedAccountName = props.accountEntity?.[props.selectedAccountId]?.name;

  return (
    <Stack horizontal>
      <Stack>
        <CvLogo/>
        <Nav
          styles={{ root: { width: 205, marginTop: 61 }, groupContent: { marginBottom: 0 } }}
          groups={navGroups}
          initialSelectedKey={locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <TooltipHost
          content={selectedAccountName
            ? `Download CV van ${selectedAccountName} als MS-Word document`
            : "Download CV als MS-Word document"}
          styles={{ root: { marginTop: 10 } }}>
          <PrimaryButton
            text="Download CV"
            iconProps={{ iconName: "DownloadDocument" }}
            primary
            split
            menuProps={docxTemplateMenuProps}
            disabled={!props.selectedAccountId}
            onClick={onGenerateCv}>
            <LocaleFlag/>
          </PrimaryButton>
          <Text
            variant="small"
            style={{ display: "flex", flexDirection: "row-reverse"}}>
            <em>{props.docxTeplateOverride?.text || "VALORI"}</em>
          </Text>
        </TooltipHost>
      </Stack>
      <Separator vertical />
      <Stack.Item grow>
        <CvTopBar/>
        <div style={{ height: 105 }}>
          <CvTitle />
        </div>
        {renderContent}
        <HistoryView/>
      </Stack.Item>
    </Stack>
  );
};

ContentPage.propTypes = {
  locale: PropTypes.string.isRequired,
  navKey: PropTypes.string,
  authInfo: PropTypes.object,
  locationHash: PropTypes.string,
  accountEntity: PropTypes.object,
  characteristicsEntity: PropTypes.object,
  docxTeplateOverride: PropTypes.object,
  selectedAccountId: PropTypes.string,
  fetchCvHistory: PropTypes.func.isRequired,
  overrideDocxTeplate: PropTypes.func.isRequired,
  generateCv: PropTypes.func.isRequired,
  setHistoryViewVisible: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  locationHash: store.ui.locationHash,
  accountEntity: store.safe.content.account,
  characteristicsEntity: store.safe.content.characteristics,
  selectedAccountId: store.ui.selectedId.account,
  docxTeplateOverride: store.cv.docxTeplateOverride
});

const mapDispatchToProps = (dispatch) => ({
  fetchCvHistory: (accountId) => dispatch(cvActions.fetchCvHistory(accountId)),
  overrideDocxTeplate: (docxTeplateOverride) => dispatch(cvActions.overrideDocxTeplate(docxTeplateOverride)),
  generateCv: (accountId, locale) => dispatch(cvActions.generateCv(accountId, locale)),
  setHistoryViewVisible: (isVisible) => dispatch(uiActions.setHistoryViewVisible(isVisible))
});

export default connect(select, mapDispatchToProps)(ContentPage);