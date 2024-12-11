import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`), 48
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const matches = [...input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)];

	let sum = 0;
	let enabled = true;
	for (const match of matches) {
		if (match[0] === 'do()') {
			enabled = true;
		}
		else if (match[0] === 'don\'t()') {
			enabled = false;
		}
		else if (enabled) {
			sum += parseInt(match[1], 10) * parseInt(match[2], 10);
		}
	}
	return sum;
}

function parseInput(str) {
	return str.trim();
}
