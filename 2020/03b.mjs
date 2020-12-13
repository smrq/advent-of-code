import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	return run2(input, 1, 1) *
		run2(input, 3, 1) *
		run2(input, 5, 1) *
		run2(input, 7, 1) *
		run2(input, 1, 2);
}

function run2(input, strideX, strideY) {
	let count = 0;
	for (let y = 0; y < input.length; y += strideY) {
		const x = (y * strideX) % input[0].length;
		if (input[y][x]) {
			++count;
		}
	}
	return count;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line.split('').map(x => x === '#');
	});
}
