import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`111111111111
999999999991
999999999991
999999999991
999999999991`), 71,
	parseInput(`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`), 94,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function opposite(dir) {
	return {
		up: 'down',
		right: 'left',
		down: 'up',
		left: 'right',
	}[dir];
}

function run(input) {
	const w = input[0].length;
	const h = input.length;

	const path = L.astar({
		start: { x: 0, y: 0, dir: null, straight: 0 },
		goal: 'goal',
		key: node => JSON.stringify(node),
		neighbors: (node) => {
			if (node.x === w-1 && node.y === h-1) {
				return node.straight >= 4 ? ['goal'] : [];
			}
			
			let neighbors = [
				{ x: node.x, y: node.y-1, dir: 'up' },
				{ x: node.x+1, y: node.y, dir: 'right' },
				{ x: node.x, y: node.y+1, dir: 'down'},
				{ x: node.x-1, y: node.y, dir: 'left' },
			];

			neighbors = neighbors.filter(neighbor =>
				(neighbor.dir !== opposite(node.dir)) &&
				(neighbor.x >= 0) &&
				(neighbor.x < w) &&
				(neighbor.y >= 0) &&
				(neighbor.y < h) &&
				(node.dir == null || neighbor.dir === node.dir ?
					node.straight < 10 :
					node.straight >= 4
				)
			);

			neighbors = neighbors.map(neighbor => ({
				...neighbor,
				straight: neighbor.dir === node.dir ? node.straight + 1 : 1,
			}));

			return neighbors;
		},
		cost: (current, neighbor) => {
			if (neighbor === 'goal') return 0;
			return input[neighbor.y][neighbor.x];
		},
	});

	return path.cost;
}

function parseInput(str) {
	return str.split('\n').map(line => line.split('').map(n => +n));
}
