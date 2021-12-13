import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([dots, folds]) {
	for (let [axis, n] of folds) {
		dots = dots.map(([x, y]) => {
			if (axis === 'x') {
				return [x > n ? 2*n-x : x, y]
			} else {
				return [x, y > n ? 2*n-y : y]
			}
		});
	}

	L.graphPoints(dots);
}

function parseInput(str) {
	let [dots, folds] = L.autoparse(str);
	dots = dots.map(x => x.split(',').map(x => +x));
	folds = folds.map(x => x.replace(/fold along /, '').split('='))
		.map(([axis, n]) => [axis, +n]);
	return [dots, folds];
}
