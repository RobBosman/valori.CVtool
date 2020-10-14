export const getEnumData = (enumArray, key) =>
  enumArray.find(entry => entry.key === key);

export const EducationTypes = [
  {
    key: "EDUCATION",
    text: "Opleiding",
    iconProps: { iconName: "PublishCourse" }
  },
  {
    key: "TRAINING",
    text: "Cursus",
    iconProps: { iconName: "UserEvent" }
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
    text: "Talen"
  },
  {
    key: "BRANCHES",
    text: "Branches"
  },
  {
    key: "DATABASES",
    text: "Databases"
  },
  {
    key: "PROGRAMMING",
    text: "Programmeren"
  },
  {
    key: "APPLICATIONS",
    text: "Applicaties"
  },
  {
    key: "METHODS",
    text: "Methoden"
  },
  {
    key: "EXPERTISE",
    text: "Expertises"
  },
  {
    key: "TOOLS",
    text: "Tools"
  },
  {
    key: "OS_NETWORKS",
    text: "OS / Netwerken"
  }
];