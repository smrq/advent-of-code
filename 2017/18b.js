const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('18.txt', 'utf-8').trim();
const tests = [
	[`snd 1\nsnd 2\nsnd p\nrcv a\nrcv b\nrcv c\nrcv d`, 3]
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const match = /(\w+) (\S+( \S+)*)/.exec(line);
	if (!match) throw line;
	const [_, op, args] = match;
	return { op, args: args.split(' ') };
}

function run(input) {
	const instructions = parseInput(input);
	const registers0 = new Map();
	const registers1 = new Map();
	let pc0 = 0;
	let pc1 = 0;
	const queue0 = [];
	const queue1 = [];
	let terminated0 = false;
	let terminated1 = false;

	registers0.set('p', 0);
	registers1.set('p', 1);

	let score = 0;

	while (!(terminated0 && terminated1)) {
		let deadlocked = true;
		if (!terminated0) {
			const result = executeInstruction(registers0, instructions[pc0], pc0, queue0, queue1);
			if (result !== false) {
				deadlocked = false;
				pc0 = result;
			}
		}

		if (!terminated1) {
			const result = executeInstruction(registers1, instructions[pc1], pc1, queue1, queue0, handleSend1);
			if (result !== false) {
				deadlocked = false;
				pc1 = result;
			}
		}

		if (deadlocked) {
			terminated0 = true;
			terminated1 = true;
		}

		if (pc0 > instructions.length || pc0 < 0) {
			terminated0 = true;
		}

		if (pc1 > instructions.length || pc1 < 0) {
			terminated1 = true;
		}
	}

	return score;

	function handleSend1() {
		++score;
	}
}

function executeInstruction(registers, instruction, pc, input, output, onSend) {
	const { op, args } = instruction;
	switch (op) {
		case 'set':
			registers.set(args[0], value(args[1]));
			++pc;
			break;
		case 'add':
			registers.set(args[0], value(args[0]) + value(args[1]));
			++pc;
			break;
		case 'mul':
			registers.set(args[0], value(args[0]) * value(args[1]));
			++pc;
			break;
		case 'mod':
			registers.set(args[0], value(args[0]) % value(args[1]));
			++pc;
			break;
		case 'snd':
			output.push(value(args[0]));
			if (onSend) { onSend(); }
			++pc;
			break;
		case 'rcv':
			if (input.length) {
				registers.set(args[0], input.shift());
			} else {
				return false;
			}
			++pc;
			break;
		case 'jgz':
			if (value(args[0]) > 0) {
				pc += value(args[1]);
			} else {
				++pc;
			}
			break;
	}

	return pc;

	function value(x) {
		if (/\d+/.test(x)) {
			return +x;
		} else {
			return registers.get(x) || 0;
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
