import PropTypes from "prop-types";
import React from "react";
import { DetailsList, DetailsListLayoutMode, ScrollablePane, Selection, Sticky, StickyPositionType, TooltipHost } from "@fluentui/react";

export const CvDetailsList = (props) => {

  const { instanceId, setSelectedInstance, locale } = props.instanceContext;
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
    selection.setKeySelected(instanceId, true, false);
  }, [instanceId]);

  const mapLocaleFields = props.columns.map((column) =>
    column.localeFieldName
      ? {
        ...column,
        fieldName: column.localeFieldName,
        onRender: (instance) => instance[column.localeFieldName] && instance[column.localeFieldName][locale]
      }
      : column
  );

  const scrollStyle = {
    position: "relative",
    overflowY: "auto",
    // width: "calc(50vw - 98px)",
    height: "calc(100vh - 250px)",
    ...props.scrollStyle
  };

  
  const onRenderDetailsHeader = (props, defaultRender) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip = tooltipHostProps => (
      <TooltipHost {...tooltipHostProps} />
    );
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  return (
    <div style={scrollStyle}>
      <ScrollablePane>
        <DetailsList
          columns={mapLocaleFields}
          items={props.items}
          setKey={props.setKey}
          getKey={getKey}
          selection={selection}
          selectionMode={1}
          isHeaderVisible={true}
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
          onRenderDetailsHeader={onRenderDetailsHeader}
          onRenderItemColumn={props.onRenderItemColumn}
          dragDropEvents={props.dragDropEvents}
          onItemInvoked={props.onItemInvoked}
          styles={props.styles}
        />
      </ScrollablePane>
    </div>
  );
};

CvDetailsList.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  dragDropEvents: PropTypes.object,
  setKey: PropTypes.string,
  onRenderItemColumn: PropTypes.func,
  onItemInvoked: PropTypes.func,
  styles: PropTypes.object,
  scrollStyle: PropTypes.object
};