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

        it.todo('should properly determine `getGridItemAbove`');

        it.todo('should properly determine `getGridItemBelow`');

        it.todo('should properly determine `getGridItemToTheLeft`');

        it.todo('should properly determine `getGridItemToTheRight`');
    });

    describe('General Functionality', () => {

        it.todo('should properly determine column count');

        it.todo('should properly determine row count');

        it.todo('should properly determine column-gap-width');

        it.todo('should properly determine the nth child');

        it.todo('should properly determine the width of a given child');

        it.todo('should properly assign classnames to children');

        it.todo('should recalculate values and classnames upon grid parent resize');
    });
});
