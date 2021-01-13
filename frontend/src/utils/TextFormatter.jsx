import React from "react";
import { Text } from "@fluentui/react";

export const isLetter = (text, index) => {
  if (index >= 0 && index < text.length) {
    const code = text.charCodeAt(index);
    return ((code > 64 && code < 91) || (code > 96 && code < 123)); // a-z, A-Z
  }
  return false;
};

const indexOfWord = (haystack, needle, wordBreakBefore, wordBreakAfter) => {
  let index = haystack.indexOf(needle);
  while (index >= 0) {
    if ((!wordBreakBefore || !isLetter(haystack, index - 1))
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
        index: indexOfWord(lowerCaseHaystack, needle, formattingSpec.wordBreakBefore, formattingSpec.wordBreakAfter),
        formattingSpec
      };
    })
    .filter(({ index }) => index >= 0)
    .shift()
    || { index: -1 };
};

const renderRecursively = (haystack, formattingSpecs, recurseFunction, recurseLevel) => {
  const { index, formattingSpec } = searchNextNeedle(haystack, formattingSpecs, true);
  if (index < 0) {
    return haystack;
  }
  const before = haystack.slice(0, index);
  const match = haystack.slice(index, index + formattingSpec.textToMatch.length);
  const after = haystack.slice(index + formattingSpec.textToMatch.length);
  return (
    <Text>
      {before}
      {formattingSpec.renderAndFormat(match)}
      {recurseLevel > 0 && after.length > 0
        ? recurseFunction(after, formattingSpecs, recurseFunction, recurseLevel - 1)
        : after
      }
    </Text>
  );
};

/**
 * formattingSpec:
 * {
 *   textToMatch: "text to match",
 *   wordBreakBefore: Boolean,
 *   wordBreakAfter: Boolean,
 *   render: (before, match, after, formattingSpecs) =>
 *     <Text>
 *       {before}
 *       <Text style={{color: "red"}}>{match}</Text>
 *       {renderAndFormat(after, formattingSpecs)}
 *     </Text>
 * }
 */
export const renderAndFormat = (fullText = "", formattingSpecs = []) => {
  const { index, formattingSpec } = searchNextNeedle(fullText, formattingSpecs);
  if (index < 0) {
    return fullText;
  }
  const before = fullText.slice(0, index);
  const match = fullText.slice(index, index + formattingSpec.textToMatch.length);
  const after = fullText.slice(index + formattingSpec.textToMatch.length);
  return formattingSpec.renderAndFormat(before, match, after, formattingSpecs);
};

export const renderWithFormatting = (text = "", formattingSpecs = []) =>
  renderRecursively(text, formattingSpecs, renderRecursively, 100);

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