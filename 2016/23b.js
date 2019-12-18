const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [];

function parseInput(input) {
	return input.split('\n').map(line => {
		const [op, ...args] = line.split(' ');
		return { op, args };
	});
}

function run(input) {
	// Reverse engineered formula
	// At pc=15, register a is n*(n-1) initially, and register b is n-2
	// By the last pc=18, register a has been multiplied by b!
	// At each instance of pc=25, register a is incremented by 79
	// This happens until register c is nonzero (73 times)
	// So the final formula is:
	//     73*79 + n * (n-1) * (n-2)!
	if (!process.argv[2]) {
		const n = 12;
		return 73*79 + (n * (n-1) * factorial(n-2));

		function factorial(n) {
			if (n === 1) return 1;
			return n * factorial(n-1);
		}
	}

	const debug = false;
	const instructions = parseInput(input);

	const registers = { a: +process.argv[2], b: 0, c: 0, d: 0 };
	let pc = 0;
	while (pc >= 0 && pc < instructions.length) {
		if (pc === 15) { console.log(pc, registers); }
		if (pc === 18) { console.log(pc, registers); }
		if (pc === 25) { console.log(pc, registers); }

		const { op, args } = instructions[pc];
		switch (op) {
			case 'cpy':
				if (!isImmediate(args[1])) {
					if (debug) console.log(`${pc}: cpy ${args[0]}<${getValue(args[0])}> ${args[1]}`);
					registers[args[1]] = getValue(args[0]);
				} else {
					if (debug) console.log(`${pc}: !!cpy ${args}`);
				}
				++pc;
				break;

			case 'inc':
				if (!isImmediate(args[0])) {
					if (debug) console.log(`${pc}: inc ${args[0]}<${getValue(args[0])}>`);
					++registers[args[0]];
				} else {
					if (debug) console.log(`${pc}: !!inc ${args}`);
				}
				++pc;
				break;

			case 'dec':
				if (!isImmediate(args[0])) {
					if (debug) console.log(`${pc}: dec ${args[0]}<${getValue(args[0])}>`);
					--registers[args[0]];
				} else {
					if (debug) console.log(`${pc}: !!dec ${args}`);
				}
				++pc;
				break;

			case 'jnz':
				if (debug) console.log(`${pc}: jnz ${args[0]}<${getValue(args[0])}> ${args[1]}<${getValue(args[1])}>`);
				if (getValue(args[0]) !== 0) {
					pc += getValue(args[1]);
				} else {
					++pc;
				}
				break;

			case 'tgl':
				const index = pc + getValue(args[0]);
				if (index >= 0 && index < instructions.length) {
					if (debug) console.log(`${pc}: tgl ${args[0]}<${pc+getValue(args[0])}>`);
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
