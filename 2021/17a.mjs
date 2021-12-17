import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	[20,30,-10,-5], 45
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([x0, x1, y0, y1]) {
	return (-y0) * (-y0-1) / 2;
}

function parseInput(str) {
	let [_, x0, x1, y0, y1] = /target area: x=(\d+)\.\.(\d+), y=(-\d+)..(-\d+)/.exec(str);
	x0 = parseInt(x0, 10);
	x1 = parseInt(x1, 10);
	y0 = parseInt(y0, 10);
	y1 = parseInt(y1, 10);
	return [x0, x1, y0, y1];
}
