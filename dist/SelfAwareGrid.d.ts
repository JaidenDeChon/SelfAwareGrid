/**
 * SelfAwareGrid provides positional awareness for the children of a grid element.
 * This allows for certain behaviors which are not available natively in the browser, such as traversing a grid via
 * keyboard like a spreadsheet, custom styling based on grid-child element positions, etc.
 * Remember to call `destroy` when finished to prevent memory leaks due to the `ResizeObserver` on the parent element.
 * @public
 */
export default class SelfAwareGrid {
    private readonly _rootGridElement;
    private _children;
    private _minChildWidth;
    private _columnGapWidth;
    private _rowGapWidth;
    private _columnCount;
    private _rowCount;
    private _columnGapCount;
    private _rowGapCount;
    private readonly _parentClassNamePrefix;
    private readonly _childClassNamePrefix;
    private readonly topRowClassname;
    private readonly bottomRowClassname;
    private readonly leftColumnClassname;
    private readonly rightColumnClassname;
    private _localResizeObserver;
    private readonly _allowZeroColumns;
    /**
     * Constructor.
     * @param   { Element }   rootGridElement    Grid container element.
     * @param   { number }    minChildWidth      Allows for explicitly setting the width of smallest child.
     * @param   { boolean }   allowZeroColumns   Controls whether to allow the reporting of zero columns.
     * @public
     */
    constructor(rootGridElement: Element, minChildWidth?: number, allowZeroColumns?: boolean);
    /**
     * PRIVATE MEMBER FUNCTIONS
     *     - setCalculatedColumnCount
     *     - setCalculatedRowCount
     *     - setMeasuredColumnGapWidth
     *     - setMeasuredRowGapWidth
     *     - setCalculatedColumnGapCount
     *     - setCalculatedRowGapCount
     *     - setupChildren
     *     - assignClassNames
     *     - computeAllGridData
     */
    /**
     * Calculates how many columns the grid renders.
     * @private
     */
    private setCalculatedColumnCount;
    /**
     * Calculates how many rows the grid renders.
     * @private
     */
    private setCalculatedRowCount;
    /**
     * Calculates the width in pixels of the grid container's `grid-column-gap` or `column-gap` rule.
     * @private
     */
    private setMeasuredColumnGapWidth;
    /**
     * Calculates the width in pixels of the grid container's `grid-row-gap` or `column-gap` rule.
     * @private
     */
    private setMeasuredRowGapWidth;
    /**
     * Calculates the combined amount of gutters between columns.
     * @private
     */
    private setCalculatedColumnGapCount;
    /**
     * Calculates the combined amount of gutters between rows.
     * @private
     */
    private setCalculatedRowGapCount;
    /**
     * Assigns `self-aware-grid` classnames to each grid child.
     * @private
     */
    private assignClassNames;
    /**
     * Takes care of (re-)measuring grid values and assigning appropriate classnames.
     * @private
     */
    private computeAllGridData;
    /**
     * PUBLIC MEMBER FUNCTIONS: Positional Booleans
     *     - isTopRow
     *     - isBottomRow
     *     - isLeftColumn
     *     - isRightColumn
     *     - isNthColumn
     *     - isNthRow
     */
    /**
     * Determines whether the given grid-item is in the top row of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the top row.
     * @public
     */
    isTopRow(gridItemIndex: number): boolean;
    /**
     * Determines whether the given grid-item is in the bottom row of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the bottom row.
     * @public
     */
    isBottomRow(gridItemIndex: number): boolean;
    /**
     * Determines whether the given grid-item is in the left-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the left column.
     * @public
     */
    isLeftColumn(gridItemIndex: number): boolean;
    /**
     * Determines whether the given grid-item is in the right-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the right column.
     * @public
     */
    isRightColumn(gridItemIndex: number): boolean;
    /**
     * Returns which column the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    isNthColumn(childElementIndex: number): number;
    /**
     * Returns which row the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    isNthRow(childElementIndex: number): number;
    /**
     * PUBLIC MEMBER FUNCTIONS: Positional awareness
     *     - getGridItemAbove
     *     - getGridItemBelow
     *     - getGridItemToTheLeft
     *     - getGridItemToTheRight
     */
    /**
     * Determines the index of the grid item directly above this one.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    getGridItemAbove(gridItemIndex: number): number;
    /**
     * Determines the index of the grid item directly below this one.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    getGridItemBelow(gridItemIndex: number): number;
    /**
     * Determines the index of the previous grid item.
     * @param   { number }    gridItemIndex   The index of the grid-child in question.
     * @param   { boolean }   preventWrap     Controls whether the selection will wrap around to the opposite side.
     * @public
     */
    getGridItemToTheLeft(gridItemIndex: number, preventWrap?: boolean): number;
    /**
     * Determines the index of the next grid item.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    getGridItemToTheRight(gridItemIndex: number): number;
    /**
     * PUBLIC MEMBER FUNCTIONS: Generalized Functionality
     *     - columnCount
     *     - rowCount
     *     - columnGapWidth
     *     - nth
     *     - getElementWidth
     *     - setupChildren
     *     - measureAndSetAllGridValues
     *     - beginObservingResize
     *     - stopObservingResize
     *     - destroy
     */
    /**
     * Returns the amount of columns the grid renders.
     * @public
     */
    columnCount(): number;
    /**
     * Returns the amount of rows the grid renders.
     * @public
     */
    rowCount(): number;
    /**
     * Returns the CSS `grid-column-gap` setting of the gridContainer (in px).
     * @public
     */
    columnGapWidth(): number;
    /**
     * Returns the grid child (Element) at the given index.
     * @param    { number }   index   The index of the desired grid child.
     * @return   { Element }
     * @public
     */
    nth(index: number): Element | undefined;
    /**
     * Calculates the width (in pixels) of a given element.
     * @param    { Element }   el   Element who's width to calculate.
     * @return   { number }
     * @public
     */
    getElementWidth(el: Element): number;
    /**
     * Rounds up all children of the parent element, uses them to calculate grid measurements, and assigns proper
     * classnames.
     * @param   { number | undefined }   minChildWidth   Allows for specifying a minimum child width (in case widths
     * change dynamically etc)
     * @public
     */
    setupChildren(minChildWidth?: number): void;
    /**
     * Responsible for calculating the dimensions and quantities for the important private member variables.
     * @public
     */
    measureAndSetAllGridValues(): void;
    /**
     * Initializes the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    beginObservingResize(): void;
    /**
     * Kills the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    stopObservingResize(): void;
    /**
     * Cleans up internal references, event listeners, etc.
     * @public
     */
    destroy(): void;
}
//# sourceMappingURL=SelfAwareGrid.d.ts.map