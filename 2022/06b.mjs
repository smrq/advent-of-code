import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 19
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	for (let i = 14; i <= input.length; ++i) {
		if (new Set(input.slice(i-14, i).split('')).size === 14) return i;
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
