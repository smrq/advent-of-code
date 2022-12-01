import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`), 45000
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(L.sum).sort((a, b) => b - a).slice(0, 3));
}

function parseInput(str) {
	return L.autoparse(str);
}
