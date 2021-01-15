export const isLetter = (text, index) => {
  if (index >= 0 && index < text.length) {
    const code = text.charCodeAt(index);
    return ((code > 64 && code < 91) || (code > 96 && code < 123)); // A-Z, a-z
  }
  return false;
};

const searchIndex = (haystack, needle, newLineBefore, wordBreakBefore, wordBreakAfter) => {
  let index = haystack.indexOf(needle);
  while (index >= 0) {
    if ((!newLineBefore || index === 0 || haystack[index - 1] === "\n")
      && (!wordBreakBefore || !isLetter(haystack, index - 1))
      && (!wordBreakAfter || !isLetter(haystack, index + needle.length))) {
      return index;
    }
    index = haystack.indexOf(needle, index + needle.length);
  }
  return -1;
};

const searchNextNeedle = (haystack = "", formattingSpecs = []) => {
  const lowerCaseHaystack = haystack.toLowerCase();
  return formattingSpecs
    .filter(formattingSpec => formattingSpec.textToMatch)
    .map(formattingSpec => {
      const needle = formattingSpec.textToMatch.toLowerCase();
      return {
        index: searchIndex(lowerCaseHaystack, needle, formattingSpec.newLineBefore, formattingSpec.wordBreakBefore, formattingSpec.wordBreakAfter),
        formattingSpec
      };
    })
    .filter(({ index }) => index >= 0)
    .shift()
    || { index: -1 };
};

const recursivelyRenderAndFormat = (fullText, formattingSpecs, defaultStyle, renderContext) => {
  const { index, formattingSpec } = searchNextNeedle(fullText, formattingSpecs);
  if (index < 0) {
    return fullText;
  }
  const before = fullText.slice(0, index);
  const match = fullText.slice(index, index + formattingSpec.textToMatch.length);
  const after = fullText.slice(index + formattingSpec.textToMatch.length);
  const renderFunc = (someText, options = {}) => {
    if (options.newParagraph) {
      renderContext.paragraph = renderContext.paragraph + 1;
    }
    return recursivelyRenderAndFormat(someText, formattingSpecs, defaultStyle, renderContext);
  };
  return formattingSpec.render(before, match, after, renderFunc, defaultStyle, renderContext);
};

/**
 * formattingSpec:
 * {
 *   textToMatch: "text to match",
 *   newLineBefore: Boolean,
 *   wordBreakBefore: Boolean,
 *   wordBreakAfter: Boolean,
 *   render: (before, match, after, renderFunc, defaultStyle, renderContext) =>
 *     <Text style={defaultStyle}>
 *       {renderFunc(before)}
 *       <Text style={{ ...defaultStyle, color: "red" }}>{match}</Text>
 *       {renderFunc(after, { x: 3 })}
 *     </Text>
 * }
 */
export const renderAndFormat = (fullText = "", formattingSpecs = [], defaultStyle = {}) =>
  recursivelyRenderAndFormat(fullText, formattingSpecs, defaultStyle, { paragraph: 0 });

export const getTextFragment = (fullText = "", targetText = "", maxLength) => {
  const index = fullText.indexOf(targetText);
  const fragmentStartIndex = Math.max(0, index - (maxLength - targetText.length) / 2);
  let textFragment = fullText.slice(fragmentStartIndex, fragmentStartIndex + maxLength);
  if (fragmentStartIndex > 0) {
    textFragment = `...${textFragment}`;
  }
  if (fullText.length > fragmentStartIndex + maxLength) {
    textFragment = `${textFragment}...`;
  }
  return textFragment;
};