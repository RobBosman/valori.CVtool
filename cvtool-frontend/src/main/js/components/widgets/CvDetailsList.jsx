import PropTypes from "prop-types";
import React from "react";
import { DetailsList, DetailsListLayoutMode, ScrollablePane, Selection, SelectionMode, Sticky, StickyPositionType, TooltipHost } from "@fluentui/react";
import * as commonUtils from "../../utils/CommonUtils";

export const CvDetailsList = (props) => {

  const { instanceId, setSelectedInstanceId } = props.instanceContext;
  const getKey = (item) => item?._id;
  
  // Keep track of {selection} so we can use it outside the context of the DetailsList.
  const [selection] = React.useState(new Selection({
    items: props.items,
    getKey: getKey,
    onSelectionChanged: () => setSelectedInstanceId(getKey(selection.getSelection()[0]))
  }));
  const [sortingBy, setSortingBy] = React.useState({
    fieldName: props.columns[0]?.fieldName,
    isSortedDescending: props.columns[0]?.isSortedDescending
  });

  // Re-select current item when navigating back to this page.
  React.useLayoutEffect(() => {
    props.items
      .map(getKey)
      .forEach(key => selection.setKeySelected(key, key === instanceId), false);
  }, [props.items, instanceId]);

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

  const onSort = (orgOnColumnClick) => (event, column) => {
    setSortingBy({
      fieldName: column?.fieldName,
      isSortedDescending: column.isSorted && !column.isSortedDescending
    });
    return orgOnColumnClick?.(event, column);
  };

  const sortableColumns = React.useMemo(() =>
    props.columns
      .map(column => {
        const fieldPath = column.fieldName?.split(".", 2) || [];
        const isSortColumn = sortingBy.fieldName === column.fieldName;
        return {
          isSorted: isSortColumn,
          isSortedDescending: isSortColumn && sortingBy?.isSortedDescending,
          onRender: fieldPath.length === 2
            ? instance => instance[fieldPath[0]]?.[fieldPath[1]]
            : column.onRender,
          ...column,
          onColumnClick: onSort(column.onColumnClick)
        };
      }),
  [props.columns, sortingBy]);

  const sortedItems = React.useMemo(() =>
    props.items
      .slice(0)
      .sort((l, r) => sortingBy.isSortedDescending
        ? commonUtils.compareItemsByField(r, l, sortingBy.fieldName)
        : commonUtils.compareItemsByField(l, r, sortingBy.fieldName)
      ),
  [props.items, sortingBy]);

  return (
    <div style={scrollStyle}>
      <ScrollablePane>
        <DetailsList
          columns={sortableColumns}
          items={sortedItems}
          setKey={props.setKey}
          getKey={getKey}
          selection={selection}
          selectionMode={props.selectionMode === undefined ? SelectionMode.single : props.selectionMode}
          isHeaderVisible={true}
          layoutMode={DetailsListLayoutMode.justified}
          compact={true}
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
  selectionMode: PropTypes.number,
  dragDropEvents: PropTypes.object,
  setKey: PropTypes.string,
  onRenderItemColumn: PropTypes.func,
  onItemInvoked: PropTypes.func,
  styles: PropTypes.object,
  scrollStyle: PropTypes.object
};