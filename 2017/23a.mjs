import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('23.txt', 'utf-8').trim();
const tests = [];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const [_, op, arg0, arg1] = /(\w+) (\S+) (\S+)/.exec(line);
	return { op, arg0, arg1 };
}

function run(input) {
	const instructions = parseInput(input);
	const registers = new Map('abcdefgh'.split('').map(c => [c, 0]));
	let pc = 0;
	let score = 0;

	while (pc >= 0 && pc < instructions.length) {
		const instruction = instructions[pc];
		pc = executeInstruction(instruction, pc, registers, () => { ++score; });
	}

	return score;
}

function executeInstruction({ op, arg0, arg1 }, pc, registers, incrementScore) {
	switch (op) {
		case 'set':
			registers.set(arg0, value(arg1));
			return pc + 1;
		case 'sub':
			registers.set(arg0, value(arg0) - value(arg1));
			return pc + 1;
		case 'mul':
			incrementScore();
			registers.set(arg0, value(arg0) * value(arg1));
			return pc + 1;
		case 'jnz':
			if (value(arg0) !== 0) {
				return pc + value(arg1);
			} else {
				return pc + 1;
			}
		default:
			throw new Error(op);
	}

	function value(x) {
		if (/[a-z]/.test(x)) {
			return registers.get(x);
		}
		return parseInt(x, 10);
	}
}


for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
