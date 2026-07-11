import PropTypes from "prop-types";
import React from "react";
import {shallowEqual, useSelector} from "react-redux";
import {HoverCard, HoverCardType, Stack, Text} from "@fluentui/react";
import * as commonUtils from "../../utils/CommonUtils";
import {useTheme} from "../../services/ui/ui-services";
import {formatDate} from "../cv/Preview";

const CvTitle = prps => {

  const selectors = useSelector(
    state => ({
      locale: state.ui.userPrefs.locale,
      characteristicsEntity: state.safe.content.characteristics,
      selectedAccountId: state.ui.selectedId.account,
      accountEntity: state.safe.content.account
    }),
    {equalityFn: shallowEqual}
  );
  const props = {...prps, ...selectors};
  
  const {ceriosYellow} = useTheme();

  const memo = React.useMemo(() => {
    const account = props.accountEntity?.[props.selectedAccountId];
    const characteristics = Object.values(props.characteristicsEntity || {})
      .find(instance => instance.accountId === props.selectedAccountId && instance.includeInCv);
    const role = commonUtils.getValueOrFallback(characteristics, "role", props.locale);
    return {
      email: account?.email,
      name: account?.name || "<NAAM>",
      role: role || (characteristics ? "<ROL>" : ""),
      dateOfBirth: account?.dateOfBirth && formatDate(account.dateOfBirth) || "<GEBOORTEDATUM>",
      residence: account?.residence || "<WOONPLAATS>"
    };
  },
  [props.accountEntity, props.characteristicsEntity, props.selectedAccountId, props.locale]);
  const renderPlainCard = () => <p style={{margin: 10}}>{memo.email}</p>;

  return (
    <Stack styles={{ root: { textTransform: "uppercase", color: "#999999" } }}>
      <HoverCard
        type={HoverCardType.plain}
        plainCardProps={{ onRenderPlainCard: renderPlainCard }}
        instantOpenOnClick={true}>
        <Text variant="xxLarge">{memo.name}</Text>
      </HoverCard>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        {memo.role
          ? <Text variant="large">{memo.role}</Text>
          : null
        }
        {memo.role
          ? <Text variant="large" style={{ color: ceriosYellow }}>{"//"}</Text>
          : null
        }
        <Text variant="large">{memo.dateOfBirth}</Text>
        <Text variant="large" style={{ color: ceriosYellow }}>{"//"}</Text>
        <Text variant="large">{memo.residence}</Text>
      </Stack>
    </Stack>
  );
};

CvTitle.propTypes = {
  locale: PropTypes.string,
  characteristicsEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  accountEntity: PropTypes.object
};

export default CvTitle;