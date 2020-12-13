import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [
	[5, 3]
];

function iterate(arr) {
	const odd = arr.length % 2 === 1;
	arr = arr.filter((_, i) => i % 2 === 0);
	if (odd) {
		arr.unshift(arr.pop());
	}
	return arr;
}

function run(input) {
	let arr = Array(+input).fill().map((_, i) => i + 1);
	while (arr.length > 1) {
		arr = iterate(arr);
	}
	return arr[0];
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
