import { getRawInput, autoparse } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	let count = 0;
	for (let i = 1; i < input.length; ++i) {
		if (input[i] > input[i-1]) {
			++count;
		}
	}
	return count;
}

function parseInput(str) {
	return autoparse(str);
}
