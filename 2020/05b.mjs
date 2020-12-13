import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	const ids = input.map(getId).sort((a, b) => a - b);
	for (let i = 0, n = ids[0]; i < ids.length; ++i, ++n) {
		if (n !== ids[i]) {
			return n;
		}
	}
}

function getId(pass) {
	const row = parseInt(pass.slice(0, 7).split('').map(x => x === 'F' ? 0 : 1).join(''), 2);
	const col = parseInt(pass.slice(7, 10).split('').map(x => x === 'L' ? 0 : 1).join(''), 2);
	return row * 8 + col;
}

function parseInput(str) {
	return str.split('\n');
}
