export const cvHeadings = {
  activities: "Taken/werkzaamheden:",
  results: "Resultaat:",
  keywords: "Werkomgeving:"
};

export const cvTextStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "10pt",
  lineHeight: 1.3
};

export const composeExperiencePeriod = (experience) => {
  const beginString = experience.periodBegin
    ? `${experience.periodBegin.substr(5, 2)}-${experience.periodBegin.substr(0, 4)}`
    : "";
  const endString = experience.periodEnd
    ? `${experience.periodEnd.substr(5, 2)}-${experience.periodEnd.substr(0, 4)}`
    : "heden";
  return `${beginString} \u2014 ${endString}`;
};

export const composeExperienceDescription = (experience, locale) => {
  const assignment = experience.assignment && experience.assignment[locale]?.trim() || "";
  const activities = experience.activities && experience.activities[locale]?.trim() || "";
  const results = experience.results && experience.results[locale]?.trim() || "";
  const keywords = experience.keywords && experience.keywords[locale]?.trim() || "";
  var composedText = assignment;
  if (activities)
    composedText += `\n${cvHeadings.activities}\n${activities}`;
  if (results)
    composedText += `\n${cvHeadings.results}\n${results}`;
  if (keywords)
    composedText += `\n${cvHeadings.keywords}\n${keywords}`;
  return composedText.trim();
};

export const composeExperiencePreview = (experience, locale) => ({
  period: composeExperiencePeriod(experience),
  role: experience.role,
  clientOrEmployer: experience.client || experience.employer || "",
  description: {
    [locale]: composeExperienceDescription(experience, locale)
  }
});