const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('02.txt', 'utf-8').trim();
const tests = [
	[`5 1 9 5\n7 5 3\n2 4 6 8`, 18]
];

function run(input) {
	return input.split('\n').map(line => {
		const values = line.split(/\s+/).map(x => +x);
		return Math.max(...values) - Math.min(...values);
	}).reduce((a, b) => a + b);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));