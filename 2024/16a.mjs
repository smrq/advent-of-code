import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`), 7036,
	parseInput(`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`), 11048,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const [startY, startX] = L.findIndex2d(input, x => x === 'S');
	const [endY, endX] = L.findIndex2d(input, x => x === 'E');
	const result = L.astar2({
		start: { y: startY, x: startX, direction: 'E' },
		goal: state => state.y === endY && state.x === endX,
		key: state => `${state.y},${state.x},${state.direction}`,
		neighbors: function* ({ y, x, direction }) {
			let dy, dx;
			switch (direction) {
				case 'N':
					yield [{ y, x, direction: 'E' }, 1000];
					yield [{ y, x, direction: 'W' }, 1000];
					dy = -1;
					dx = 0;
					break;
				case 'E':
					yield [{ y, x, direction: 'N' }, 1000];
					yield [{ y, x, direction: 'S' }, 1000];
					dy = 0;
					dx = 1;
					break;
				case 'S':
					yield [{ y, x, direction: 'E' }, 1000];
					yield [{ y, x, direction: 'W' }, 1000];
					dy = 1;
					dx = 0;
					break;
				case 'W':
					yield [{ y, x, direction: 'N' }, 1000];
					yield [{ y, x, direction: 'S' }, 1000];
					dy = 0;
					dx = -1;
					break;
			}
			if (L.inBounds(input, y + dy, x + dx) && input[y + dy][x + dx] !== '#') {
				yield [{ y: y + dy, x: x + dx, direction }, 1];
			}
		},
	});
	return result.cost;
}

function parseInput(str) {
	return L.autoparse(str);
}
