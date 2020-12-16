import assert from 'assert';
import * as lib from './lib.mjs';

(() => {
	let runCount = 0;
	const f = lib.memo(x => {
		++runCount;
		return x;
	});
	let result;

	result = f(0);
	assert.strictEqual(result, 0);
	assert.strictEqual(runCount, 1);

	result = f(0);
	assert.strictEqual(result, 0);
	assert.strictEqual(runCount, 1);

	result = f(1);
	assert.strictEqual(result, 1);
	assert.strictEqual(runCount, 2)

	result = f(1);
	assert.strictEqual(result, 1);
	assert.strictEqual(runCount, 2);

	result = f(0);
	assert.strictEqual(result, 0);
	assert.strictEqual(runCount, 2);
})();

lib.runTests(args => lib.zip(...args), [
	[[1,2,3],[4,5,6]], [[1,4],[2,5],[3,6]],
	[[1,2,3],[4,5,6],[7,8,9]], [[1,4,7],[2,5,8],[3,6,9]],
	[[1],[4],[7,8,9]], [[1,4,7],[undefined,undefined,8],[undefined,undefined,9]],
]);

lib.runTests(lib.sum, [
	[1,2,3], 6,
	[1,2,3,4], 10,
	[], 0,
	[1n, 2n, 3n], 6n,
]);

lib.runTests(lib.product, [
	[1,2,3], 6,
	[1,2,3,4], 24,
	[], 1,
	[1n, 2n, 3n], 6n,
]);

lib.runTests(lib.flatten, [
	[], [],
	[[]], [],
	[[[],[],[[]]],[]], [],
	[1,2,3], [1,2,3],
	[[1,2],[3]], [1,2,3],
	[[[[1]],[[[2],3,4]]],[[5],6]], [1,2,3,4,5,6],
]);

lib.runTests(args => lib.minBy(...args), [
	[[{x:4},{x:2},{x:3}], item => item.x], {x:2},
	[[{x:4n},{x:2n},{x:3n}], item => item.x], {x:2n},
]);

lib.runTests(args => lib.maxBy(...args), [
	[[{x:4},{x:2},{x:3}], item => item.x], {x:4},
	[[{x:4n},{x:2n},{x:3n}], item => item.x], {x:4n},
]);

lib.runTests(args => lib.arrayUnion(...args), [
	[[1,2,3],[1,4,5],[4,2,3,6,5,7]], [1,2,3,4,5,6,7],
]);

lib.runTests(args => lib.arrayIntersection(...args), [
	[[1,2,3,4,5],[1,4,5],[4,2,3,6,5,7]], [4,5],
]);

lib.runTests(args => lib.arrayDifference(...args), [
	[[1,2,3,4,5],[1,4,5]], [2,3],
]);

lib.runTests(args => [...lib.permutations(args)], [
	[], [],
	[1], [[1]],
	[1,2], [[1,2], [2,1]],
	[1,2,3], [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]],
	['a','b','c'], [['a','b','c'], ['a','c','b'], ['b','a','c'], ['b','c','a'], ['c','a','b'], ['c','b','a']],
]);

lib.runTests(args => lib.indexOfAll(...args), [
	[[1,2,1,3,4,1,5,1,1,6], 1], [0, 2, 5, 7, 8],
	['abacdaeaaf', 'a'], [0, 2, 5, 7, 8],
]);

lib.runTests(args => lib.range(...args), [
	[0, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	[5, 10], [5, 6, 7, 8, 9],
	[5, 5], [],
]);

lib.runTests(args => lib.setUnion(...args), [
	[new Set([1,2,3]), new Set([1,4,5]), new Set([4,2,3,6,5,7])], new Set([1,2,3,4,5,6,7]),
]);

lib.runTests(args => lib.setIntersection(...args), [
	[new Set([1,2,3,4,5]),new Set([1,4,5]),new Set([4,2,3,6,5,7])], new Set([4,5]),
]);

lib.runTests(args => lib.setDifference(...args), [
	[new Set([1,2,3,4,5]),new Set([1,4,5])], new Set([2,3]),
]);

lib.runTests(args => lib.gcd(...args), [
	[360], 360,
	[360n], 360n,
	[24, 14], 2,
	[24n, 14n], 2n,
	[360, 520, 130], 10,
	[360n, 520n, 130n], 10n,
]);

lib.runTests(args => lib.lcm(...args), [
	[24, 14], 168,
	[24n, 14n], 168n,
	[360, 520, 130], 4680,
	[360n, 520n, 130n], 4680n,
]);

lib.runTests(args => lib.modulo(...args), [
	[352, 10], 2,
	[352n, 10n], 2n,
	[-14, 10], 6,
	[-14n, 10n], 6n,
]);

lib.runTests(lib.largestPowerOf2Below, [
	300, 256,
	300n, 256n,
]);

lib.runTests(args => lib.powerRemainder(...args), [
	[12, 3, 10], 8,
	[12n, 3, 10], 8n,
	[12, 3n, 10], 8n,
	[12, 3, 10n], 8n,
	[17, 11, 117], 62,
	[17n, 11n, 117n], 62n,
]);

lib.runTests(args => lib.modMulInverse(...args), [
	[3, 10], 7,
	[3n, 10], 7n,
	[3, 10n], 7n,
	[77, 5], 3,
	[55, 7], 6,
	[35, 11], 6,
]);

lib.runTests(args => lib.chineseRemainder(...args), [
	[[4, 4, 6], [5, 7, 11]], 39,
	[[4n, 4n, 6n], [5n, 7n, 11n]], 39n,
]);

lib.runTests(lib.astar, [
	{ start: 0, goal: 10, neighbors: x => [x+1], heuristic: (x, goal) => goal - x },
	{ path: [0,1,2,3,4,5,6,7,8,9,10], cost: 10 },

	{ start: 0, goal: 10, neighbors: x => [x+1,x+3], heuristic: (x, goal) => x < goal ? goal - x : Infinity },
	{ path: [0,3,6,9,10], cost: 4 },
]);

console.log('OK');
