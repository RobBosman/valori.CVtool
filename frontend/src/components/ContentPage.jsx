import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { PrimaryButton, Nav, Separator, Stack, TooltipHost } from "@fluentui/react";
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
import Accounts from "./admin/Accounts";
import * as cvActions from "../services/cv/cv-actions";
import BusinessUnits from "./admin/BusinessUnits";
import Search from "./admin/Search";
import LocaleFlag from "./widgets/LocaleFlag";

const ContentPage = (props) => {

  const locationHash = props.locationHash.split("=").shift();

  const onRenderGroupHeader = (group) =>
    <Stack horizontal
      verticalAlign="center">
      <h3>{group.name}</h3>
    </Stack>;

  const onGenerateCv = () =>
    props.generateCv(props.selectedAccountId || props.authInfo.accountId, props.locale);

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
          ["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#accounts",
            url: "#accounts",
            name: "Accounts",
            icon: "AccountManagement",
            content: <Accounts />
          },
          ["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
          && {
            key: "#businessUnits",
            url: "#businessUnits",
            name: "Tribes",
            icon: "WorkforceManagement",
            content: <BusinessUnits />
          },
          ["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
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
        links: [
          {
            key: "#profile",
            url: "#profile",
            name: "Profiel",
            icon: "ContactInfo",
            disabled: !props.selectedCvId,
            content: <Profile />
          },
          {
            key: "#education",
            url: "#education",
            name: "Opleidingen",
            icon: "Education",
            disabled: !props.selectedCvId,
            content: <Education />
          },
          {
            key: "#training",
            url: "#training",
            name: "Trainingen",
            icon: "UserEvent",
            disabled: !props.selectedCvId,
            content: <Training />
          },
          {
            key: "#skills",
            url: "#skills",
            name: "Vaardigheden",
            icon: "Backlog",
            disabled: !props.selectedCvId,
            content: <Skill />
          },
          {
            key: "#publications",
            url: "#publications",
            name: "Publicaties",
            icon: "ReadingMode",
            disabled: !props.selectedCvId,
            content: <Publication />
          },
          {
            key: "#references",
            url: "#references",
            name: "Referenties",
            icon: "ReminderGroup",
            disabled: !props.selectedCvId,
            content: <Reference />
          },
          {
            key: "#experience",
            url: "#experience",
            name: "Werkervaring",
            icon: "TaskLogo",
            disabled: !props.selectedCvId,
            content: <Experience />
          }
        ]
      }
    ],
  [props.authInfo.authorizationLevel, props.selectedCvId]);

  let renderContent = null;
  if (locationHash === "" || locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = navGroups
      // .flatMap(navGroup => navGroup.links) // flatmap() is not supported by Edge
      .map(navGroup => navGroup.links)
      .reduce((acc, val) => acc.concat(val), [])
      .find(item => item.url === locationHash);
    renderContent = item?.content || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  const selectedAccountName = props.accountEntity && props.accountEntity[props.selectedAccountId]?.name;

  return (
    <Stack horizontal>
      <Stack>
        <CvLogo/>
        <Nav
          styles={{ root: { width: 180, marginTop: 61 }, groupContent: { marginBottom: 0 } }}
          groups={navGroups}
          initialSelectedKey={locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <TooltipHost
          content={`Download CV${selectedAccountName ? ` van ${selectedAccountName}` : ""} als MS-Word document`}>
          <PrimaryButton
            text="Download CV"
            iconProps={{ iconName: "DownloadDocument" }}
            disabled={!props.selectedAccountId}
            onClick={onGenerateCv}
            styles={{ root: { width: 180, marginTop: 10 } }}>
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
  selectedAccountId: PropTypes.string,
  selectedCvId: PropTypes.string,
  generateCv: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  locationHash: store.ui.locationHash,
  accountEntity: store.safe.content.account,
  selectedAccountId: store.ui.selectedId.account,
  selectedCvId: store.ui.selectedId.cv
});

const mapDispatchToProps = (dispatch) => ({
  generateCv: (accountId, locale) => dispatch(cvActions.generateCv(accountId, locale))
});

export default connect(select, mapDispatchToProps)(ContentPage);