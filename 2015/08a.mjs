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
	let len = 0;
	for (let i = 1; i < line.length - 1; ++i) {
		if (line[i] === '\\') {
			if (line[i + 1] === 'x') {
				i += 3;
			} else if (line[i + 1] === '\\') {
				i += 1;
			} else if (line[i + 1] === '"') {
				i += 1;
			}
		}
		++len;
	}
	return line.length - len;
}

assert.strictEqual(run(`""
"abc"
"aaa\\"aaa"
"\\x27"`), 12);

console.log(run(input));
