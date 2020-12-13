import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let count = 0;
	for (let y = 0; y < input.length; ++y) {
		const x = (y * 3) % input[0].length;
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
