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
        key: '#profile',
        url: '#profile'
      },
      {
        name: 'Opleiding',
        key: '#education',
        url: '#education'
      }
    ]
  }
];

const EditorPage = (props) => {

  const [locationHash, setLocationHash] = React.useState(document.location.hash || '#');

  React.useEffect(() => {
    const listener = (event) => {
      if (event.newURL.endsWith('#/')) {
        document.location.hash = '#'
      }
      setLocationHash(document.location.hash || '#')
    };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

  const accountId = props.account && props.account._id;
  const cv = accountId && props.cvEntity && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
  const cvId = cv && cv._id;

  const renderContent = {
    '#': <Account />,
    '#profile': <Profile cvId={cvId} />,
    '#education': <Education cvId={cvId} />
  }[locationHash]
    || <ErrorPage message={`Unknown location hash '${locationHash}'`} />;

  return (
    <Stack horizontal>
      <Nav
        styles={{ root: { width: 200 } }}
        groups={navGroups}
        selectedKey={locationHash} />
      <Stack>
        <Text variant="xxLarge">Welkom bij de <Title height="24em" /></Text>
        {renderContent}
      </Stack>
    </Stack>
  )
};

const select = (state) => ({
  account: state.authentication.account,
  cvEntity: state.safe.cv
});

export default connect(select)(EditorPage)