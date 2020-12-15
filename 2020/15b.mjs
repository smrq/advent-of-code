import { D, getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let spoken = new Map();

	for (let i = 0; i < input.length-1; ++i) {
		spoken.set(input[i], i+1);
	}

	let last = input[input.length - 1];

	for (let turn = input.length+1; turn <= 30000000; ++turn) {
		let next;
		if (spoken.has(last)) {
			next = turn-1 - spoken.get(last);
		} else {
			next = 0;
		}
		spoken.set(last, turn-1);
		last = next;

		if (turn % 1e6 === 0){
			D(`Turn ${turn}...`);
		}
	}
	return last;
}

function parseInput(str) {
	return str.split(',').map(n => +n);
}
