import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { PrimaryButton, Nav, Separator, Stack, TooltipHost, ActionButton } from "@fluentui/react";
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
import { Authorizations, getEnumData } from "./cv/Enums";

const ContentPage = (props) => {

  const navGroups = [
    {
      links: [
        {
          key: "#",
          url: "#",
          name: "Info",
          icon: "BullseyeTarget",
          content: <Info />
        },
      ]
    },
    ["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
    && {
      name: getEnumData(Authorizations, props.authInfo.authorizationLevel).text,
      links: [
        {
          key: "#accounts",
          url: "#accounts",
          name: "Accounts",
          icon: "AccountManagement",
          content: <Accounts />
        }
      ]
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
          icon: "D365TalentLearn",
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
  ].filter(Boolean);

  let renderContent = null;
  const locationHash = props.locationHash.split("=")[0];
  if (locationHash === "" || locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = navGroups
      .flatMap((navGroup) => navGroup.links)
      .find((item) => item.url === locationHash);
    renderContent = item?.content
      || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  const onFetchCv = () =>
    props.fetchCvByAccountId(props.selectedAccountId);

  // Show the fetchCvButton only if
  // * the user has the right authorization level AND
  // * if the user selected an other person's account AND
  // * if the cv-data of that other person is not available yet.
  const fetchCvButton = ["ADMIN", "EE_LEAD", "SALES"].includes(props.authInfo.authorizationLevel)
  && props.selectedAccountId && props.selectedAccountId !== props.authInfo.accountId && !props.selectedCvId
    ? <TooltipHost content="Haal de gegevens op om het CV te bewerken">
      <ActionButton
        text="gegevens ophalen"
        iconProps={{ iconName: "CloudDownload" }}
        onClick={onFetchCv}
        styles={{ root: { fontStyle: "italic" } }}
      />
    </TooltipHost>
    : null;

  const onRenderGroupHeader = (group) =>
    <Stack horizontal
      verticalAlign="center">
      <h3>{group.name}</h3>
      {group.name === "CV" ? fetchCvButton : null}
    </Stack>;

  const onGenerateCv = () =>
    props.generateCv(props.selectedAccountId || props.authInfo.accountId);

  return (
    <Stack horizontal>
      <Stack>
        <CvLogo/>
        <Nav
          styles={{ root: { width: 180, marginTop: 59 } }}
          groups={navGroups}
          initialSelectedKey={locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <TooltipHost content="Download CV als MS-Word document">
          <PrimaryButton
            text="Download CV"
            iconProps={{ iconName: "DownloadDocument" }}
            disabled={!props.selectedAccountId}
            onClick={onGenerateCv}
            styles={{ root: { width: 180 } }}
          />
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
  navKey: PropTypes.string,
  authInfo: PropTypes.object,
  locationHash: PropTypes.string,
  selectedAccountId: PropTypes.string,
  selectedCvId: PropTypes.string,
  generateCv: PropTypes.func.isRequired,
  fetchCvByAccountId: PropTypes.func.isRequired
};

const select = (state) => ({
  authInfo: state.auth.authInfo,
  locationHash: state.ui.locationHash,
  selectedAccountId: state.ui.selectedId["account"],
  selectedCvId: state.ui.selectedId["cv"]
});

const mapDispatchToProps = (dispatch) => ({
  generateCv: (accountId) => dispatch(cvActions.generateCv(accountId)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(ContentPage);