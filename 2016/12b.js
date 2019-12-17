const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = fs.readFileSync('12.txt', 'utf-8').trim();
const tests = [
	[`cpy 41 a\ninc a\ninc a\ndec a\njnz a 2\ndec a`, 42]
];

function parseInput(input) {
	return input.split('\n').map(line => {
		const [op, ...args] = line.split(' ');
		return { op, args };
	});
}

function run(input) {
	const instructions = parseInput(input);

	const registers = { a: 0, b: 0, c: 1, d: 0 };
	let pc = 0;
	while (pc >= 0 && pc < instructions.length) {
		const { op, args } = instructions[pc];
		switch (op) {
			case 'cpy':
				registers[args[1]] = getValue(args[0]);
				++pc;
				break;

			case 'inc':
				++registers[args[0]];
				++pc;
				break;

			case 'dec':
				--registers[args[0]];
				++pc;
				break;

			case 'jnz':
				if (getValue(args[0]) !== 0) {
					pc += getValue(args[1]);
				} else {
					++pc;
				}
				break;
		}
	}

	return registers.a;

	function getValue(arg) {
		if (/-?\d+/.test(arg)) {
			return +arg;
		} else {
			return registers[arg];
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
