import React from "react";
import { connect } from "react-redux";
import { Pivot, PivotItem, PivotLinkSize, Stack, Text } from "office-ui-fabric-react";
import Title from "./Title";
import Account from "./Account";
import Profile from "./cv/Profile";
import Education from "./cv/Education";

const EditorPage = (props) => {

  const accountId = props.account && props.account._id;
  const cv = accountId && props.cvEntity && Object.values(props.cvEntity).find((instance) => instance.accountId === accountId)
  const cvId = cv && cv._id;
  const educations = cvId && props.educationEntity && Object.values(props.educationEntity).filter((instance) => instance.cvId === cvId)
  const education = educations && educations[0];
  const educationId = education && education._id;

  return (
    <Stack>
      <Text variant="xxLarge">Welkom bij de <Title height="24em" /></Text>
      <Pivot linkSize={PivotLinkSize.large}>
        <PivotItem itemIcon="Emoji" headerText="Account" itemCount={42}>
          <Account />
        </PivotItem>
        <PivotItem itemIcon="Emoji2" headerText="Profiel">
          <Profile cvId={cvId} />
        </PivotItem>
        <PivotItem headerText="Opleiding">
          <Education educationId={educationId} />
        </PivotItem>
      </Pivot>
    </Stack>
  )
};

const select = (state) => ({
  account: state.authentication.account,
  cvEntity: state.safe.cv,
  educationEntity: state.safe.education
});

export default connect(select)(EditorPage)