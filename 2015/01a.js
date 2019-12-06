const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [
	['(())', 0],
	['()()', 0],
	['(((', 3],
	['(()(()(', 3],
	['))(((((', 3],
	['())', -1,],
	['))(', -1],
	[')))', -3],
	[')())())', -3],
];

function run(input) {
	return input.split('').reduce((acc, c) => c === '(' ? acc + 1 : acc - 1, 0);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));