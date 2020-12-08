const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	return interpret(input);
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
		if (visited.has(pc)) break;
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