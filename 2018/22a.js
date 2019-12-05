const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('22.txt', 'utf-8').trim();
const testInput = `depth: 510
target: 10,10`

assert.strictEqual(114, run(...parseInput(testInput)));
console.log(run(...parseInput(input)));

function parseInput(input) {
	const [_, depth, targetX, targetY] = /^depth: (\d+)\ntarget: (\d+),(\d+)$/.exec(input);
	return [+depth, { x: +targetX, y: +targetY }];
}

function run(depth, target) {
	const erosionLevel = memo2((x, y) => {
		if (x === 0 && y === 0) {
			return depth;
		}
		if (x === target.x && y === target.y) {
			return depth;
		}
		if (y === 0) {
			return (depth + (x * 16807)) % 20183;
		}
		if (x === 0) {
			return (depth + (y * 48271)) % 20183;
		}
		return (depth + erosionLevel(x-1, y) * erosionLevel(x, y-1)) % 20183;
	});

	function type(x, y) {
		return erosionLevel(x, y) % 3;
	}

	let result = 0;
	for (let y = 0; y <= target.y; ++y) {
		for (let x = 0; x <= target.x; ++x) {
			result += type(x, y);
		}
	}
	return result;
}

function memo2(fn) {
	const cache = new Map();
	return (x, y) => {
		const key = `${x}|${y}`;
		if (!cache.has(key)) {
			cache.set(key, fn(x, y));
		}
		return cache.get(key);
	}
}
