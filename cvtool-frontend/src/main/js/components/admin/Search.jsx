import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, TextField, Label, Pivot, PivotItem } from "@fluentui/react";
import { connect } from "react-redux";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvFormattedText } from "../widgets/CvFormattedText";
import * as enums from "../cv/Enums";
import * as cvActions from "../../services/cv/cv-actions";
import * as uiActions from "../../services/ui/ui-actions";
import * as uiServices from "../../services/ui/ui-services";
import * as textFormatter from "../../utils/TextFormatter";
import * as preview from "../cv/Preview";

const onLinkClick = setSelectedExperienceIdFunc =>
  item => setSelectedExperienceIdFunc(item?.props?.itemKey);

const SearchText = properties => {
  const { semanticColors } = uiServices.useTheme();
  return <Text style={{ fontFamily: "Courier New, sans-serif", background: semanticColors.inputBackground }}>
    &nbsp;{properties.children}&nbsp;
  </Text>;
};

const FoundText = properties =>
  <Text>
    &quot;<em>{properties.children}</em>&quot;
  </Text>;

// searchResult:
// {
//   _id: "id-account-1",
//   name: "Rob Bosman",
//   skills: [],
//   skillLevel: 3,
//   experiences: [],
//   experienceYear: 2020
// }
const Search = props => {

  const { semanticColors, markHighlightBackground, editPaneBackground, viewPaneBackground, valoriYellow } = uiServices.useTheme();
  const today = new Date().toISOString();

  const renderHighlighted = (before, match, after, renderFunc, defaultStyle) =>
    <Text style={defaultStyle}>
      {renderFunc(before)}
      <Text style={{ ...defaultStyle, backgroundColor: markHighlightBackground }}>{match}</Text>
      {renderFunc(after)}
    </Text>;

  const highlightFormattingSpecs = props.searchText
    ?.trim()
    ?.split(/\s+/g)
    ?.map(keyword => ({
      textToMatch: keyword,
      wordBreakBefore: true,
      wordBreakAfter: true,
      render: renderHighlighted
    }));

  const enrichExperience = React.useCallback(experience => ({
    ...experience,
    toYear: parseInt((experience.periodEnd || today).substring(0, 4)),
    ...preview.composeExperiencePreview(experience, props.locale)
  }),
  [props.locale]);

  const composeSearchResult = React.useCallback(accountId => {
    const name = Object.values(props.accountEntity || {})
      .find(account => account._id === accountId)?.name;
    const educations = Object.values(props.searchResultEntities?.education || {})
      .filter(education => education.accountId === accountId);
    const trainings = Object.values(props.searchResultEntities?.training || {})
      .filter(training => training.accountId === accountId);
    const skills = Object.values(props.searchResultEntities?.skill || {})
      .filter(skill => skill.accountId === accountId);
    const skillLevel = skills
      .toSorted((l, r) => r.skillLevel - l.skillLevel)
      .map(skill => skill.skillLevel)
      .shift()
      || 0;
    const experiences = Object.values(props.searchResultEntities?.experience || {})
      .filter(experience => experience.accountId === accountId)
      .map(enrichExperience);
    const toYear = experiences
      .map(experience => experience.toYear)
      .sort((l, r) => r - l)
      .shift()
      || -1;
    const publications = Object.values(props.searchResultEntities?.publication || {})
      .filter(publication => publication.accountId === accountId);
    return {
      _id: accountId,
      accountId: accountId,
      name: name,
      educations: educations,
      trainings: trainings,
      skills: skills,
      skillLevel: skillLevel,
      experiences: experiences,
      experienceYear: toYear,
      publications: publications
    };
  },
  [props.accountEntity, props.searchResultEntities]);

  const searchResultEntity = React.useMemo(() => {
    const accountIds = new Set();
    if (props.searchResultEntities) {
      ["education", "experience", "publication", "skill", "training"]
        .forEach(entityName => {
          Object.values(props.searchResultEntities[entityName] || {})
            .map(instance => instance.accountId)
            .forEach(accountId => accountIds.add(accountId));
        });
    }

    const entity = {};
    accountIds
      .forEach(accountId => {
        entity[accountId] = composeSearchResult(accountId);
      });
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

  React.useEffect(() => {
    // Re-select the recently selected experience or select the first one of the search results.
    const selectedExperience =
      selectedSearchResult?.experiences?.find(experience => experience._id === props.selectedExperienceId)
        || selectedSearchResult?.experiences?.sort((l, r) => r.toYear - l.toYear)[0];
    props.setSelectedExperienceId(selectedExperience?._id);
  },
  [selectedSearchResult]);

  const renderSkillResult = (item) =>
    item.skills?.length > 0
      ? `${"\u2605 ".repeat(item.skillLevel).trim()} (${item.skills.length})`
      : "";

  const renderExperienceResult = (item) =>
    item.experiences?.length > 0
      ? `${item.experienceYear} (${item.experiences.length})`
      : "";

  const renderMiscellaneaResult = (item) => {
    const totalHits = (item.educations?.length || 0) + (item.publications?.length || 0) + (item.trainings?.length || 0);
    return totalHits > 0
      ? `(${totalHits})`
      : "";
  };

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
    },
    {
      key: "miscellanea",
      name: "Overig",
      minWidth: 80,
      maxWidth: 80,
      onRender: renderMiscellaneaResult
    }
  ];

  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 550,
      height: "calc(100vh - 170px)"
    }
  };
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      width: "100%",
      height: "calc(100vh - 170px)"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)",
    maxWidth: "calc(50vw - 98px)"
  };
  const searchResultStyle = (hasData) => ({
    backgroundColor: hasData > 0 ? semanticColors.inputBackground : semanticColors.disabledBackground,
    padding: 8,
    width: "100%",
    minHeight: 16
  });

  const onSearch = (event) => {
    props.searchCvData(event.target.value);
  };

  const onFetchCv = () => {
    if (props.selectedAccountId && props.selectedAccountId !== props.authInfo.accountId) {
      props.fetchCvByAccountId(props.selectedAccountId);
    }
  };

  const renderExperience = (experience) => {
    const experienceContext = {
      entity: { [experience._id]: experience },
      instanceId: experience._id,
    };
    return <Stack
      styles={{
        root: {
          background: viewPaneBackground,
          padding: 20,
          height: `calc(100vh - ${329 + selectedSearchResult.skills.length * 24}px)`
        }
      }}>
      <div style={{
        position: "relative",
        overflowY: "auto",
        height: "inherit"
      }}>
        <Stack
          styles={{
            root: {
              borderColor: valoriYellow,
              borderWidth: 1,
              borderStyle: "solid dashed none none"
            }
          }}>
          <CvFormattedText
            field="period"
            instanceContext={experienceContext}
            markDown={false}
            formattingSpecs={highlightFormattingSpecs}
            textComponentStyle={{
              paddingBottom: 0
            }}
          />
          <CvFormattedText
            field={`role.${props.locale}`}
            instanceContext={experienceContext}
            markDown={false}
            formattingSpecs={highlightFormattingSpecs}
            textComponentStyle={{
              color: valoriYellow,
              paddingTop: 0,
              paddingBottom: 0
            }}
          />
          <CvFormattedText
            field="clientOrEmployer"
            instanceContext={experienceContext}
            markDown={false}
            formattingSpecs={highlightFormattingSpecs}
            textComponentStyle={{
              color: valoriYellow,
              paddingTop: 0
            }}
          />
        </Stack>
        <CvFormattedText
          field={`description.${props.locale}`}
          instanceContext={experienceContext}
          markDown={true}
          formattingSpecs={highlightFormattingSpecs}
          styles={{
            root: {
              borderColor: valoriYellow,
              borderWidth: 1,
              borderStyle: "solid none solid dashed"
            }
          }}
        />
      </div>
    </Stack>;
  };

  const infoText =
    <Text>
      Vul één of meer zoektermen in, gescheiden door spaties.
      <ul>
        <li>De lijst met zoekresultaten wordt automatisch bijgewerkt.</li>
        <li>De zoekfunctie is case-insensitive.</li>
        <li>
          Er wordt alleen gezocht op hele woorden.
          <br/>Dus als je zoekt op <SearchText>java</SearchText> zul je geen <FoundText>JavaScript</FoundText> vinden en andersom.
        </li>
        <li>
          Combineren van zoektermen is mogelijk.
          <br/>Met zoekterm <SearchText>java c#</SearchText> vind je alle cv&apos;s waarin zowel <FoundText>C#</FoundText> als <FoundText>Java</FoundText> voorkomt.
        </li>
      </ul>
      <u>Let op</u>:
      <br/>Sommige termen worden verschillend gespeld, zoals <FoundText>TMap</FoundText>, <FoundText>T-Map</FoundText> en <FoundText>T&nbsp;Map</FoundText>.
      <br/>Het combineren van zoektermen werkt hier niet. Om alle spellingsvarianten te vinden moet je ze een voor een als zoekterm invoeren.
      <br/>
      <br/>De lijst toont alleen accountgegevens en zoekresultaten.
      <br/><strong>Dubbel-klikken</strong> op een account haalt ook de rest van cv-gegevens op.
      <br/>De CV-menu items worden dan geënabled zodat je naar de details van het cv kunt navigeren.
    </Text>;

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th valign="top" style={tdStyle}>
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
          </th>

          <td valign="top" style={tdStyle}>
            {selectedSearchResult
              ? <Stack styles={editStyles}>
                <Label
                  disabled={!(selectedSearchResult.educations?.length || selectedSearchResult.trainings?.length)}>
                  Opleiding
                </Label>
                <table style={searchResultStyle((selectedSearchResult.educations?.length || selectedSearchResult.trainings?.length) > 0)}>
                  <tbody>
                    {[...(selectedSearchResult.educations || []), ...(selectedSearchResult.trainings || [])]
                      .map(educationOrTraining =>
                        <tr key={educationOrTraining._id}>
                          <th width="10%">Naam</th>
                          <td width="40%">{textFormatter.renderAndFormat(educationOrTraining.name?.[props.locale], highlightFormattingSpecs)}</td>
                          <th width="10%">Instituut</th>
                          <td width="40%">{textFormatter.renderAndFormat(educationOrTraining.institution, highlightFormattingSpecs)}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
                <Label
                  disabled={!selectedSearchResult.skills?.length}>
                  Vaardigheden
                </Label>
                <table style={searchResultStyle(selectedSearchResult?.skills?.length > 0)}>
                  <tbody>
                    {selectedSearchResult
                      .skills
                      ?.sort((l, r) => r.skillLevel - l.skillLevel)
                      ?.map(skill =>
                        <tr key={skill._id}>
                          <th width="20%">{enums.getText(enums.SkillCategories, skill.category, props.locale) || skill.category}</th>
                          <td width="30%">{textFormatter.renderAndFormat(skill.description?.[props.locale], highlightFormattingSpecs)}</td>
                          <td width="10%" align="right">{"\u2605 ".repeat(skill.skillLevel).trim()}</td>
                          <td width="40%" align="right" style={{borderLeftStyle: "outset"}}>
                            <em>{textFormatter.renderAndFormat(skill.explanation?.[props.locale], highlightFormattingSpecs)}</em>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
                {selectedSearchResult.experiences?.length > 0
                  && <Label>
                    Werkervaring
                  </Label>
                }
                <Pivot
                  linkFormat="tabs"
                  selectedKey={props.selectedExperienceId}
                  onLinkClick={onLinkClick(props.setSelectedExperienceId)}>
                  {selectedSearchResult
                    .experiences
                    ?.sort((l, r) => r.toYear - l.toYear)
                    .slice(0, 8)
                    ?.map(experience =>
                      <PivotItem key={experience._id}
                        itemKey={experience._id}
                        headerText={experience.toYear}>
                        {renderExperience(experience)}
                      </PivotItem>
                    )
                  }
                </Pivot>
              </Stack>
              : <Stack styles={editStyles}>
                {infoText}
              </Stack>
            }
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
  fetchCvByAccountId: PropTypes.func.isRequired,
  selectedExperienceId: PropTypes.string,
  setSelectedExperienceId: PropTypes.func.isRequired
};

const select = (store) => ({
  locale: store.ui.userPrefs.locale,
  authInfo: store.auth.authInfo,
  searchText: store.cv.searchText,
  searchResultEntities: store.cv.searchResult,
  accountEntity: store.safe.content.account,
  selectedAccountId: store.ui.selectedId.account,
  selectedExperienceId: store.ui.selectedId.experience
});

const mapDispatchToProps = (dispatch) => ({
  searchCvData: (searchText) => dispatch(cvActions.searchCvData(searchText)),
  setSelectedAccountId: (id) => dispatch(uiActions.setSelectedId("account", id)),
  fetchCvByAccountId: (accountId) => dispatch(cvActions.fetchCvByAccountId(accountId)),
  setSelectedExperienceId: (id) => dispatch(uiActions.setSelectedId("experience", id))
});

export default connect(select, mapDispatchToProps)(Search);