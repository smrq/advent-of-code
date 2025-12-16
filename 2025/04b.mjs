import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`), 43
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;
	let valid;
	do {
		const indices = L.findAllIndices2d(input, c => c === '@');
		valid = indices.filter(([y, x]) => {
			const neighbors = L.orthodiagonalOffsets(2).filter(([dy, dx]) => {
				return L.inBounds(input, y+dy, x+dx) && input[y+dy][x+dx] === '@';
			});
			return neighbors.length < 4;
		});
		result += valid.length;
		for (const [y, x] of valid) {
			input[y][x] = '.';
		}
	} while (valid.length);
	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}

