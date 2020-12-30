import React from "react";
import { Text } from "@fluentui/react";

export const getTextFragment = (fullText = "", needle = "", maxLength) => {
  const index = fullText.indexOf(needle);
  const fragmentStartIndex = Math.max(0, index - (maxLength - needle.length) / 2);
  let textFragment = fullText.slice(fragmentStartIndex, fragmentStartIndex + maxLength);
  if (fragmentStartIndex > 0) {
    textFragment = `...${textFragment}`;
  }
  if (fullText.length > fragmentStartIndex + maxLength) {
    textFragment = `${textFragment}...`;
  }
  return textFragment;
};

const isLetter = (text, index) => {
  if (index >= 0 && index < text.length) {
    const code = text.charCodeAt(index);
    return ((code > 64 && code < 91) || (code > 96 && code < 123)); // a-z, A-Z
  }
  return false;
};

const indexOfWord = (haystack, needle) => {
  let index = haystack.indexOf(needle);
  while (index >= 0) {
    if (!isLetter(haystack, index - 1) && !isLetter(haystack, index + needle.length)) {
      return index;
    }
    index = haystack.indexOf(needle, index + needle.length);
  }
  return -1;
};

/**
 * needleSpec:
 * {
 *   text: "text to match",
 *   wholeWord: Boolean,
 *   render: (props) => <Text>{props.children}</Text>
 * }
 */
export const searchNextNeedle = (haystack = "", needleSpecs = []) => {
  const lowerHaystack = haystack.toLowerCase();
  return needleSpecs
    .filter(needleSpec => needleSpec.text)
    .sort((l, r) => r.text.length - l.text.length)
    .map(needleSpec => {
      const needle = needleSpec.text.toLowerCase();
      return {
        index: needleSpec.wholeWord ? indexOfWord(lowerHaystack, needle) : lowerHaystack.indexOf(needle),
        needleSpec
      };
    })
    .filter(({index}) => index >= 0)
    .sort((l, r) => l.index - r.index)
    .find(() => true)
    || { index: -1 };
};
  
const renderRecursively = (haystack, needleSpecs, recurseFunction, recurseLevel) => {
  const {index, needleSpec} = searchNextNeedle(haystack, needleSpecs, true);
  if (index < 0) {
    return haystack;
  }
  const before = haystack.slice(0, index);
  const match = haystack.slice(index, index + needleSpec.text.length);
  const after = haystack.slice(index + needleSpec.text.length);
  return (
    <Text>
      {before}
      {needleSpec.render({ children: match })}
      { recurseLevel > 0 && after.length > 0
        ? recurseFunction(after, needleSpecs, recurseFunction, recurseLevel - 1)
        : after
      }
    </Text>
  );
};
  
export const renderWithHighlightedKeywords = (text = "", needleSpecs = []) =>
  renderRecursively(text, needleSpecs, renderRecursively, 100);