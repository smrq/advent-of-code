import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`), 54
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const height = input.length;
	const width = input[0].length;

	const rowBlizzards = {};
	const colBlizzards = {};

	for (let i = 0; i < height; ++i) {
		for (let j = 0; j < width; ++j) {
			switch (input[i][j]) {
				case '>':
					rowBlizzards[i] = rowBlizzards[i] || [];
					rowBlizzards[i].push({ x0: j, dx: 1 });
					break;
				case '<':
					rowBlizzards[i] = rowBlizzards[i] || [];
					rowBlizzards[i].push({ x0: j, dx: -1 });
					break;
				case 'v':
					colBlizzards[j] = colBlizzards[j] || [];
					colBlizzards[j].push({ y0: i, dy: 1 });
					break;
				case '^':
					colBlizzards[j] = colBlizzards[j] || [];
					colBlizzards[j].push({ y0: i, dy: -1 });
					break;
			}
		}
	}

	const start = { t: 0, x: 0, y: -1, leg: 'first' };
	const goal = { x: width-1, y: height };

	const path = L.astar({
		start: start,
		goal: 'end',
		key: node => node === 'end' ? 'end' : `${node.t}|${node.x},${node.y}|${node.leg}`,
		neighbors: ({ t, x, y, leg }) => {
			if (x === goal.x && y === goal.y) {
				if (leg === 'first') {
					return [{ t, x, y, leg: 'return' }];
				}
				if (leg === 'second') {
					return ['end'];
				}
			}
			if (x === start.x && y === start.y) {
				if (leg === 'return') {
					return [{ t, x, y, leg: 'second' }];
				}
			}

			let neighbors = L.orthogonalOffsets(2).map(([dx, dy]) => [x + dx, y + dy]);
			neighbors.push([x, y]);
			neighbors = neighbors.filter(([x, y]) =>
				(x === start.x && y === start.y) ||
				(x === goal.x && y === goal.y) ||
				(y >= 0 && y < height && x >= 0 && x < width));
			neighbors = neighbors.filter(([x, y]) => isFree(t+1, x, y));
			neighbors = neighbors.map(([x, y]) => ({ t: t+1, x, y, leg }));
			return neighbors;
		},
		cost: (current, neighbor) => {
			if (neighbor === 'end') return 0;
			if (neighbor.leg !== current.leg) return 0;
			return 1;
		},
		heuristic: ({ x, y, leg }) => {
			switch (leg) {
				case 'second':
					return Math.abs(goal.x - x) + Math.abs(goal.y - y);
				case 'return':
					return Math.abs(start.x - x) + Math.abs(start.y - y) +
						Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);
				case 'first':
					return Math.abs(goal.x - x) + Math.abs(goal.y - y) +
						2 * (Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y));
			}
		},
	});
	
	return path.cost;

	function isFree(t, x, y) {
		return (
			(rowBlizzards[y] || []).every(({ x0, dx }) => x !== L.modulo(x0 + t*dx, width)) &&
			(colBlizzards[x] || []).every(({ y0, dy }) => y !== L.modulo(y0 + t*dy, height))
		);
	}
}

function parseInput(str) {
	return L.autoparse(str).slice(1, -1).map(line => line.slice(1, -1));
}
