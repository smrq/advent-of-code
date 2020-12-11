const assert = require('assert');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function D(...args) {
	// Log debug output to stderr so that stdout only contains the program result
	process.stderr.write(chalk.red('[DEBUG] '))
	console.error(...args);
}

function getRawInput() {
	const inputFilename = path.resolve(process.cwd(),
		path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
	const input = fs.readFileSync(inputFilename, 'utf-8').trim();
	return input;
}

function runTests(f, tests) {
	assert.ok(tests.length % 2 === 0, 'Tests must be an interleaved array of inputs and outputs');
	for (let i = 0; i < tests.length; i += 2) {
		const input = tests[i];
		const output = tests[i+1];
		assert.deepStrictEqual(f(input), output);
	}
}

class PriorityQueue {
	constructor() {
		this.data = [];
		this.priorities = [];
		this.length = this.data.length;
	}

	push(item, priority) {
		const index = this.priorities.findIndex(p => p > priority);
		this.data.splice(index, 0, item);
		this.priorities.splice(index, 0, priority);
		this.length = this.data.length;
	}

	pop() {
		const result = this.data.shift();
		this.priorities.shift();
		this.length = this.data.length;
		return result;
	}
}

function astar({ start, goal, key, neighbors, cost, heuristic, progress, progressFrequency }) {
	if (!key) key = x => x;
	if (!cost) cost = () => 1;
	if (!heuristic) heuristic = () => 0;

	const parents = new Map();

	const gScores = new Map();
	gScores.set(key(start), 0);
	
	// const fScores = new Map();
	// fScores.set(key(start), heuristic(start, goal));

	const keyGoal = key(goal);

	const openSet = new PriorityQueue();
	openSet.push(start, heuristic(start, goal));

	let iteration = 0;

	while (openSet.length) {
		const current = openSet.pop();
		const keyCurrent = key(current);

		if (keyCurrent === keyGoal) {
			return getPath(parents, current);
		}

		const gScoreCurrent = gScores.get(keyCurrent);

		for (let neighbor of neighbors(current)) {
			const keyNeighbor = key(neighbor);

			const gScore = gScoreCurrent + cost(current, neighbor);
			if (!gScores.has(keyNeighbor) ||
				gScores.get(keyNeighbor) > gScore
			) {
				const hScore = heuristic(neighbor, goal);
				parents.set(keyNeighbor, current);
				gScores.set(keyNeighbor, gScore);
				// fScores.set(keyNeighbor, gScore + hScore);
				openSet.push(neighbor, gScore + hScore);
			}
		}

		++iteration;

		if (progress && (!progressFrequency || iteration % progressFrequency === 0)) {
			progress(iteration, gScores.size, openSet.length, gScoreCurrent, heuristic(current, goal), current);
		}
	}

	return false;

	function getPath(parents, current) {
		const path = [current];
		let totalCost = 0;
		while (parents.has(key(current))) {
			const parent = parents.get(key(current));
			totalCost += cost(parent, current);
			path.unshift(parent);
			current = parent;
		}
		return { path, cost: totalCost };
	}
}

function *permutations(arr) {
	if (arr.length === 1) yield arr;
	for (let k = 0; k < arr.length; ++k) {
		for (let p of permutations([
			...arr.slice(0, k),
			...arr.slice(k+1)
		])) {
			yield [arr[k], ...p];
		}
	}
}

function sum(arr) {
	return arr.reduce((a, b) => a + b, 0);
}

function product(arr) {
	return arr.reduce((a, b) => a * b, 1);
}

// x^p % r
function bigIntPowerRemainder(x, p, r) {
	if (p === 0n) {
		return 1n;
	}

	const powersOfX = new Map();
	for (let i = 1n, n = x;
		i <= p;
		i *= 2n, n = (n * n) % r
	) {
		powersOfX.set(i, n);
	}

	let n = 1n;
	while (p > 0n) {
		const powerOf2 = bigIntLargestPowerOf2Below(p);
		const powerOfX = powersOfX.get(powerOf2);
		n = n * powerOfX % r;
		p -= powerOf2;
	}

	return n % r;
}

function bigIntLargestPowerOf2Below(n) {
	let x = 1n;
	while (x <= n) {
		x *= 2n;
	}
	return x / 2n;
}

function setUnion(...sets) {
	return sets.reduce((result, set) => {
		for (let item of set) {
			result.add(item);
		}
		return result;
	}, new Set());
}

function setIntersection(set1, ...sets) {
	const result = new Set(set1);
	for (let item of set1) {
		if (sets.some(s => !s.has(item))) {
			result.delete(item);
		}
	}
	return result;
}

function setDifference(a, b) {
	const result = new Set();
	for (let item of a) {
		if (!b.has(item)) {
			result.add(item);
		}
	}
	return result;
}

function *iter1(arr) {
	for (let i = 0; i < arr.length; ++i) {
		yield i;
	}
}

function *iter2(arr) {
	for (let i = 0; i < arr.length; ++i) {
		for (let j = i + 1; j < arr.length; ++j) {
			yield [i, j];
		}
	}
}

function *iter3(arr) {
	for (let i = 0; i < arr.length; ++i) {
		for (let j = i + 1; j < arr.length; ++j) {
			for (let k = j + 1; k < arr.length; ++k) {
				yield [i, j, k];
			}
		}
	}
}

function *iter4(arr) {
	for (let i = 0; i < arr.length; ++i) {
		for (let j = i + 1; j < arr.length; ++j) {
			for (let k = j + 1; k < arr.length; ++k) {
				for (let l = k + 1; l < arr.length; ++l) {
					yield [i, j, k, l];
				}
			}
		}
	}
}

function memo(f) {
	const memos = new Map();
	return (...args) => {
		const key = JSON.stringify(args);
		if (memos.has(key)) {
			return memos.get(key);
		}
		const result = f(...args);
		memos.set(key, result);
		return result;
	}
}

const orthodiagonalOffsets = memo(function orthodiagonalOffsets(dimensions) {
	const result = [];
	for (let i = 0; i < 3**dimensions; ++i) {
		const offsets = Array(dimensions).fill().map((_, d) => (i / 3**d | 0) % 3 - 1);
		if (offsets.every(o => o === 0)) continue;
		result.push(offsets);
	}
	return result;
});

function cell2d({ grid, rule, neighbors, finished }) {
	const width = grid[0].length;
	const height = grid.length;
	const neighborOffsets = orthodiagonalOffsets(2);

	neighbors = neighbors || (
		(grid, x, y) => neighborOffsets.map(o => [x+o[0], y+o[1]])
			.filter(([x, y]) => x >= 0 && y >= 0 && x < width && y < height)
			.map(([x, y]) => grid[y][x])
	);

	finished = finished || (
		({ changed }) => !changed
	);

	for (;;) {
		const last = grid;
		let changed = false;
		grid = grid.map((line, y) => line.map((current, x) => {
			const updated = rule(current, neighbors(grid, x, y), x, y);
			if (updated !== current) {
				changed = true;
			}
			return updated;
		}));
		if (finished({ last, grid, changed })) {
			return grid;
		}
	}
}

function cell3d({ grid, rule, neighbors, finished }) {
	const width = grid[0][0].length;
	const height = grid[0].length;
	const depth = grid.length;
	const neighborOffsets = orthodiagonalOffsets(3);

	neighbors = neighbors || (
		(grid, x, y, z) => neighborOffsets.map(o => [x+o[0], y+o[1], z+o[2]])
			.filter(([x, y, z]) => x >= 0 && y >= 0 && z >= 0 && x < width && y < height && z < depth)
			.map(([x, y, z]) => grid[z][y][x])
	);

	finished = finished || (
		({ changed }) => !changed
	);

	for (;;) {
		const last = grid;
		let changed = false;
		grid = grid.map((plane, z) => plane.map((line, y) => line.map((current, x) => {
			const updated = rule(current, neighbors(grid, x, y, z), x, y, z);
			if (updated !== current) {
				changed = true;
			}
			return updated;
		})));
		if (finished({ last, grid, changed })) {
			return grid;
		}
	}
}

function flatten(arr) {
	if (!Array.isArray(arr)) return arr;
	return [].concat(...arr.map(flatten));
}

module.exports = {
	D,
	getRawInput,
	runTests,
	PriorityQueue,
	astar,
	permutations,
	sum,
	product,
	bigIntPowerRemainder,
	bigIntLargestPowerOf2Below,
	setUnion,
	setIntersection,
	setDifference,
	iter1,
	iter2,
	iter3,
	iter4,
	memo,
	orthodiagonalOffsets,
	cell2d,
	cell3d,
	flatten,
};
