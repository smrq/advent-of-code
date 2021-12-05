import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`), 5
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const points = new Map();

	function inc(x, y) {
		const key = `${x},${y}`;
		points.set(key, (points.get(key) || 0) + 1);
	}

	for (let [p1, p2] of input) {
		if (p1[0] === p2[0]) {
			const x = p1[0];
			const y0 = Math.min(p1[1], p2[1]);
			const y1 = Math.max(p1[1], p2[1]);
			for (let y = y0; y <= y1; ++y) {
				inc(x, y);
			}
		} else if (p1[1] === p2[1]) {
			const y = p1[1];
			const x0 = Math.min(p1[0], p2[0]);
			const x1 = Math.max(p1[0], p2[0]);
			for (let x = x0; x <= x1; ++x) {
				inc(x, y)
			}
		}
	}

	return [...points.values()].filter(n => n > 1).length;
}

function parseInput(str) {
	return L.autoparse(str);
}
