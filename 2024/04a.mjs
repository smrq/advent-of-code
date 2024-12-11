import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`), 18
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let count = 0;
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			count += search(input, x, y);
		}
	}
	return count;
}

function search(grid, x, y) {
	let count = 0;
	for (let [dx, dy] of L.orthodiagonalOffsets(2)) {
		if (!inBounds(grid, x + 3*dx, y + 3*dy)) {
			continue;
		}
		let str = '';
		for (let n = 0; n < 4; ++n) {
			str += grid[y + n*dy][x + n*dx];
		}
		if (str === 'XMAS') {
			++count;
		}
	}
	return count;
}

function inBounds(grid, row, col) {
	return row >= 0 &&
		row < grid.length &&
		col >= 0 &&
		col < grid[row].length;
}

function parseInput(str) {
	return L.autoparse(str);
}
