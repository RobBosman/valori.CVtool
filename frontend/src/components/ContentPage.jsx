import React from "react";
import { connect } from "react-redux";
import { Nav, Separator, Stack } from "@fluentui/react";
import Account from "./Account";
import ErrorPage from "./ErrorPage";
import Profile from "./cv/Profile";
import Education from "./cv/Education";
import { selectCvId } from "../redux/ui";

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
  props.selectCvId(cv && cv._id);

  const renderMap = {
    '#': <Account />,
    '#profile': <Profile />,
    '#education': <Education />
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

const mapDispatchToProps = (dispatch) => ({
  selectCvId: (cvId) => dispatch(selectCvId(cvId))
});

export default connect(select, mapDispatchToProps)(ContentPage)