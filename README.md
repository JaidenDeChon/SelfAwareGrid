# SelfAwareGrid

SelfAwareGrid was created to add additional functionality to CSS grid, such as:
- **Responsively** styling specific grid columns, rows, and cells -- no more hard-coding a grid width for every
  resolution your app supports. You can now style rows and columns independently and without hard-coding an nth-column.
- Enabling excel-like keyboard navigation of grid cells.

## Usage

SelfAwareGrid works by instantiating a new `SelfAwareGrid` object using a grid element as an argument.

* _Todo - Add an import statement example once the package is created_

```javascript
const myGrid = document.getElementById('my-grid-element');
const myGridObject = new SelfAwareGrid(myGrid);
```

Optionally, you can provide two additional arguments when instantiating your SelfAwareGrid object. The first argument,
`minChildWidth`, allows you to provide a number to represent the minimum width of the grid children. This is useful for
when grid children have different widths.* The second argument controls whether you want SelfAwareGrid to report when
it is zero columns wide-- that is, when the width of the grid becomes less than that of a single column, SelfAwareGrid
will report that the grid is zero columns wide unless you use `false` here, in which case SelfAwareGrid will report
the grid as a minimum of one column wide.

\* SelfAwareGrid does not yet have the capability of handling children of differing widths. Classnames or other
functionality will be unreliable without uniform child widths.

SelfAwareGrid then measures the width of the element you gave it. The reason it's important you provide an element with
`display: grid` is because certain grid-specific values will then also be measured. SelfAwareGrid takes into account the
`grid-column-gap`, as well as the width of the children, and uses some pretty straightforward arithmetic to determine
how many columns sthe grid should be.

## Classnames

With this information, SelfAwareGrid can then determine which grid children are in the left/right columns, which are on
the top/bottom row, and which aren't any of those 4 but are somewhere in the middle. These grid children are then given
classnames indicating their position in the grid. For example, a grid element on the top row will receive the classname
`self-aware-grid__child--is-top-row`.

The grid element and each child are also given classnames independent of their position. The parent will receive
`self-aware-grid` while each child will receive `self-aware-grid__child` and an "index" class: 
`self-aware-grid__child--x` where "x" is its index in the parent. `0` for the first element, `1` for the next and so on.

## API

SelfAwareGrid exposes several functions for various bits of information about the grid. Given the same variable
we instantiated earlier, you can access the following:

### Positional Status
Provide an index and receive position information on a given grid child.

```javascript
// Determines whether the given grid-item is in the top row of the grid.
myGridObject.isTopRow(5);
```

```javascript
// Determines whether the given grid-item is in the bottom row of the grid.
myGridObject.isBottomRow(5);
```

```javascript
// Determines whether the given grid-item is in the left-most column of the grid.
myGridObject.isLeftColumn(5);
```

```javascript
// Determines whether the given grid-item is in the right-most column of the grid.
myGridObject.isRightColumn(5);
```

```javascript
// Returns which column the given grid-item is in (zero-based). -1 if the element was not found.
myGridObject.isNthColumn(5);
```

```javascript
// Returns which row the given grid-item is in (zero-based). -1 if the element was not found.
myGridObject.isNthRow(5);
```

### Contextual Awareness
Provide an index and receive position information of nearby grid children.

```javascript
// Determines the index of the grid item directly above this one.
myGridObject.getGridItemAbove();
```

```javascript
// Determines the index of the grid item directly below this one.
myGridObject.getGridItemBelow();
```

```javascript
// Determines the index of the previous grid item.
myGridObject.getGridItemToTheLeft();
```

```javascript
// Determines the index of the next grid item.
myGridObject.getGridItemToTheRight();
```

### General Functionality


```javascript
// Returns the amount of columns the grid renders.
myGridObject.columnCount();
```

```javascript
// Returns the amount of rows the grid renders.
myGridObject.rowCount();
```

```javascript
// Returns the CSS grid-column-gap setting of the gridContainer (in px).
myGridObject.columnGapWidth();
```

```javascript
// Returns the grid child (Element) at the given index.
myGridObject.nth();
```

```javascript
// Calculates the width (in pixels) of a given element.
myGridObject.getElementWidth();
```

```javascript
// Rounds up all children of the parent element, uses them to calculate grid measurements, and assigns
// proper classnames.
myGridObject.setupChildren();
```

```javascript
// Responsible for calculating the dimensions and quantities for the important private member variables.
myGridObject.measureAndSetAllGridValues();
```

```javascript
// Initializes the ResizeObserver assigned to the gridContainer element.
myGridObject.beginObservingResize();
```

```javascript
// Kills the ResizeObserver assigned to the gridContainer element.
myGridObject.stopObservingResize();
```

```javascript
// Cleans up internal references, event listeners, etc.
myGridObject.destroy();
```

## Demo

* _Todo - Create and link to a demo once the package is created_
