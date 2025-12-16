import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3-5
10-14
16-20
12-18

1
5
8
11
17
32`), 3
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([ranges, ids]) {
	return ids.filter(id => ranges.some(range => inRange(range, id)))
			.length;
}

function inRange(range, id) {
	return id >= range[0] && id <= range[1];
}

function parseInput(str) {
	const [ranges, ids] = L.autoparse(str);
	return [
		ranges.map(range => range.split('-').map(n => parseInt(n, 10))),
		ids.map(id => parseInt(id, 10)),
	];
}

