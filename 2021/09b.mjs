import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`2199943210
3987894921
9856789892
8767896789
9899965678`), 1134
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const map = new Map();

	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (input[y][x] === '9') continue;
			const point = descend(input, y, x);
			const count = map.get(point) || 0;
			map.set(point, count + 1);
		}
	}

	return L.product(
		[...map.values()]
			.sort((a, b) => b - a)
			.slice(0, 3)
	);
}

function descend(input, y, x) {
	if (input[y-1] != null && input[y-1][x] < input[y][x]) {
		return descend(input, y-1, x);
	}
	if (input[y][x-1] != null && input[y][x-1] < input[y][x]) {
		return descend(input, y, x-1);
	}
	if (input[y+1] != null && input[y+1][x] < input[y][x]) {
		return descend(input, y+1, x);
	}
	if (input[y][x+1] != null && input[y][x+1] < input[y][x]) {
		return descend(input, y, x+1);
	}
	return `${y},${x}`;
}

function parseInput(str) {
	return str.split('\n');
}
