import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();

function run(input) {
	return input.split('\n').map(score).reduce((a, b) => a + b);
}

function score(line) {
	let len = 2;
	for (let i = 0; i < line.length; ++i) {
		if (line[i] === '\\' || line[i] === '"') {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len - line.length;
}

assert.strictEqual(run(`""
"abc"
"aaa\\"aaa"
"\\x27"`), 19);

console.log(run(input));
