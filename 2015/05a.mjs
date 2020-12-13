import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();

function run(input) {
	return input.split('\n').filter(line => isNice(line)).length;
}

function isNice(line) {
	return line.split(/[aeiou]/).length > 3 &&
		/(.)\1/.test(line) &&
		!/ab|cd|pq|xy/.test(line);
}

console.log(run(input));