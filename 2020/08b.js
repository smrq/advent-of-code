const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	for (let i = 0; i < input.length; ++i) {
		if (input[i].op === 'jmp') {
			input[i].op = 'nop';
			const r = interpret(input);
			if (r != null) {
				return r;
			}
			input[i].op = 'jmp';
		} else if (input[i].op === 'nop') {
			input[i].op = 'jmp';
			const r = interpret(input);
			if (r != null) {
				return r;
			}
			input[i].op = 'nop';
		}
	}
}

function parseInput(str) {
	return str.split('\n').map(parseInstruction);
}

// INTCODE

function interpret(program) {
	let acc = 0;
	let pc = 0;
	let visited = new Set();
	while (pc < program.length && pc >= 0) {
		if (visited.has(pc)) return null;
		visited.add(pc);

		const { op, value } = program[pc];
		switch (op) {
			case 'nop':
				++pc;
				break;
			case 'acc':
				acc += value;
				++pc;
				break;
			case 'jmp':
				pc += value;
				break;
		}
	}
	return acc;
}

function parseInstruction(str) {
	const [op, value] = str.split(' ');
	return { op, value: +value };
}