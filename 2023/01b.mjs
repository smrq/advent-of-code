import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`), 281
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const values = input.map(line => {
		const digitsText = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

		const first = (() => {
			for (let i = 0; i < line.length; ++i) {
				if (/\d/.test(line[i])) {
					return line[i];
				}
				for (let t of digitsText) {
					if (line.slice(i).startsWith(t)) {
						return digitsText.indexOf(t) + 1;
					}
				}
			}
		})();

		const last = (() => {
			for (let i = line.length - 1; i >= 0; --i) {
				if (/\d/.test(line[i])) {
					return line[i];
				}
				for (let t of digitsText) {
					if (line.slice(i).startsWith(t)) {
						return digitsText.indexOf(t) + 1;
					}
				}
			}
		})();
		
		return parseInt(`${first}${last}`);
	});
	return L.sum(values);
}

function parseInput(str) {
	return L.autoparse(str);
}
