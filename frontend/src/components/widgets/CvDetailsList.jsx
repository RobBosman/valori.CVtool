import PropTypes from "prop-types";
import React from "react";
import { DetailsList, DetailsListLayoutMode, Selection } from "@fluentui/react";

const CvDetailsList = (props) => {

  const { entityId, selectInstance } = props.instanceContext;
  const getKey = (item) => item._id;

  // Keep track of {selection} so we can use it outside the context of the DetailsList.
  const [selection] = React.useState(new Selection({
    items: props.items,
    getKey: getKey,
    onSelectionChanged: () => selectInstance(selection.getSelection()[0]?._id)
  }));

  // Re-select current item when navigating back to this page.
  React.useEffect(() => selection.setKeySelected(entityId, true, false), []);

  props.onExposeSelectionRef && props.onExposeSelectionRef(selection);

  return (
    <DetailsList
      columns={props.columns}
      items={props.items}
      setKey={props.setKey}
      getKey={getKey}
      selection={selection}
      isHeaderVisible={true}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={1}
      selectionPreservedOnEmptyClick={true} />
  );
};

CvDetailsList.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  setKey: PropTypes.string,
  onExposeSelectionRef: PropTypes.func
};

export default CvDetailsList;