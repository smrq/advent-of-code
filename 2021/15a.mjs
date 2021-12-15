import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`), 40
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const dim = input.length;
	const goal = [dim-1, dim-1];
	const result = L.astar({
		start: [0,0],
		goal: goal,
		key: ([x,y]) => `${x},${y}`,
		neighbors: ([x, y]) => L.orthogonalOffsets(2).map(([dx, dy]) => [x+dx, y+dy]),
		cost: (from, [x, y]) => {
			if (x < 0) return Infinity;
			if (y < 0) return Infinity;
			if (x >= dim) return Infinity;
			if (y >= dim) return Infinity;
			return input[y][x];
		},
		heuristic: ([x, y]) => (goal[0] - x) + (goal[1] - y),
	});
	return result.cost;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => line.split('').map(x => +x));
}
