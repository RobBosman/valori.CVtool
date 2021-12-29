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


// The widths in this table are in mm. They are based on the Arial 10pt font used in MS-Word.
const ARIAL_WIDTH_MAP = {
  "ijl": 0.75,
  "Ift, /": 1.00,
  "r.-()": 1.20,
  "JLcksvxyz": 1.75,
  "abdeghnopqu0123456789=": 1.95,
  "FTZ&": 2.25,
  "ABEKPSVXY": 2.35,
  "CDHNRUw": 2.55,
  "GMOQ": 2.75,
  "m": 2.95,
  "W": 3.30
};

const getCharWidth = (ch) => {
  const key = Object.keys(ARIAL_WIDTH_MAP)
    .find(key => key.includes(ch));
  return key && key[1] || 1.0;
};

const getWidth = (text) =>
  [...text]
    .map(c => getCharWidth(c))
    .reduce((acc, c) => acc + c, 0.0);

/**
 * Search for the letter-index at 42.5 mm using table WIDTH_MAP.
 * That is 17 capitals of about 2,47 mm or 24 lower case letters of circa 1,75 mm wide.
 * If the text is longer than that, then replace the last space *before* that index with a newline.
 *
 * NB - The implementation of this function has a Kotlin counterpart, see XsUtils.kt.
 */
export const wrapText = (text, wrapWidth) => {

  const spaceWidth = getCharWidth(" ");

  let buildUpWidth = 0.0;
  let wrappedText = "";
  text
    .split(/ \t\n/)
    .forEach(fragmentText => {
      const fragmentWidth = getWidth(fragmentText);

      if (buildUpWidth + spaceWidth + fragmentWidth > wrapWidth) {
        wrappedText = `${wrappedText}\n${fragmentText}`.trim();
        buildUpWidth = fragmentWidth;
      } else if (wrappedText.length === 0) {
        wrappedText = fragmentText;
        buildUpWidth = fragmentWidth;
      } else {
        wrappedText += ` ${fragmentText}`;
        buildUpWidth += spaceWidth + fragmentWidth;
      }
    });

  return wrappedText;
};