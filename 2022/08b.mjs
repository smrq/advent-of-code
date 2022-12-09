import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`30373
25512
65332
33549
35390`), 8
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = -Infinity;
	for (let x = 1; x < input.length - 1; ++x) {
		for (let y = 1; y < input[x].length - 1; ++y) {
			result = Math.max(result, score(input, x, y));
		}
	}
	return result;
}

function score(arr, x, y) {
	let score1 = 0;
	for (let i = x - 1; i >= 0; --i) {
		++score1;
		if (arr[i][y] >= arr[x][y]) break;
	}

	let score2 = 0;
	for (let i = x + 1; i < arr.length; ++i) {
		++score2;
		if (arr[i][y] >= arr[x][y]) break;
	}

	let score3 = 0;
	for (let j = y - 1; j >= 0; --j) {
		++score3;
		if (arr[x][j] >= arr[x][y]) break;
	}

	let score4 = 0;
	for (let j = y + 1; j < arr[x].length; ++j) {
		++score4;
		if (arr[x][j] >= arr[x][y]) break;
	}

	return score1 * score2 * score3 * score4;
}

function parseInput(str) {
	return str.split('\n').map(line => line.split('').map(n => parseInt(n, 10)));
}
