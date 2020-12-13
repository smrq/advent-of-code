import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [
	[5, 2]
];

function iterate(arr) {
	const odd = arr.length % 2 === 1;
	const iFront = Math.ceil(arr.length / 3);
	const iBack = Math.floor(arr.length / 2);
	return [
		...arr.slice(iFront, iBack),
		...arr.slice(iBack).filter((_, i) => i % 3 === (odd ? 1 : 2)),
		...arr.slice(0, iFront)
	];
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
