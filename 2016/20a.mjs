import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
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
