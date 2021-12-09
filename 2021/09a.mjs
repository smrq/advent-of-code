import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`2199943210
3987894921
9856789892
8767896789
9899965678`), 15
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;

	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (input[y-1] != null && (input[y-1][x] < input[y][x])) {
				continue;
			}
			if (input[y][x-1] != null && (input[y][x-1] < input[y][x])) {
				continue;
			}
			if (input[y+1] != null && (input[y+1][x] < input[y][x])) {
				continue;
			}
			if (input[y][x+1] != null && (input[y][x+1] < input[y][x])) {
				continue;
			}
			result += +input[y][x] + 1;
		}
	}
	
	return result;
}

function parseInput(str) {
	return str.split('\n');
}
