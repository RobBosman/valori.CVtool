import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import Profile from "./cv/Profile";
import Education from "./cv/Education";
import { selectCvId } from "../redux/ui";

const adminLinks = [
  {
    key: '#tribes',
    url: '#tribes',
    name: 'Tribes',
    icon: 'HomeGroup',
    content: <ErrorPage message="TODO" />
  },
  {
    key: '#accounts',
    url: '#accounts',
    name: 'Accounts',
    icon: 'People',
    content: <ErrorPage message="TODO" />
  },
  {
    key: '#search',
    url: '#search',
    name: 'Zoeken',
    icon: 'Search',
    content: <ErrorPage message="TODO" />
  }
];

const cvLinks = [
  {
    key: '#profile',
    url: '#profile',
    name: 'Profiel',
    icon: 'ContactInfo',
    content: <Profile />
  },
  {
    key: '#education',
    url: '#education',
    name: 'Opleiding',
    icon: 'PublishCourse',
    content: <Education />
  },
  {
    key: '#skill',
    url: '#skill',
    name: 'Vaardigheden',
    icon: 'SortLines',
    content: <ErrorPage message="TODO" />
  },
  {
    key: '#publications',
    url: '#publications',
    name: 'Publicaties',
    icon: 'ReadingMode',
    content: <ErrorPage message="TODO" />
  },
  {
    key: '#references',
    url: '#references',
    name: 'Referenties',
    icon: 'ReminderGroup',
    content: <ErrorPage message="TODO" />
  },
  {
    key: '#experience',
    url: '#experience',
    name: 'Ervaring',
    icon: 'CheckboxComposite',
    content: <ErrorPage message="TODO" />
  }
];

const select = (state) => ({
  account: state.authentication.account,
  cvEntity: state.safe.cv,
  locationHash: state.ui.locationHash
});

const mapDispatchToProps = (dispatch) => ({
  selectCvId: (cvId) => dispatch(selectCvId(cvId))
});

const render = (props) => {
  const [isNavExpanded, setNavExpanded] = React.useState(true);

  React.useEffect(() => {
    const accountId = props.account && props.account._id;
    const cv = accountId
      && props.cvEntity
      && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
    props.selectCvId(cv && cv._id)
  });

  const isAdmin = props.account
    && props.account.privileges
    && props.account.privileges.find((privilege) => privilege === 'ADMIN');
  const navGroups = [
    isAdmin && {
      name: 'Admin',
      links: adminLinks
    },
    {
      name: 'Eigen CV',
      links: cvLinks
    }
  ].filter(Boolean);

  let renderContent = null;
  if (props.locationHash === '' || props.locationHash === '#') {
    renderContent = <ErrorPage message={'TODO - home'} />;
  } else {
    const allLinks = isAdmin ? adminLinks.concat(cvLinks) : cvLinks;
    const item = allLinks.find((item) => item.url === props.locationHash);
    renderContent = item && item.content || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  return (
    <Stack horizontal>
      <Nav
        styles={{ root: { width: isNavExpanded ? 150 : 20 } }}
        groups={navGroups}
        selectedKey={props.navKey}
        onRenderGroupHeader={(group) => (<h3>{group.name}</h3>)} />
      <Separator vertical />
      <Stack.Item grow>
        {renderContent}
      </Stack.Item>
    </Stack>
  )
};

export default connect(select, mapDispatchToProps)(render)