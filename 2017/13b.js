const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('13.txt', 'utf-8').trim();
const tests = [
	['0: 3\n1: 2\n4: 4\n6: 4', 10],
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
	for (let delay = 0; ; ++delay) {
		if (attempt(scanners, delay)) {
			return delay;
		}
	}
}

function attempt(scanners, delay) {
	for (let n = 0; n < scanners.length; ++n) {
		const depth = scanners[n];
		if (depth == null) continue;
		if ((n + delay) % (2*(depth-1)) === 0) {
			return false;
		}
	}
	return true;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
