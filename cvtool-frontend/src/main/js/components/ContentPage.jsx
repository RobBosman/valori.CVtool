import PropTypes from "prop-types";
import React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {IconButton, Nav, PrimaryButton, Separator, Stack, TooltipHost} from "@fluentui/react";
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
import * as cvActions from "../services/cv/cv-actions";
import * as uiActions from "../services/ui/ui-actions";
import * as utils from "../utils/CommonUtils";

const ContentPage = prps => {

  const selectors = useSelector(
    state => ({
      locale: state.ui.userPrefs.locale,
      authInfo: state.auth.authInfo,
      locationHash: state.ui.locationHash,
      accountEntity: state.safe.content.account,
      characteristicsEntity: state.safe.content.characteristics,
      selectedAccountId: state.ui.selectedId.account
    }),
    {equalityFn: shallowEqual}
  );
  const dispatch = useDispatch();
  const dispatches = React.useMemo(() => ({
      fetchCvHistory: (accountId) => dispatch(cvActions.fetchCvHistory(accountId)),
      generateCv: (accountId, locale) => dispatch(cvActions.generateCv(accountId, locale)),
      setHistoryViewVisible: (isVisible) => dispatch(uiActions.setHistoryViewVisible(isVisible))
    }),
    [dispatch]);
  const props = {...prps, ...selectors, ...dispatches};

  const locationHash = props.locationHash.split("=").shift();

  const hasCharacteristics = utils.hasInstances(props.characteristicsEntity, props.selectedAccountId);

  const selectedAccountName = props.accountEntity?.[props.selectedAccountId]?.name;

  const onFetchCvHistory = () => {
    props.fetchCvHistory(props.selectedAccountId);
    props.setHistoryViewVisible(true);
  };

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
            name: "Kerncompetenties / skills",
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

  let renderContent;
  if (locationHash === "" || locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = navGroups
      .flatMap(navGroup => navGroup.links)
      .find(item => item.url === locationHash);
    renderContent = item?.content || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  const navStyles = {
    root: { width: 205, marginTop: 61, marginBottom: 8 },
    linkText: { overflow: "unset" },
    groupContent: { marginBottom: 0 }
  };

  return (
    <Stack horizontal>
      <Stack>
        <CvLogo/>
        <Nav
          styles={navStyles}
          groups={navGroups}
          initialSelectedKey={locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <TooltipHost
          content={selectedAccountName
            ? `Download CV van ${selectedAccountName} als MS-Word document`
            : "Download CV als MS-Word document"}>
          <PrimaryButton
            text="Download CV&nbsp;&nbsp;"
            iconProps={{ iconName: "DownloadDocument" }}
            primary
            disabled={!props.selectedAccountId}
            onClick={onGenerateCv}
            styles={{ root: { width: "100%", padding: "0 6px", justifyContent: "left" } }}>
            <LocaleFlag/>
          </PrimaryButton>
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
  locale: PropTypes.string,
  navKey: PropTypes.string,
  authInfo: PropTypes.object,
  locationHash: PropTypes.string,
  accountEntity: PropTypes.object,
  characteristicsEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  fetchCvHistory: PropTypes.func,
  generateCv: PropTypes.func,
  setHistoryViewVisible: PropTypes.func
};

export default ContentPage;