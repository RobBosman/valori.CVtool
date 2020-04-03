import React from "react";
import {connect} from "react-redux";
import {Pivot, PivotItem, PivotLinkSize, Stack, Text} from "office-ui-fabric-react";
import Title from "./Title";
import Account from "./Account";
import Profile from "./cv/Profile";
import Education from "./cv/Education";

const EditorPage = (props) => {

    const account = props.accountEntities && props.accountEntities[props.accountId];
    const cvId = account && account.cvIds && account.cvIds[0];
    const cv = props.cvEntities && props.cvEntities[cvId];
    const educationId = cv && cv.educationIds && cv.educationIds[0];

    return (
        <Stack>
            <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
            <Pivot linkSize={PivotLinkSize.large}>
                <PivotItem itemIcon="Emoji" headerText="Account" itemCount={42}>
                    <Account entityId={props.accountId}/>
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
    accountId: state.ui.accountId,
    accountEntities: state.safe.account,
    cvEntities: state.safe.cv
});

export default connect(select)(EditorPage)