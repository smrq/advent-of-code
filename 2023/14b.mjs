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
#OO..#....`), 64,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function rollStart(segment) {
	return segment.split('')
		.sort((a, b) => a === 'O' ? -1 : b === 'O' ? 1 : 0)
		.join('');
}

function rollEnd(segment) {
	return segment.split('')
		.sort((a, b) => a === 'O' ? 1 : b === 'O' ? -1 : 0)
		.join('');
}

function rollEast(input) {
	return input.map(col => col.join('').split('#').map(rollStart).join('#').split(''));
}

function rollWest(input) {
	return input.map(col => col.join('').split('#').map(rollEnd).join('#').split(''));
}

function rollNorth(input) {
	input = L.transpose(input);
	input = rollEast(input);
	input = L.transpose(input);
	return input;
}

function rollSouth(input) {
	input = L.transpose(input);
	input = rollWest(input);
	input = L.transpose(input);
	return input;
}

function roll(input) {
	input = L.stringToArray2D(input);
	input = rollNorth(input);
	input = rollEast(input);
	input = rollSouth(input);
	input = rollWest(input);
	input = L.array2DToString(input);
	return input;
}

function score(input) {	
	input = L.stringToArray2D(input);
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
	const states = new Map();
	let foundCycle = false;

	for (let i = 0; i < 1000000000; ++i) {
		const updated = roll(input);
		if (!foundCycle) {
			if (states.has(updated)) {
				const cycleStart = states.get(updated);
				const cycleLength = i - cycleStart;
				while (i + cycleLength < 1000000000) {
					i += cycleLength;
				}
				foundCycle = true;
			} else {
				states.set(updated, i);
			}
		}
		input = updated;
	}

	return score(input);
}

function parseInput(str) {
	return str.trim();
}
