import * as L from '../lib.mjs';

await L.runTests(args => run(args), [
	parseInput(
		`7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
	), 50
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let max = -Infinity;

	for (let i = 0; i < input.length; ++i) {
		for (let j = i+1; j < input.length; ++j) {
			max = Math.max(max, area(input[i], input[j]));
		}
	}

	return max;
}

function area(a, b) {
	return Math.abs(a[0] - b[0] + 1) *
		Math.abs(a[1] - b[1] + 1);
}

function parseInput(str) {
	return L.autoparse(str);
}

