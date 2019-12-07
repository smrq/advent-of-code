const assert = require('assert');
const fs = require('fs');
const input = +fs.readFileSync('17.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	const arr = [0];
	let position = 0;
	let result;
	for (let i = 1; i <= 50e6; ++i) {
		position = (position + input) % i + 1;
		if (position === 1) {
			result = i;
		}
	}
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
