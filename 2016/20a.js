const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [];

function parseInput(input) {
	return input.split('\n').map(line => line.split('-').map(x => +x));
}

function run(input) {
	let ranges = parseInput(input);
	ranges.sort((a, b) => a[0] - b[0]);
	let n = 0;
	for (;;) {
		const touchedRanges = ranges.filter(r => r[0] <= n && r[1] >= n);
		if (!touchedRanges.length) {
			return n;
		}
		n = Math.max(...touchedRanges.map(r => r[1])) + 1;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
