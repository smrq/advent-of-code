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
	let result = 0;
	for (;;) {
		const touchedRanges = ranges.filter(r => r[0] <= n && r[1] >= n);
		if (!touchedRanges.length) {
			const nextRange = ranges.find(r => r[0] > n);
			if (!nextRange) {
				return result;
			} else {
				result += nextRange[0] - n;
				process.stdout.write(`Allowed: ${n}-${nextRange[0] - 1} (${result})\n`);
				n = nextRange[0];
			}
		} else {
			process.stdout.write(`Blacklisted: ${n}-`);
			n = Math.max(...touchedRanges.map(r => r[1])) + 1;
			process.stdout.write(`${n-1}\n`);
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
