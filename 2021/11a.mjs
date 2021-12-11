import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`), 1656
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let ct = 0;
	for (let step = 0; step < 100; ++step) {
		for (let y = 0; y < input.length; ++y) {
			for (let x = 0; x < input.length; ++x) {
				++input[y][x];
			}
		}

		for (let y = 0; y < input.length; ++y) {
			for (let x = 0; x < input.length; ++x) {
				if (input[y][x] > 9) {
					flash(x, y);
				}
			}
		}
	}

	return ct;

	function flash(x, y) {
		++ct;
		input[y][x] = 0;
		for (let [dx, dy] of L.orthodiagonalOffsets(2)) {
			const xx = x + dx;
			const yy = y + dy;
			if (input[yy] != null && input[yy][xx] != null && input[yy][xx] > 0) {
				if (++input[yy][xx] > 9) {
					flash(xx, yy);
				}
			}
		}
	}
}

function parseInput(str) {
	return str.split('\n').map(line => line.split('').map(c => +c));
}
