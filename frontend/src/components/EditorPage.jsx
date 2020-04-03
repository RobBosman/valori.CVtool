import React from "react"
import {Pivot, PivotItem, PivotLinkSize, Stack, Text} from "office-ui-fabric-react"
import Title from "./Title"
import Account from "./Account"
import Profile from "./cv/Profile"
import Education from "./cv/Education"

const EditorPage = () => (
    <Stack>
        <Text variant="xxLarge">Welkom bij de <Title height="24em"/></Text>
        <Pivot linkSize={PivotLinkSize.large}>
            <PivotItem itemIcon="Emoji" headerText="Account" itemCount={42}>
                <Account/>
            </PivotItem>
            <PivotItem itemIcon="Emoji2" headerText="Profiel">
                <Profile/>
            </PivotItem>
            <PivotItem headerText="Opleiding">
                <Education/>
            </PivotItem>
        </Pivot>
    </Stack>
);

export default EditorPage