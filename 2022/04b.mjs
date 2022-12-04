import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`), 4
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return input.filter(([a, b]) => isOverlapped(a, b)).length;
}

function parseInput(str) {
	return L.autoparse(str).map(line => line.split(',').map(x => x.split('-').map(n => parseInt(n, 10))));
}

function isOverlapped([a0, a1], [b0, b1]) {
	return (a0 <= b0 && a1 >= b0) || (a0 <= b1 && a1 >= b1) || (a0 >= b0 && a1 <= b1);
}
