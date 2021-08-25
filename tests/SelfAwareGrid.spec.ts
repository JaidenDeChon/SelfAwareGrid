import SelfAwareGrid from '../src';

let gridElement: HTMLElement;
let gridObject: SelfAwareGrid;

/**
 * Populates the gridElement variable with all the data necessary.
 * Also instantiates a SelfAwareGrid object against which to run our tests.
 */
function createGridAndChildren () {

    gridElement = document.createElement('div') as HTMLElement;

    gridElement.style.width = '800px';
    gridElement.style.display = 'grid';
    gridElement.style.columnGap = '16px';
    gridElement.style.rowGap = '16px;'

    for (let i = 0; i < 21; i++) {
        const el = document.createElement('div') as HTMLElement;
        el.style.width = '64px';
        el.style.height = '64px';
        gridElement.appendChild(el);
    }

    gridObject = new SelfAwareGrid(gridElement);
}

/**
 * Due to the measurements set in the setup function `createGridAndChildren`:
 *
 *     Rows:
 *         * Children 0-9 should land on the top row
 *         * Children 10-19 should land on the middle row
 *         * Child 20 should land on the bottom row
 *
 *     Columns:
 *         * Children 0, 10, and 20 should land on the leftmost column
 *         * Children 9 and 19 should land on the rightmost column
 */

describe('SelfAwareGridTests', () => {

    beforeAll(() => {
        createGridAndChildren();
    });

    describe('Positional Status', () => {

        it('should properly determine `isTopRow`', () => {
            expect(gridObject.isTopRow(0)).toBe(true);
            expect(gridObject.isTopRow(4)).toBe(true);
            expect(gridObject.isTopRow(9)).toBe(true);
            expect(gridObject.isTopRow(19)).toBe(false);
        });

        it('should properly determine `isBottomRow`', () => {
            expect(gridObject.isBottomRow(20)).toBe(true);
            expect(gridObject.isBottomRow(19)).toBe(false);
        });

        it('should properly determine `isLeftColumn`', () => {
            expect(gridObject.isLeftColumn(0)).toBe(true);
            expect(gridObject.isLeftColumn(10)).toBe(true);
            expect(gridObject.isLeftColumn(20)).toBe(true);
            expect(gridObject.isLeftColumn(9)).toBe(false);
            expect(gridObject.isLeftColumn(11)).toBe(false);
        });

        it('should properly determine `isRightColumn`', () => {
            expect(gridObject.isRightColumn(9)).toBe(true);
            expect(gridObject.isRightColumn(19)).toBe(true);
            expect(gridObject.isRightColumn(8)).toBe(false);
            expect(gridObject.isRightColumn(10)).toBe(false);
        });

        it('should properly determine `isNthColumn`', () => {
            expect(gridObject.isNthColumn(4)).toBe(4);
        });

        it('should properly determine `isNthRow`', () => {
            expect(gridObject.isNthRow(15)).toBe(1);
        });
    });

    describe('Contextual Awareness', () => {

        it('should properly determine `getGridItemAbove`', () => {
            expect(gridObject.getGridItemAbove(15)).toBe(5);
        });

        it('should properly determine `getGridItemBelow`', () => {
            expect(gridObject.getGridItemBelow(2)).toBe(12);
        });

        it('should properly determine `getGridItemToTheLeft`', () => {
            expect(gridObject.getGridItemToTheLeft(1)).toBe(0);
        });

        it('should properly determine `getGridItemToTheRight`', () => {
            expect(gridObject.getGridItemToTheRight(17)).toBe(18);
        });
    });

    describe('General Functionality', () => {

        it('should properly determine column count', () => {
            expect(gridObject.columnCount()).toBe(10);
        });

        it('should properly determine row count', () => {
            expect(gridObject.rowCount()).toBe(3);
        });

        it('should properly determine column-gap-width', () => {
            expect(gridObject.columnGapWidth()).toBe(16);
        });

        it('should properly determine the nth child', () => {
            const thirdChild = gridElement.children[3] as Element;
            expect(gridObject.nth(3)).toStrictEqual(thirdChild);
        });

        it('should properly determine the width of a given child', () => {
            const thirdChild = gridElement.children[3] as Element;
            const thirdChildWidth = parseFloat(getComputedStyle(thirdChild).width);
            expect(gridObject.getElementWidth(thirdChild)).toBe(thirdChildWidth);
        });

        it('should properly assign classnames to children', () => {
            // Top left element
            expect(gridElement.children[0].classList).toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[0].classList).toContain('self-aware-grid__child--is-left-column');

            // Top middle element
            expect(gridElement.children[5].classList).toContain('self-aware-grid__child--is-top-row');

            // Top right element
            expect(gridElement.children[9].classList).toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[9].classList).toContain('self-aware-grid__child--is-right-column');

            // Middle left element
            expect(gridElement.children[10].classList).toContain('self-aware-grid__child--is-left-column');

            // Middle element
            expect(gridElement.children[15].classList).not.toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[15].classList).not.toContain('self-aware-grid__child--is-left-column');
            expect(gridElement.children[15].classList).not.toContain('self-aware-grid__child--is-right-column');
            expect(gridElement.children[15].classList).not.toContain('self-aware-grid__child--is-bottom-row');

            // Middle right element
            expect(gridElement.children[19].classList).toContain('self-aware-grid__child--is-right-column');

            // Bottom left element (is the last element in this case)
            expect(gridElement.children[20].classList).toContain('self-aware-grid__child--is-bottom-row');
            expect(gridElement.children[20].classList).toContain('self-aware-grid__child--is-left-column');

            // Test a few spots to ensure classes are not showing up where they shouldn't
            expect(gridElement.children[2].classList).not.toContain('self-aware-grid__child--is-bottom-row');
            expect(gridElement.children[7].classList).not.toContain('self-aware-grid__child--is-bottom-row');
            expect(gridElement.children[12].classList).not.toContain('self-aware-grid__child--is-bottom-row');
            expect(gridElement.children[12].classList).not.toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[17].classList).not.toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[17].classList).not.toContain('self-aware-grid__child--is-bottom-row');
            expect(gridElement.children[20].classList).not.toContain('self-aware-grid__child--is-top-row');
            expect(gridElement.children[20].classList).not.toContain('self-aware-grid__child--is-right-column');
        });

        it.todo('should recalculate values and classnames upon grid parent resize');
    });
});
