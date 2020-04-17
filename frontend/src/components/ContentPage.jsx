import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
import Account from "./Account";
import ErrorPage from "./ErrorPage";
import Profile from "./cv/Profile";
import Education from "./cv/Education";

const navGroups = [
  {
    name: 'Eigen CV',
    isExpanded: true,
    links: [
      {
        key: '#',
        url: '#',
        name: 'Account',
        icon: 'Emoji2'
      },
      {
        key: '#profile',
        url: '#profile',
        name: 'Profiel',
        icon: 'ContactInfo'
      },
      {
        key: '#education',
        url: '#education',
        name: 'Opleiding',
        icon: 'PublishCourse'
      }
    ]
  }
];

const ContentPage = (props) => {

  const accountId = props.account && props.account._id;
  const cv = accountId && props.cvEntity && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
  const cvId = cv && cv._id;

  const renderMap = {
    '#': <Account />,
    '#profile': <Profile cvId={cvId} />,
    '#education': <Education cvId={cvId} />
  };

  const renderContent = renderMap[props.locationHash] || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;

  return (
    <Stack horizontal>
      <Nav
        styles={{ root: { width: 200 } }}
        groups={navGroups}
        selectedKey={props.navKey} />
      <Separator vertical />
      <Stack.Item grow>
        {renderContent}
      </Stack.Item>
    </Stack>
  )
};

const select = (state) => ({
  locationHash: state.ui.locationHash,
  account: state.authentication.account,
  cvEntity: state.safe.cv
});

export default connect(select)(ContentPage)