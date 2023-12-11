import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`), 374,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function distance(a, b, rowCosts, colCosts) {
	const [y1, y2] = [a[0], b[0]].sort((a, b) => a - b);
	const [x1, x2] = [a[1], b[1]].sort((a, b) => a - b);
	return L.sum(rowCosts.slice(y1, y2)) +
		L.sum(colCosts.slice(x1, x2));
}

function run(input) {
	const rowCosts = input.map(line => /#/.test(line) ? 1 : 2);
	const colCosts = L.zip(...input).map(line => /#/.test(line) ? 1 : 2);
	const galaxies = L.findAllIndices2d(input, x => x === '#');

	let result = 0;
	for (let i = 0; i < galaxies.length; ++i) {
		for (let j = i+1; j < galaxies.length; ++j) {
			result += distance(galaxies[i], galaxies[j], rowCosts, colCosts);
		}
	}
	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}
