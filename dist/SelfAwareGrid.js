"use strict";
/// <reference types="resize-observer-browser" />
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SelfAwareGrid provides positional awareness for the children of a grid element.
 * This allows for certain behaviors which are not available natively in the browser, such as traversing a grid via
 * keyboard like a spreadsheet, custom styling based on grid-child element positions, etc.
 * Remember to call `destroy` when finished to prevent memory leaks due to the `ResizeObserver` on the parent element.
 * @public
 */
var SelfAwareGrid = /** @class */ (function () {
    /**
     * Constructor.
     * @param   { Element }   rootGridElement    Grid container element.
     * @param   { number }    minChildWidth      Allows for explicitly setting the width of smallest child.
     * @param   { boolean }   allowZeroColumns   Controls whether to allow the reporting of zero columns.
     * @public
     */
    function SelfAwareGrid(rootGridElement, minChildWidth, allowZeroColumns) {
        var _this = this;
        if (allowZeroColumns === void 0) { allowZeroColumns = true; }
        this._parentClassNamePrefix = 'self-aware-grid';
        this._childClassNamePrefix = 'self-aware-grid__child';
        this.topRowClassname = this._childClassNamePrefix + '--is-top-row';
        this.bottomRowClassname = this._childClassNamePrefix + '--is-bottom-row';
        this.leftColumnClassname = this._childClassNamePrefix + '--is-left-column';
        this.rightColumnClassname = this._childClassNamePrefix + '--is-right-column';
        // Set up observer and other private variables that can be set immediately.
        this._rootGridElement = rootGridElement;
        this._rootGridElement.classList.add(this._parentClassNamePrefix);
        this._rootGridElement.addEventListener('DOMSubtreeModified', function () { return _this.setupChildren(); });
        // Set up the private variables that can be set immediately.
        this._allowZeroColumns = allowZeroColumns;
        // Measure all relevant grid values and assign appropriate classnames.
        this.setupChildren();
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
     *     - computeAllGridData
     */
    /**
     * Calculates how many columns the grid renders.
     * @private
     */
    SelfAwareGrid.prototype.setCalculatedColumnCount = function () {
        var _a, _b;
        var rootElementWidth = this.getElementWidth(this._rootGridElement);
        var gridItemWidth = (_b = (_a = this._minChildWidth) !== null && _a !== void 0 ? _a : this.getElementWidth(this._children[0])) !== null && _b !== void 0 ? _b : 0;
        var itemsAcross = 1 + Math.floor((rootElementWidth - gridItemWidth) / (gridItemWidth + this._columnGapWidth));
        if (this._allowZeroColumns) {
            this._columnCount = itemsAcross;
        }
        else {
            this._columnCount = itemsAcross < 1 ? 1 : itemsAcross;
        }
    };
    /**
     * Calculates how many rows the grid renders.
     * @private
     */
    SelfAwareGrid.prototype.setCalculatedRowCount = function () {
        this._rowCount = Math.ceil(this._children.length / this._columnCount);
    };
    /**
     * Calculates the width in pixels of the grid container's `grid-column-gap` or `column-gap` rule.
     * @private
     */
    SelfAwareGrid.prototype.setMeasuredColumnGapWidth = function () {
        var gridColumnGap = parseFloat(getComputedStyle(this._rootGridElement).gridColumnGap);
        var columnGap = parseFloat(getComputedStyle(this._rootGridElement).columnGap);
        this._columnGapWidth = !isNaN(gridColumnGap) ? gridColumnGap : columnGap;
    };
    /**
     * Calculates the width in pixels of the grid container's `grid-row-gap` or `column-gap` rule.
     * @private
     */
    SelfAwareGrid.prototype.setMeasuredRowGapWidth = function () {
        var gridRowGap = parseFloat(getComputedStyle(this._rootGridElement).gridRowGap);
        var rowGap = parseFloat(getComputedStyle(this._rootGridElement).rowGap);
        this._rowGapWidth = !isNaN(gridRowGap) ? gridRowGap : rowGap;
    };
    /**
     * Calculates the combined amount of gutters between columns.
     * @private
     */
    SelfAwareGrid.prototype.setCalculatedColumnGapCount = function () {
        this._columnGapCount = this._columnCount - 1;
    };
    /**
     * Calculates the combined amount of gutters between rows.
     * @private
     */
    SelfAwareGrid.prototype.setCalculatedRowGapCount = function () {
        this._rowGapCount = this._rowCount - 1;
    };
    /**
     * Assigns `self-aware-grid` classnames to each grid child.
     * @private
     */
    SelfAwareGrid.prototype.assignClassNames = function () {
        var _this = this;
        for (var index = 0; index < this._children.length; index++) {
            var child = this._children[index];
            __spreadArray([], __read(child.classList)).filter(function (classname) { return !classname.startsWith(_this._childClassNamePrefix); });
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
    };
    /**
     * Takes care of (re-)measuring grid values and assigning appropriate classnames.
     * @private
     */
    SelfAwareGrid.prototype.computeAllGridData = function () {
        this.measureAndSetAllGridValues();
        this.assignClassNames();
    };
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
    SelfAwareGrid.prototype.isTopRow = function (gridItemIndex) {
        return gridItemIndex < this._columnCount;
    };
    /**
     * Determines whether the given grid-item is in the bottom row of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the bottom row.
     * @public
     */
    SelfAwareGrid.prototype.isBottomRow = function (gridItemIndex) {
        var columns = this._columnCount;
        var rows = this._rowCount;
        var highestPotentialIndex = rows * columns - 1;
        return gridItemIndex >= highestPotentialIndex - columns + 1;
    };
    /**
     * Determines whether the given grid-item is in the left-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the left column.
     * @public
     */
    SelfAwareGrid.prototype.isLeftColumn = function (gridItemIndex) {
        return this.isNthColumn(gridItemIndex) === 0;
    };
    /**
     * Determines whether the given grid-item is in the right-most column of the grid.
     * @param   { number }   gridItemIndex   The index of the grid-child for which to check the right column.
     * @public
     */
    SelfAwareGrid.prototype.isRightColumn = function (gridItemIndex) {
        return this.isNthColumn(gridItemIndex) === this._columnCount - 1;
    };
    /**
     * Returns which column the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    SelfAwareGrid.prototype.isNthColumn = function (childElementIndex) {
        if (!this._children[childElementIndex]) {
            return -1;
        }
        return childElementIndex % this._columnCount;
    };
    /**
     * Returns which row the given grid-item is in (zero-based). -1 if the element was not found.
     * @param   { number }   childElementIndex   The index of the grid-child to provide.
     * @public
     */
    SelfAwareGrid.prototype.isNthRow = function (childElementIndex) {
        if (!this._children[childElementIndex]) {
            return -1;
        }
        return Math.floor(childElementIndex / this._columnCount);
    };
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
    SelfAwareGrid.prototype.getGridItemAbove = function (gridItemIndex) {
        return this.isTopRow(gridItemIndex)
            ? 0
            : gridItemIndex - this._columnCount;
    };
    /**
     * Determines the index of the grid item directly below this one.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    SelfAwareGrid.prototype.getGridItemBelow = function (gridItemIndex) {
        return this.isBottomRow(gridItemIndex)
            ? this._children.length - 1
            : gridItemIndex + this._columnCount;
    };
    /**
     * Determines the index of the previous grid item.
     * @param   { number }    gridItemIndex   The index of the grid-child in question.
     * @param   { boolean }   preventWrap     Controls whether the selection will wrap around to the opposite side.
     * @public
     */
    SelfAwareGrid.prototype.getGridItemToTheLeft = function (gridItemIndex, preventWrap) {
        if (preventWrap) {
            return this.isNthColumn(gridItemIndex) === 0 ? gridItemIndex : gridItemIndex - 1;
        }
        else {
            return gridItemIndex - 1;
        }
    };
    /**
     * Determines the index of the next grid item.
     * @param   { number }   gridItemIndex   The index of the grid-child in question.
     * @public
     */
    SelfAwareGrid.prototype.getGridItemToTheRight = function (gridItemIndex) {
        return gridItemIndex <= this._children.length ? gridItemIndex + 1 : gridItemIndex;
    };
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
    SelfAwareGrid.prototype.columnCount = function () {
        return this._columnCount;
    };
    /**
     * Returns the amount of rows the grid renders.
     * @public
     */
    SelfAwareGrid.prototype.rowCount = function () {
        return this._rowCount;
    };
    /**
     * Returns the CSS `grid-column-gap` setting of the gridContainer (in px).
     * @public
     */
    SelfAwareGrid.prototype.columnGapWidth = function () {
        return this._columnGapWidth;
    };
    /**
     * Returns the grid child (Element) at the given index.
     * @param    { number }   index   The index of the desired grid child.
     * @return   { Element }
     * @public
     */
    SelfAwareGrid.prototype.nth = function (index) {
        return this._children[index];
    };
    /**
     * Calculates the width (in pixels) of a given element.
     * @param    { Element }   el   Element who's width to calculate.
     * @return   { number }
     * @public
     */
    SelfAwareGrid.prototype.getElementWidth = function (el) {
        return parseFloat(getComputedStyle(el).width);
    };
    /**
     * Rounds up all children of the parent element, uses them to calculate grid measurements, and assigns proper
     * classnames.
     * @param   { number | undefined }   minChildWidth   Allows for specifying a minimum child width (in case widths
     * change dynamically etc)
     * @public
     */
    SelfAwareGrid.prototype.setupChildren = function (minChildWidth) {
        this._children = this._rootGridElement.children;
        this._minChildWidth = this._children[0]
            ? minChildWidth !== null && minChildWidth !== void 0 ? minChildWidth : this.getElementWidth(this._children[0])
            : 0;
        this.computeAllGridData();
    };
    /**
     * Responsible for calculating the dimensions and quantities for the important private member variables.
     * @public
     */
    SelfAwareGrid.prototype.measureAndSetAllGridValues = function () {
        this.setMeasuredColumnGapWidth();
        this.setMeasuredRowGapWidth();
        this.setCalculatedColumnCount();
        this.setCalculatedRowCount();
        this.setCalculatedColumnGapCount();
        this.setCalculatedRowGapCount();
    };
    /**
     * Initializes the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    SelfAwareGrid.prototype.beginObservingResize = function () {
        var _this = this;
        this._localResizeObserver = new ResizeObserver(function () {
            _this.computeAllGridData();
        });
        this._localResizeObserver.observe(this._rootGridElement);
    };
    /**
     * Kills the ResizeObserver assigned to the gridContainer element.
     * @public
     */
    SelfAwareGrid.prototype.stopObservingResize = function () {
        this._localResizeObserver.unobserve(this._rootGridElement);
    };
    /**
     * Cleans up internal references, event listeners, etc.
     * @public
     */
    SelfAwareGrid.prototype.destroy = function () {
        var _this = this;
        // Add additional statements or calls as needed
        this.stopObservingResize();
        this._rootGridElement.removeEventListener('DOMSubtreeModified', function () { return _this.setupChildren(); });
    };
    return SelfAwareGrid;
}());
exports.default = SelfAwareGrid;
//# sourceMappingURL=SelfAwareGrid.js.map