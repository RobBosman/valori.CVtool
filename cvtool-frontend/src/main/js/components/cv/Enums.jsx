export const getValue = (enumArray, key) =>
  enumArray.find(entry => entry.key === key);

export const getTextFromValue = (enumData, locale) =>
  enumData?.text?.[locale] || enumData?.text?.nl_NL || "";

export const getText = (enumArray, key, locale) =>
  getTextFromValue(getValue(enumArray, key), locale);

export const getOptions = (enumArray, locale) =>
  enumArray
    .sort((l, r) => l.sortIndex - r.sortIndex)
    .map(enumValue => ({
      key: enumValue.key,
      text: getTextFromValue(enumValue, locale)
    }));

export const Authorizations = [
  {
    key: "CONSULTANT",
    sortIndex: 0,
    text: {
      nl_NL: "-"
    }
  },
  {
    key: "ADMIN",
    sortIndex: 1,
    text: {
      nl_NL: "Beheer",
      uk_UK: "Admin"
    }
  },
  {
    key: "UNIT_LEAD",
    sortIndex: 2,
    text: {
      nl_NL: "Unit Lead"
    }
  },
  {
    key: "SALES",
    sortIndex: 3,
    text: {
      nl_NL: "Sales"
    }
  }
];

export const DocxTemplates = [
  {
    key: "CERIOS",
    sortIndex: 0,
    text: {
      nl_NL: "CERIOS"
    }
  },
  {
    key: "VALORI",
    sortIndex: 1,
    text: {
      nl_NL: "VALORI"
    }
  },
  {
    key: "TESTCREW-IT",
    sortIndex: 2,
    text: {
      nl_NL: "TESTCREW-IT"
    }
  }
];

export const EducationResultTypes = [
  {
    key: "DIPLOMA",
    sortIndex: 0,
    text: {
      nl_NL: "diploma",
      uk_UK: "diploma"
    }
  },
  {
    key: "CERTIFICATE",
    sortIndex: 1,
    text: {
      nl_NL: "certificaat",
      uk_UK: "certificate"
    }
  },
  {
    key: "ONGOING",
    sortIndex: 2,
    text: {
      nl_NL: "nog bezig",
      uk_UK: "ongoing"
    }
  },
  {
    key: "CANCELED",
    sortIndex: 3,
    text: {
      nl_NL: "afgebroken",
      uk_UK: "cancelled"
    }
  },
  {
    key: "NOT_APPLICABLE",
    sortIndex: 4,
    text: {
      nl_NL: "nvt",
      uk_UK: "n/a"
    }
  }
];

export const SkillCategories = [
  {
    key: "LANGUAGES",
    sortIndex: 0,
    text: {
      nl_NL: "Talen",
      uk_UK: "Languages"
    }
  },
  {
    key: "BRANCHES",
    sortIndex: 1,
    text: {
      nl_NL: "Branches",
      uk_UK: "Branches"
    }
  },
  {
    key: "EXPERTISE",
    sortIndex: 2,
    text: {
      nl_NL: "Expertises",
      uk_UK: "Expertises"
    }
  },
  {
    key: "DATABASES",
    sortIndex: 3,
    text: {
      nl_NL: "Databases",
      uk_UK: "Databases"
    }
  },
  {
    key: "APPLICATIONS",
    sortIndex: 4,
    text: {
      nl_NL: "Applicaties",
      uk_UK: "Applications"
    }
  },
  {
    key: "TOOLS",
    sortIndex: 5,
    text: {
      nl_NL: "Tools",
      uk_UK: "Tools"
    }
  },
  {
    key: "PROGRAMMING",
    sortIndex: 6,
    text: {
      nl_NL: "Programmeren",
      uk_UK: "Programming"
    }
  },
  {
    key: "METHODS",
    sortIndex: 7,
    text: {
      nl_NL: "Methodes",
      uk_UK: "Methods"
    }
  },
  {
    key: "OS_NETWORKS",
    sortIndex: 8,
    text: {
      nl_NL: "OS & Netwerken",
      uk_UK: "OS & Networks"
    }
  }
];