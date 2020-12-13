import { getRawInput, runTests } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
	[[20, 15, 10, 5, 5], 25],
	[2, 3]
]);

const [used, ways] = run(input, 150);
console.log(`${ways} ways to use ${used} containers`);

function run(sizes, remaining) {
	return (function run(sizes, remaining, used) {
		if (remaining < 0) {
			return null;
		}
		if (remaining === 0) {
			return [used, 1];
		}
		if (sizes.length === 0) {
			return null;
		}

		const a = run(sizes.slice(1), remaining, used);
		const b = run(sizes.slice(1), remaining - sizes[0], used + 1);
		if (a == null && b == null) return null;
		if (a == null) return b;
		if (b == null) return a;
		if (a[0] < b[0]) return a;
		if (b[0] < a[0]) return b;
		return [a[0], a[1] + b[1]];
	})(sizes, remaining, 0);
}

function parseInput(str) {
	return str.split('\n').map(x => +x).sort((a, b) => b - a);
}
