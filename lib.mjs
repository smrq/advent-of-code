import assert from 'assert';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

/* AOC functions */

export function D(...args) {
	// Log debug output to stderr so that stdout only contains the program result
	console.error(...args);
}

export function getRawInput() {
	const inputFilename = path.resolve(
		process.cwd(),
		path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
	let input = fs.readFileSync(inputFilename, 'utf-8');
	if (/\n$/.test(input)) {
		input = input.replace(/\n$/, '');
	}
	return input;
}

export function runTests(f, tests) {
	assert.ok(tests.length % 2 === 0, 'Tests must be an interleaved array of inputs and outputs');
	for (let i = 0; i < tests.length; i += 2) {
		const input = tests[i];
		const output = tests[i+1];
		assert.deepStrictEqual(f(input), output);
	}
}

/* Data structures */

export class PriorityQueue {
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

/* Memoization */

export function memo(f) {
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

/* Arrays */

export function zip(...arrays) {
	const result = [];
	const size = Math.max(...arrays.map(a => a.length));
	for (let i = 0; i < size; ++i) {
		result.push(arrays.map(a => a[i]));
	}
	return result;
}

export function sum(arr) {
	if (!arr.length) return 0;
	return arr.reduce((a, b) => a + b);
}

export function product(arr) {
	if (!arr.length) return 1;
	return arr.reduce((a, b) => a * b);
}

export function flatten(arr) {
	if (!Array.isArray(arr)) return arr;
	return [].concat(...arr.map(flatten));
}

export function selectBy(arr, lookup, compare) {
	let result = arr[0];
	let best = lookup(result);

	for (let item of arr.slice(1)) {
		let n = lookup(item);
		if (compare(n, best)) {
			result = item;
			best = n;
		}
	}

	return result;
}

export function minBy(arr, lookup) {
	return selectBy(arr, lookup, (a, b) => a < b);
}

export function maxBy(arr, lookup) {
	return selectBy(arr, lookup, (a, b) => a > b);
}

export function arrayUnion(...arrays) {
	return arrays.reduce((result, arr) => {
		for (let item of arr) {
			if (!result.includes(item)) {
				result.push(item);
			}
		}
		return result;
	}, []);
}

export function arrayIntersection(arr1, ...arrays) {
	const result = [];
	for (let item of arr1) {
		if (arrays.every(arr => arr.includes(item))) {
			result.push(item);
		}
	}
	return result;
}

export function arrayDifference(a, b) {
	const result = [];
	for (let item of a) {
		if (!b.includes(item)) {
			result.push(item);
		}
	}
	return result;
}

export function *permutations(arr) {
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

/* Sets */

export function setUnion(...sets) {
	return sets.reduce((result, set) => {
		for (let item of set) {
			result.add(item);
		}
		return result;
	}, new Set());
}

export function setIntersection(set1, ...sets) {
	const result = new Set();
	for (let item of set1) {
		if (sets.every(s => s.has(item))) {
			result.add(item);
		}
	}
	return result;
}

export function setDifference(a, b) {
	const result = new Set();
	for (let item of a) {
		if (!b.has(item)) {
			result.add(item);
		}
	}
	return result;
}

/* Number theory */

export function gcd(...N) {
	return N.reduce(gcd2);

	function gcd2(a, b) {
		if (a == 0) return b;
		return gcd(b % a, a);
	}
}

export function lcm(...N) {
	return N.reduce(lcm2);

	function lcm2(a, b) {
		return (a / gcd(a, b)) * b;
	}
}

// Negative-safe modulo operator
export function modulo(x, m) {
	while (x < 0) x += m;
	return x % m;
}

export function largestPowerOf2Below(n) {
	if (typeof n === 'bigint') {
		let x = 1n;
		while (x*2n <= n) {
			x *= 2n;
		}
		return x;
	} else {
		let x = 1;
		while (x*2 <= n) {
			x *= 2;
		}
		return x;
	}
}

export function bigIntLargestPowerOf2Below(n) {
	D('bigIntLargestPowerOf2Below is deprecated');
	return largestPowerOf2Below(n);
}

// x^p % r
export function powerRemainder(x, p, r) {
	let big = false;
	if (typeof x === 'bigint' || typeof p === 'bigint' || typeof r === 'bigint') {
		x = BigInt(x);
		p = BigInt(p);
		r = BigInt(r);
		big = true;
	}

	if (p == 0) {
		return (big ? 1n : 1);
	}

	const powersOfX = new Map();
	for (let i = (big ? 1n : 1), n = x;
		i <= p;
		i *= (big ? 2n : 2), n = (n * n) % r
	) {
		powersOfX.set(i, n);
	}

	let n = (big ? 1n : 1);
	while (p > 0) {
		const powerOf2 = largestPowerOf2Below(p);
		const powerOfX = powersOfX.get(powerOf2);
		n = n * powerOfX % r;
		p -= powerOf2;
	}

	return n % r;
}

export function bigIntPowerRemainder(x, p, r) {
	D('bigIntPowerRemainder is deprecated');
	return powerRemainder(x, p, r);
}

// Modular multiplicative inverse
// https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
// x where `ax % m == 1`
export function modMulInverse(a, m) {
	if (typeof a === 'bigint' || typeof m === 'bigint') {
		a = BigInt(a);
		m = BigInt(m);

		let b = a % m;
		for (let i = 1n; i < m; ++i) {
			if ((b * i) % m == 1n) {
				return i;
			}
		}
		return 1n;
	} else {
		let b = a % m;
		for (let i = 1; i < m; ++i) {
			if ((b * i) % m == 1) {
				return i;
			}
		}
		return 1;
	}
}

export function bigIntModMulInverse(a, m) {
	D('bigIntModMulInverse is deprecated');
	return modMulInverse(a, m);
}

// Chinese remainder theorem
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
// x where `x % Ni == Ai` for all i
export function chineseRemainder(A, N) {
	const big = typeof(A[0]) === 'bigint';

	const nProduct = product(N);
	const s = zip(A, N).reduce((acc, [a, n]) => {
		const p = nProduct / n;
		return acc + (a * p * modMulInverse(p, n));
	}, big ? 0n : 0);
	return s % nProduct;
}

export function bigIntChineseRemainder(A, N) {
	D('bigIntChineseRemainder is deprecated');
	return chineseRemainder(a, m);
}

/* Iteration */

export function *iter1(arr) {
	for (let i = 0; i < arr.length; ++i) {
		yield i;
	}
}

export function *iter2(arr) {
	for (let i = 0; i < arr.length; ++i) {
		for (let j = i + 1; j < arr.length; ++j) {
			yield [i, j];
		}
	}
}

export function *iter3(arr) {
	for (let i = 0; i < arr.length; ++i) {
		for (let j = i + 1; j < arr.length; ++j) {
			for (let k = j + 1; k < arr.length; ++k) {
				yield [i, j, k];
			}
		}
	}
}

export function *iter4(arr) {
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

/* Algorithms */

export function astar({ start, goal, key, neighbors, cost, heuristic, progress, progressFrequency }) {
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

export const orthodiagonalOffsets = memo(function orthodiagonalOffsets(dimensions) {
	const result = [];
	for (let i = 0; i < 3**dimensions; ++i) {
		const offsets = Array(dimensions).fill().map((_, d) => (i / 3**d | 0) % 3 - 1);
		if (offsets.every(o => o === 0)) continue;
		result.push(offsets);
	}
	return result;
});

export function cell2d({ grid, rule, neighbors, finished }) {
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

export function cell3d({ grid, rule, neighbors, finished }) {
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
