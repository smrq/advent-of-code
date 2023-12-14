import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`), 136,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function rollStart(segment) {
	return segment.split('')
		.sort((a, b) =>
			a === 'O' ? -1 :
			b === 'O' ? 1 :
			0)
		.join('');
}

function roll(input) {
	input = L.transpose(input);
	input = input.map(col => col.join('').split('#').map(rollStart).join('#').split(''));
	input = L.transpose(input);
	return input;
}

function score(input) {
	input = L.transpose(input);

	let result = 0;
	for (let col of input) {
		for (let i = 0; i < col.length; ++i) {
			if (col[i] === 'O') {
				result += col.length - i;
			}
		}
	}

	return result;
}

function run(input) {
	input = roll(input);
	return score(input);
}

function parseInput(str) {
	return L.stringToArray2D(str.trim());
}
