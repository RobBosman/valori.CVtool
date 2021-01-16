import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField, Label, Pivot, PivotItem, ScrollablePane, PivotLinkFormat } from "@fluentui/react";
import { connect } from "react-redux";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvFormattedText } from "../widgets/CvFormattedText";
import { getEnumData, SkillCategories } from "../cv/Enums";
import * as cvActions from "../../services/cv/cv-actions";
import * as uiActions from "../../services/ui/ui-actions";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";
import * as preview from "../cv/Preview";

// searchResult:
// {
//   _id: "id-account-1",
//   cvId: "id-cv-1",
//   name: "Rob Bosman",
//   skills: [],
//   skillLevel: 3,
//   experiences: [],
//   experienceYear: 2020
// }
const Search = (props) => {

  const { semanticColors, markHighlightBackground, editPaneBackground, viewPaneBackground } = uiServices.useTheme();
  const today = new Date().toISOString();

  const renderHighlighted = (before, match, after, renderFunc, defaultStyle) =>
    <Text style={defaultStyle}>
      {renderFunc(before)}
      <Text style={{ ...defaultStyle, backgroundColor: markHighlightBackground }}>{match}</Text>
      {renderFunc(after)}
    </Text>;

  const highlightFormattingSpecs = props.searchText
    ?.trim()
    ?.split(/\s+/)
    ?.map(keyword => ({
      textToMatch: keyword,
      wordBreakBefore: true,
      wordBreakAfter: true,
      render: renderHighlighted
    }));

  const enrichExperience = React.useCallback(experience => ({
    ...experience,
    toYear: parseInt((experience.periodEnd || today).substr(0, 4)),
    ...preview.composeExperiencePreview(experience, props.locale)
  }),
  [props.locale]);

  const composeSearchResult = React.useCallback(cvInstance => {
    const name = Object.values(props.accountEntity || {})
      .find(account => account._id === cvInstance.accountId)?.name;
    const skills = Object.values(props.searchResultEntities?.skill || {})
      .filter(skill => skill.cvId === cvInstance._id);
    const skillLevel = skills
      .sort((l, r) => r.skillLevel - l.skillLevel)
      .map(skill => skill.skillLevel)
      .shift()
      || 0;
    const experiences = Object.values(props.searchResultEntities?.experience || {})
      .filter(experience => experience.cvId === cvInstance._id)
      .map(enrichExperience);
    const toYear = experiences
      .map(experience => experience.toYear)
      .sort((l, r) => r - l)
      .shift()
      || -1;
    return {
      _id: cvInstance.accountId,
      cvId: cvInstance._id,
      name: name,
      skills: skills,
      skillLevel: skillLevel,
      experiences: experiences,
      experienceYear: toYear
    };
  },
  [props.accountEntity, props.searchResultEntities]);

  const searchResultEntity = React.useMemo(() => {
    const entity = {};
    Object.values(props.searchResultEntities?.cv || {})
      .map(cvInstance => composeSearchResult(cvInstance))
      .forEach(instance => entity[instance._id] = instance);
    return entity;
  },
  [props.accountEntity, props.searchResultEntities, props.locale]);

  const searchResultItems = Object.values(searchResultEntity);

  const searchResultContext = React.useMemo(() => ({
    entity: searchResultEntity,
    instanceId: props.selectedAccountId,
    setSelectedInstanceId: props.setSelectedAccountId
  }),
  [searchResultEntity, props.selectedAccountId, props.setSelectedAccountId]);

  const selectedSearchResult = searchResultEntity[props.selectedAccountId];

  const renderSkillResult = (item) =>
    item.skills.length > 0
      ? `${"* ".repeat(item.skillLevel).trim()} (${item.skills.length})`
      : "";

  const renderExperienceResult = (item) =>
    item.experiences.length > 0
      ? `${item.experienceYear} (${item.experiences.length})`
      : "";

  const columns = [
    {
      key: "name",
      fieldName: "name",
      name: "Naam",
      isResizable: true,
      minWidth: 130
    },
    {
      key: "skills",
      fieldName: "skillLevel",
      name: "Vaardigheden",
      minWidth: 110,
      maxWidth: 110,
      onRender: renderSkillResult
    },
    {
      key: "experiences",
      fieldName: "experienceYear",
      name: "Werkervaring",
      minWidth: 110,
      maxWidth: 110,
      onRender: renderExperienceResult
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
        width: "100%",
        height: "calc(100vh - 170px)"
      }
    ]
  };
  const tdStyle = {
    width: "calc(50vw - 98px)",
    maxWidth: "calc(50vw - 98px)"
  };
  const skillsStyle = {
    backgroundColor: selectedSearchResult?.skills?.length > 0 ? semanticColors.inputBackground : semanticColors.disabledBackground,
    padding: 8,
    width: "100%",
    minHeight: 16
  };

  const onSearch = (event) => {
    props.searchCvData(event.target.value);
  };

  const onFetchCv = () => {
    if (["ADMIN", "EE_LEAD"].includes(props.authInfo.authorizationLevel)
      && props.selectedAccountId && props.selectedAccountId !== props.authInfo.accountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  const renderExperience = (experience) => {
    const experienceContext = {
      entity: { [experience._id]: experience },
      instanceId: experience._id,
    };
    return <Stack
      tokens={{ childrenGap: "l1" }}
      styles={{
        root: {
          background: viewPaneBackground,
          padding: 20,
          height: `calc(100vh - ${329 + selectedSearchResult.skills.length * 24}px)`
        }
      }}>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <CvFormattedText
          field="period"
          instanceContext={experienceContext}
          markDown={false}
          formattingSpecs={highlightFormattingSpecs}
          styles={{ root: { minWidth: 135 } }}
        />
        <CvFormattedText
          field={`role.${props.locale}`}
          instanceContext={experienceContext}
          markDown={false}
          formattingSpecs={highlightFormattingSpecs}
        />
        <CvFormattedText
          field="clientOrEmployer"
          instanceContext={experienceContext}
          markDown={false}
          formattingSpecs={highlightFormattingSpecs}
        />
      </Stack>
      <div style={{
        position: "relative",
        overflowY: "auto",
        height: "inherit"
      }}>
        <ScrollablePane>
          <CvFormattedText
            field={`description.${props.locale}`}
            instanceContext={experienceContext}
            markDown={true}
            formattingSpecs={highlightFormattingSpecs}
          />
        </ScrollablePane>
      </div>
    </Stack>;
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
                onItemInvoked={onFetchCv}
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editStyles}>
              {selectedSearchResult
                && <Label
                  disabled={!selectedSearchResult?.skills?.length}>
                  Vaardigheden
                </Label>
              }
              {selectedSearchResult
                && <table style={skillsStyle}>
                  <tbody>
                    {selectedSearchResult
                      ?.skills
                      ?.sort((l, r) => r.skillLevel - l.skillLevel)
                      ?.map(skill =>
                        <tr key={skill._id}>
                          <td width="30%">{getEnumData(SkillCategories, skill.category)?.text || skill.category}</td>
                          <td width="60%">{textFormatter.renderAndFormat(skill.description && skill.description[props.locale], highlightFormattingSpecs)}</td>
                          <td width="10%" align="right">{"* ".repeat(skill.skillLevel).trim()}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              }
              {selectedSearchResult?.experiences?.length > 0
                && <Label
                  disabled={!selectedSearchResult?.experiences?.length}>
                  Werkervaring
                </Label>
              }
              {selectedSearchResult
                && <Pivot
                  linkFormat={PivotLinkFormat.tabs}>
                  {selectedSearchResult
                    ?.experiences
                    ?.sort((l, r) => r.toYear - l.toYear)
                    .slice(0, 8)
                    ?.map(experience =>
                      <PivotItem key={experience._id}
                        headerText={experience.toYear}>
                        {renderExperience(experience)}
                      </PivotItem>
                    )
                  }
                </Pivot>
              }
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
  setSelectedAccountId: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  fetchCvByAccountId: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  searchText: store.cv.searchText,
  searchResultEntities: store.cv.searchResult,
  accountEntity: store.safe.content.account,
  selectedAccountId: store.ui.selectedId.account
});

const mapDispatchToProps = (dispatch) => ({
  searchCvData: (searchText) => dispatch(cvActions.searchCvData(searchText)),
  setSelectedAccountId: (id) => dispatch(uiActions.setSelectedId("account", id)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId))
});

export default connect(select, mapDispatchToProps)(Search);