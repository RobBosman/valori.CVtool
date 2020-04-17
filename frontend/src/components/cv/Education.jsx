import React from "react";
import { Stack, Text } from "@fluentui/react";
import EducationList from "./EducationList";
import EducationEdit from "./EducationEdit";

const Education = (props) => {

  const [educationId, setEducationId] = React.useState('');

  const onActiveItemChanged = (item) => {
    setEducationId(item && item._id || '');
  };

  return (
    <Stack horizontal>
      <Stack.Item grow={2}
        styles={{ root: { width: '40%' } }}>
        <Text variant="xxLarge">Opleiding</Text>
        <EducationList cvId={props.cvId}
          onActiveItemChanged={onActiveItemChanged} />
      </Stack.Item>
      <Stack.Item grow={1}>
        <Text variant="xxLarge">Edit</Text>
        <EducationEdit educationId={educationId} />
      </Stack.Item>
    </Stack >
  )
};

export default Education