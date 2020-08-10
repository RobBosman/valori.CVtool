import PropTypes from "prop-types";
import React from "react";
import { DetailsList, DetailsListLayoutMode, Selection } from "@fluentui/react";

export const CvDetailsList = (props) => {

  const { entityId, setSelectedInstance, locale } = props.instanceContext;
  const getKey = (item) => item._id;

  // Keep track of {selection} so we can use it outside the context of the DetailsList.
  const [selection] = React.useState(new Selection({
    items: props.items,
    getKey: getKey,
    onSelectionChanged: () => setSelectedInstance(selection.getSelection()[0]?._id)
  }));

  // Re-select current item when navigating back to this page.
  React.useEffect(() => {
    selection.setAllSelected(false);
    selection.setKeySelected(entityId, true, false);
  }, []);

  props.onExposeSelectionRef && props.onExposeSelectionRef(selection);

  const mapLocaleFields = props.columns.map((column) =>
    column.localeFieldName
      ? {
        ...column,
        fieldName: column.localeFieldName,
        onRender: (instance) => instance[column.localeFieldName] && instance[column.localeFieldName][locale]
      }
      : column
  );

  return (
    <DetailsList
      columns={mapLocaleFields}
      items={props.items}
      setKey={props.setKey}
      getKey={getKey}
      selection={selection}
      isHeaderVisible={true}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={1}
      selectionPreservedOnEmptyClick={true}
      onRenderItemColumn={props.onRenderItemColumn}
      onItemInvoked={props.onItemInvoked}/>
  );
};

CvDetailsList.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  setKey: PropTypes.string,
  onRenderItemColumn: PropTypes.func,
  onExposeSelectionRef: PropTypes.func,
  onItemInvoked: PropTypes.func
};