import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
import ErrorPage from "./ErrorPage";
import Profile from "./cv/Profile";
import Education from "./cv/Education";
import { selectCvId } from "../redux/ui";

const cvLinks = [
  {
    key: '#',
    url: '#',
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

const navGroups = [
  {
    name: 'Eigen CV',
    isExpanded: true,
    links: cvLinks
  }
];

const ContentPage = (props) => {

  React.useEffect(() => {
    const accountId = props.account && props.account._id;
    const cv = accountId && props.cvEntity && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId);
    props.selectCvId(cv && cv._id)
  });

  const item = cvLinks.find((item) => item.url === props.locationHash);
  const renderContent = item && item.content || <ErrorPage message={`Unknown location '${props.locationHash}'`} />;

  return (
    <Stack horizontal>
      <Nav
        styles={{ root: { width: 150 } }}
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
  account: state.authentication.account,
  cvEntity: state.safe.cv,
  locationHash: state.ui.locationHash
});

const mapDispatchToProps = (dispatch) => ({
  selectCvId: (cvId) => dispatch(selectCvId(cvId))
});

export default connect(select, mapDispatchToProps)(ContentPage)