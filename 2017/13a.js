const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('13.txt', 'utf-8').trim();
const tests = [
	['0: 3\n1: 2\n4: 4\n6: 4', 24],
];

function parseInput(input) {
	const scanners = [];
	for (let line of input.split('\n')) {
		const [pos, depth] = line.split(': ');
		scanners[+pos] = +depth;
	}
	return scanners;
}

function run(input) {
	const scanners = parseInput(input);
	let score = 0;
	for (let n = 0; n < scanners.length; ++n) {
		const depth = scanners[n];
		if (depth == null) continue;
		if (n % (2*(depth-1)) === 0) {
			score += n * depth;
		}
	}
	return score;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
