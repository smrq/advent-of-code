import assert from 'assert';
import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`), 5,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function *brickIteratorXY({ start, end }) {
	const dx = start[0] === end[0] ? 0 : 1;
	const dy = start[1] === end[1] ? 0 : 1;
	for (let x = start[0], y = start[1];
		x !== end[0] || y !== end[1];
		x += dx, y += dy
	) {
		yield [x, y];
	}
	yield [end[0], end[1]];
}

function run(input) {
	for (let { start, end } of input) {
		assert(start[0] <= end[0]);
		assert(start[1] <= end[1]);
		assert(start[2] <= end[2]);
	}

	input.sort((a, b) => (
		a.start[2] - b.start[2] ||
		a.start[1] - b.start[1] ||
		a.start[0] - b.start[0]
	));

	const topBricks = new L.InfiniteGrid(2);

	for (let i = 0; i < input.length; ++i) {
		const brick = input[i];
		L.D(brick);
		brick.supported = new Set();

		let dropHeight = 1;
		for (let [x, y] of brickIteratorXY(brick)) {
			const existing = topBricks.get([x, y]);
			if (existing != null) {
				dropHeight = Math.max(dropHeight, input[existing].end[2] + 1);
			}
		}
		const dropDistance = brick.start[2] - dropHeight;

		brick.start[2] -= dropDistance;
		brick.end[2] -= dropDistance;

		for (let [x, y] of brickIteratorXY(brick)) {
			const existing = topBricks.get([x, y]);
			if (existing != null && input[existing].end[2] === brick.start[2]-1) {
				brick.supported.add(existing);
			}
			topBricks.set([x, y], i);
		}
	}

	const supporters = new Set(
		input.map(brick => brick.supported)
			.filter(set => set.size === 1)
			.flatMap(set => [...set])
	);
	return input.length - supporters.size;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [start, end] = line.split('~').map(triplet => triplet.split(',').map(x => +x));
		return { start, end };
	});
}
