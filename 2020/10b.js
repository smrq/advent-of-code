const { getRawInput, runTests } = require('../lib');

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
19208
]);

console.log(run(input));

function run(input) {
	input.push(0);
	input.push(Math.max(...input) + 3);
	input.sort((a, b) => a - b);

	const ways = new Array(input.length).fill(0);
	ways[0] = 1;

	for (let i = 0; i < input.length; ++i) {
		for (let j = i + 1; j < input.length; ++j) {
			if (input[j] - input[i] > 3) break;
			ways[j] += ways[i];
		}
	}

	return ways[ways.length - 1];
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}

