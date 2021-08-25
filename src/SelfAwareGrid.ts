/// <reference types="resize-observer-browser" />

/**
 * SelfAwareGrid provides positional awareness for the children of a grid element.
 * This allows for certain behaviors which are not available natively in the browser, such as traversing a grid via
 * keyboard like a spreadsheet, custom styling based on grid-child element positions, etc.
 * Remember to call `destroy` when finished to prevent memory leaks due to the `ResizeObserver` on the parent element.
 * @public
 */
export default class SelfAwareGrid {

    private readonly _rootGridElement: Element;
    private _children!: HTMLCollection;

    private _minChildWidth!: number;
    private _columnGapWidth!: number;
    private _rowGapWidth!: number;
    private _columnCount!: number;
    private _rowCount!: number;
    private _columnGapCount!: number;
    private _rowGapCount!: number;

    private readonly _parentClassNamePrefix = 'self-aware-grid';
    private readonly _childClassNamePrefix = 'self-aware-grid__child';
    private readonly topRowClassname = this._childClassNamePrefix + '--is-top-row';
    private readonly bottomRowClassname = this._childClassNamePrefix + '--is-bottom-row';
    private readonly leftColumnClassname = this._childClassNamePrefix + '--is-left-column';
    private readonly rightColumnClassname = this._childClassNamePrefix + '--is-right-column';

    private _localResizeObserver!: ResizeObserver;

    private readonly _allowZeroColumns: boolean;

    /**
     * Constructor.
     * @param   { Element }   rootGridElement    Grid container element.
     * @param   { number }    minChildWidth      Allows for explicitly setting the width of smallest child.
     * @param   { boolean }   allowZeroColumns   Controls whether to allow the reporting of zero columns.
     * @public
     */
    constructor (rootGridElement: Element, minChildWidth?: number, allowZeroColumns = true) {
        // Set up the root grid element and begin observing it for changes in content.
        this._rootGridElement = rootGridElement;
        this._rootGridElement.classList.add(this._parentClassNamePrefix);
        this._rootGridElement.addEventListener('DOMSubtreeModified', () => this.setupChildren());

        // Set up the private variables that can be set immediately.
        this._allowZeroColumns = allowZeroColumns;

        this.setupChildren(minChildWidth);

        this.measureAndSetAllGridValues();
    }

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
     *     - handleResize
     */

    /**
     * Calculates how many columns the grid renders.
     * @private
     */
    private setCalculatedColumnCount (): void {
        const rootElementWidth = this.getElementWidth(this._rootGridElement);
        const gridItemWidth = this._minChildWidth ?? this.getElementWidth(this._children[0]) ?? 0;
        const itemsAcross =
            1 + Math.floor((rootElementWidth - gridItemWidth) / (gridItemWidth + this._columnGapWidth));

        if (this._allowZeroColumns) {
            this._columnCount = itemsAcross;
        } else {
            this._columnCount = itemsAcross < 1 ? 1 : itemsAcross;
        }
    }

    /**
     * Calculates how many rows the grid renders.
     * @private
     */
    private setCalculatedRowCount (): void {
        this._rowCount = Math.ceil(this._children.length / this._columnCount);
    }

    /**
     * Calculates the width in pixels of the grid container's `grid-column-gap` or `column-gap` rule.
     * @private
     */
    private setMeasuredColumnGapWidth (): void {
        const gridColumnGap = parseFloat(getComputedStyle(this._rootGridElement).gridColumnGap);
        const columnGap = parseFloat(getComputedStyle(this._rootGridElement).columnGap);
        this._columnGapWidth = !isNaN(gridColumnGap) ? gridColumnGap : columnGap;
    }

    /**
     * Calculates the width in pixels of the grid container's `grid-row-gap` or `column-gap` rule.
     * @private
     */
    private setMeasuredRowGapWidth (): void {
        const gridRowGap = parseFloat(getComputedStyle(this._rootGridElement).gridRowGap);
        const rowGap = parseFloat(getComputedStyle(this._rootGridElement).rowGap);

        this._rowGapWidth = !isNaN(gridRowGap) ? gridRowGap : rowGap;
    }

    /**
     * Calculates the combined amount of gutters between columns.
     * @private
     */
    private setCalculatedColumnGapCount (): void {
        this._columnGapCount = this._columnCount - 1;
    }

    /**
     * Calculates the combined amount of gutters between rows.
     * @private
     */
    private setCalculatedRowGapCount (): void {
        this._rowGapCount = this._rowCount - 1;
    }

    /**
     * Assigns `self-aware-grid` classnames to each grid child.
     * @private
     */
    private assignClassNames (): void {

        for (let index = 0; index < this._children.length; index++) {

            const child = this._children[index];

            [...child.classList].filter(classname => !classname.startsWith(this._childClassNamePrefix));
            child.classList.add(this._childClassNamePrefix);
            child.classList.add(this._childClassNamePrefix + '--' + index);

            // Assign or replace position-dependent classnames.

            this.isTopRow(index)
                ? child.classList.add(this.topRowClassname)
                : child.classList.remove(this.topRowClassname);

            this.isBottomRow(index) && !this.isTopRow(index)
                ? child.classList.add(this.bottomRowClassname)
                : child.classList.remove(this.bottomRowClassname);

            this.isLeftColumn(index)
                ? child.classList.add(this.leftColumnClassname)
                : child.classList.remove(this.leftColumnClassname);

            this.isRightColumn(index) && !this.isLeftColumn(index)
                ? child.classList.add(this.rightColumnClassname)
                : child.classList.remove(this.rightColumnClassname);
        }
    }

    /**
     * Takes care of re-measuring grid values and assigning appropriate classnames.
     * @private
     */
    private handleResize (): void {
        this.measureAndSetAllGridValues();
        this.assignClassNames();
    }

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
    public isTopRow (gridItemIndex: number): boolean {
        return gridItemIndex < this._columnCount;
    }

    /**
     * Determines whether the given grid-item is in the bottom row of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the bottom row.
     * @public
     */
    public isBottomRow (gridItemIndex: number): boolean {
        const columns = this._columnCount;
        const rows = this._rowCount;
        const highestPotentialIndex = rows * columns - 1;
        return gridItemIndex >= highestPotentialIndex - columns + 1;
    }

    /**
     * Determines whether the given grid-item is in the left-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the left column.
     * @public
     */
    public isLeftColumn (gridItemIndex: number): boolean {
        return this.isNthColumn(gridItemIndex) === 0;
    }

    /**
     * Determines whether the given grid-item is in the right-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the right column.
     * @public
     */
    public isRightColumn (gridItemIndex: number): boolean {
        return this.isNthColumn(gridItemIndex) === this._columnCount - 1;
    }

    /**
     * Returns which column the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    public isNthColumn (childElementIndex: number): number {
        if (!this._children[childElementIndex]) {
            return -1;
        }
        return childElementIndex % this._columnCount;
    }

    /**
     * Returns which row the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    public isNthRow (childElementIndex: number): number {
        if (!this._children[childElementIndex]) {
            return -1;
        }
        return Math.floor(childElementIndex / this._columnCount);
    }

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
    public getGridItemAbove (gridItemIndex: number): number {
        return this.isTopRow(gridItemIndex)
            ? 0
            : gridItemIndex - this._columnCount;
    }

    /**
     * Determines the index of the grid item directly below this one.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    public getGridItemBelow (gridItemIndex: number): number {
        return this.isBottomRow(gridItemIndex)
            ? this._children.length - 1
            : gridItemIndex + this._columnCount;
    }

    /**
     * Determines the index of the previous grid item.
     * @param   { number }    gridItemIndex   The index of the grid-child in question.
     * @param   { boolean }   preventWrap     Controls whether the selection will wrap around to the opposite side.
     * @public
     */
    public getGridItemToTheLeft (gridItemIndex: number, preventWrap?: boolean): number {
        if (preventWrap) {
            return this.isNthColumn(gridItemIndex) === 0 ? gridItemIndex : gridItemIndex - 1;
        } else {
            return gridItemIndex - 1;
        }
    }

    /**
     * Determines the index of the next grid item.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    public getGridItemToTheRight (gridItemIndex: number): number {
        return gridItemIndex <= this._children.length ? gridItemIndex + 1 : gridItemIndex;
    }

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
    public columnCount (): number {
        return this._columnCount;
    }

    /**
     * Returns the amount of rows the grid renders.
     * @public
     */
    public rowCount (): number {
        return this._rowCount;
    }

    /**
     * Returns the CSS `grid-column-gap` setting of the gridContainer (in px).
     * @public
     */
    public columnGapWidth (): number {
        return this._columnGapWidth;
    }

    /**
     * Returns the grid child (Element) at the given index.
     * @param    { number }   index   The index of the desired grid child.
     * @return   { Element }
     * @public
     */
    public nth (index: number): Element | undefined {
        return this._children[index];
    }

    /**
     * Calculates the width (in pixels) of a given element.
     * @param    { Element }   el   Element who's width to calculate.
     * @return   { number }
     * @public
     */
    public getElementWidth (el: Element): number {
        return parseFloat(getComputedStyle(el).width);
    }

    /**
     * Rounds up all children of the parent element, uses them to calculate grid measurements, and assigns proper
     * classnames.
     * @param   { number | undefined }   minChildWidth   Allows for specifying a minimum child width (in case widths
     * change dynamically etc)
     * @public
     */
    public setupChildren (minChildWidth?: number): void {
        this._children = this._rootGridElement.children;

        this._minChildWidth = this._children[0]
            ? minChildWidth ?? this.getElementWidth(this._children[0])
            : 0;

        this.measureAndSetAllGridValues();
        this.assignClassNames();
    }

    /**
     * Responsible for calculating the dimensions and quantities for the important private member variables.
     * @public
     */
    public measureAndSetAllGridValues (): void {
        this.setMeasuredColumnGapWidth();
        this.setMeasuredRowGapWidth();
        this.setCalculatedColumnCount();
        this.setCalculatedRowCount();
        this.setCalculatedColumnGapCount();
        this.setCalculatedRowGapCount();
    }

    /**
     * Initializes the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    public beginObservingResize (): void {
        this._localResizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        this._localResizeObserver.observe(this._rootGridElement);
    }

    /**
     * Kills the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    public stopObservingResize (): void {
        this._localResizeObserver.unobserve(this._rootGridElement);
    }

    /**
     * Cleans up internal references, event listeners, etc.
     * @public
     */
    public destroy (): void {
        // Add additional statements or calls as needed
        this.stopObservingResize();
        this._rootGridElement.removeEventListener('DOMSubtreeModified', () => this.setupChildren());
    }
}
