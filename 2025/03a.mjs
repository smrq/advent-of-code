import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`987654321111111
811111111111119
234234234234278
818181911112111`), 357
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;

	for (let bank of input) {
		result += score(bank);
	}

	return result;
}

function score(bank) {
	const firstDigit = bank.slice(0, -1).split('').sort((a, b) => b - a)[0];
	const index = bank.indexOf(firstDigit);
	const secondDigit = bank.slice(index + 1).split('').sort((a, b) => b - a)[0];
	return parseInt(firstDigit + secondDigit, 10);
}

function parseInput(str) {
	return str.trim().split('\n');
}

