import { getRawInput, autoparse } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	let depth = 0;
	let horiz = 0;
	let aim = 0;

	for (let {opcode, args: [n]} of input) {
		switch (opcode) {
			case 'forward':
				horiz += n;
				depth += n * aim;
				break;

			case 'down':
				aim += n;
				break;
				
			case 'up':
				aim -= n;
				break;
		}
	}

	return depth * horiz;
}

function parseInput(str) {
	return autoparse(str);
}
