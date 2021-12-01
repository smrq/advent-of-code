import { getRawInput, autoparse } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	let count = 0;
	for (let i = 4; i < input.length; ++i) {
		const a = input[i-3] + input[i-2] + input[i-1];
		const b = input[i-2] + input[i-1] + input[i-0];
		if (b > a) {
			++count;
		}
	}
	return count;
}

function parseInput(str) {
	return autoparse(str);
}
