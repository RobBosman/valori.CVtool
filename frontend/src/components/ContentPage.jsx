import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import Profile from "./cv/Profile";
import Education from "./cv/Education";
import { selectCvId } from "../redux/ui";
import CvTitle from "./widgets/CvTitle";
import CvLogo from "./widgets/CvLogo";
import SkillsList from "./cv/SkillsList";

const ADMIN_LINKS = [
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

const CV_LINKS = [
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
    key: '#skills',
    url: '#skills',
    name: 'Vaardigheden',
    icon: 'SortLines',
    content: <SkillsList />
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

const ContentPage = (props) => {
  const [isNavExpanded, setNavExpanded] = React.useState(true);

  React.useEffect(() => {
    const accountId = props.account && props.account._id;
    const cvInstance = accountId
      && props.cvEntity
      && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
    props.selectCvId(cvInstance && cvInstance._id)
  });

  const isAdmin = props.account
    && props.account.privileges
    && props.account.privileges.find((privilege) => privilege === 'ADMIN');
  const navGroups = [
    isAdmin && {
      name: 'Admin',
      links: ADMIN_LINKS
    },
    {
      name: 'Eigen CV',
      links: CV_LINKS
    }
  ].filter(Boolean);

  let renderContent = null;
  if (props.locationHash === '' || props.locationHash === '#') {
    renderContent = <ErrorPage message={'TODO - home'} />;
  } else {
    const allLinks = isAdmin ? ADMIN_LINKS.concat(CV_LINKS) : CV_LINKS;
    const item = allLinks.find((item) => item.url === props.locationHash);
    renderContent = item && item.content
      || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;
  }

  return (
    <Stack horizontal>
      <Stack>
        <div style={{ height: 50 }}>
          <CvLogo />
        </div>
        <Nav
          styles={{ root: { width: isNavExpanded ? 180 : 20 } }}
          groups={navGroups}
          selectedKey={props.navKey}
          onRenderGroupHeader={(group) => (<h3>{group.name}</h3>)} />
      </Stack>
      <Separator vertical />
      <Stack.Item grow>
        <div style={{ paddingLeft: 140, height: 100 }}>
          <CvTitle />
        </div>
        {renderContent}
      </Stack.Item>
    </Stack>
  )
};

export default connect(select, mapDispatchToProps)(ContentPage)