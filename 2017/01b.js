const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [
	['1212', 6],
	['1221', 0],
	['123425', 4],
	['123123', 12],
	['12131415', 4],
];

function run(input) {
	let result = 0;
	for (let i = 0; i < input.length; ++i) {
		if (input[i] === input[(i + (input.length / 2)) % input.length]) {
			result += +input[i];
		}
	}
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));