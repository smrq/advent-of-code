import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
const input = [fs.readFileSync('13.txt', 'utf-8').trim(), 31, 39];
const tests = [];

function isWall(input, x, y) {
	const n = x*x + 3*x + 2*x*y + y + y*y + input;
	return popcount(n) % 2 === 1;
}

function popcount(n) {
	let result = 0;
	while (n) {
		if (n & 1) ++result;
		n = n >> 1;
	}
	return result;
}

function key(state) {
	return state.join(',');
}

function neighbors(input, x, y) {
	const result = [];
	if (x > 0 && !isWall(input, x-1, y)) {
		result.push([x-1, y]);
	}
	if (y > 0 && !isWall(input, x, y-1)) {
		result.push([x, y-1]);
	}
	if (!isWall(input, x+1, y)) {
		result.push([x+1, y]);
	}
	if (!isWall(input, x, y+1)) {
		result.push([x, y+1]);
	}
	return result;
}

function memo(fn) {
	const cache = new Map();
	return (...args) => {
		const key = args.join('|');
		if (!cache.has(key)) {
			cache.set(key, fn(...args));
		}
		return cache.get(key);
	}
}

function run([input, ...goal]) {
	input = +input;

	const start = [1, 1];
	const visited = new Set(['1,1']);

	let openSet = [[1, 1]];
	for (let i = 0; i < 50; ++i) {
		openSet = [].concat(...openSet.map(([x, y]) => neighbors(input, x, y)));
		openSet = openSet.filter(coords => !visited.has(key(coords)));
		for (let coords of openSet) {
			visited.add(key(coords));
		}
	}

	return visited.size;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
