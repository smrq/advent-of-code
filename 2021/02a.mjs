import { getRawInput, autoparse } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	let depth = 0;
	let horiz = 0;

	for (let {opcode, args: [n]} of input) {
		switch (opcode) {
			case 'forward':
				horiz += n;
				break;
				
			case 'down':
				depth += n;
				break;
				
			case 'up':
				depth -= n;
				break;
				
		}
	}

	return depth * horiz;
}

function parseInput(str) {
	return autoparse(str);
}
