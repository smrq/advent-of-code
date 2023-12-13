import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`), 405,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function isReflected(row, index) {
	let a = row.slice(0, index).reverse();
	let b = row.slice(index);
	const len = Math.min(a.length, b.length);
	a = a.slice(0, len).join('');
	b = b.slice(0, len).join('');
	return a === b;
}

function findVerticalReflection(map) {
	for (let i = 1; i < map[0].length; ++i) {
		if (map.every(row => isReflected(row, i))) {
			return i;
		}
	}
}

function findHorizontalReflection(map) {
	const transposed = L.zip(...map);
	return findVerticalReflection(transposed);
}

function score(map) {
	const col = findVerticalReflection(map);
	if (col) {
		return col;
	}

	const row = findHorizontalReflection(map);
	if (row) {
		return 100*row;
	}

	throw new Error('could not find reflection');
}

function run(input) {
	return L.sum(input.map(score));
}

function parseInput(str) {
	return L.autoparse(str).map(rows => rows.map(row => row.split('')));
}
