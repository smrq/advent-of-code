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
###############`), 45,
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
#################`), 64,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const [startY, startX] = L.findIndex2d(input, x => x === 'S');
	const [endY, endX] = L.findIndex2d(input, x => x === 'E');
	const resultGen = pathfind({
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

	let resultSet = new Set();
	for (let result of resultGen) {
		for (let step of result) {
			resultSet.add(`${step.y},${step.x}`);
		}
	}
	return resultSet.size;
}

function* pathfind({ start, goal, key, neighbors }) {
	const scores = new Map();
	scores.set(key(start), 0);

	const openSet = new L.PriorityQueue();
	openSet.push([start], 0);

	let finalCost = Infinity;

	while (openSet.length) {
		const path = openSet.pop();
		const current = path.at(-1);
		const scoreCurrent = scores.get(key(current));
		if (scoreCurrent > finalCost) {
			return;
		}

		if (goal(current)) {
			finalCost = scoreCurrent;
			yield path;
			continue;
		}

		for (let [neighbor, cost] of neighbors(current)) {
			const scoreNeighbor = scoreCurrent + cost;
			if (scoreNeighbor <= (scores.get(key(neighbor)) ?? Infinity)) {
				scores.set(key(neighbor), scoreNeighbor);
				openSet.push([...path, neighbor], scoreNeighbor);
			}
		}
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
