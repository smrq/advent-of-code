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
#....#..#`), 400,
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

function findVerticalReflection(map, skip = null) {
	for (let i = 1; i < map[0].length; ++i) {
		if (i === skip) continue;
		if (map.every(row => isReflected(row, i))) {
			return i;
		}
	}
}

function findHorizontalReflection(map, skip = null) {
	const transposed = L.zip(...map);
	return findVerticalReflection(transposed, skip);
}

function score(map) {
	const originalCol = findVerticalReflection(map);
	const originalRow = findHorizontalReflection(map);

	for (let y = 0; y < map.length; ++y) {
		for (let x = 0; x < map[y].length; ++x) {
			const value = map[y][x];
			map[y][x] = value === '#' ? '.' : '#';

			const col = findVerticalReflection(map, originalCol);
			if (col) {
				return col;
			}

			const row = findHorizontalReflection(map, originalRow);
			if (row) {
				return 100*row;
			}

			map[y][x] = value;
		}
	}
	
	throw new Error('could not find reflection');
}

function run(input) {
	return L.sum(input.map(score));
}

function parseInput(str) {
	return L.autoparse(str).map(rows => rows.map(row => row.split('')));
}
