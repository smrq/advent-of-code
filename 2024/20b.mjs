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
###############`), 74], 7
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 100));

function run(input, target) {
	preprocess(input);

	let result = 0;
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (typeof input[y][x] !== 'number') continue;
			for (let dy = -20; dy <= 20; ++dy) {
				for (let dx = -(20 - Math.abs(dy)); dx <= 20 - Math.abs(dy); ++dx) {
					if (
						L.inBounds(input, y+dy, x+dx) &&
						typeof input[y+dy][x+dx] === 'number'
					) {
						const t = input[y+dy][x+dx] - input[y][x] - Math.abs(dy) - Math.abs(dx);
						if (t >= target) {
							++result;
						}
					}
				}
			}
		}
	}
	return result;
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
