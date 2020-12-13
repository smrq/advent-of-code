import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [
];

function nextRow(row) {
	return row.map((c, i) => {
		const l = i > 0 ? row[i - 1] : '.';
		const r = i < row.length - 1 ? row[i + 1] : '.';
		return ((l === '^' && c === '^' && r === '.') ||
			(l === '.' && c === '^' && r === '^') ||
			(l === '^' && c === '.' && r === '.') ||
			(l === '.' && c === '.' && r === '^')) ? '^' : '.';
	});
}

function run(input) {
	let total = input.split('.').length - 1;

	let line = input.split('');
	for (let i = 1; i < 400000; ++i) {
		line = nextRow(line);
		total += line.join('').split('.').length - 1;
	}

	return total;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
