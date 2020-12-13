import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [];

function parseInput(input) {
	return input.split('\n').map((line, i) => {
		const match = /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./.exec(line);
		assert.strictEqual(+match[1], i + 1);
		return {
			index: +match[1],
			positions: +match[2],
			phase: +match[3]
		};
	});
}

function makeGenerator({ positions, phase, index }) {
	return function *() {
		let n = (2 * positions - phase - index) % positions;
		for (;;) {
			yield n;
			n += positions;
		}
	}
}

function run(input) {
	const discs = parseInput(input);
	discs.push({ index: discs.length + 1, positions: 11, phase: 0 });
	const generators = discs.map(d => makeGenerator(d)());

	let n = generators[0].next().value;
	let g_n = 0;

	outer: for (;;) {
		for (let g = (g_n + 1) % generators.length; g !== g_n; g = (g + 1) % generators.length) {
			let n2;
			while ((n2 = generators[g].next().value) < n);
			if (n2 > n) {
				n = n2;
				g_n = g;
				continue outer;
			}
		}
		return n;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
