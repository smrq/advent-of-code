import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`), 3
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const locks = input.filter(grid => grid[0][0] === '#').map(parseGrid);
	const keys = input.filter(grid => grid[0][0] === '.').map(parseGrid);
	const space = input[0].length - 2;

	let result = 0;
	for (let lock of locks) {
		for (let key of keys) {
			if (lock.every((l, i) => l + key[i] <= space)) {
				++result;
			}
		}
	}

	return result;
}

function parseGrid(grid) {
	return L.transpose(grid.slice(1, -1)).map(row => row.filter(c => c === '#').length);
}

function parseInput(str) {
	return L.autoparse(str);
}
