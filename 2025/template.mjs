import * as L from '../lib.mjs';

await L.runTests(args => run(args), [
	parseInput(
		``
	), 0
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return input;
}

function parseInput(str) {
	return L.autoparse(str);
}

