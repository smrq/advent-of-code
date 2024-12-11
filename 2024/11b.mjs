import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`125 17`), 25], 55312
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 75));

function run(input, times) {
	let map = new Map(input.map(n => [n, 1]));
	for (let i = 0; i < times; ++i) {
		map = step(map);
	}
	return L.sum([...map.values()]);
}

function step(map) {
	let next = new Map();

	for (let [n, count] of map.entries()) {
		if (n === 0) {
			next.set(1, (next.get(1) ?? 0) + count);
		} else {
			const str = String(n);
			if (str.length % 2 === 0) {
				const a = parseInt(str.slice(0, str.length / 2), 10);
				const b = parseInt(str.slice(str.length / 2), 10);
				next.set(a, (next.get(a) ?? 0) + count);
				next.set(b, (next.get(b) ?? 0) + count);
			} else {
				next.set(n * 2024, (next.get(n * 2024) ?? 0) + count);
			}
		}
	}

	return next;
}

function parseInput(str) {
	return L.autoparse(str);
}
