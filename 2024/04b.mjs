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
MXMXAXMASX`), 9
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let count = 0;
	for (let y = 1; y < input.length - 1; ++y) {
		for (let x = 1; x < input[y].length - 1; ++x) {
			count += search(input, x, y);
		}
	}
	return count;
}

function search(grid, x, y) {
	const str1 = grid[y-1][x-1] + grid[y][x] + grid[y+1][x+1];
	const str2 = grid[y-1][x+1] + grid[y][x] + grid[y+1][x-1];
	if ((str1 === 'MAS' || str1 === 'SAM') && (str2 === 'MAS' || str2 === 'SAM')) {
		return 1;
	}
	return 0;
}

function parseInput(str) {
	return L.autoparse(str);
}
