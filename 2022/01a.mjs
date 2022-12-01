import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return Math.max(...input.map(L.sum));
}

function parseInput(str) {
	return L.autoparse(str);
}
