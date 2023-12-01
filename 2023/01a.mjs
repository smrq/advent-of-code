import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`), 142
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const values = input.map(line => {
		const digits = line.split('').filter(x => /\d/.test(x));
		return parseInt(digits[0] + digits[digits.length - 1]);
	});
	return L.sum(values);
}

function parseInput(str) {
	return L.autoparse(str);
}
