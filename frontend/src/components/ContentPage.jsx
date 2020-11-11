import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { DefaultButton, Nav, Separator, Stack } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import CvTitle from "./widgets/CvTitle";
import CvLogo from "./widgets/CvLogo";
import Education from "./cv/Education";
import Experience from "./cv/Experience";
import Info from "./cv/Info";
import Profile from "./cv/Profile";
import Publication from "./cv/Publication";
import Reference from "./cv/Reference";
import Skill from "./cv/Skill";
import * as cvActions from "../services/cv/cv-actions";
import Accounts from "./admin/Accounts";

const ContentPage = (props) => {

  const isAdmin = props.accountInfo.privileges.includes("ADMIN");
  const navGroups = [
    isAdmin && {
      name: "Admin",
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
          key: "#",
          url: "#",
          name: "Info",
          icon: "BullseyeTarget",
          content: <Info />
        },
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
          name: "Opleiding",
          icon: "D365TalentLearn",
          disabled: !props.selectedCvId,
          content: <Education />
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
          name: "Ervaring",
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
    props.generateCv(props.selectedAccountId || props.accountInfo._id);

  return (
    <Stack horizontal>
      <Stack>
        <div style={{ height: 50 }}>
          <CvLogo />
        </div>
        <Nav
          styles={{ root: { width: 180 } }}
          groups={navGroups}
          initialSelectedKey={props.locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={onRenderGroupHeader}
        />
        <DefaultButton
          text="Download CV"
          iconProps={{ iconName: "DownloadDocument" }}
          tooltipText="Download CV als MS-Word document"
          disabled={!props.selectedCvId}
          onClick={onGenerateCv}
        />
      </Stack>
      <Separator vertical />
      <Stack.Item grow>
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
  accountInfo: PropTypes.object,
  locationHash: PropTypes.string,
  selectedAccountId: PropTypes.string,
  selectedCvId: PropTypes.string,
  generateCv: PropTypes.func.isRequired
};

const select = (state) => ({
  accountInfo: state.authentication.accountInfo,
  locationHash: state.ui.locationHash,
  selectedAccountId: state.ui.selectedId["account"],
  selectedCvId: state.ui.selectedId["cv"]
});

const mapDispatchToProps = (dispatch) => ({
  generateCv: (accountId) => dispatch(cvActions.generateCv(accountId))
});

export default connect(select, mapDispatchToProps)(ContentPage);