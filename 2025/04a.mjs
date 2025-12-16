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
@.@.@@@.@.`), 13
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const indices = L.findAllIndices2d(input, c => c === '@');
	const valid = indices.filter(([y, x]) => {
		const neighbors = L.orthodiagonalOffsets(2).filter(([dy, dx]) => {
			return L.inBounds(input, y+dy, x+dx) && input[y+dy][x+dx] === '@';
		});
		return neighbors.length < 4;
	});
	return valid.length;
}

function parseInput(str) {
	return L.autoparse(str);
}

