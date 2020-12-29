import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField } from "@fluentui/react";
import { connect } from "react-redux";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import * as cvActions from "../../services/cv/cv-actions";
import * as uiActions from "../../services/ui/ui-actions";
import { useTheme } from "../../services/ui/ui-services";

// searchResult:
// {
//   "_id": "id-skill-1",
//   "cvId": "id-cv-1",
//   "accountId": "id-account-1",
//   "name": "Rob Bosman",
//   "context": "...",
//   "skillLevel": 3
// }
// or
// {
//   "_id": "id-experience-1",
//   "cvId": "id-cv-1",
//   "accountId": "id-account-1",
//   "name": "Rob Bosman",
//   "context": "...",
//   "period": "2004 - 2007"
// }
const Search = (props) => {

  const isLetter = (text, index) => {
    if (index >= 0 && index < text.length) {
      const code = text.charCodeAt(index);
      return ((code > 64 && code < 91) || (code > 96 && code < 123)); // a-z, A-Z
    }
    return false;
  };

  const indexOfWord = (text, word) => {
    let index = text.indexOf(word);
    while (index >= 0) {
      if (!isLetter(text, index - 1) && !isLetter(text, index + word.length)) {
        return index;
      }
      index = text.indexOf(word, index + word.length);
    }
    return -1;
  };

  const searchNextKeyword = (text, keywords) => {
    const lowerText = text.toLowerCase();
    const hits = keywords
      .sort((l, r) => r.length - l.length)
      .map(keyword => [indexOfWord(lowerText, keyword.toLowerCase()), keyword])
      .filter(([index]) => index >= 0)
      .sort((l, r) => l[0] - r[0]);
    return hits.length > 0 ? hits[0] : [-1, ""];
  };

  const {highlightBackground} = useTheme();
  
  const renderWithHighlightedKeywords = (text, keywords, recurseFunction, recurseLevel = 100) => {
    const [index, keyword] = searchNextKeyword(text, keywords);
    if (index < 0) {
      return <Text>{text}</Text>;
    }
    const before = text.slice(0, index);
    const match = text.slice(index, index + keyword.length);
    const after = text.slice(index + keyword.length);
    return (
      <Text>
        {before}
        <Text style={{backgroundColor: highlightBackground}}>{match}</Text>
        { recurseLevel > 0 && after.length > 0
          ? recurseFunction(after, keywords, recurseFunction, recurseLevel - 1)
          : after
        }
      </Text>
    );
  };
  
  const getTextFragment = (text, keywords, maxLength) => {
    const [index, keyword] = searchNextKeyword(text, keywords);
    if (index < 0) {
      return text.slice(0, maxLength);
    }
    const fragmentStartIndex = Math.max(0, index - (maxLength - keyword.length) / 2);
    let textFragment = text.slice(fragmentStartIndex, fragmentStartIndex + maxLength);
    if (fragmentStartIndex > 0) {
      textFragment = `...${textFragment}`;
    }
    if (text.length > fragmentStartIndex + maxLength) {
      textFragment = `${textFragment}...`;
    }
    return renderWithHighlightedKeywords(textFragment, keywords, renderWithHighlightedKeywords);
  };
  
  const renderFragmentWithHighlightedKeywords = (text, searchCriteria, maxLength) =>
    getTextFragment(text || "", searchCriteria?.trim()?.split(/\s+/) || [], maxLength);

  const composeSkillResult = (skill) => ({
    _id: skill._id,
    relevance: "* ".repeat(skill.skillLevel).trim(),
    context: skill.description && skill.description[props.locale]
  });

  const composeExperienceResult = (experience) => ({
    _id: experience._id,
    relevance: `${experience.periodBegin?.substr(0, 4) || ""} - ${experience.periodEnd?.substr(0, 4) || "heden"}`,
    context: [
      experience.assignment && experience.assignment[props.locale],
      experience.activities && experience.activities[props.locale],
      experience.results && experience.results[props.locale],
      experience.keywords && experience.keywords[props.locale]
    ].join("\n")
  });

  const searchResultEntity = React.useMemo(() => {
    const accounts = Object.values(props.accountEntity || {});
    const experiences = Object.values(props.searchResultEntities?.experience || {});
    const skills = Object.values(props.searchResultEntities?.skill || {});
    const entity = {};
    Object.values(props.searchResultEntities?.cv || {})
      .flatMap(cvInstance =>
        [
          ...skills
            .filter(skill => skill.cvId === cvInstance._id)
            .map(skill => composeSkillResult(skill)),
          ...experiences
            .filter(experience => experience.cvId === cvInstance._id)
            .map(experience => composeExperienceResult(experience))
        ]
          .map(searchResultItem => ({
            ...searchResultItem,
            cvId: cvInstance._id,
            accountId: cvInstance.accountId,
            name: accounts.find(account => account._id === cvInstance.accountId)?.name
          }))
      )
      .forEach(instance => entity[instance._id] = instance);
    return entity;
  },
  [props.accountEntity, props.searchResultEntities, props.searchCriteria, props.locale]);

  const searchResultItems = Object.values(searchResultEntity);

  const searchResultContext = React.useMemo(() => ({
    entity: searchResultEntity,
    instanceId: props.selectedSearchResultId,
    setSelectedInstanceId: props.setSelectedSearchResultId
  }),
  [searchResultEntity, props.selectedSearchResultId]);

  const onRenderContext = (item, _, element) =>
    renderFragmentWithHighlightedKeywords(item.context, props.searchCriteria, element.calculatedWidth / 6);

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 130,
      maxWidth: 200
    },
    {
      key: "relevance",
      fieldName: "relevance",
      name: "Relevantie",
      minWidth: 90,
      maxWidth: 90
    },
    {
      key: "context",
      fieldName: "context",
      name: "Context",
      isResizable: true,
      minWidth: 150,
      onRender: onRenderContext
    }
  ];

  const { editPaneColor, viewPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20,
        minWidth: 550,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  const onSearch = (event) => {
    props.searchCvData(event.target.value);
  };

  const selectedItem = searchResultEntity[props.selectedSearchResultId];

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Zoeken</Text>
                <Stack horizontal
                  tokens={{ childrenGap: "l1" }}>
                  <TextField
                    label="Zoekterm"
                    underlined
                    iconProps={{ iconName: "Search" }}
                    value={props.searchCriteria}
                    onChange={onSearch}
                    styles={{ root: { width: 350 } }}
                  />
                </Stack>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={searchResultItems}
                instanceContext={searchResultContext}
                setKey="searchResults"
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              <CvTextField
                label="Naam"
                field="name"
                instanceContext={searchResultContext}
                readOnly={true}
              />
              <CvTextField
                label="Relevantie"
                field="relevance"
                instanceContext={searchResultContext}
                readOnly={true}
              />
              {renderFragmentWithHighlightedKeywords(selectedItem?.context, props.searchCriteria, 1000)}
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Search.propTypes = {
  locale: PropTypes.string.isRequired,
  authInfo: PropTypes.object,
  searchCvData: PropTypes.func.isRequired,
  searchCriteria: PropTypes.string,
  searchResultEntities: PropTypes.object,
  accountEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  setSelectedAccountId: PropTypes.func.isRequired,
  selectedSearchResultId: PropTypes.string,
  setSelectedSearchResultId: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  searchCriteria: store.cv.searchCriteria,
  searchResultEntities: store.cv.searchResult,
  accountEntity: store.safe.content.account,
  selectedAccountId: store.ui.selectedId.account,
  selectedSearchResultId: store.ui.selectedId.searchResult
});

const mapDispatchToProps = (dispatch) => ({
  searchCvData: (searchCriteria) => dispatch(cvActions.searchCvData(searchCriteria)),
  setSelectedAccountId: (id) => dispatch(uiActions.setSelectedId("account", id)),
  setSelectedSearchResultId: (id) => dispatch(uiActions.setSelectedId("searchResult", id))
});

export default connect(select, mapDispatchToProps)(Search);