import PropTypes from "prop-types";
import React from "react";
import { CommandBar } from "@fluentui/react";

/**
 * React component for navigating a single-selection list of items and adding/deleting items.
 * It uses a {selection} that is obtained via a provider function {props.selectionProvider}.
 * @param {*} props 
 */
const CvEditNavigator = (props) => {

  const items = [
    {
      key: "selectPrevious",
      text: "Vorige",
      iconProps: { iconName: "Previous" },
      iconOnly: true,
      onClick: props.onPrevious
    },
    {
      key: "add",
      text: "Nieuw",
      iconProps: { iconName: "Add" },
      iconOnly: true,
      onClick: props.onAdd
    }
  ];

  const farItems = [
    {
      key: "delete",
      text: "Verwijderen",
      iconProps: { iconName: "Delete" },
      iconOnly: true,
      onClick: props.onDelete
    },
    {
      key: "selectNext",
      text: "Volgende",
      iconProps: { iconName: "Next" },
      iconOnly: true,
      onClick: props.onNext
    }
  ];

  return (
    <CommandBar items={items} farItems={farItems} />
  );
};

CvEditNavigator.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

export default CvEditNavigator;