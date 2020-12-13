import { getRawInput, runTests } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`),
22*10
]);

console.log(run(input));

function run(input) {
	input.push(0);
	input.push(Math.max(...input) + 3);
	input.sort((a, b) => a - b);

	const distr = {};

	for (let i = 1; i < input.length; ++i) {
		const diff = input[i] - input[i-1];
		distr[diff] = (distr[diff] || 0) + 1;
	}

	return distr[1] * distr[3];
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}

