const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('03.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	return input.split('\n').map(line => {
		const sides = line.trim().split(/\s+/).map(x => +x).sort((a, b) => a - b);
		return sides[0] + sides[1] > sides[2];
	}).filter(x => x).length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
