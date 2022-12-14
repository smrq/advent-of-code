import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`), 24
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const world = createWorld(input);
	const maxY = world.dimensions()[1][1];

	let done = false;
	let count = 0;
	while (!done) {
		let x = 500, y = 0;

		while (true) {
			if (y+1 > maxY) {
				done = true;
				break;
			} else if (world.get([x, y+1]) == null) {
				y += 1;
			} else if (world.get([x-1, y+1]) == null) {
				x -= 1;
				y += 1;
			} else if (world.get([x+1, y+1]) == null) {
				x += 1;
				y += 1;
			} else {
				++count;
				world.set([x, y], 'o');
				break;
			}
		}
	}

	return count;
}

function createWorld(input) {
	const world = new L.InfiniteGrid(2);
	world.dimensions()[0] = [500, 500];

	for (let scan of input) {
		for (let i = 1; i < scan.length; ++i) {
			const point0 = scan[i-1];
			const point1 = scan[i];

			const dx = Math.sign(point1[0] - point0[0]);
			const dy = Math.sign(point1[1] - point0[1]);

			let [x, y] = point0;
			while (true) {
				world.set([x,y], '#');
				if (x === point1[0] && y === point1[1]) break;
				x += dx;
				y += dy;
			}
		}
	}

	return world;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => line.split(' -> ').map(pair => pair.split(',').map(n => parseInt(n, 10))));
}
