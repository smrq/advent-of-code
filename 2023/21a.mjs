import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`), 6], 16,
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 64));

function floodFill(map) {
	const start = L.findIndex2d(map, cell => cell === 'S');

	let working = [start];
	map[start[0]][start[1]] = 0;

	while (working.length) {
		let next = [];
		for (let [y, x] of working) {
			for (let [dy, dx] of L.orthogonalOffsets(2)) {
				if ('S.'.includes(map[y+dy]?.[x+dx])) {
					map[y+dy][x+dx] = map[y][x] + 1;
					next.push([y+dy, x+dx]);
				}
			}
		}
		working = next;
	}
}

function countSpaces(map, steps) {
	return map
		.flatMap(x => x)
		.filter(cell =>
			typeof cell === 'number' &&
			cell % 2 === steps % 2 &&
			cell <= steps)
		.length;
}

function run(input, steps) {
	floodFill(input);
	return countSpaces(input, steps);
}

function parseInput(str) {
	return L.autoparse(str);
}
