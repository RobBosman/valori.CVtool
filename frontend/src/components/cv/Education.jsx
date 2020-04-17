import React from "react";
import { Stack, Text, registerOnThemeChangeCallback, removeOnThemeChangeCallback, getTheme } from "@fluentui/react";
import EducationList from "./EducationList";
import EducationEdit from "./EducationEdit";

const Education = (props) => {

  const [key, setKey] = React.useState(Math.random());

  React.useEffect(() => {
    const themeChangeCallback = (theme) => setKey(Math.random());
    registerOnThemeChangeCallback(themeChangeCallback);
    return () => removeOnThemeChangeCallback(themeChangeCallback);
  }, []);

  const listStyles = {
    root: [
      {
        background: getTheme().palette.neutralQuaternaryAlt,
        padding: 20,
        width: '40%'
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: getTheme().palette.neutralTertiaryAlt,
        padding: 20
      }
    ]
  };

  return (
    <Stack horizontal key={key}>
      <Stack.Item grow={2} styles={listStyles}>
        <Text variant="xxLarge">Opleiding</Text>
        <EducationList />
      </Stack.Item>
      <Stack.Item grow={1} styles={editStyles}>
        <Text variant="xxLarge">Edit</Text>
        <EducationEdit />
      </Stack.Item>
    </Stack>
  )
};

export default Education