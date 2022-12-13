import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`), 29
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ map, starts, end }) {
	function validMove(map, current, next) {
		if (next[0] < 0) return false;
		if (next[1] < 0) return false;
		if (next[0] >= map.length) return false;
		if (next[1] >= map[next[0]].length) return false;

		const a = map[current[0]][current[1]];
		const b = map[next[0]][next[1]];
		return b <= a + 1;
	}

	const result = L.astar({
		start: null,
		goal: end,
		key: current => current == null ? 'start' : `${current[0]},${current[1]}`,
		neighbors: current => {
			if (current == null) {
				return starts;
			}
			return L.orthogonalOffsets(2).map(([i, j]) => {
				const next = [current[0]+i, current[1]+j];
				return validMove(map, current, next) ? next : null
			}).filter(Boolean);
		},
		cost: (current, neighbor) => current == null ? 0 : 1,
		heuristic: (current, goal) =>
			current == null ? 0 :
				Math.abs(current[0] - goal[0]) +
				Math.abs(current[1] - goal[1]),
	})
	return result.cost;
}

function parseInput(str) {
	const lines = L.autoparse(str);
	let starts = [], end;
	for (let i = 0; i < lines.length; ++i) {
		const line = lines[i];
		
		const ss = line.split('').map((c, i) => c === 'S' || c === 'a' ? i : null).filter(n => n != null);
		starts.push(...ss.map(ss => [i, ss]));

		const e = line.indexOf('E');
		if (e !== -1) {
			end = [i, e];
		}
	}

	const map = lines.map(line =>
		line.split('')
			.map(c =>
				c === 'S' ? 'a' :
				c === 'E' ? 'z' :
				c)
			.map(c => c.charCodeAt(0) - 'a'.charCodeAt(0)));
	return { map, starts, end };
}
