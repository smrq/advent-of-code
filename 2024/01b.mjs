import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3   4
4   3
2   5
1   3
3   9
3   3`), 31
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([a, b]) {
	return L.sum(a.map(n => n * b.filter(x => x === n).length));
}

function parseInput(str) {
	const lists = L.autoparse(str);
	return L.zip(...lists);
}
