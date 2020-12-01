const { getRawInput, runTests } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
	[[20, 15, 10, 5, 5], 25],
	4,
]);

const result = run(input, 150);
console.log(result);

function run(sizes, remaining) {
	if (remaining < 0) {
		return 0;
	}

	if (sizes.length === 0) {
		return remaining === 0;
	}

	return run(sizes.slice(1), remaining) + run(sizes.slice(1), remaining - sizes[0]);
}

function parseInput(str) {
	return str.split('\n').map(x => +x).sort((a, b) => b - a);
}
