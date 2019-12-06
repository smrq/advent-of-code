const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [
	[')', 1],
	['()())', 5],
];

function run(input) {
	let pos = 0;
	for (let i = 0; i < input.length; ++i) {
		pos = input[i] === '(' ? pos + 1 : pos - 1;
		if (pos < 0) return i + 1;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));