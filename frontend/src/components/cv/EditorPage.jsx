import React from "react";
import { connect } from "react-redux";
import { Nav, Stack, Text } from "@fluentui/react";
import Title from "../Title";
import Account from "../Account";
import ErrorPage from "../ErrorPage";
import Profile from "./Profile";
import Education from "./Education";

const navGroups = [
  {
    name: 'Eigen CV',
    isExpanded: true,
    links: [
      {
        name: 'Account',
        key: '#',
        url: '#'
      },
      {
        name: 'Profiel',
        key: '#/profile',
        url: '#/profile'
      },
      {
        name: 'Opleiding',
        key: '#/education',
        url: '#/education'
      }
    ]
  }
];

const EditorPage = (props) => {

  const accountId = props.account && props.account._id;
  const cv = accountId && props.cvEntity && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
  const cvId = cv && cv._id;

  const renderMap = {
    '#': <Account />,
    '#/profile': <Profile cvId={cvId} />,
    '#/education': <Education cvId={cvId} />
  };

  return (
    <Stack horizontal>
      <Nav
        styles={{ root: { width: 200 } }}
        groups={navGroups}
        selectedKey={props.locationHash} />
      <Stack>
        <Text variant="xxLarge">Welkom bij de <Title height="24em" /></Text>
        {renderMap[props.locationHash] || <ErrorPage />}
      </Stack>
    </Stack>
  )
};

const select = (state) => ({
  account: state.authentication.account,
  locationHash: state.ui.locationHash,
  cvEntity: state.safe.cv
});

export default connect(select)(EditorPage)