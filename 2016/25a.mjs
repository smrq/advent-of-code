import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [];


function parseInput(input) {
	return input.split('\n').map(line => {
		const [op, ...args] = line.split(' ');
		return { op, args };
	});
}

function run(input) {
	/*
	Period is 12:
	 0   0 1 1 0 1 1 1 1 1 0 0 1    0 1 1 0 1 1 1 1 1 0 0 1 0 1 1 0 1 1 1 1 1 0 0 1 ...
	 1   1 1 1 0 1 1 1 1 1 0 0 1    1 1 1 0 1 1 1 1 1 0 0 1 1 1 1 0 1 1 1 1 1 0 0 1 ...
	 2   0 0 0 1 1 1 1 1 1 0 0 1    0 0 0 1 1 1 1 1 1 0 0 1 0 0 0 1 1 1 1 1 1 0 0 1 ...
	 3   1 0 0 1 1 1 1 1 1 0 0 1    1 0 0 1 1 1 1 1 1 0 0 1 1 0 0 1 1 1 1 1 1 0 0 1 ...
	 4   0 1 0 1 1 1 1 1 1 0 0 1    0 1 0 1 1 1 1 1 1 0 0 1 0 1 0 1 1 1 1 1 1 0 0 1 ...
	 5   1 1 0 1 1 1 1 1 1 0 0 1    1 1 0 1 1 1 1 1 1 0 0 1 1 1 0 1 1 1 1 1 1 0 0 1 ...
	 6   0 0 1 1 1 1 1 1 1 0 0 1    0 0 1 1 1 1 1 1 1 0 0 1 0 0 1 1 1 1 1 1 1 0 0 1 ...
	 7   1 0 1 1 1 1 1 1 1 0 0 1    1 0 1 1 1 1 1 1 1 0 0 1 1 0 1 1 1 1 1 1 1 0 0 1 ...
	 8   0 1 1 1 1 1 1 1 1 0 0 1    0 1 1 1 1 1 1 1 1 0 0 1 0 1 1 1 1 1 1 1 1 0 0 1 ...
	 9   1 1 1 1 1 1 1 1 1 0 0 1    1 1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1 1 1 1 1 0 0 1 ...
	10   0 0 0 0 0 0 0 0 0 1 0 1    0 0 0 0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 0 0 0 1 0 1 ...
	11   1 0 0 0 0 0 0 0 0 1 0 1    1 0 0 0 0 0 0 0 0 1 0 1 1 0 0 0 0 0 0 0 0 1 0 1 ...
	12   0 1 0 0 0 0 0 0 0 1 0 1    0 1 0 0 0 0 0 0 0 1 0 1 0 1 0 0 0 0 0 0 0 1 0 1 ...
	13   1 1 0 0 0 0 0 0 0 1 0 1    1 1 0 0 0 0 0 0 0 1 0 1 1 1 0 0 0 0 0 0 0 1 0 1 ...
	14   0 0 1 0 0 0 0 0 0 1 0 1    0 0 1 0 0 0 0 0 0 1 0 1 0 0 1 0 0 0 0 0 0 1 0 1 ...
	15   1 0 1 0 0 0 0 0 0 1 0 1    1 0 1 0 0 0 0 0 0 1 0 1 1 0 1 0 0 0 0 0 0 1 0 1 ...
	16   0 1 1 0 0 0 0 0 0 1 0 1    0 1 1 0 0 0 0 0 0 1 0 1 0 1 1 0 0 0 0 0 0 1 0 1 ...
	*/
	const period = 12;
	for (let i = 0; ; ++i) {
		const output = runProgram(input, i, period);
		console.log(`${String(i).padStart(4, ' ')} ${output}`);
		if (isValid(output)) {
			return i;
		}
	}
}

function isValid(output) {
	for (let i = 0; i < output.length - 1; ++i) {
		if (output[i] === output[i + 1]) return false;
	}
	return true;
}

function runProgram(input, start, period) {
	const debug = false;
	const instructions = parseInput(input);
	const registers = { a: start, b: 0, c: 0, d: 0 };
	let pc = 0;
	let output = [];
	while (pc >= 0 && pc < instructions.length && output.length < period) {
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

			case 'out':
				if (debug) console.log(`${pc}: out ${args[0]}<${getValue(args[0])}>`);
				output.push(getValue(args[0]));
				++pc;
				break;
		}
	}

	return output;

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
