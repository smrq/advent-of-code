import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();

function run(input) {
	const seen = new Set([input]);
	for (;;) {
		input = iterate(input);
		if (seen.has(input)) {
			return score(input);
		} else {
			seen.add(input);
		}
	}
}

function score(map) {
	return map.replace(/\n/g, '')
		.split('')
		.reduce((acc, c, n) => acc + (c === '#' ? 1 << n : 0), 0);
}

function iterate(map) {
	map = map.split('\n').map(line => line.split(''));
	map = map.map((line, y) => line.map((c, x) => {
		let neighbors = 0;
		if (y > 0 && map[y-1][x] === '#') ++neighbors;
		if (x > 0 && map[y][x-1] === '#') ++neighbors;
		if (y < map.length - 1 && map[y+1][x] === '#') ++neighbors;
		if (x < map[0].length - 1 && map[y][x+1] === '#') ++neighbors;

		if (c === '#') {
			return (neighbors === 1) ? '#' : '.';
		} else {
			return (neighbors === 1 || neighbors === 2) ? '#' : '.';
		}
	}));
	return map.map(line => line.join('')).join('\n');
}

assert.strictEqual(score(`.....
.....
.....
#....
.#...`), 2129920);

console.log(run(input));
