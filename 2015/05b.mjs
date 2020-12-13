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
	return /(..).*\1/.test(line) &&
		/(.).\1/.test(line);
}

console.log(run(input));