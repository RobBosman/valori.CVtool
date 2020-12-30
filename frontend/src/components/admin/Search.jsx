import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField } from "@fluentui/react";
import { connect } from "react-redux";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvFormattedText } from "../widgets/CvFormattedText";
import * as cvActions from "../../services/cv/cv-actions";
import * as uiActions from "../../services/ui/ui-actions";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";

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

  const {highlightBackground, editPaneBackground, viewPaneBackground} = uiServices.useTheme();

  const renderHighlighted = (p) =>
    <Text style={{backgroundColor: highlightBackground}}>{p.children}</Text>;
  const needleSpecs = props.searchText
    ?.trim()
    ?.split(/\s+/)
    ?.map(word => ({
      text: word,
      wholeWord: true,
      render: renderHighlighted
    }));

  const composeSkillResult = React.useCallback(skill => ({
    _id: skill._id,
    relevance: "* ".repeat(skill.skillLevel).trim(),
    context: skill.description && skill.description[props.locale]
  }),
  [props.locale]);

  const composeExperienceResult = React.useCallback(experience => ({
    _id: experience._id,
    relevance: `${experience.periodBegin?.substr(0, 4) || ""} - ${experience.periodEnd?.substr(0, 4) || "heden"}`,
    context: [
      experience.assignment && experience.assignment[props.locale],
      experience.activities && experience.activities[props.locale],
      experience.results && experience.results[props.locale],
      experience.keywords && experience.keywords[props.locale]
    ].join("\n")
  }),
  [props.locale]);

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
  [props.accountEntity, props.searchResultEntities, props.locale]);

  const searchResultItems = Object.values(searchResultEntity);

  const searchResultContext = React.useMemo(() => ({
    entity: searchResultEntity,
    instanceId: props.selectedSearchResultId,
    setSelectedInstanceId: props.setSelectedSearchResultId
  }),
  [searchResultEntity, props.selectedSearchResultId]);

  const onRenderContext = React.useCallback((item, _, element) => {
    const {needleSpec} = textFormatter.searchNextNeedle(item.context, needleSpecs);
    const textFragment = textFormatter.getTextFragment(item.context, needleSpec?.text, element.calculatedWidth / 6);
    return textFormatter.renderWithHighlightedKeywords(textFragment, needleSpecs);
  },
  [needleSpecs]);

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

  const viewStyles = {
    root: [
      {
        background: viewPaneBackground,
        padding: 20,
        minWidth: 550,
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneBackground,
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
                    value={props.searchText}
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
              <CvFormattedText
                label="Context"
                field="context"
                instanceContext={searchResultContext}
                markDown={true}
                needleSpecs={needleSpecs}
              />
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
  searchText: PropTypes.string,
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
  searchText: store.cv.searchText,
  searchResultEntities: store.cv.searchResult,
  accountEntity: store.safe.content.account,
  selectedAccountId: store.ui.selectedId.account,
  selectedSearchResultId: store.ui.selectedId.searchResult
});

const mapDispatchToProps = (dispatch) => ({
  searchCvData: (searchText) => dispatch(cvActions.searchCvData(searchText)),
  setSelectedAccountId: (id) => dispatch(uiActions.setSelectedId("account", id)),
  setSelectedSearchResultId: (id) => dispatch(uiActions.setSelectedId("searchResult", id))
});

export default connect(select, mapDispatchToProps)(Search);