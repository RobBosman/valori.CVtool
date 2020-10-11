import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
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

const NAV_GROUPS = [
  {
    name: "Eigen CV",
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
        content: <Profile />
      },
      {
        key: "#education",
        url: "#education",
        name: "Opleiding",
        icon: "D365TalentLearn",
        content: <Education />
      },
      {
        key: "#skills",
        url: "#skills",
        name: "Vaardigheden",
        icon: "Backlog",
        content: <Skill />
      },
      {
        key: "#publications",
        url: "#publications",
        name: "Publicaties",
        icon: "ReadingMode",
        content: <Publication />
      },
      {
        key: "#references",
        url: "#references",
        name: "Referenties",
        icon: "ReminderGroup",
        content: <Reference />
      },
      {
        key: "#experience",
        url: "#experience",
        name: "Ervaring",
        icon: "TaskLogo",
        content: <Experience />
      }
    ]
  }
];

const ContentPage = (props) => {

  let renderContent = null;
  if (props.locationHash === "" || props.locationHash === "#") {
    renderContent = <Info />;
  } else {
    const item = NAV_GROUPS
      .flatMap((navGroup) => navGroup.links)
      .find((item) => item.url === props.locationHash);
    renderContent = item?.content
      || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  return (
    <Stack horizontal>
      <Stack>
        <div style={{ height: 50 }}>
          <CvLogo />
        </div>
        <Nav
          styles={{ root: { width: 180 } }}
          groups={NAV_GROUPS}
          initialSelectedKey={props.locationHash || "#"}
          selectedKey={props.navKey}
          onRenderGroupHeader={(group) => (<h3>{group.name}</h3>)} />
      </Stack>
      <Separator vertical />
      <Stack.Item grow>
        <div style={{ paddingLeft: 140, height: 105 }}>
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
  locationHash: PropTypes.string
};

const select = (state) => ({
  accountInfo: state.authentication.accountInfo,
  locationHash: state.ui.locationHash
});

export default connect(select)(ContentPage);