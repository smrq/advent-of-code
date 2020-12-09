const { getRawInput, runTests, sum } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
[parseInput(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`), 127],
62
]);

console.log(run(input, 507622668));

function run(input, N) {
	for (let i = 0; i < input.length; ++i) {
		for (let j = i + 1; j < input.length; ++j) {
			const range = input.slice(i, j);
			if (sum(range) === N) {
				return Math.max(...range) + Math.min(...range);
			}
		}
	}
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}
