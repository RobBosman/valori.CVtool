import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { PrimaryButton, Nav, Separator, Stack, TooltipHost } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import CvTitle from "./widgets/CvTitle";
import Info from "./Info";
import Accounts from "./admin/Accounts";
import Education from "./cv/Education";
import Experience from "./cv/Experience";
import Profile from "./cv/Profile";
import Publication from "./cv/Publication";
import Reference from "./cv/Reference";
import Skill from "./cv/Skill";
import * as cvActions from "../services/cv/cv-actions";
import CvTopBar from "./widgets/CvTopBar";
import CvLogo from "./widgets/CvLogo";
import Training from "./cv/Training";
import EducationAndTraining from "./cv/EducationAndTraining";

const ContentPage = (props) => {

  const isAdmin = props.authInfo.roles.includes("ADMIN");
  const isEELead = props.authInfo.roles.includes("EE_LEAD");
  const isSales = props.authInfo.roles.includes("SALES");

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
    (isAdmin || isSales || isEELead) && {
      name: isAdmin ? "Admin" : isEELead ? "E&E Lead" : "Sales",
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
          key: "#educationAndTraining",
          url: "#educationAndTraining",
          name: "Opleiding en training",
          icon: "D365TalentLearn",
          disabled: !props.selectedCvId,
          content: <EducationAndTraining />
        },
        {
          key: "#education",
          url: "#education",
          name: "Opleidingen",
          icon: "PublishCourse",
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
  if (props.locationHash === "" || props.locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = navGroups
      .flatMap((navGroup) => navGroup.links)
      .find((item) => item.url === props.locationHash);
    renderContent = item?.content
      || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  const onRenderGroupHeader = (group) =>
    (<h3>{group.name}</h3>);

  const onGenerateCv = () =>
    props.generateCv(props.selectedAccountId || props.authInfo.accountId);

  return (
    <Stack horizontal>
      <Stack>
        <CvLogo/>
        <Nav
          styles={{ root: { width: 180, marginTop: 59 } }}
          groups={navGroups}
          initialSelectedKey={props.locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <TooltipHost content="Download CV als MS-Word document">
          <PrimaryButton
            text="Download CV"
            iconProps={{ iconName: "DownloadDocument" }}
            disabled={!props.selectedAccountId}
            onClick={onGenerateCv}
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
  generateCv: PropTypes.func.isRequired
};

const select = (state) => ({
  authInfo: state.auth.authInfo,
  locationHash: state.ui.locationHash,
  selectedAccountId: state.ui.selectedId["account"],
  selectedCvId: state.ui.selectedId["cv"]
});

const mapDispatchToProps = (dispatch) => ({
  generateCv: (accountId) => dispatch(cvActions.generateCv(accountId))
});

export default connect(select, mapDispatchToProps)(ContentPage);