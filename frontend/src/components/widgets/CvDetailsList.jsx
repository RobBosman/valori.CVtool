import PropTypes from "prop-types";
import React from "react";
import { DetailsList, DetailsListLayoutMode, ScrollablePane, Selection, Sticky, StickyPositionType, TooltipHost } from "@fluentui/react";

export const CvDetailsList = (props) => {

  const { instanceId, setSelectedInstance } = props.instanceContext;
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
  }, [props.items, instanceId]);

  const mapLocaleFields = props.columns.map((column) => {
    const fieldPath = (column.fieldName || "").split(".");
    if (fieldPath.length === 2) {
      return {
        ...column,
        onRender: (instance) => instance[fieldPath[0]] && instance[fieldPath[0]][fieldPath[1]]
      };
    }
    return column;
  });

  const scrollStyle = {
    position: "relative",
    overflowY: "auto",
    height: "calc(100vh - 248px)",
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
          onColumnC
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