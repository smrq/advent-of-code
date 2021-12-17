import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	[20,30,-10,-5], 112
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([x0, x1, y0, y1]) {
	let ct = 0;

	const minDy = y0;
	const maxDy = (-y0) * (-y0-1) / 2;

	for (let dx = 1; dx <= x1; ++dx) {
		for (let dy = minDy; dy <= maxDy; ++dy) {
			if (sim(dx, dy)) {
				++ct;
			}
		}
	}

	return ct;

	function sim(dx, dy) {
		let x = 0;
		let y = 0;

		for (;;) {
			x += dx;
			y += dy;
			if (dx > 0) {
				--dx;
			}
			--dy;

			if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
				return true;
			}
			if (dx === 0 && y < y0) {
				return false;
			}
		}
	}
}

function parseInput(str) {
	let [_, x0, x1, y0, y1] = /target area: x=(\d+)\.\.(\d+), y=(-\d+)..(-\d+)/.exec(str);
	x0 = parseInt(x0, 10);
	x1 = parseInt(x1, 10);
	y0 = parseInt(y0, 10);
	y1 = parseInt(y1, 10);
	return [x0, x1, y0, y1];
}
