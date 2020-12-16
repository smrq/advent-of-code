import { getRawInput, runTests, sum, range } from '../lib.mjs';

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
	for (let i of range(0, input.length)) {
		for (let j of range(i+1, input.length)) {
			const items = input.slice(i, j);
			if (sum(items) === N) {
				return Math.max(...items) + Math.min(...items);
			}
		}
	}
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}
