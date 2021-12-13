import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`), 17
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([dots, folds]) {
	let [axis, n] = folds[0];
	dots = dots.map(([x, y]) => {
		if (axis === 'x') {
			return [x > n ? 2*n-x : x, y];
		} else {
			return [x, y > n ? 2*n-y : y];
		}
	});

	let set = new Set();
	for (let [x,y] of dots) {
		set.add(`${x},${y}`);
	}
	return set.size;
}

function parseInput(str) {
	let [dots, folds] = L.autoparse(str);
	dots = dots.map(x => x.split(',').map(x => +x));
	folds = folds.map(x => x.replace(/fold along /, '').split('='))
		.map(([axis, n]) => [axis, +n]);
	return [dots, folds];
}
