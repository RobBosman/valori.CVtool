export const getEnumData = (enumArray, key) =>
  enumArray.find(entry => entry.key === key);

export const EducationTypes = [
  {
    key: "EDUCATION",
    text: "Opleiding",
    iconProps: { iconName: "PublishCourse" },
    sortIndex: 1
  },
  {
    key: "TRAINING",
    text: "Training",
    iconProps: { iconName: "UserEvent" },
    sortIndex: 2
  }
];

export const EducationResultTypes = [
  {
    key: "DIPLOMA",
    text: "diploma"
  },
  {
    key: "CERTIFICATE",
    text: "certificaat"
  },
  {
    key: "ONGOING",
    text: "nog bezig"
  },
  {
    key: "CANCELED",
    text: "afgebroken"
  },
  {
    key: "NOT_APPLICABLE",
    text: "n.v.t."
  }
];

export const SkillCategories = [
  {
    key: "LANGUAGES",
    text: "Talen",
    sortIndex: 1
  },
  {
    key: "BRANCHES",
    text: "Branches",
    sortIndex: 2
  },
  {
    key: "EXPERTISE",
    text: "Expertises",
    sortIndex: 3
  },
  {
    key: "DATABASES",
    text: "Databases",
    sortIndex: 4
  },
  {
    key: "APPLICATIONS",
    text: "Applicaties",
    sortIndex: 5
  },
  {
    key: "TOOLS",
    text: "Tools",
    sortIndex: 6
  },
  {
    key: "PROGRAMMING",
    text: "Programmeren",
    sortIndex: 7
  },
  {
    key: "METHODS",
    text: "Methoden",
    sortIndex: 8
  },
  {
    key: "OS_NETWORKS",
    text: "OS & Netwerken",
    sortIndex: 9
  }
];