import { D, getRawInput, autoparse, runTests, powerRemainder } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
	[5764801, 17807724], 14897079
]);

console.log(run(input));

function run(input) {
	for (let i = 1; ; ++i) {
		const p = powerRemainder(7, i, 20201227);
		if (p == input[0]) {
			return powerRemainder(input[1], i, 20201227);
		}
		if (p == input[1]) {
			return powerRemainder(input[0], i, 20201227);
		}
		if (i % 1e5 === 0) { D(`${i}...`); }
	}
}

function parseInput(str) {
	return autoparse(str);
}
