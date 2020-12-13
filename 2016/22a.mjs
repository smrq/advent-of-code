import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [];

function parseInput(input) {
	const grid = new Map();
	for (let line of input.split('\n').slice(2)) {
		const [filesystem, _, used, avail] = line.split(/\s+/);
		const [x, y] = /node-x(\d+)-y(\d+)$/.exec(filesystem).slice(1).map(x => +x);
		grid.set(`${x},${y}`, {
			x,
			y,
			used: parseInt(used, 10),
			avail: parseInt(avail, 10)
		});
	}
	return grid;
}

function run(input) {
	const grid = parseInput(input);
	const nodes = [...grid.values()];
	nodes.sort((a, b) => b.avail - a.avail);

	let result = 0;
	for (let a of nodes) {
		if (a.used === 0) continue;

		result += nodes.findIndex(b => b.avail < a.used);

		if (a.avail >= a.used) {
			--result;
		}
	}

	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
