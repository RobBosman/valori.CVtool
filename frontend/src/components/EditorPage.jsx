import React from "react";
import {connect} from "react-redux";
import {Pivot, PivotItem, PivotLinkSize, Stack, Text} from "office-ui-fabric-react";
import Title from "./Title";
import Account from "./Account";
import Profile from "./cv/Profile";
import Education from "./cv/Education";

const EditorPage = (props) => {

    const cvId = props.account && props.account.cvIds && props.account.cvIds[0];
    const cv = props.cvEntity && props.cvEntity[cvId];
    const educationId = cv && cv.educationIds && cv.educationIds[0];

    return (
        <Stack>
            <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
            <Pivot linkSize={PivotLinkSize.large}>
                <PivotItem itemIcon="Emoji" headerText="Account" itemCount={42}>
                    <Account/>
                </PivotItem>
                <PivotItem itemIcon="Emoji2" headerText="Profiel">
                    <Profile entityId={cvId}/>
                </PivotItem>
                <PivotItem headerText="Opleiding">
                    <Education entityId={educationId}/>
                </PivotItem>
            </Pivot>
        </Stack>
    )
};

const select = (state) => ({
    account: state.authentication.account,
    cvEntity: state.safe.cv
});

export default connect(select)(EditorPage)