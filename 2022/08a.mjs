import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`30373
25512
65332
33549
35390`), 21
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let count = 0;
	for (let x = 0; x < input.length; ++x) {
		for (let y = 0; y < input[x].length; ++y) {
			count += isVisible(input, x, y);
		}
	}
	return count;
}

function isVisible(arr, x, y) {
	let hidden;

	hidden = false;
	for (let i = 0; i < x; ++i) {
		if (arr[i][y] >= arr[x][y]) {
			hidden = true;
			break;
		}
	}
	if (!hidden) return true;

	hidden = false;
	for (let i = arr.length - 1; i > x; --i) {
		if (arr[i][y] >= arr[x][y]) {
			hidden = true;
			break;
		}
	}
	if (!hidden) return true;

	hidden = false;
	for (let j = 0; j < y; ++j) {
		if (arr[x][j] >= arr[x][y]) {
			hidden = true;
			break;
		}
	}
	if (!hidden) return true;

	hidden = false;
	for (let j = arr[x].length - 1; j > y; --j) {
		if (arr[x][j] >= arr[x][y]) {
			hidden = true;
			break;
		}
	}
	if (!hidden) return true;

	return false;
}

function parseInput(str) {
	return str.split('\n').map(line => line.split('').map(n => parseInt(n, 10)));
}
