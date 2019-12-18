const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [
	[`cpy 2 a\ntgl a\ntgl a\ntgl a\ncpy 1 a\ndec a\ndec a`, 3]
];

function parseInput(input) {
	return input.split('\n').map(line => {
		const [op, ...args] = line.split(' ');
		return { op, args };
	});
}

function run(input) {
	const instructions = parseInput(input);

	const registers = { a: 7, b: 0, c: 0, d: 0 };
	let pc = 0;
	while (pc >= 0 && pc < instructions.length) {
		const { op, args } = instructions[pc];
		switch (op) {
			case 'cpy':
				if (!isImmediate(args[1])) {
					console.log(`${pc}: cpy ${args[0]}<${getValue(args[0])}> ${args[1]}`);
					registers[args[1]] = getValue(args[0]);
				} else {
					console.log(`${pc}: !!cpy ${args}`);
				}
				++pc;
				break;

			case 'inc':
				if (!isImmediate(args[0])) {
					console.log(`${pc}: inc ${args[0]}<${getValue(args[0])}>`);
					++registers[args[0]];
				} else {
					console.log(`${pc}: !!inc ${args}`);
				}
				++pc;
				break;

			case 'dec':
				if (!isImmediate(args[0])) {
					console.log(`${pc}: dec ${args[0]}<${getValue(args[0])}>`);
					--registers[args[0]];
				} else {
					console.log(`${pc}: !!dec ${args}`);
				}
				++pc;
				break;

			case 'jnz':
				console.log(`${pc}: jnz ${args[0]}<${getValue(args[0])}> ${args[1]}<${getValue(args[1])}>`);
				if (getValue(args[0]) !== 0) {
					pc += getValue(args[1]);
				} else {
					++pc;
				}
				break;

			case 'tgl':
				const index = pc + getValue(args[0]);
				if (index >= 0 && index < instructions.length) {
					console.log(`${pc}: tgl ${args[0]}<${pc+getValue(args[0])}>`);
					const target = instructions[index];
					switch (target.args.length) {
						case 1:
							target.op = target.op === 'inc' ? 'dec' : 'inc';
							break;
						case 2:
							target.op = target.op === 'jnz' ? 'cpy' : 'jnz';
							break;
					}
				}
				++pc;
				break;
		}
	}

	return registers.a;

	function isImmediate(arg) {
		return /-?\d+/.test(arg);
	}

	function getValue(arg) {
		if (isImmediate(arg)) {
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
