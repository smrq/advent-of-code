import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`), 7
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	for (let i = 4; i <= input.length; ++i) {
		if (new Set(input.slice(i-4, i).split('')).size === 4) return i;
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
