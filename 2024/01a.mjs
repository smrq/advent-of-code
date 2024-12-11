import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3   4
4   3
2   5
1   3
3   9
3   3`), 11
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([a, b]) {
	a.sort();
	b.sort();
	return L.sum(L.zip(a, b).map(([a, b]) => Math.abs(a - b)));
}

function parseInput(str) {
	const lists = L.autoparse(str);
	return L.zip(...lists);
}
