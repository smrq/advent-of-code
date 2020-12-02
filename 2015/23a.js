const { getRawInput, runTests, PriorityQueue } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function parseInput(str) {
	return str.split('\n');
}

function run(program) {
	const registers = { a: 0, b: 0 };
	let pc = 0;

	while (pc >= 0 && pc < program.length) {
		const [opcode, operands] = parseInstruction(program[pc]);
		switch (opcode) {
			case 'hlf':
				registers[operands[0]] = Math.floor(registers[operands[0]] / 2);
				++pc;
				break;
			case 'tpl':
				registers[operands[0]] *= 3;
				++pc;
				break;
			case 'inc':
				registers[operands[0]] += 1;
				++pc;
				break;
			case 'jmp':
				pc += +(operands[0]);
				break;
			case 'jie':
				if (registers[operands[0]] % 2 === 0) {
					pc += +(operands[1]);
				} else {
					++pc;
				}
				break;
			case 'jio':
				if (registers[operands[0]] === 1) {
					pc += +(operands[1]);
				} else {
					++pc;
				}
				break;
			default: throw new Error('invalid opcode');
		}
	}

	return registers;
}

function parseInstruction(str) {
	const [_, opcode, operandsStr] = /(\w+) (.*)/.exec(str);
	const operands = operandsStr.split(', ');
	return [opcode, operands];
}