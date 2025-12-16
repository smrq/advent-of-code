import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`987654321111111
811111111111119
234234234234278
818181911112111`), 3121910778619
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;

	for (let bank of input) {
		result += parseInt(score(bank, 12), 10);
	}

	return result;
}

function score(bank, digits) {
	const remainingDigits = digits - 1;
	const digit = bank.slice(0, remainingDigits ? -remainingDigits : undefined)
		.split('')
		.sort((a, b) => b - a)[0];
	const index = bank.indexOf(digit);
	if (remainingDigits > 0) {
		return digit + score(bank.slice(index + 1), remainingDigits);
	} else {
		return digit;
	}
}

function parseInput(str) {
	return str.trim().split('\n');
}

