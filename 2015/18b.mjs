import { getRawInput, runTests } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
	[parseInput(
`.#.#.#
...##.
#....#
..#...
#.#..#
####..`
	), 5],
	17,
]);

console.log(run(input, 100));

function run(grid, steps) {
	grid[0][0] = true;
	grid[0][grid[0].length-1] = true;
	grid[grid.length-1][0] = true;
	grid[grid.length-1][grid[0].length-1] = true;

	for (let n = 0; n < steps; ++n) {
		grid = grid.map((line, y) => line.map((c, x) => {
			let count = 0;
			for (let yy = y-1; yy <= y+1; ++yy) {
				if (yy < 0) continue;
				if (yy >= grid.length) continue;
				for (let xx = x-1; xx <= x+1; ++xx) {
					if (xx < 0) continue;
					if (xx >= line.length) continue;
					if (y === yy && x === xx) continue;
					if (grid[yy][xx]) {
						++count;
					}
				}
			}
			return c ? (count === 2 || count === 3) :
				(count === 3);
		}));
		grid[0][0] = true;
		grid[0][grid[0].length-1] = true;
		grid[grid.length-1][0] = true;
		grid[grid.length-1][grid[0].length-1] = true;
	}
	return grid.reduce((acc, line) => acc + line.reduce((acc, c) => c ? acc+1 : acc, 0), 0);
}

function parseInput(str) {
	return str.split('\n').map(line => line.split('').map(c => c === '#'));
}
