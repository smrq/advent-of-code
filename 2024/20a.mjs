import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`), 6], 16
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 100));

function run(input, target) {
	preprocess(input);

	const cheats = [];
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (input[y][x] !== '#') continue;
			if (
				L.inBounds(input, y-1, x) && input[y-1][x] !== '#' &&
				L.inBounds(input, y+1, x) && input[y+1][x] !== '#'
			) {
				const t = Math.abs(input[y-1][x] - input[y+1][x]) - 2;
				cheats.push({ t, y, x });
			}
			if (
				L.inBounds(input, y, x-1) && input[y][x-1] !== '#' &&
				L.inBounds(input, y, x+1) && input[y][x+1] !== '#'
			) {
				const t = Math.abs(input[y][x-1] - input[y][x+1]) - 2;
				cheats.push({ t, y, x });
			}
		}
	}
	cheats.sort((a, b) => b.t - a.t);
	return cheats.filter(x => x.t >= target).length;
}

function preprocess(input) {
	let [y, x] = L.findIndex2d(input, x => x === 'S');
	for (let t = 0; ; ++t) {
		const tile = input[y][x];
		input[y][x] = t;
		if (tile === 'E') {
			break;
		}
		for (let [dy, dx] of L.orthogonalOffsets(2)) {
			if (input[y+dy][x+dx] === '.' || input[y+dy][x+dx] === 'E') {
				y += dy;
				x += dx;
				break;
			}
		}
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
